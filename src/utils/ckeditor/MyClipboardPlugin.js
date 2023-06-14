import uploadWrapper from "src/utils/qiniu";
import { v4 as uuidv4 } from "uuid";
import { Loading, QSpinnerGears } from "quasar";

// 剪切板适配器
export function MyClipboardAdapterPlugin(editor) {
  const editingView = editor.editing.view;
  editingView.document.on("clipboardInput", (evt, data) => {
    if (editor.isReadOnly) {
      return;
    }

    let files = data.dataTransfer.files;

    if (files.length != 0) {
      let content = "";

      files.forEach((file) => {
        // uuid
        const uuid = uuidv4();

        const fileRename = `${uuid}.${file.name.replace(/.+\./, "")}`;

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
          url = `https://view.officeapps.live.com/op/view.aspx?src=${process.env.QINIUCDN}${fileRename}`;
        } else {
          url = `${process.env.QINIUCDN}${fileRename}`;
        }

        content += `<a href='${url}'>${file.name}</a> &emsp;`;

        uploadWrapper(file, fileRename).then((uploader) => {
          uploader.subscribe(
            (res) => {
              // 用于显示上传进度
              Loading.show({
                spinner: QSpinnerGears,
                message: `上传中...${Math.floor(res.total.percent)}%`,
              });
            },
            (error) => {
              console.error(error);
            },
            (data) => {
              Loading.hide();
              // console.log("上传成功");
            }
          );
        });
      });

      data.content = editor.data.htmlProcessor.toView(content);
    }
  });
}
