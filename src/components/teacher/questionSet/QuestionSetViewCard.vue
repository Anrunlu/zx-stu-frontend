<template>
  <q-card style="width: 900px; max-width: 90vw">
    <CardBar title="题集预览" icon="list" />
    <q-card-section style="max-height: 90vh" class="scroll">
      <div v-for="(questionDetails, index) in questions" :key="index">
        <QuestionViewCommon
          :questionDetails="questionDetails"
          :showShortId="true"
          class="q-my-sm"
        />
        <q-separator />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { apiGetQuestionSetDetails } from "src/api/teacher/questionSet";
import { preProcessQuestionSetQuestions } from "src/utils/questionSet";
export default {
  name: "QuestionSetViewCard",
  props: {
    questionSetId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      questions: [],
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
    QuestionViewCommon: () =>
      import("src/components/common/QuestionViewCommon.vue"),
  },

  watch: {
    questionSetId() {
      this.getQuestionSetDetails();
    },
  },

  methods: {
    // 获取题集详细信息
    async getQuestionSetDetails() {
      try {
        const { data } = await apiGetQuestionSetDetails(this.questionSetId);
        const questionSet = data.data;
        preProcessQuestionSetQuestions(questionSet);
        this.questions = questionSet.questions;
      } catch (e) {
        console.log(e);
        this.$q.notify({
          message: "获取题集详细信息失败",
          type: "negative",
        });
      }
    },
  },

  created() {
    this.getQuestionSetDetails();
  },
};
</script>

<style></style>
