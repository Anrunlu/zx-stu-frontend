import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Swal from "sweetalert2";
import { FileDialogButtonView } from "ckeditor5/src/upload";
import axios from "axios";
import * as qiniu from "qiniu-js";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

function getToken() {
  return Cookies.get(process.env.TOKEN_KEY) || "";
  // return localStorage.getItem(process.env.TOKEN_KEY) || "";
}

// FIXME:baseURL 需要按需要修改
const request = axios.create({
  baseURL: process.env.API_URL,
  timeout: 150000,
});

request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = "Bearer " + getToken() || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function getUploadToken() {
  return request({
    url: "auth/qiniu/uploadToken",
    method: "get",
  });
}

// 上传文件到七牛
async function uploadWrapper(file, key) {
  // 用时间戳作为文件名
  const { data } = await getUploadToken();
  const token = data.uploadToken;
  return qiniu.upload(file, key, token, {
    fname: key,
  });
}

export class FileUploadBtn extends Plugin {
  init() {
    const editor = this.editor;
    const componentCreator = (locale) => {
      const view = new FileDialogButtonView(locale);

      view.set({
        allowMultipleFiles: true,
      });

      view.buttonView.set({
        label: "上传文件",
        tooltip: true,
        withText: true,
      });

      view.on("done", (evt, files) => {
        // 焦点
        editor.editing.view.focus();

        // 上传文件
        const filesToUpload = Array.from(files);

        // 允许上传标志
        let allowToUpload = true;

        if (filesToUpload.length) {
          // 过滤图片
          filesToUpload.forEach((file) => {
            if (file.type.indexOf("image") !== -1) {
              Swal.fire({
                icon: "warning",
                title: "上传图片文件请使用上传图片功能",
                showConfirmButton: false,
                timer: 1500,
              });
              allowToUpload = false;
              return;
            }
          });

          if (!allowToUpload) return;

          // 最大允许上传文件大小
          const maxFileSize = 1024 * 1024 * 100;
          filesToUpload.forEach((file) => {
            if (file.size > maxFileSize) {
              Swal.fire({
                icon: "warning",
                title: "单个文件大小不能超过100M",
                showConfirmButton: false,
                timer: 1500,
              });
              allowToUpload = false;
              return;
            }
          });

          if (!allowToUpload) return;

          const fileName = uuidv4(); // 生成随机文件名

          filesToUpload.forEach((file) => {
            const fileRename = `${fileName}.${file.name.replace(/.+\./, "")}`;

            let url = ``;

            // 如果是 office 类型的文件，使用在线预览
            if (
              file.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              file.type === "application/msword" ||
              file.type === "application/vnd.ms-powerpoint" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
              file.type === "application/vnd.ms-excel" ||
              file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ) {
              url = `https://view.officeapps.live.com/op/view.aspx?src=${process.env.QINIUCDN}${fileRename}`;
            } else {
              url = `${process.env.QINIUCDN}${fileRename}`;
            }

            editor.model.change((writer) => {
              editor.model.insertContent(
                writer.createText(file.name, { linkHref: url })
              );
              editor.model.insertContent(writer.createText("    "));
            });

            let alertTitle = "请稍后";

            Swal.fire({
              toast: true,
              icon: "info",
              html: "文件上传中...<b></b>",
              title: alertTitle,
              showConfirmButton: false,
              showClass: {
                popup: "animate__animated animate__fadeIn",
                backdrop: "animate__animated animate__fadeIn",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOut",
                backdrop: "animate__animated animate__fadeOut",
              },
              didOpen: () => {
                Swal.showLoading();
              },
              willClose: () => {},
            });

            // 调用七牛云上传
            uploadWrapper(file, fileRename).then((uploader) => {
              uploader.subscribe(
                (res) => {
                  // 用于显示上传进度
                  const b = Swal.getHtmlContainer().querySelector("b");
                  b.textContent = `${Math.floor(res.total.percent)}%`;
                },
                (error) => {
                  console.error(error);
                },
                (data) => {
                  Swal.close();
                }
              );
            });
          });
        }
      });

      // 恢复焦点
      editor.editing.view.focus();

      return view;
    };

    editor.ui.componentFactory.add("uploadFile", componentCreator);
  }
}
