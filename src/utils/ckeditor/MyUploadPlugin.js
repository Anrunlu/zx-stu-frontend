import qiniuUpload from "src/utils/qiniu";
import { Loading, QSpinnerGears } from "quasar";

// 图片上传适配器，用于将图片上传到七牛云
export class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.uploader = null;
  }

  // 通过这个方法，会把上传到服务器的文件地址展示到编辑器中
  async upload() {
    const file = await this.loader.file;
    this.uploader = await qiniuUpload(file);
    return new Promise((resolve, reject) => {
      this.uploader.subscribe(
        (res) => {
          // 用于显示上传进度
          Loading.show({
            spinner: QSpinnerGears,
            message: `上传中...${Math.floor(res.total.percent)}%`,
          });
        },
        (error) => {
          console.error(error);
          return reject(error);
        },
        (data) => {
          Loading.hide();
          return resolve({
            default: process.env.QINIUCDN + data.key,
          });
        }
      );
    });
  }

  // 这个方法会在编辑器销毁时候，终止文件上传
  abort() {
    if (this.uploader) {
      this.uploader.unsubscribe();
    }
  }
}

export function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}
