<template>
  <q-layout view="hHh Lpr fFf" class="bg-grey-1">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="edit_note" />
        <div>{{ currStuInfo.nickname }} {{ currStuInfo.username }}</div>
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
          <q-tooltip> 切换模式 <kbd>V</kbd></q-tooltip>
        </q-chip>
        <q-btn dense flat icon="settings" @click="handleSettingsBtnClick">
          <q-tooltip>设置</q-tooltip>
        </q-btn>
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
        <q-btn dense flat icon="help" v-if="!$q.platform.is.mobile">
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

    <q-drawer
      v-model="displayStuList"
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
              v-for="student in stuInfoList"
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
                <span v-else>{{ student.homeworkFinalScore }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

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
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
                <!-- 解答题 -->
                <StudentQAJiedaViewCard
                  v-else
                  :index="index + 1"
                  :questionDetails="questionDetails"
                  :isActive="questionDetails._id == currQuestion._id"
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
                  :currQuestionIndex="currQuestionIndex"
                  :isActive="true"
                  @questionCardClick="handleQuestionCardClick"
                  @questionCardDblClick="handleQuestionCardDblClick"
                />
                <QuestionStatisticsCard
                  v-if="
                    mode == 'focus' &&
                    displayStatisticsCard &&
                    currQuestion.type != '解答' &&
                    currQuestion.type != '填空'
                  "
                  :questionId="currQuestion._id"
                  :homeworkId="homeworkId"
                />
              </div>
              <!-- 解答题 -->
              <StudentQAJiedaViewCard
                v-else
                :index="currQuestionIndex + 1"
                :questionDetails="currQuestion"
                :isActive="true"
                @questionCardClick="handleQuestionCardClick"
                @questionCardDblClick="handleQuestionCardDblClick"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer
      bordered
      class="bg-white text-primary q-py-sm"
      v-if="!$q.platform.is.mobile"
    >
      <CorrectionToolbar
        :currQuestion="currQuestion"
        :currQuestionIndex="currQuestionIndex"
        :totalQuestionNum="questions.length"
        :currStuIndex="currStuInfoIndex"
        :totalStuNum="stuInfoList.length"
        @nextStu="handleNextStu"
        @prevStu="handlePrevStu"
        @nextQuestion="handleNextQuestion"
        @prevQuestion="handlePrevQuestion"
        @switchDisplayStuList="handleSwitchDisplayStuList"
        @submited="handleCorrectionSubmited"
      />
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
  pretreatmentStudentHomeworkDetails,
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
      displayStuList: true,
      displayStatisticsCard: true,
      stuInfoList: [],
      currStuInfo: {},
      currStuInfoIndex: 0,
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
      questions: [],
    };
  },

  components: {
    StudentQAViewCard: () =>
      import("src/components/teacher/studentHomework/StudentQAViewCard.vue"),
    StudentQAJiedaViewCard: () =>
      import(
        "src/components/teacher/studentHomework/StudentQAJiedaViewCard.vue"
      ),
    QuestionStatisticsCard: () =>
      import(
        "src/components/teacher/studentHomework/QuestionStatisticsCard.vue"
      ),
    CorrectionToolbar: () =>
      import("src/components/teacher/studentHomework/CorrectionToolbar.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),
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

        this.stuInfoList = data.data;

        // 获取路由 query 参数
        const query = this.$route.query;

        // 如果有 u 参数，则定位到该学生
        let stuInfo = null;
        if (query.u) {
          stuInfo = this.stuInfoList.find((stu) => stu.username === query.u);
        } else {
          // 否则默认定位到第一个学生
          stuInfo = this.stuInfoList[0];
        }
        this.switchToStu(stuInfo);
        setTimeout(() => {
          this.locateStuNoFlash();
        }, 500);
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

        const { questions, quesCategory } = pretreatmentStudentHomeworkDetails(
          data.data
        );

        this.questions = questions;
        this.quesCategory = quesCategory;
        this.currQuestion = questions[this.currQuestionIndex];
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
      // 获取学生在 stuInfoList 中的索引
      this.currStuInfoIndex = this.stuInfoList.findIndex(
        (stu) => stu._id === stuInfo._id
      );

      // 获取学生作答详情
      await this.getCurrStuAnswerDetail();

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

        // 提示用户
        this.$q.notify({
          message: `当前为专注模式，您可以通过 <kbd>V</kbd> 键快速切换模式。是否进行全屏以获得更好的批阅体验？`,
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
                        "请求浏览器全屏失败，您可以尝试手动进行全屏以获得更好的批阅体验。",
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
      this.mode = _mode;
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

    // 点击学生列表表项
    handleStuItemClick(stuInfo) {
      this.switchToStu(stuInfo);
    },

    // 切换学生列表显示
    handleSwitchDisplayStuList() {
      this.displayStuList = !this.displayStuList;
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

    // 上一人
    handlePrevStu() {
      const currStuIndex = this.stuInfoList.findIndex(
        (stu) => stu._id === this.currStuInfo._id
      );
      const prevStuIndex = currStuIndex - 1;
      // 如果是第一个学生，不做任何操作
      if (prevStuIndex < 0) {
        this.$q.notify({
          message: "当前第一个学生",
          type: "warning",
          position: "top",
          timeout: 1000,
        });
        return;
      }

      this.switchToStu(this.stuInfoList[prevStuIndex]);
    },

    // 下一人
    handleNextStu() {
      const currStuIndex = this.stuInfoList.findIndex(
        (stu) => stu._id === this.currStuInfo._id
      );
      const nextStuIndex = currStuIndex + 1;
      // 如果是最后一个学生，不做任何操作
      if (nextStuIndex >= this.stuInfoList.length) {
        this.$q.notify({
          message: "当前最后一个学生",
          type: "warning",
          position: "top",
          timeout: 1000,
        });
        return;
      }

      this.switchToStu(this.stuInfoList[nextStuIndex]);

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

    // 批改已提交事件
    handleCorrectionSubmited(rspData) {
      this.currQuestion.getScore = rspData.score;
      this.currQuestion.studentQA[0].comment = rspData.comment;
      this.currQuestion.studentQA[0].corrected = rspData.corrected;

      this.currStuInfo.homeworkFinalScore = rspData.homeworkFinalScore;
    },

    // 点击批改设置按钮
    handleSettingsBtnClick() {},

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
      this.$router.push(`/teacher/homework/${this.homeworkId}`);
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
    this.getHomeworkDetail();
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

<style>
kbd {
  color: grey;
  background-color: hsl(0deg, 0%, 99%);
  border-radius: 5px;
  border: 1px solid hsl(0deg, 0%, 80%);
  padding: 4px 5px;
  font-weight: bold;
  box-shadow: inset 0 1px 0 hsl(0deg, 0%, 100%), 0 1px 0 hsl(0deg, 0%, 80%);
}
</style>
