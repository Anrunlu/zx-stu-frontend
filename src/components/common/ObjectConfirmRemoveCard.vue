<template>
  <q-card style="min-width: 500px; max-width: 80vw">
    <CardBar :title="title" icon="warning" bgColor="negative" />
    <q-card-section>
      <div class="q-mb-sm">
        删除{{ objectName }}【{{ shortId }}】<span
          style="font-weight: 500; color: red"
          >操作不可恢复！</span
        >
      </div>

      <!-- addition 补充说明插槽 -->
      <slot name="addition"></slot>

      <q-input
        v-model="confirmText"
        type="text"
        outlined
        square
        dense
        :label="`请输入“${shortId}”以确认删除`"
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        color="negative"
        icon="delete"
        label="确认删除"
        @click="handleConfirmBtnClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "ObjectConfirmRemoveCard",
  props: {
    title: {
      type: String,
      default: "确认删除",
    },
    shortId: {
      type: String,
    },
    objectName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      confirmText: "",
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  methods: {
    handleConfirmBtnClick() {
      // 校验
      if (this.confirmText !== this.shortId) {
        this.$q.notify({
          message: "输入的确认文本不匹配",
          type: "negative",
        });
        return;
      }

      // 确认删除
      this.$emit("confirmRemove");
    },
  },
};
</script>

<style></style>
