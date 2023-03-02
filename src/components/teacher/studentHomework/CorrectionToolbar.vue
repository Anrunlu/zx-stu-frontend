<template>
  <div
    class="row q-ml-sm justify-end"
    :class="$q.platform.is.mobile ? 'q-gutter-sm' : 'q-gutter-lg'"
  >
    <div class="row q-mr-xl">
      <!-- 大屏幕 -->
      <q-btn-group outline v-if="!$q.platform.is.mobile">
        <q-btn
          outline
          label="上题"
          icon="chevron_left"
          @click="handlePrevQuestion"
        />
        <q-btn
          outline
          dense
          :label="`${currQuestionIndex + 1}/${totalQuestionNum}`"
        >
          <!-- <q-tooltip> 开启/关闭题目列表 </q-tooltip> -->
        </q-btn>
        <q-btn
          outline
          label="下题"
          icon-right="chevron_right"
          @click="handleNextQuestion"
        />
      </q-btn-group>
    </div>
  </div>
</template>

<script>
import { apiPostCorrectStudentQA } from "src/api/teacher/homework";
export default {
  name: "CorrectionToolbar",
  props: {
    currQuestion: {
      type: Object,
      required: true,
    },
    currQuestionIndex: {
      type: Number,
      required: true,
    },
    totalQuestionNum: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      questionDetails: {
        _id: "",
        id: "",
        type: "",
        difficulty: 0,
        presetScore: 0,
        content: "",
        studentQA: [
          {
            stuAnswer: [
              {
                content: "",
              },
            ],
            score: 0,
            comment: "",
          },
        ],
      },
      commentsDig: false,
    };
  },

  watch: {
    currQuestion: {
      handler(newVal) {
        this.questionDetails = newVal;
      },
      deep: true,
    },
  },

  methods: {
    // 提交
    async handleSubmit() {
      // 检查是否未作答
      if (!this.currQuestion.isSubmit) {
        this.$q.notify({
          message: "未作答无法评分",
          type: "negative",
          position: "top",
          timeout: 1000,
        });
        return;
      }

      // 检查评分是否大于预设分
      if (
        this.currQuestion.studentQA[0].score > this.currQuestion.presetScore
      ) {
        this.$q.notify({
          message: "评分不能大于预设分",
          type: "negative",
          position: "top",
          timeout: 1000,
        });
        return;
      }

      // 分数输入框失焦
      this.$refs.scoreInput.blur();

      const payload = {
        studentQA_id: this.questionDetails.studentQA[0]._id,
        comment: this.questionDetails.studentQA[0].comment,
        score: this.questionDetails.studentQA[0].score,
      };

      const { data } = await apiPostCorrectStudentQA(payload);

      const rspStudentQA = data.data.studentQA;
      const rspStudentHomework = data.data.studentHomework;

      // 通知父组件更新数据
      const payload2emit = {
        score: rspStudentQA.score,
        comment: rspStudentQA.comment,
        corrected: rspStudentQA.corrected,
        homeworkFinalScore: rspStudentHomework.finalScore,
      };

      this.$emit("submited", payload2emit);

      // 评论内容置空
      this.comment = "";

      this.$q.notify({
        message: "提交成功",
        type: "positive",
        position: "top",
        timeout: 1000,
      });
    },

    handleNextStu() {
      this.$emit("nextStu");
    },
    handlePrevStu() {
      this.$emit("prevStu");
    },
    handleNextQuestion() {
      this.$emit("nextQuestion");
    },
    handlePrevQuestion() {
      this.$emit("prevQuestion");
    },
    handleSwitchDisplayStuList() {
      this.$emit("switchDisplayStuList");
    },

  },

  mounted() {
    // 绑定快捷键
    // 激活分数输入框
    this.$shortcut.bind("space", this.handleActivateScoreInput);
    // 提交
    this.$shortcut.bind("enter", this.handleSubmit);
  },

  created() {
    this.questionDetails = this.currQuestion;
  },

  beforeDestroy() {
    this.$shortcut.unbind("space");
    this.$shortcut.unbind("enter");
  },
};
</script>

<style></style>
