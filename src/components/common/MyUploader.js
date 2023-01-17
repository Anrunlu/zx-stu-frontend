// MyUploader.js
import { QUploaderBase } from "quasar";
import uploadWrapper from "src/utils/qiniu";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "MyUploader",

  mixins: [QUploaderBase],

  props: {
    allowUpload: Boolean,
  },

  data() {
    return {
      workingThreads: 0,
      uploadedFiles: [],
    };
  },

  computed: {
    // [REQUIRED]
    // we're working on uploading files
    isUploading() {
      return this.workingThreads > 0;
    },

    // [optional]
    // shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    isBusy() {
      // return <Boolean>
    },
  },

  watch: {
    isUploading(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.$emit("finished", this.uploadedFiles);
      }
    },
  },

  methods: {
    // [REQUIRED]
    // abort and clean up any process
    // that is in progress
    abort() {
      // ...
    },

    // [REQUIRED]
    upload() {
      if (this.canUpload === false || this.allowUpload === false) {
        return;
      }

      const queue = this.queuedFiles.slice(0);
      this.queuedFiles = [];

      queue.forEach((file) => {
        this.uploadFileToQiniu(file);
      });
    },

    uploadFileToQiniu(file) {
      this.workingThreads++;
      const uuid = uuidv4();
      const fileRename = uuid + "." + file.name.split(".").pop();

      uploadWrapper(file, fileRename).then((uploader) => {
        uploader.subscribe(
          (res) => {
            this.__updateFile(file, "uploading", res.total.loaded);
          },
          (error) => {
            console.error(error);
            this.workingThreads--;
          },
          (data) => {
            this.workingThreads--;
            this.__updateFile(file, "uploaded");
            this.uploadedSize += file.size;
            const fileUrl = process.env.QINIUCDN + data.key;
            file.fileUrl = fileUrl;
            this.uploadedFiles.push(file);
          }
        );
      });
    },
  },
};
