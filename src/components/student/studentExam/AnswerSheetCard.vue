<template>
  <div>
    <q-btn
      color="primary"
      class="float-button"
      label="答题卡"
      @click="handleShowAnswerSheet"
    />
    <q-dialog v-model="answerSheetCardDg" persistent position="right">
      <q-card>
        <q-card-section>
          <div class="row items-center q-gutter-sm">
            <div v-for="(q, i) in questions" :key="i">
              <q-btn
                :color="q.submited ? 'positive' : 'primary'"
                :label="i + 1"
                outline
                @click="handleClickAnswerSheetItem(q)"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="q-mt-xl"
            color="primary"
            icon="close"
            label="关闭答题卡"
            outline
            @click="handleShowAnswerSheet"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "AnswerSheetCard",
  props: {
    questions: {
      type: Array,
    },
  },
  data() {
    return {
      answerSheetCardDg: false,
    };
  },
  methods: {
    handleShowAnswerSheet() {
      this.answerSheetCardDg = !this.answerSheetCardDg;
    },

    handleClickAnswerSheetItem(q) {
      this.$emit("questionClick", q);
      this.answerSheetCardDg = false;
    },
  },
};
</script>

<style>
.float-button {
  position: fixed;
  bottom: 15rem;
  right: 0;
  width: 2rem;
  padding: 0;
  border-radius: 6px 0 0 6px;
}
</style>
