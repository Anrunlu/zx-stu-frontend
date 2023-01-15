<template>
  <q-card style="width: 900px; max-width: 90vw">
    <CardBar :title="questionSet.title" icon="topic">
      <!-- 右侧按钮 -->
      <template v-slot:right>
        <q-btn
          class="q-mr-sm"
          dense
          outline
          icon="publish"
          @click="handlePublishBtnClick"
          label="发布"
        >
          <q-tooltip>发布</q-tooltip>
        </q-btn>
      </template>
    </CardBar>
    <q-card-section style="max-height: 90vh" class="scroll">
      <div v-for="(questionDetails, index) in questions" :key="index">
        <QuestionViewCommon
          :questionDetails="questionDetails"
          :index="index + 1"
          :showIndex="true"
          :showShortId="true"
          :showPresetScore="true"
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
      questionSet: {
        title: "",
      },
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
        this.questionSet = questionSet;
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

    // 点击发布按钮
    handlePublishBtnClick() {
      this.$emit("publish", this.questionSetId);
    },
  },

  created() {
    this.getQuestionSetDetails();
  },
};
</script>

<style></style>
