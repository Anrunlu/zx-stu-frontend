import { uploadWrapper } from "src/utils/qiniu";

// 剪切板适配器
export function MyClipboardAdapterPlugin(editor) {
  const editingView = editor.editing.view;
  console.log(editingView);
  editingView.document.on("clipboardInput", (evt, data) => {
    if (editor.isReadOnly) {
      return;
    }

    let files = data.dataTransfer.files;

    // const username = store.getters["user/username"];
    const username = `test`;

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

        console.log(content);

        // uploadWrapper(file, fileRename).then(() => {
        //   console.log("123456");
        // });
      });

      data.content = editor.data.htmlProcessor.toView(content);
    }
  });
}
