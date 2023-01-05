<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="edit_note" />
        <div>{{ currStuInfo.nickname }} {{ currStuInfo.username }}</div>
        <q-space />
        <q-btn dense flat icon="settings" label="批改设置"> </q-btn>
        <q-btn dense flat icon="help">
          <q-tooltip>帮助</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="handleCloseBtnClick">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>

    <q-drawer
      v-model="drawerLeft"
      show-if-above
      :width="220"
      :breakpoint="700"
      elevated
    >
      <q-scroll-area class="fit">
        <div class="q-my-md">
          <q-list separator>
            <q-item
              clickable
              v-ripple
              v-for="student in overallAnswerStatus"
              :key="student.username"
              :id="student.username"
              :active="student.username === currStuInfo.username"
              active-class="bg-cyan-1 text-grey-8"
              @click="handleStuItemClick(student)"
            >
              <q-item-section avatar>
                <q-avatar rounded color="secondary" text-color="white">
                  <img :src="student.avatar" v-if="student.avatar" />
                  <span v-else>{{ student.nickname.slice(0, 1) }}</span>
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ student.nickname }}</q-item-section>
              <q-item-section side>
                <span
                  v-if="student.answerProgress <= 0"
                  style="font-size: 0.5rem"
                  >未作答</span
                >
                <span v-else>{{ student.score }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page class="q-ma-md">
        <div class="row justify-center">
          <div class="col-11 col-md-10">
            <!-- 非解答题 -->
            <q-card
              v-for="questionDetails in questions"
              :key="questionDetails._id"
              :id="questionDetails._id"
              class="q-my-sm shadow-1 cursor-pointer"
              :class="{ 'shadow-5': questionDetails._id == currQuestion._id }"
              @click="handleQuestionCardClick(questionDetails)"
            >
              <q-card-section v-if="questionDetails.type != '解答'">
                <!-- 题干区域 -->
                <div>
                  <div>
                    <QuestionChip :questionType="questionDetails.type" />
                    <ObjectShortId
                      :id="questionDetails._id"
                      :color="'grey'"
                      objectName="题目"
                    />
                    <q-chip
                      class="float-right"
                      dense
                      outline
                      size="sm"
                      square
                      :color="questionDetails.getScore > 0 ? 'green-5' : 'grey'"
                      :label="`得分:${questionDetails.getScore}`"
                    />
                  </div>
                  <div
                    class="text-subtitle1 q-pt-sm"
                    v-html="questionDetails.content"
                    v-katex
                    v-viewer
                  ></div>
                </div>
                <!-- 选项区域 -->
                <q-list>
                  <q-item
                    v-for="(option, index) in questionDetails.answer"
                    :key="index"
                  >
                    <!-- 非填空题 -->
                    <q-item-section
                      avatar
                      v-if="questionDetails.type != '填空'"
                    >
                      <q-icon
                        :class="{
                          'q-pa-xs rounded-borders bg-red-2':
                            option.selected && !option.isRight,
                        }"
                        :color="
                          option.isRight && option.selected
                            ? 'positive'
                            : option.selected
                            ? 'primary'
                            : 'grey'
                        "
                        >{{ option.mark }}

                        <q-badge
                          color="red"
                          floating
                          rounded
                          v-if="option.selected && !option.isRight"
                        >
                          x
                        </q-badge>
                      </q-icon>
                    </q-item-section>
                    <!-- 填空题 -->
                    <q-item-section avatar v-else>
                      <q-icon :color="option.isRight ? 'positive' : 'grey'">{{
                        option.mark.slice(1, 2)
                      }}</q-icon>
                    </q-item-section>
                    <q-item-section>
                      <div
                        class="text-body2 option"
                        v-katex
                        v-html="option.content"
                        v-viewer
                      ></div>
                    </q-item-section>
                  </q-item>
                </q-list>
                <span class="q-mt-sm text-grey" style="font-size: 0.3rem">{{
                  questionDetails.submited
                    ? `最后提交:${questionDetails.lastSubmitedTime}`
                    : "未作答"
                }}</span>
              </q-card-section>
            </q-card>

            <!-- 解答题 -->
            <div
              class="cursor-pointer"
              @click.stop="handleQuestionCardClick(currJiedaQuestion)"
              :class="{
                'shadow-3': currJiedaQuestion._id == currQuestion._id,
              }"
            >
              <JiedaQuestionCard
                v-if="jiedaQuestions.length > 0"
                :currQuestion="currJiedaQuestion"
                :currQuestionIndex="currJiedaQuestionIndex"
                :totalQuestionCount="jiedaQuestions.length"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-white text-primary q-py-sm">
      <div class="row q-gutter-lg q-ml-sm">
        <div class="col-7 col-xl-5">
          <div class="row q-gutter-sm">
            <q-slider
              class="col"
              v-model="currQuestion.studentQA[0].score"
              label
              :marker-labels="sliderMarkerLabel"
              :min="0"
              :max="currQuestion.presetScore"
              dense
            />
            <q-input
              class="q-ml-lg"
              clearable
              clear-icon="close"
              v-model="currQuestion.studentQA[0].score"
              type="number"
              label="输入成绩"
              dense
              outlined
            />
            <q-btn-group push>
              <q-btn-dropdown label="提交" color="blue" split>
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-item-label>输入评语</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-btn-group>
          </div>
        </div>

        <div class="col">
          <q-btn-group outline>
            <q-btn
              outline
              label="下一人"
              icon="arrow_downward"
              @click="handleNextStu"
            />
            <q-btn
              outline
              dense
              :label="`${currStuInfoIndex + 1}/${overallAnswerStatus.length}`"
              @click="drawerLeft = !drawerLeft"
            >
              <q-tooltip> 开启/关闭学生列表 </q-tooltip>
            </q-btn>
            <q-btn
              outline
              label="上一人"
              icon-right="arrow_upward"
              @click="handlePrevStu"
            />
            <q-btn
              outline
              label="上题"
              icon="chevron_left"
              @click="handlePrevQuestion"
            />
            <q-btn
              outline
              dense
              :label="`${currQuestionIndex + 1}/${questions.length}`"
              @click="drawerLeft = !drawerLeft"
            >
              <q-tooltip> 开启/关闭题目列表 </q-tooltip>
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
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import {
  apiGetHomeworkDetails,
  apiGetHomeworkOverallAnswerStatus,
  apiGetStudentHomeworkDetails,
} from "src/api/teacher/homework";
import {
  preProcessHomeworkDetails,
  preProcessStuAnswerStatus,
  pretreatmentChoiceQuestions,
  pretreatmentFillBlankQuestions,
  pretreatmentJiedaQuestions,
} from "src/utils/homework";

export default {
  name: "StudentHomework",
  props: {
    homeworkId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      mode: "waterfall", // foucs: 专注模式, waterfall: 瀑布模式
      drawerLeft: true,
      overallAnswerStatus: [],
      currStuInfo: {},
      currStuInfoIndex: 0,
      currQuestion: {
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
          },
        ],
      },
      currQuestionIndex: 0,
      hasObjQues: false,
      hasSubQues: false,
      questions: [],
      choiceQuestions: [],
      fillBlankQuestions: [],
      jiedaQuestions: [],
      currJiedaQuestionIndex: 0,
      currJiedaQuestion: {
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
          },
        ],
      },
    };
  },

  components: {
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
    JiedaQuestionCard: () =>
      import("src/components/teacher/studentHomework/JiedaQuestionCard.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    sliderMarkerLabel() {
      const level1 = this.currQuestion.presetScore * 0.6 || 60;
      const level2 = this.currQuestion.presetScore * 0.85 || 85;
      const level3 = this.currQuestion.presetScore * 1 || 100;
      return [
        { value: 0, label: `0分` },
        { value: level1, label: `${level1}分` },
        { value: level2, label: `${level2}分` },
        { value: level3, label: `${level3}` },
      ];
    },
  },

  methods: {
    // 获取作业详细信息
    async getHomeworkDetail() {
      try {
        const { data } = await apiGetHomeworkDetails(this.homeworkId);
        preProcessHomeworkDetails(data.data);
        this.homeworkDetails = data.data;

        // 获取教学班学生作答情况
        this.getHomeworkOverallAnswerStatus();
      } catch (error) {
        this.$q.notify({
          message: "获取作业信息失败",
          type: "negative",
        });
      }
    },

    // 获取教学班学生作答情况
    async getHomeworkOverallAnswerStatus() {
      const getHomeworkOverallAnswerStatusDto = {
        homework_id: this.homeworkDetails._id,
        receiver_id: this.homeworkDetails.receiver._id,
        receiver_type: "Classroom",
        tcc_id: this.homeworkDetails.tcc,
      };

      try {
        const { data } = await apiGetHomeworkOverallAnswerStatus(
          getHomeworkOverallAnswerStatusDto
        );
        data.data.forEach((stuAnswerStatus) => {
          preProcessStuAnswerStatus(stuAnswerStatus);
        });

        this.overallAnswerStatus = data.data;

        // 获取路由 query 参数
        const query = this.$route.query;

        // 如果有 u 参数，则定位到该学生
        if (query.u) {
          const stuInfo = this.overallAnswerStatus.find(
            (stu) => stu.username === query.u
          );

          this.switchToStu(stuInfo);

          setTimeout(() => {
            this.locateStuNoFlash();
          }, 500);
        }
      } catch (error) {
        this.$q.notify({
          message: "获取作答情况失败",
          type: "negative",
        });
      }
    },

    // 获取当前学生作答详情
    async getCurrStuAnswerDetail() {
      const payload = {
        homework_id: this.homeworkId,
        student_id: this.currStuInfo._id,
      };

      try {
        const { data } = await apiGetStudentHomeworkDetails(payload);

        const questionSets = data.data.questionSets;
        // 过滤题型和统计各类型题目数
        const quesCategory = [];
        // 选择题，包括单、多选和判断
        let choiceQuestions = questionSets[0].questions.filter(
          (question) =>
            question.type === "单选" ||
            question.type === "多选" ||
            question.type === "判断"
        );
        if (choiceQuestions.length > 0) {
          quesCategory.push({
            type: "选择题",
            num: choiceQuestions.length,
            submitedNum: choiceQuestions.filter((q) => q.studentQA.length > 0)
              .length,
            routePrefix: "choice",
            // id: hmwId,
          });
        }
        // 填空题
        let fillBlankQuestions = questionSets[0].questions.filter(
          (question) => question.type === "填空"
        );
        if (fillBlankQuestions.length > 0) {
          quesCategory.push({
            type: "填空题",
            num: fillBlankQuestions.length,
            submitedNum: fillBlankQuestions.filter(
              (q) => q.studentQA.length > 0
            ).length,
            routePrefix: "fillBlank",
            // id: hmwId,
          });
        }
        // 编程题
        const programQuestions = questionSets[0].questions.filter(
          (question) => question.type === "编程"
        );
        if (programQuestions.length > 0) {
          quesCategory.push({
            type: "编程题",
            num: programQuestions.length,
            submitedNum: programQuestions.filter((q) => q.studentQA.length > 0)
              .length,
            routePrefix: "program",
            // id: hmwId,
          });
        }
        // 解答题
        const jiedaQuestions = questionSets[0].questions.filter(
          (question) => question.type === "解答"
        );
        if (jiedaQuestions.length > 0) {
          quesCategory.push({
            type: "解答题",
            num: jiedaQuestions.length,
            submitedNum: jiedaQuestions.filter((q) => q.studentQA.length > 0)
              .length,
            routePrefix: "jieda",
            // id: hmwId,
          });
        }

        // 设置 hasObjQues 和 hasSubQues 和 correctMode
        const hasObjQues = quesCategory.some(
          (q) => q.type === "选择题" || q.type === "填空题"
        );
        const hasSubQues = quesCategory.some((q) => q.type === "解答题");

        this.hasObjQues = hasObjQues;
        this.hasSubQues = hasSubQues;

        // 预处理选择题
        choiceQuestions = pretreatmentChoiceQuestions(choiceQuestions);
        // 预处理填空题
        fillBlankQuestions = pretreatmentFillBlankQuestions(fillBlankQuestions);
        // 预处理解答题
        pretreatmentJiedaQuestions(jiedaQuestions);

        const questions = [
          ...choiceQuestions,
          ...fillBlankQuestions,
          ...programQuestions,
          ...jiedaQuestions,
        ];

        const questionsMeta = questionSets[0].questionsMeta; // 题目元数据

        if (questionsMeta.length > 0) {
          // 把题目元数据拼接到题目上
          questions.forEach((question) => {
            const questionMeta = questionsMeta.find(
              (meta) => meta._id === question._id
            );
            question.presetScore = questionMeta.presetScore;
            question.creator = questionMeta.creator;
          });
        } else {
          // TODO:为了兼容旧数据，这样处理
          // 如果没有题目元数据，表明题目预设分是100
          const baseScore = 100;
          questions.forEach((q) => {
            q.presetScore = baseScore;
          });
        }

        this.questions = questions;
        this.quesCategory = quesCategory;
        this.choiceQuestions = choiceQuestions;
        this.fillBlankQuestions = fillBlankQuestions;
        this.jiedaQuestions = jiedaQuestions;
        this.programQuestions = programQuestions;

        this.currQuestion = questions[this.currQuestionIndex];

        if (this.jiedaQuestions.length > 0) {
          this.currJiedaQuestion = jiedaQuestions[this.currJiedaQuestionIndex];
        }
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取学生作答详情失败",
          type: "negative",
        });
      }
    },

    // 切换学生
    async switchToStu(stuInfo) {
      this.currStuInfo = stuInfo;
      // 获取学生在 overallAnswerStatus 中的索引
      this.currStuInfoIndex = this.overallAnswerStatus.findIndex(
        (stu) => stu._id === stuInfo._id
      );

      // 获取学生作答详情
      await this.getCurrStuAnswerDetail();

      // 如果路由 query 参数中有 q 参数，则切换到该题目
      if (this.$route.query.q) {
        const question = this.questions.find(
          (q) => q._id == this.$route.query.q
        );
        if (question) {
          this.switchToQuestion(question);
        }
      }

      // 列表定位到学生
      this.locateStuNoFlash();
      // 更新路由 query 参数
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
            u: stuInfo.username,
          },
        },
        () => {}
      );
    },

    // 切换题目
    switchToQuestion(question) {
      this.currQuestion = question;

      if (question.type === "解答") {
        this.currJiedaQuestionIndex = this.jiedaQuestions.findIndex(
          (q) => q._id === question._id
        );
        this.currJiedaQuestion =
          this.jiedaQuestions[this.currJiedaQuestionIndex];
      }
      // 获取题目在 questions 中的索引
      this.currQuestionIndex = this.questions.findIndex(
        (q) => q._id === question._id
      );

      // 定位到题目
      if (this.currQuestionIndex > 1 && question.type != "解答") {
        this.locateQuestionNoFlash();
      }

      // 如果是专注模式更新路由 query 中的 q 参数, 用于刷新页面后还能定位到该题目
      if (this.mode === "focus") {
        this.$router.replace(
          {
            query: {
              ...this.$route.query,
              q: question._id,
            },
          },
          () => {}
        );
      }
    },

    // 定位到学生不闪烁
    locateStuNoFlash() {
      setTimeout(() => {
        // 找到学生
        const item = document.getElementById(this.currStuInfo.username);
        if (!item) {
          return;
        }
        // 定位到学生区域
        item.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 250);
    },

    // 定位到题目不闪烁
    locateQuestionNoFlash() {
      setTimeout(() => {
        const item = document.getElementById(this.currQuestion._id);
        if (!item) {
          return;
        }

        item.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 250);
    },

    // 点击学生列表
    handleStuItemClick(stuInfo) {
      this.switchToStu(stuInfo);
    },

    // 点击题目卡片
    handleQuestionCardClick(question) {
      this.switchToQuestion(question);
    },

    // 上一人
    handlePrevStu() {
      const currStuIndex = this.overallAnswerStatus.findIndex(
        (stu) => stu._id === this.currStuInfo._id
      );
      const prevStuIndex = currStuIndex - 1;
      // 如果是第一个学生，不做任何操作
      if (prevStuIndex < 0) {
        this.$q.notify({
          message: "已经是第一个学生了",
          type: "warning",
        });
        return;
      }

      this.switchToStu(this.overallAnswerStatus[prevStuIndex]);

      // this.getStudentHomeworkDetail();
    },

    // 下一人
    handleNextStu() {
      const currStuIndex = this.overallAnswerStatus.findIndex(
        (stu) => stu._id === this.currStuInfo._id
      );
      const nextStuIndex = currStuIndex + 1;
      // 如果是最后一个学生，不做任何操作
      if (nextStuIndex >= this.overallAnswerStatus.length) {
        this.$q.notify({
          message: "已经是最后一个学生了",
          type: "warning",
        });
        return;
      }

      this.switchToStu(this.overallAnswerStatus[nextStuIndex]);

      // this.getStudentHomeworkDetail();

      this.locateStuNoFlash();
    },

    // 上一题
    handlePrevQuestion() {
      const currIndex = this.questions.findIndex(
        (item) => item._id === this.currQuestion._id
      );

      if (currIndex > 0) {
        this.currQuestion = this.questions[currIndex - 1];
        this.currQuestionIndex = currIndex - 1;
        this.switchToQuestion(this.currQuestion);
      } else {
        // 第一题
        this.$q.notify({
          message: "当前第一题",
          type: "warning",
        });
      }
    },

    // 下一题
    handleNextQuestion() {
      const currIndex = this.questions.findIndex(
        (item) => item._id === this.currQuestion._id
      );
      if (currIndex < this.questions.length - 1) {
        this.currQuestion = this.questions[currIndex + 1];
        this.currQuestionIndex = currIndex + 1;
        this.switchToQuestion(this.currQuestion);
      } else {
        // 最后一题
        this.$q.notify({
          message: "当前最后一题",
          type: "warning",
        });
      }
    },

    // 点击关闭按钮
    handleCloseBtnClick() {
      this.$router.push(`/teacher/homework/${this.homeworkId}`);
    },
  },

  created() {
    this.getHomeworkDetail();
  },
};
</script>

<style>
.option p {
  margin: 0;
}
</style>
