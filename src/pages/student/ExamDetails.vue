<template>
  <q-layout view="hHh Lpr fFf" :class="isWHH ? 'bg-red-1' : 'bg-grey-1'">
    <q-header elevated>
      <q-bar
        :class="
          isWHH
            ? 'bg-pink-4 text-white shadow-1'
            : 'bg-primary text-white shadow-1'
        "
      >
        <q-icon name="edit_note" />
        <div v-if="$q.platform.is.mobile" class="text-body2">
          {{ questiondatas.title.slice(0, 6) }}···
        </div>
        <div v-else class="text-body2">{{ questiondatas.title }}</div>
        <q-chip
          v-if="
            isShowHomeworkDetails.isShowScoreAfterEndtime &&
            isShowHomeworkDetails.isEnd
          "
          dense
          outline
          size="sm"
          square
          color="white"
          :label="`总得分：${totalScore}分`"
        />
        <q-space />
        <q-chip
          text-color="white"
          :color="mode == 'focus' ? 'positive' : 'white'"
          :outline="mode != 'focus'"
          dense
          square
          icon="videocam"
          label="专注模式"
          clickable
          @click="switchMode()"
        >
          <q-tooltip>
            {{
              mode === "focus" ? "点击退出专注模式" : "点击进入专注模式"
            }}</q-tooltip
          >
        </q-chip>
        <q-btn
          v-if="!$q.platform.is.mobile"
          dense
          flat
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        >
          <q-tooltip>
            {{ $q.fullscreen.isActive ? "退出全屏" : "全屏" }}
          </q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          icon="close"
          @click="handleCloseBtnClick"
          v-if="!$q.platform.is.mobile"
        >
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-ma-md">
        <div class="row justify-center">
          <div class="col-12 col-md-10">
            <!-- 瀑布模式 -->
            <div v-show="mode == 'waterfall'">
              <div
                v-for="(questionDetails, index) in questions"
                :key="questionDetails._id"
              >
                <!-- 非解答题 -->
                <StudentQAViewCard
                  v-if="questionDetails.type != '解答'"
                  :index="index + 1"
                  :questionDetails="questionDetails"
                  :isShowHomeworkDetails="isShowHomeworkDetails"
                  :isActive="questionDetails._id == currQuestion._id"
                  @selectChoiceItem="handleSelectChoiceItem"
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
                <!-- 解答题 -->
                <StudentQAJiedaViewCard
                  v-else
                  :index="index + 1"
                  :questionDetails="questionDetails"
                  :isShowHomeworkDetails="isShowHomeworkDetails"
                  :isActive="questionDetails._id == currQuestion._id"
                  :mode="mode"
                  @postJieDaAnswer="handlePostJieDaAnswer"
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
              </div>
            </div>
          </div>

          <!-- 专注模式 -->
          <div class="col-12">
            <div v-show="mode == 'focus'">
              <!-- 非解答题 -->
              <div v-if="currQuestion.type != '解答'">
                <StudentQAViewCard
                  :index="currQuestionIndex + 1"
                  :questionDetails="currQuestion"
                  :isShowHomeworkDetails="isShowHomeworkDetails"
                  @selectChoiceItem="handleSelectChoiceItem"
                  :currQuestionIndex="currQuestionIndex"
                  :isActive="true"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
              </div>
              <!-- 解答题 -->
              <StudentQAJiedaViewCard
                v-else
                :index="currQuestionIndex + 1"
                :questionDetails="currQuestion"
                :isShowHomeworkDetails="isShowHomeworkDetails"
                :isActive="true"
                :mode="mode"
                @postJieDaAnswer="handlePostJieDaAnswer"
                @questionCardDblClick="handleQuestionCardDblClick"
              />
            </div>
          </div>
        </div>
      </q-page>
      <AnswerSheetCard
        :questions="questions"
        @questionClick="handleQuestionCardClick"
      ></AnswerSheetCard>
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <HomeworkToolbar
        :currQuestion="currQuestion"
        :currQuestionIndex="currQuestionIndex"
        :totalQuestionNum="questions.length"
        @nextQuestion="handleNextQuestion"
        @prevQuestion="handlePrevQuestion"
      />
    </q-footer>

    <!-- 实时通知组件 -->
    <ImmediatelyAncmt />
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { apiGetHomeworkInfo, apiPostAnswer } from "src/api/student/homework";
import { pretreatmentStudentHomeworkDetails } from "src/utils/homework";
import { formatTimeWithWeekDayAndSecond } from "src/utils/time";
import { shuffleArray } from "src/utils/shuffleArray";
export default {
  name: "ExamkDetails",
  props: {
    examId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      mode: "waterfall", // focus: 专注模式, waterfall: 瀑布模式
      currQuestion: {
        _id: "",
        id: "",
        type: "",
        difficulty: 0,
        presetScore: 0,
        getScore: 0,
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
            corrected: false,
          },
        ],
      },
      currQuestionIndex: 0,
      //预处理后所有题集
      questions: [],
      //data预处理后数据
      questiondatas: [],
      //作答细节展示
      isShowHomeworkDetails: {},
      //作业总成绩
      totalScore: 0,
    };
  },

  components: {
    StudentQAViewCard: () =>
      import("src/components/student/studentHomework/StudentQAViewCard.vue"),
    StudentQAJiedaViewCard: () =>
      import(
        "src/components/student/studentHomework/StudentQAJiedaViewCard.vue"
      ),
    HomeworkToolbar: () =>
      import("src/components/student/studentHomework/HomeworkToolbar.vue"),
    AnswerSheetCard: () =>
      import("src/components/student/studentExam/AnswerSheetCard.vue"),
    ImmediatelyAncmt: () =>
      import("src/components/common/ImmediatelyAncmt.vue"),
  },

  computed: {
    ...mapGetters("user", {
      isWHH: "isWHH",
      nickname: "nickname",
      username: "username",
    }),
  },

  methods: {
    //获取作业详情
    async handleGetHomeworkInfo() {
      const { data } = await apiGetHomeworkInfo(this.examId);
      //预处理作业
      pretreatmentStudentHomeworkDetails(data.data);
      this.questiondatas = data.data;
      this.questions = data.data.questions;
      //未截止打乱题目
      if (!this.questiondatas.isEnd) {
        this.questions = shuffleArray(this.questions);
      }
      this.isShowHomeworkDetails = JSON.parse(
        JSON.stringify(this.questiondatas, [
          "isShowAnswerAfterEndtime",
          "isShowKnowledge",
          "isShowScoreAfterEndtime",
          "isEnd",
        ])
      );
      this.calculateTotalScore();
      this.switchToQuestion(this.questions[0]);
      // 获取路由 query 参数
      const query = this.$route.query;

      // 如果路由 query 参数中有 q 参数，则切换到该题目。注意！！因为此时题目数据才加载完毕，所以要在此处切换！！
      if (query.q) {
        const question = this.questions.find(
          (q) => q._id == this.$route.query.q
        );
        if (question) {
          this.switchToQuestion(question);
        }
      }

      // 如果有 m 参数，则切换到相应的模式
      if (query.m) {
        this.switchMode(query.m);
      }
      // 定位到题目
      this.locateQuestionNoFlash();
      // 更新路由 query 参数
      this.$router.replace(
        {
          query: {
            ...this.$route.query,
          },
        },
        () => {}
      );
    },

    //计算作业总成绩
    async calculateTotalScore() {
      let totalScore = 0;
      this.questions.forEach((q) => {
        totalScore = totalScore + q.studentQA[0].score;
      });
      this.totalScore = totalScore;
    },

    //提交作业
    async handleSelectChoiceItem(q, choice) {
      if (this.questiondatas.isEnd) {
        this.$q.notify({
          type: "negative",
          message: "作业已截止，无法作答",
          timeout: 1000,
        });
        return;
      }
      if (q.type === "单选" || q.type === "判断") {
        q.answer.forEach((a) => {
          a.selected = false;
        });
      }
      choice.selected = !choice.selected;
      await this.handlePostAnswer(q);
    },

    async handlePostAnswer(q) {
      //选择提交
      if (q.type === "单选" || q.type === "判断" || q.type === "多选") {
        const payload = {
          question_id: q.id,
          homework_id: this.examId,
          questionSet_id: this.questiondatas.questionSets[0]._id,
          stuAnswer: [],
        };
        q.answer.forEach((a) => {
          if (a.selected) {
            payload.stuAnswer.push({ mark: a.mark });
          }
        });
        // 如果没有选择任何选项，不提交
        if (payload.stuAnswer.length === 0) {
          return;
        }
        //提交作答
        const { data } = await apiPostAnswer(payload);
        // 更新作答状态
        if (data.code === 2000) {
          this.$q.notify({
            type: "positive",
            message: "提交成功",
            timeout: 50,
          });
          q.submited = true;
          q.lastSubmitedTime = formatTimeWithWeekDayAndSecond(new Date());
        }
      }
      //填空提交
      if (q.type === "填空") {
        const payload = {
          question_id: q.id,
          homework_id: this.examId,
          questionSet_id: this.questiondatas.questionSets[0]._id,
          stuAnswer: q.answer,
        };
        //提交作答
        const { data } = await apiPostAnswer(payload);
        // 更新作答状态
        if (data.code === 2000) {
          this.$q.notify({
            type: "positive",
            message: "提交成功",
            timeout: 50,
          });
          q.submited = true;
          q.lastSubmitedTime = formatTimeWithWeekDayAndSecond(new Date());
        }
      }
    },

    //提交解答题
    async handlePostJieDaAnswer(q) {
      if (this.questiondatas.isEnd) {
        this.$q.notify({
          type: "negative",
          message: "作业已截止，无法作答",
          timeout: 1000,
        });
        return;
      }
      //判断输入是否为空
      if (q.studentQA[0].stuAnswer[0].content === "") {
        this.$q.notify({
          type: "negative",
          message: "作答不可为空",
          timeout: 1000,
        });
        return;
      }
      //构造上传参数
      const payload = {
        question_id: q.id,
        homework_id: this.examId,
        questionSet_id: this.questiondatas.questionSets[0]._id,
        stuAnswer: [
          {
            content: q.studentQA[0].stuAnswer[0].content,
          },
        ],
      };
      const { data } = await apiPostAnswer(payload);
      // 更新作答状态
      if (data.code === 2000) {
        q.submited = true;
        q.lastSubmitedTime = formatTimeWithWeekDayAndSecond(new Date());
        this.$q.notify({
          type: "positive",
          message: "提交成功",
          timeout: 500,
        });
      } else {
        this.$q.notify({
          type: "negative",
          message: "提交失败",
          timeout: 1000,
        });
      }
    },

    // 切换题目
    switchToQuestion(question) {
      this.currQuestion = question;

      // 获取题目在 questions 中的索引
      this.currQuestionIndex = this.questions.findIndex(
        (q) => q._id === question._id
      );

      // 如果是专注模式更新路由 query 中的 q 参数, 用于刷新页面后还能定位到该题目
      if (this.mode == "focus") {
        this.$router.replace(
          {
            query: {
              ...this.$route.query,
              q: this.currQuestion._id,
            },
          },
          () => {}
        );
      }

      // 定位到题目
      this.locateQuestionNoFlash();
    },

    // 切换 mode
    switchMode(mode) {
      let _mode = mode;
      // 如果 mode 没有变化，则不做任何操作
      if (_mode == this.mode) {
        return;
      }

      if (!_mode) {
        _mode = this.mode == "waterfall" ? "focus" : "waterfall";
      }

      if (_mode == "waterfall") {
        this.$router.replace(
          {
            query: {
              ...this.$route.query,
              m: _mode,
              q: null,
            },
          },
          () => {}
        );
        // 定位到当前题目
        this.locateQuestionNoFlash();
        // 提示用户
        this.$q.notify({
          message: "已退出专注模式",
          type: "info",
          timeout: 500,
        });
      } else if (_mode == "focus") {
        // 如果是专注模式更新路由 query 中的 q 参数, 用于刷新页面后还能定位到该题目
        this.$router.replace(
          {
            query: {
              ...this.$route.query,
              m: _mode,
              q: this.currQuestion._id,
            },
          },
          () => {}
        );
      }
      this.mode = _mode;
    },

    // 定位到题目不闪烁
    locateQuestionNoFlash() {
      setTimeout(() => {
        const item = document.getElementById(this.currQuestion._id);
        if (!item) {
          return;
        }
        // 如果是解答题或者第一个题目，使用 offset 定位
        if (this.currQuestion.type === "解答" || this.currQuestionIndex == 0) {
          const offset = item.offsetTop - 8;
          window.scrollTo({
            top: offset,
            behavior: "smooth",
          });
        } else {
          item.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }, 250);
    },

    // 点击题目卡片
    handleQuestionCardClick(question) {
      this.switchToQuestion(question);
    },

    // 双击题目卡片
    handleQuestionCardDblClick(question) {
      this.switchToQuestion(question);
      // 视图进入 focus 模式
      if (this.mode == "waterfall") {
        this.switchMode("focus");
      }
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
          position: "top",
          timeout: 1000,
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
          position: "top",
          timeout: 1000,
        });
      }
    },

    // 帮助按钮点击
    handleHelpBtnClick() {},

    // 通过快捷键切换模式
    handleSwitchModeByShortcut() {
      if (this.mode == "focus") {
        this.switchMode("waterfall");
      } else {
        this.switchMode("focus");
      }
    },

    // 点击关闭按钮
    handleCloseBtnClick() {
      this.$router.go(-1);
    },
  },

  // mounted() {
  //   // // 绑定按键，上一人
  //   // this.$shortcut.bind("up", this.handlePrevStu);
  //   // // 下一人
  //   // this.$shortcut.bind("down", this.handleNextStu);
  //   // // 上一题
  //   // this.$shortcut.bind("left", this.handlePrevQuestion);
  //   // // 下一题
  //   // this.$shortcut.bind("right", this.handleNextQuestion);
  //   // // 切换模式
  //   // this.$shortcut.bind("v", this.handleSwitchModeByShortcut);
  //   // // 展开学生列表
  //   // this.$shortcut.bind("tab", this.handleSwitchDisplayStuList);
  // },

  created() {
    this.handleGetHomeworkInfo();
  },

  // beforeDestroy() {
  //   this.$shortcut.unbind("up");
  //   this.$shortcut.unbind("down");
  //   this.$shortcut.unbind("left");
  //   this.$shortcut.unbind("right");
  //   this.$shortcut.unbind("v");
  //   this.$shortcut.unbind("tab");
  // },
};
</script>

<style></style>
