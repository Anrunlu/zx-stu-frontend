<template>
  <q-chip
    square
    size="sm"
    icon="fingerprint"
    color="white"
    outline
    :label="shortId"
    clickable
    @click="handleQuestionIdClick"
  >
    <q-tooltip> {{ id }} 点击复制到剪贴板 </q-tooltip>
  </q-chip>
</template>

<script>
import { copyToClipboard } from "quasar";

export default {
  name: "QuestionShortId",
  props: {
    id: {
      type: String,
    },
    shortId: {
      type: String,
    },
  },

  methods: {
    handleQuestionIdClick() {
      // 复制id到剪贴板
      copyToClipboard(this.id).then(() => {
        this.$q.notify({
          message: "题目编号已复制到剪贴板",
          type: "positive",
        });
      });
    },
  },
};
</script>

<style></style>
