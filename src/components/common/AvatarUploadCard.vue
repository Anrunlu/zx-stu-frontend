<template>
  <q-card>
    <CardBar title="上传头像" icon="face" />
    <q-card-section>
      <vue-avatar
        :width="200"
        :height="200"
        :rotation="rotation"
        :scale="scale"
        ref="vueavatar"
        @vue-avatar-editor:image-ready="onImageReady"
      >
      </vue-avatar>
      <q-separator spaced />

      <q-badge label="缩放" />
      <q-slider
        v-model="scale"
        :min="0"
        :max="2"
        :step="0.02"
        color="primary"
        label
      />

      <q-badge label="旋转" />
      <q-slider
        v-model="rotation"
        :min="0"
        :max="180"
        :step="5"
        color="primary"
        label
      />

      <img ref="image" />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        color="primary"
        icon="cloud_upload"
        label="确定并上传"
        @click="saveClicked"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { VueAvatar } from "vue-avatar-editor-improved";
import { dataURItoBlob } from "src/utils/common";
import uploadWrapper from "src/utils/qiniu";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "AvatarUploadCard",
  data() {
    return {
      rotation: 0,
      scale: 1,
    };
  },
  components: {
    VueAvatar,
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  methods: {
    async uploadAvatar(file) {
      const uuid = uuidv4();
      const fileRename = `${uuid}.${file.type.split("/").pop()}`;

      uploadWrapper(file, fileRename).then((uploader) => {
        uploader.subscribe(
          (res) => {
            // 用于显示上传进度
            // console.log(res);
          },
          (error) => {
            console.error(error);
          },
          (data) => {
            // 上传成功，返回文件名，
            const avatar = process.env.QINIUCDN + data.key;

            // 告知父组件上传成功
            this.$emit("avatarUploaded", avatar);

            // 提示上传成功
            this.$q.notify({
              message: "头像上传成功",
              type: "positive",
            });
          }
        );
      });
    },

    saveClicked() {
      let img = this.$refs.vueavatar.getImageScaled();
      const imgFile = dataURItoBlob(img.toDataURL());
      this.uploadAvatar(imgFile);
    },

    onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },
  },
};
</script>

<style></style>
