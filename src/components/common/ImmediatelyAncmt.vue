<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card :class="`bg-${bgColor} text-${txColor}`">
      <q-bar>
        <span class="text-text-subtitle1">{{ category }}「{{ type }}」</span>
        <q-space />

        <q-btn
          dense
          flat
          icon="minimize"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip
            v-if="maximizedToggle"
            content-class="bg-white text-primary"
            >最小化</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          icon="crop_square"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip
            v-if="!maximizedToggle"
            content-class="bg-white text-primary"
            >最大化</q-tooltip
          >
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h4">{{ titile }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-html="content"></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  // 即时通知
  name: "ImmediatelyAncmt",
  data() {
    return {
      dialog: false,
      maximizedToggle: false,
      titile: "",
      content: "",
      category: "",
      creator: "",
      isforce: true,
      urgencyType: "",
      bgColor: "green",
      txColor: "white",
      type: "",
    };
  },

  sockets: {
    // 接收即时通知
    immediatelyAncmt(data) {
      console.log(data);
      this.titile = data.title;
      this.content = data.content;
      this.category = data.category;
      this.creator = data.creator;
      this.isforce = data.isforce;
      this.urgencyType = data.urgencyType;
      switch (this.urgencyType) {
        case "red":
          this.bgColor = "negative";
          this.type = "紧急";
          break;
        case "green":
          this.bgColor = "positive";
          break;
        case "blue":
          this.bgColor = "primary";
          break;
        case "yellow":
          this.bgColor = "warning";
          this.type = "重要";
          break;
        default:
          this.bgColor = "white";
          this.txColor = "black";
          break;
      }

      this.dialog = true;
      this.maximizedToggle = true;
    },
  },
};
</script>

<style>
/* 防止图片溢出 */
img {
  max-width: 100% !important;
}
</style>
