<template>
  <q-chip
    square
    size="sm"
    icon="fingerprint"
    :color="color"
    outline
    :label="shortIdToShow"
    clickable
    @click.stop="handleQuestionIdClick"
  >
    <q-tooltip> {{ id }} 点击复制到剪贴板 </q-tooltip>
  </q-chip>
</template>

<script>
import { copyToClipboard } from "quasar";

export default {
  name: "ObjectShortId",
  props: {
    id: {
      type: String,
      default: "xxxxxx",
    },
    shortId: {
      type: String,
    },
    objectName: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "white",
    },
  },

  computed: {
    shortIdToShow() {
      return this.shortId || this.id.slice(-5).toUpperCase();
    },
  },

  methods: {
    handleQuestionIdClick() {
      // 复制id到剪贴板
      copyToClipboard(this.id).then(() => {
        this.$q.notify({
          message: `${this.objectName}编号已复制到剪贴板`,
          type: "positive",
        });
      });
    },
  },
};
</script>

<style></style>
