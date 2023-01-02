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
        <q-card>
          <q-card-section class="q-pa-sm">
            <div class="row q-gutter-sm">
              <q-badge color="positive">已批改</q-badge>
              <q-btn
                dense
                flat
                size="sm"
                color="primary"
                icon="search"
                label="查看题干"
              >
                <q-tooltip> 第 {{ currQuestionIndex + 1 }}/10 题 </q-tooltip>
              </q-btn>
              <q-space />
              <span class="text-grey q-mr-sm"
                >第 {{ currQuestionIndex + 1 }}/10 题</span
              >
            </div>
          </q-card-section>
          <ckeditor
            :editor="editor"
            v-model="currJiedaQuestion.studentQA[0].stuAnswer[0].content"
            :config="editorConfig"
          ></ckeditor>
        </q-card>
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-white text-primary q-py-sm">
      <div class="row q-gutter-lg q-ml-sm">
        <div class="col-7 col-xl-5">
          <div class="row q-gutter-sm">
            <q-slider
              class="col"
              v-model="model"
              label
              markers
              :marker-labels="fnMarkerLabel"
              :min="0"
              :max="6"
              dense
            />
            <q-input
              class="q-ml-lg"
              clearable
              clear-icon="close"
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
              :label="`${currStuInfoIndex + 1}/${overallAnswerStatus.length}`"
              @click="drawerLeft = !drawerLeft"
            >
              <q-tooltip> 点击开启/关闭学生列表 </q-tooltip>
            </q-btn>
            <q-btn
              outline
              label="上一人"
              icon-right="arrow_upward"
              @click="handlePrevStu"
            />
            <q-btn outline label="上一题" icon="chevron_left" />
            <q-btn outline label="下一题" icon-right="chevron_right" />
          </q-btn-group>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
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
      editor: Editor,
      model: 3,
      drawerLeft: true,
      overallAnswerStatus: [],
      currStuInfo: {},
      currStuInfoIndex: 0,
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

  components: {},

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    editorConfig() {
      return {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "fontColor",
            "highlight",
            "removeFormat",
            "underline",
            "bulletedList",
            "numberedList",
            "|",
            "alignment",
            "|",
            "math",
            "codeBlock",
            "imageUpload",
            "uploadFile",
            "blockQuote",
            "insertTable",
            "|",
            "findAndReplace",
            "undo",
            "redo",
          ],
        },
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
      };
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
          }, 100);
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

        this.questions = questions;
        this.quesCategory = quesCategory;
        this.choiceQuestions = choiceQuestions;
        this.fillBlankQuestions = fillBlankQuestions;
        this.jiedaQuestions = jiedaQuestions;
        this.programQuestions = programQuestions;

        this.currJiedaQuestion = jiedaQuestions[this.currJiedaQuestionIndex];
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取学生作答详情失败",
          type: "negative",
        });
      }
    },

    switchToStu(stuInfo) {
      this.currStuInfo = stuInfo;
      // 获取学生在 overallAnswerStatus 中的索引
      this.currStuInfoIndex = this.overallAnswerStatus.findIndex(
        (stu) => stu._id === stuInfo._id
      );

      // 获取学生作答详情
      this.getCurrStuAnswerDetail();

      // 列表定位到学生
      this.locateStuNoFlash();
      // 更新路由 query 参数
      this.$router.replace(
        {
          query: {
            u: stuInfo.username,
          },
        },
        () => {}
      );
    },

    // 定位到学生不闪烁
    locateStuNoFlash() {
      setTimeout(() => {
        // 找到题目卡片
        const item = document.getElementById(this.currStuInfo.username);
        if (!item) {
          return;
        }
        // 定位到题目区域
        item.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 100);
    },

    // 点击学生列表
    handleStuItemClick(stuInfo) {
      this.switchToStu(stuInfo);
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

    // 点击关闭按钮
    handleCloseBtnClick() {
      this.$router.push(`/teacher/homework/${this.homeworkId}`);
    },

    fnMarkerLabel(val) {
      return `${10 * val}`;
    },
  },

  created() {
    this.getHomeworkDetail();
  },
};
</script>

<style>
.ck.ck-content:not(.ck-comment__input *) {
  height: 84vh;
  overflow-y: auto;
}
@media screen and (max-width: 1920px) {
  .ck.ck-content:not(.ck-comment__input *) {
    /* height: 76vh; */
    height: 96vh;
    overflow-y: auto;
  }
}
</style>
