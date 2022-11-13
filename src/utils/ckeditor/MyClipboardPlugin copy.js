import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Swal from "sweetalert2";
import store from "@/store/index";
import { uploadWrapper } from "@/utils/qiniu";

/**
 * 编辑器通过剪切板上传文件插件
 */
export class ClipboardFile extends Plugin {
  static get pluginName() {
    return "ClipboardFile";
  }

  init() {
    const editor = this.editor;

    const editingView = editor.editing.view;

    editingView.document.on("clipboardInput", (evt, data) => {
      if (editor.isReadOnly) {
        return;
      }

      let files = data.dataTransfer.files;

      const username = store.getters["user/username"];

      if (files.length != 0) {
        let content = "";

        files.forEach((file) => {
          const fileRename = `${username}-${Date.now()}.${file.name.replace(
            /.+\./,
            ""
          )}`;

          let url = "";

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

          content += `<a href='${url}'>${file.name}</a> &emsp;`;

          Swal.fire({
            icon: "info",
            title: "文件上传中",
            allowOutsideClick: false,
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
          uploadWrapper(file, fileRename).then(() => {
            Swal.close();
          });
        });

        data.content = editor.data.htmlProcessor.toView(content);
      }
    });
  }
}
