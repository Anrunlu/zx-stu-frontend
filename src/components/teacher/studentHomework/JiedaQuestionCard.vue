<template>
  <div>
    <q-card
      class="q-my-sm shadow-1 cursor-pointer"
      :class="{
        'shadow-2': isActive,
      }"
      @click="handleQuestionCardClick"
      @dblclick="handleQuestionCardDblClick"
    >
      <q-card-section class="q-pa-sm">
        <div class="row q-gutter-sm">
          <q-badge
            :color="
              questionDetails.studentQA[0].corrected ? 'positive' : 'grey-5'
            "
            >{{
              questionDetails.studentQA[0].corrected ? "已批改" : "未批改"
            }}</q-badge
          >
          <q-btn
            dense
            flat
            size="sm"
            color="primary"
            icon="search"
            label="查看题干"
            @click="handleViewQuestionBtnClick"
          >
            <q-tooltip>
              第 {{ currJiedaQuestionIndex + 1 }}/{{ totalJiedaQuestionCount }}
              题
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            flat
            size="sm"
            color="primary"
            icon="edit"
            label="批注"
            @click="handleAnnotationBtnClick"
          >
          </q-btn>
          <q-space />
          <!-- 序号 -->
          <q-chip
            class="float-right"
            color="grey"
            dense
            outline
            size="sm"
            square
            :label="index"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          id="studentqa"
          v-viewer
          v-html="questionDetails.studentQA[0].stuAnswer[0].content"
        ></div>
      </q-card-section>
    </q-card>

    <!-- 查看题干对话框 -->
    <q-dialog v-model="questionViewDig">
      <QuestionViewCard pure :questionId="questionDetails._id" />
    </q-dialog>

    <!-- 批注对话框 -->
    <q-dialog v-model="studentqaAnnotationDig" maximized>
      <q-card id="studentqa-annotation-card"> </q-card>
    </q-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "StudentHomeworkJiedaQuestionCard",
  props: {
    index: {
      type: Number,
      required: false,
    },
    questionDetails: {
      type: Object,
      default: () => {
        return {
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
        };
      },
    },
    currJiedaQuestionIndex: {
      type: Number,
      default: 0,
    },
    totalJiedaQuestionCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      studentqaAnnotationDig: false,
      questionViewDig: false,
    };
  },

  components: {
    QuestionViewCard: () =>
      import("src/components/teacher/questionBank/QuestionViewCard.vue"),
  },

  methods: {
    handleQuestionCardClick() {
      this.$emit("questionCardClick", this.questionDetails);
    },
    handleQuestionCardDblClick() {
      this.$emit("questionCardDblClick", this.questionDetails);
    },

    // 点击批注按钮
    handleAnnotationBtnClick() {
      // 将 dom 及其子元素绘制到 canvas 上
      const capture = document.getElementById("studentqa");
      html2canvas(capture, { allowTaint: true }).then((canvas) => {
        // const dataURL = canvas.toDataURL("image/png");
        this.studentqaAnnotationDig = true;
        setTimeout(() => {
          document
            .getElementById("studentqa-annotation-card")
            .appendChild(canvas);
        }, 300);
      });
    },

    // 点击查看题干按钮
    handleViewQuestionBtnClick() {
      this.questionViewDig = true;
    },
  },
};
</script>

<style>
#studentqa {
  height: 86vh;
  overflow-y: auto;
}
@media screen and (max-width: 1920px) {
  #studentqa {
    height: 76vh;
    overflow-y: auto;
  }
}
#studentqa img {
  max-width: 85% !important;
  display: block;
  margin: 0 auto;
}
</style>
