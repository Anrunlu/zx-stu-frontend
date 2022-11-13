import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Swal from "sweetalert2";
import store from "@/store/index";
import { FileDialogButtonView } from "ckeditor5/src/upload";
import { uploadWrapper } from "@/utils/qiniu";

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
        const username = store.getters["user/username"];

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

          filesToUpload.forEach((file) => {
            const fileRename = `${username}-${Date.now()}.${file.name.replace(
              /.+\./,
              ""
            )}`;

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
              url = `https://view.officeapps.live.com/op/view.aspx?src=https://cyberdownload.anrunlu.net/${fileRename}`;
            } else {
              url = `https://cyberdownload.anrunlu.net/${fileRename}`;
            }

            editor.model.change((writer) => {
              editor.model.insertContent(
                writer.createText(file.name, { linkHref: url })
              );
              editor.model.insertContent(writer.createText("    "));
            });

            Swal.fire({
              toast: true,
              icon: "info",
              title: "文件上传中",
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
            uploadWrapper(file, fileRename).then(() => {
              Swal.close();
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
