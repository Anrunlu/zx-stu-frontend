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
    <q-card-section class="row items-center q-pb-none">
      <q-chip
        color="blue-3"
        text-color="white"
        label="作答统计"
        icon="assessment"
        square
        size="sm"
      />
      <q-space />
    </q-card-section>

    <q-card-section>
      <q-list id="question-assessment">
        <q-expansion-item
          v-for="answerCase in questionStatistics.answerNumArray"
          :key="answerCase._id"
          expand-separator
        >
          <template v-slot:header>
            <q-item
              @click="showStudentsWithThisAnswer(answerCase._id)"
              class="full-width q-pa-none"
            >
              <q-item-section avatar>
                <q-icon :color="answerCase.isRight ? 'positive' : 'grey'"
                  >{{ answerCase._id }}
                </q-icon>
              </q-item-section>

              <q-item-section>
                <q-linear-progress
                  size="25px"
                  :value="answerCase.rate"
                  :color="answerCase.isRight ? 'green-5' : 'grey-5'"
                  stripe
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="accent"
                      :label="Math.round(answerCase.rate * 100) + '%'"
                    />
                  </div>
                </q-linear-progress>
              </q-item-section>
              <q-item-section side>{{ answerCase.num }}人</q-item-section>
            </q-item>
          </template>
          <!-- TODO:抽离成 UsernameWithAvatarChip 组件 -->
          <q-card>
            <q-card-section>
              <div class="row">
                <q-chip
                  class="col-3 col-md-1"
                  square
                  color="white"
                  size="sm"
                  v-for="student in answerCase.studentsWithThisAnswer"
                  :key="student.username"
                >
                  <q-avatar color="secondary" text-color="white">
                    <img v-if="student.avatar" :src="student.avatar" />
                    <span v-else>{{ student.nickname.slice(0, 1) }}</span>
                  </q-avatar>
                  {{ student.nickname }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
      <!-- 底部信息区域 -->
      <div>
        <span class="q-mt-sm text-grey" style="font-size: 0.6rem"
          >共 {{ questionStatistics.totalAnsweredStudentNum }} 人作答</span
        >
      </div>
    </q-card-section>
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
