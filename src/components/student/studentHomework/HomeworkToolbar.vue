<template>
  <div class="row q-ml-sm justify-end q-gutter-lg">
    <div class="row q-mr-sm">
      <q-btn-group outline>
        <q-btn
          flat
          label="上题"
          icon="chevron_left"
          @click="handlePrevQuestion"
        >
          <q-tooltip :delay="200"> 快捷键：← </q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          :label="`${currQuestionIndex + 1}/${totalQuestionNum}`"
        >
          <!-- <q-tooltip> 开启/关闭题目列表 </q-tooltip> -->
        </q-btn>
        <q-btn
          flat
          label="下题"
          icon-right="chevron_right"
          @click="handleNextQuestion"
        >
          <q-tooltip :delay="200"> 快捷键：→ </q-tooltip>
        </q-btn>
      </q-btn-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeworkToolbar",
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

  created() {
    this.questionDetails = this.currQuestion;
  },
};
</script>

<style></style>
