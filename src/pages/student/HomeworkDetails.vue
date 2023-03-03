<template>
  <q-layout view="hHh Lpr fFf" class="bg-grey-1">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="edit_note" />
        <div class="text-body2">{{ questiondatas.title }}</div>
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
        <!-- <q-btn dense flat icon="settings" @click="handleSettingsBtnClick">
          <q-tooltip>设置</q-tooltip>
        </q-btn> -->
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
          icon="help"
          v-if="!$q.platform.is.mobile"
          @click.stop="handleHelpBtnClick"
        >
          <q-tooltip>帮助</q-tooltip>
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
                  :isActive="questionDetails._id == currQuestion._id"
                  @postJieDaAnswer="handlePostJieDaAnswer"
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
              </div>
            </div>

            <!-- 专注模式 -->
            <div v-show="mode == 'focus'">
              <!-- 非解答题 -->
              <div v-if="currQuestion.type != '解答'">
                <StudentQAViewCard
                  :index="currQuestionIndex + 1"
                  :questionDetails="currQuestion"
                  @selectChoiceItem="handleSelectChoiceItem"
                  :currQuestionIndex="currQuestionIndex"
                  :isActive="true"
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
              </div>
              <!-- 解答题 -->
              <StudentQAJiedaViewCard
                v-else
                :index="currQuestionIndex + 1"
                :questionDetails="currQuestion"
                :isActive="true"
                @postJieDaAnswer="handlePostJieDaAnswer"
                @questionCardClick="handleQuestionCardClick"
                @questionCardDblClick="handleQuestionCardDblClick"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-white text-primary q-py-sm">
      <CorrectionToolbar
        :currQuestion="currQuestion"
        :currQuestionIndex="currQuestionIndex"
        :totalQuestionNum="questions.length"
        @nextQuestion="handleNextQuestion"
        @prevQuestion="handlePrevQuestion"
      />
    </q-footer>
  </q-layout>
</template>

<script>
import { apiGetHomeworkInfo, apiPostAnswer } from "src/api/student/homework";
import { pretreatmentStudentHomeworkDetails } from "src/utils/homework";
import { formatTimeWithWeekDayAndSecond } from "src/utils/time";
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
    };
  },

  components: {
    StudentQAViewCard: () =>
      import("src/components/teacher/studentHomework/StudentQAViewCard.vue"),
    StudentQAJiedaViewCard: () =>
      import(
        "src/components/teacher/studentHomework/StudentQAJiedaViewCard.vue"
      ),
    CorrectionToolbar: () =>
      import("src/components/teacher/studentHomework/CorrectionToolbar.vue"),
  },

  methods: {
    //获取作业详情
    async handleGetHomeworkInfo() {
      const { data } = await apiGetHomeworkInfo(this.homeworkId);
      //预处理作业
      pretreatmentStudentHomeworkDetails(data.data);
      this.questiondatas = data.data;
      this.questions = data.data.questions;
    },

    //提交作业
    async handleSelectChoiceItem(q, choice) {
      if (this.questiondatas.isEnd) {
        this.$q.notify({
          type: "negative",
          message: "作业已截止",
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
          homework_id: this.homeworkId,
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
          q.submited = true;
          q.lastSubmitedTime = formatTimeWithWeekDayAndSecond(new Date());
        }
      }
      //填空提交
      if (q.type === "填空") {
        const payload = {
          question_id: q.id,
          homework_id: this.homeworkId,
          questionSet_id: this.questiondatas.questionSets[0]._id,
          stuAnswer: q.answer,
        };
        //提交作答
        const { data } = await apiPostAnswer(payload);
        // 更新作答状态
        if (data.code === 2000) {
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
          message: "作业已截止",
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
        homework_id: this.homeworkId,
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
          timeout: 1000,
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
          position: "top",
          icon: "notifications",
          color: "warning",
          textColor: "white",
          classes: "glossy",
          timeout: 1000,
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

        // 如果是桌面端，则提示用户
        if (!this.$q.platform.is.mobile) {
          this.$q.notify({
            message: `当前为专注模式，您可以通过 <kbd>V</kbd> 键快速切换模式。是否进行全屏以获得更好的作答体验？`,
            position: "top",
            icon: "notifications",
            progress: true,
            color: "accent",
            textColor: "white",
            classes: "glossy",
            timeout: 10000,
            html: true,
            actions: [
              {
                label: "全屏",
                color: "white",
                handler: () => {
                  this.$q.fullscreen.request().catch(() => {
                    setTimeout(() => {
                      this.$q.notify({
                        message:
                          "请求浏览器全屏失败，您可以尝试手动进行全屏以获得更好的作答体验。",
                        position: "top",
                        type: "warning",
                      });
                    }, 7000);
                  });
                },
              },
            ],
          });
        }
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
        if (this.currQuestion.type == "解答" || this.currQuestionIndex == 0) {
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
      // 视图进入 foucs 模式
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
      this.$router.push({ path: "/homework" });
    },
  },

  mounted() {
    // 绑定按键，上一人
    this.$shortcut.bind("up", this.handlePrevStu);
    // 下一人
    this.$shortcut.bind("down", this.handleNextStu);
    // 上一题
    this.$shortcut.bind("left", this.handlePrevQuestion);
    // 下一题
    this.$shortcut.bind("right", this.handleNextQuestion);
    // 切换模式
    this.$shortcut.bind("v", this.handleSwitchModeByShortcut);
    // 展开学生列表
    this.$shortcut.bind("tab", this.handleSwitchDisplayStuList);
  },

  created() {
    this.handleGetHomeworkInfo();
  },

  beforeDestroy() {
    this.$shortcut.unbind("up");
    this.$shortcut.unbind("down");
    this.$shortcut.unbind("left");
    this.$shortcut.unbind("right");
    this.$shortcut.unbind("v");
    this.$shortcut.unbind("tab");
    this.$shortcut.unbind("space");
    this.$shortcut.unbind("enter");
  },
};
</script>

<style></style>
