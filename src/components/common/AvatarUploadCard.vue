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
import qiniuUpload from "src/utils/qiniu";
export default {
  name: "AvatarUploadCard",
  data() {
    return {
      rotation: 0,
      scale: 1,
      file: null,
    };
  },
  components: {
    VueAvatar,
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  methods: {
    async uploadAvatar() {
      this.uploader = await qiniuUpload(file);
      return new Promise((resolve, reject) => {
        this.uploader.subscribe(
          () => {},
          (error) => {
            console.error(error);
            return reject(error);
          },
          (data) => {
            return resolve({
              default: `https://cyberdownload.anrunlu.net/` + data.key,
            });
          }
        );
      });
    },

    saveClicked() {
      let img = this.$refs.vueavatar.getImageScaled();
      const imgFile = dataURItoBlob(img.toDataURL());
      console.log(imgFile);
    },

    onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },
  },
};
</script>

<style></style>
