<template>
  <q-card
    class="q-my-sm shadow-1 cursor-pointer"
    style="border-radius: 7px"
    :class="{
      'shadow-2 actived': isActive,
    }"
    @click="handleQuestionCardClick"
    @dblclick="handleQuestionCardDblClick"
  >
  </q-card>
</template>

<script>
import { apiGetHomeworkQuestionStatistics } from "src/api/teacher/homework";
export default {
  // 客观题作答统计卡片
  // TODO: 暂不支持填空题
  name: "QuestionStatisticsCard",
  props: {
    homeworkId: {
      type: String,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      questionStatistics: {
        answerNumArray: [],
        totalAnswerNum: 0,
        totalAnsweredStudentNum: 0,
        studentAnswerDetails: [],
      },
    };
  },

  watch: {
    questionId: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.getQuestionStatistics();
        }
      },
      immediate: true,
    },
  },

  methods: {
    // 获取题目的统计信息
    async getQuestionStatistics() {
      const payload = {
        homework_id: this.homeworkId,
        question_id: this.questionId,
      };

      const { data } = await apiGetHomeworkQuestionStatistics(payload);

      this.questionStatistics.studentAnswerDetails =
        data.data.studentAnswerDetails;

      const question = data.data.question;
      const answerNumArray = data.data.questionOptionsStatistics;
      const totalAnsweredStudentNum = data.data.studentAnswerDetails.length;

      const totalAnswerNum = answerNumArray.reduce((pre, curr) => {
        pre += curr.num;
        return pre;
      }, 0);
      answerNumArray.forEach((an) => {
        an.rate = an.num / totalAnswerNum;
        question.answer.forEach((qan) => {
          if (an._id == qan.mark && qan.isRight) {
            an.isRight = true;
          }
        });
      });

      // 显示当前选项学生列表，TODO:开销较大，后期考虑优化
      answerNumArray.forEach((an) => {
        let studentsWithThisAnswer =
          this.questionStatistics.studentAnswerDetails.reduce((pre, curr) => {
            const currStuAnswers = curr.stuAnswer;
            currStuAnswers.forEach((stuAn) => {
              if (stuAn.mark == an._id) {
                pre.push(curr.student.user);
              }
            });
            return pre;
          }, []);
        an.studentsWithThisAnswer = studentsWithThisAnswer;
      });

      // 按 ABCD 排序
      answerNumArray.sort(function (a, b) {
        let nameA = a._id.toUpperCase(); // ignore upper and lowercase
        let nameB = b._id.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.questionStatistics.answerNumArray = answerNumArray;
      this.questionStatistics.totalAnswerNum = totalAnswerNum;
      this.questionStatistics.totalAnsweredStudentNum = totalAnsweredStudentNum;
    },

    handleQuestionCardClick() {},
    handleQuestionCardDblClick() {},
  },
};
</script>

<style>
#question-assessment .q-item {
  padding-top: 1px;
  padding-bottom: 3px;
}
</style>
