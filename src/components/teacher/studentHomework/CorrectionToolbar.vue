<template>
  <div class="row q-gutter-lg q-ml-sm">
    <div class="col-7 col-xl-5">
      <div class="row q-gutter-sm">
        <q-slider
          class="col"
          v-model="questionDetails.studentQA[0].score"
          label
          :marker-labels="sliderMarkerLabel"
          :min="0"
          :max="questionDetails.presetScore"
          dense
        />
        <q-input
          ref="scoreInput"
          class="q-ml-lg"
          clearable
          clear-icon="close"
          v-model.number="questionDetails.studentQA[0].score"
          type="number"
          label="输入成绩"
          dense
          outlined
          @keypress.enter="handleSubmit"
        />
        <q-btn-group push>
          <q-btn-dropdown label="提交" color="blue" @click="handleSubmit" split>
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
          :label="`${currStuIndex + 1}/${totalStuNum}`"
          @click="handleSwitchDisplayStuList"
        >
          <q-tooltip :delay="1000" content-class="bg-white text-black shadow-1">
            开启/关闭学生列表 <kbd style="margin-left: 5px">Tab</kbd>
          </q-tooltip>
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
          :label="`${currQuestionIndex + 1}/${totalQuestionNum}`"
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CorrectionToolbar",
  props: {
    homeworkId: {
      type: String,
      required: true,
    },
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
    currStuIndex: {
      type: Number,
      required: true,
    },
    totalStuNum: {
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
          },
        ],
      },
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

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    sliderMarkerLabel() {
      const level1 = this.questionDetails.presetScore * 0.6 || 60;
      const level2 = this.questionDetails.presetScore * 0.85 || 85;
      const level3 = this.questionDetails.presetScore * 1 || 100;
      return [
        { value: 0, label: `0分` },
        { value: level1, label: `${level1}分` },
        { value: level2, label: `${level2}分` },
        { value: level3, label: `${level3}` },
      ];
    },
  },

  methods: {
    // 提交
    async handleSubmit() {
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

    // 激活分数输入框
    handleActivateScoreInput() {
      this.$refs.scoreInput.focus();
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
