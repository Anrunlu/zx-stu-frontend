<template>
  <!-- 自动组题 -->
  <q-card style="width: 700px; max-width: 90vw">
    <CardBar title="自动组题" icon="o_auto_mode" />
    <q-card-section class="q-pa-sm">
      <q-list class="row">
        <q-item>
          <q-item-section>
            <q-checkbox
              dense
              v-model="selfOnly"
              label="仅从我上传的题目中组题"
            />
          </q-item-section>
        </q-item>

        <q-item class="col-12">
          <q-item-section
            ><div class="q-gutter-sm">
              <q-checkbox
                v-for="(questionType, index) in questionTypeOptions"
                :key="index"
                dense
                v-model="questionCategoryInclude[questionType.value]"
                :label="questionType.label"
              />
            </div>
          </q-item-section>
        </q-item>

        <div
          class="col-12"
          v-for="(questionType, index) in questionTypeOptions"
          :key="index"
        >
          <q-item v-if="questionCategoryInclude[questionType.value]">
            <q-item-section>
              {{ questionType.label }}
              <q-list class="row">
                <q-item class="col">
                  <q-item-section>
                    <q-input
                      outlined
                      square
                      color="black"
                      label="题目数量"
                      type="number"
                      v-model.number="option[questionType.value].amount"
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="filter_1" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>

                <!-- TODO:难度系数 -->
                <q-item class="col">
                  <q-item-section>
                    <q-input
                      disable
                      outlined
                      square
                      color="black"
                      label="难度系数(暂不支持，即将上线)"
                      v-model="option[questionType.value].diffcuty"
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="subject" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>

                <!-- 暂时不考虑 -->
                <!-- <q-item class="col">
                  <q-item-section>
                    <q-input
                      outlined
                      square
                      color="black"
                      label="总分"
                      type="number"
                      v-model.number="option[questionType.value].totalScore"
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="functions" />
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item> -->

                <q-item>
                  <q-item-section>
                    <q-checkbox
                      dense
                      v-model="option[questionType.value].selfOnly"
                      label="仅我的"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-card-section>

    <q-card-actions align="right">
      <!-- <span class="q-mr-lg">当前总分：{{ totalScore }}</span> -->
      <q-btn color="primary" icon="done" @click="handleConfirmBtnClick">
        确定
      </q-btn>
    </q-card-actions>

    <!-- 题车对话框 -->
    <q-dialog v-model="questionCarDig" persistent>
      <QuestionCar
        :from="`autoCreateQuestionSet`"
        @refreshRandomQuestionList="getRandomQuestions"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { apiGetRandomQuestions } from "src/api/teacher/question";
import { preProcessQuestionList } from "src/utils/question";
export default {
  name: "AutoCreateQuestionSetCard",

  data() {
    return {
      questionCategoryInclude: {
        单选: false,
        多选: false,
        判断: false,
        填空: false,
        解答: false,
      },
      option: {
        单选: {
          amount: 0,
          diffcuty: 0,
          totalScore: 0,
          selfOnly: false,
        },
        多选: {
          amount: 0,
          diffcuty: 0,
          totalScore: 0,
          selfOnly: false,
        },
        判断: {
          amount: 0,
          diffcuty: 0,
          totalScore: 0,
          selfOnly: false,
        },
        填空: {
          amount: 0,
          diffcuty: 0,
          totalScore: 0,
          selfOnly: false,
        },
        解答: {
          amount: 0,
          diffcuty: 0,
          totalScore: 0,
          selfOnly: false,
        },
      },
      selfOnly: false,
      questionSetTitle: "",
      questionCarDig: false,
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
    QuestionCar: () =>
      import("src/components/teacher/questionBank/QuestionCarCard.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      questionTypeOptions: "questionTypeOptions",
    }),

    questionCar: {
      get() {
        return this.$store.state.questionCar.questions;
      },
      set(val) {
        this.$store.commit("questionCar/setQuestions", val);
      },
    },

    totalScore() {
      let totalScore = 0;
      for (const questionType in this.option) {
        totalScore += this.option[questionType].totalScore;
      }
      return totalScore;
    },
  },

  watch: {
    selfOnly(val) {
      for (const questionType in this.option) {
        this.option[questionType].selfOnly = val;
      }
    },
  },

  methods: {
    // 发送随机组题(自动组题)请求
    async getRandomQuestions() {
      // 构造请求参数
      const questionGroup = [];
      for (const questionType in this.option) {
        if (this.questionCategoryInclude[questionType]) {
          questionGroup.push({
            type: questionType,
            amount: this.option[questionType].amount,
            totalScore: this.option[questionType].totalScore,
            selfOnly: this.option[questionType].selfOnly,
          });
        }
      }

      const payload = {
        course_id: this.currSelectedTeaCourse.courseId,
        questionGroup,
      };

      // 发送请求
      try {
        const { data } = await apiGetRandomQuestions(payload);
        this.questionCar = preProcessQuestionList(data.data);

        this.questionCarDig = true;
      } catch (e) {
        console.log(e);
        this.$q.notify({
          message: "获取题目失败",
          type: "negative",
        });
      }
    },

    handleConfirmBtnClick() {
      // 校验
      for (const questionType in this.option) {
        // 选中的题目类型的题目数量不能为0
        if (
          this.questionCategoryInclude[questionType] &&
          this.option[questionType].amount == 0
        ) {
          this.$q.notify({
            message: `题目数量不能为0`,
            type: "negative",
          });
          return;
        }
        // 选中的题目类型的题目分值不能为0
        // if (
        //   this.questionCategoryInclude[questionType] &&
        //   this.option[questionType].totalScore == 0
        // ) {
        //   this.$q.notify({
        //     message: `题目分值不能为0`,
        //     type: "negative",
        //   });
        //   return;
        // }
      }

      // 题集总分须为100分
      // if (this.totalScore != 100) {
      //   this.$q.notify({
      //     message: "题集总分须为100分",
      //     type: "negative",
      //   });
      //   return;
      // }

      this.getRandomQuestions();
    },
  },

  created() {},
};
</script>
