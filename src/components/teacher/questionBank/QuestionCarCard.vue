<template>
  <q-card style="width: 1100px; max-width: 80vw">
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="text-h5">
        <q-icon name="add_shopping_cart" />
        题车(共{{ questionsCountInfo.total }}题)
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="white"
          v-close-popup
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="q-pb-sm">
      <q-btn
        :color="questionsCountInfo.totalScore == 100 ? 'positive' : 'negative'"
        :icon="questionsCountInfo.totalScore == 100 ? 'check' : 'warning'"
        :label="`当前总分(${questionsCountInfo.totalScore})`"
      >
        <q-tooltip> 总分须为100分 </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          :key="index"
          :class="questionClass[qType.label]"
          v-for="(qType, index) in questionTypes"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar :icon="questionIcon[qType.label]" />
            </q-item-section>

            <q-item-section>
              {{
                `${qType.label}(${questionsCountInfo[qType.value]})`
              }}</q-item-section
            >

            <q-item-section side>
              <div class="row items-center">
                <q-input
                  square
                  dense
                  :disable="qType.lockScore"
                  v-model.number="qType.currSettingScore"
                  type="number"
                  label="分数"
                  @click.stop=""
                  style="width: 65px"
                />
                <q-toggle
                  color="primary"
                  v-model="qType.lockScore"
                  size="sm"
                  @input="handleQuestionCarLockScoreToggleClick(qType)"
                >
                  锁定分数
                  <q-tooltip v-if="!qType.lockScore">
                    锁定后，题目分数将平均化且不可修改
                  </q-tooltip>
                </q-toggle>
              </div>
            </q-item-section>
          </template>

          <draggable
            class="list-group"
            :list="questions"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
          >
            <q-list
              v-for="(question, index) in questions.filter(
                (question) => question.type === qType.label
              )"
              :key="index"
              bordered
              class="rounded-borders cursor-move"
              dense
            >
              <q-item class="bg-white">
                <q-item-section avatar>
                  <q-chip
                    :color="questionBadgeColor[question.type]"
                    text-color="white"
                    :label="question.type"
                    :icon="questionIcon[question.type]"
                    square
                    size="sm"
                  />
                </q-item-section>

                <q-item-section style="font-size: 18px" class="text-grey-9">
                  {{ `${index + 1}、${question.content}` }}
                </q-item-section>

                <q-item-section class="col-1">
                  <span>SFFX001</span>
                </q-item-section>

                <q-item-section class="col-1">
                  <span>{{ question.creator }}</span>
                </q-item-section>

                <div class="row items-center">
                  <q-chip
                    dense
                    :label="`${question.presetScore}分`"
                    :color="question.presetScore > 0 ? 'positive' : ''"
                    :disable="qType.lockScore"
                    text-color="white"
                    style="cursor: pointer"
                  />
                  <q-popup-edit
                    v-model="question.presetScore"
                    :validate="(val) => val > 0"
                    :disable="qType.lockScore"
                    anchor="top start"
                  >
                    <template v-slot="scope">
                      <q-input
                        autofocus
                        dense
                        type="number"
                        v-model="scope.value"
                        hint="输入题目得分"
                        :rules="[
                          (val) => scope.validate(val) || '分数必须大于0',
                        ]"
                        @keyup.enter="
                          handleSetQuestionPresetscore(scope, qType)
                        "
                      >
                        <template v-slot:after>
                          <q-btn
                            flat
                            dense
                            color="negative"
                            icon="cancel"
                            @click.stop="scope.cancel"
                          />

                          <q-btn
                            flat
                            dense
                            color="positive"
                            icon="check_circle"
                            @click.stop="
                              handleSetQuestionPresetscore(scope, qType)
                            "
                            :disable="
                              scope.validate(scope.value) === false ||
                              scope.initialValue === scope.value
                            "
                          />
                        </template>
                      </q-input>
                    </template>
                  </q-popup-edit>
                </div>

                <q-item-section side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      size="12px"
                      color="primary"
                      flat
                      dense
                      round
                      icon="edit"
                    >
                      <q-tooltip> 编辑题目 </q-tooltip>
                    </q-btn>
                    <q-btn
                      size="12px"
                      color="red"
                      flat
                      dense
                      round
                      icon="delete_sweep"
                      @click="
                        handleQuestionCarQuestionRemoveBtnClick(question.id)
                      "
                      ><q-tooltip> 从题车移除 </q-tooltip></q-btn
                    >
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </draggable>
        </q-expansion-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        class="q-ml-sm"
        color="primary"
        label="创建试题集"
        icon="topic"
        @click="handleQuestionCarCreateQuestionSetBtnClick"
      />
    </q-card-actions>

    <!-- 基于题车创建试题集对话框 -->
    <q-dialog
      v-model="createQuestionSetDig"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 600px">
        <q-card-section>
          <div class="text-h5 q-ml-sm">
            创建试题集
            <q-btn
              round
              flat
              dense
              icon="close"
              class="float-right"
              color="grey-8"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            class="q-mb-sm"
            dense
            square
            outlined
            disable
            v-model="currSelectedTeaCourse.name"
            label="当前课程"
          >
            <template v-slot:prepend>
              <q-icon name="folder_shared" />
            </template>
          </q-input>
          <q-input
            dense
            square
            outlined
            label="试题集名称"
            v-model="questionSetName"
          >
            <template v-slot:prepend>
              <q-icon name="topic" />
            </template>
          </q-input>
          <q-toggle
            class="q-mt-sm"
            color="green"
            label="共享试题集"
            v-model="isShare"
          >
            <q-tooltip> 共享后，同课程的其他教师可以使用该试题集 </q-tooltip>
          </q-toggle>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="创建"
            icon="cloud_upload"
            @click="handleConfirmCreateQuestionSetBtnClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { apiCreateQuestionSet } from "src/api/teacher/questionSet";
import draggable from "vuedraggable";
export default {
  name: "QuestionCarCard",
  data() {
    return {
      // 基于题车创建试题集对话框
      createQuestionSetDig: false,
      // 试题集名称
      questionSetName: "",
      // 是否共享试题集
      isShare: false,
      // 题目类型
      questionTypes: [
        {
          label: "单选",
          value: "singleChoice",
          currSettingScore: 0,
          lockScore: false,
        },
        {
          label: "多选",
          value: "multipleChoice",
          currSettingScore: 0,
          lockScore: false,
        },
        {
          label: "判断",
          value: "trueOrFalse",
          currSettingScore: 0,
          lockScore: false,
        },
        {
          label: "填空",
          value: "fillInBlank",
          currSettingScore: 0,
          lockScore: false,
        },
        {
          label: "解答",
          value: "jieda",
          currSettingScore: 0,
          lockScore: false,
        },
      ],
    };
  },

  components: {
    draggable,
  },

  computed: {
    ...mapGetters("teaCourse", {
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("questionCar", {
      questionClass: "questionClass",
      questionIcon: "questionIcon",
      questionBadgeColor: "questionBadgeColor",
    }),

    questions: {
      get() {
        return this.$store.state.questionCar.questions;
      },
      set(val) {
        this.$store.commit("questionCar/setQuestions", val);
      },
    },

    // 拖拽组件设置
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },

    // 题目信息统计
    questionsCountInfo() {
      return {
        // 总分
        totalScore: this.questionTypes.reduce((total, curr) => {
          return total + curr.currSettingScore * 1;
        }, 0),
        // 总数
        total: this.questions.length,
        // 单选题
        singleChoice: this.questions.filter(
          (question) => question.type === "单选"
        ).length,
        // 多选题
        multipleChoice: this.questions.filter(
          (question) => question.type === "多选"
        ).length,
        // 判断题
        trueOrFalse: this.questions.filter(
          (question) => question.type === "判断"
        ).length,
        // 填空题
        fillInBlank: this.questions.filter(
          (question) => question.type === "填空"
        ).length,
        // 解答题
        jieda: this.questions.filter((question) => question.type === "解答")
          .length,
      };
    },
  },

  watch: {
    "questionsCountInfo.totalScore"(newVal, oldVale) {
      if (newVal > 100) {
        this.$q.notify({
          message: `题集总分必须为100分`,
          type: "warning",
        });
      }
    },
  },

  methods: {
    // 创建试题集
    async createQuestionSet() {
      // 构造请求体
      const createQuestionSetDto = {
        title: this.questionSetName,
        course_id: this.currSelectedTeaCourse.courseId,
        question_ids: this.questions.map((question) => question.id),
        questionsMeta: this.questions.map((question, index) => {
          return {
            index: index + 1,
            presetScore: question.presetScore,
            question_id: question.id,
            groupName: question.type,
          };
        }),
        isShare: this.isShare,
      };

      // 发送请求

      try {
        const { data } = await apiCreateQuestionSet(createQuestionSetDto);
        // 提示创建成功
        this.$q.notify({
          message: "创建成功",
          type: "positive",
        });
      } catch (e) {
        // 提示创建失败
        this.$q.notify({
          message: "创建失败",
          type: "negative",
        });
      }
    },

    // 题车锁定分数
    handleQuestionCarLockScoreToggleClick(qType) {
      // 判断是否已经锁定分数
      if (qType.lockScore) {
        // 如果锁定分数，则将分数平均分给同类型的每一个题目
        this.$store.commit("questionCar/averagingQuestionsScore", {
          qType,
          questionsCountInfo: this.questionsCountInfo,
        });
      }
    },

    // 设置题目分数, 第一个参数勿动
    handleSetQuestionPresetscore(scope, qType) {
      scope.set(); // 固定写法

      // 重新计算题目总分
      let totalScore = 0;
      this.questions.forEach((question) => {
        if (question.type === qType.label) {
          totalScore += question.presetScore * 1;
        }
      });
      qType.currSettingScore = Math.floor(totalScore * 100) / 100;
    },

    // 点击题车中的创建试题集
    handleQuestionCarCreateQuestionSetBtnClick() {
      // 校验是否有题目未设置分数
      let hasQuestionWithoutScore = false;
      this.questions.forEach((question) => {
        if (!question.presetScore) {
          hasQuestionWithoutScore = true;
        }
      });

      if (hasQuestionWithoutScore) {
        this.$q.notify({
          message: "部分题目未设置分数，请检查",
          type: "negative",
        });
        return;
      }

      // 校验题目总分是否超过100分
      if (this.questionsCountInfo.totalScore > 100) {
        this.$q.notify({
          message: "题目总分不能超过100分，请检查",
          type: "negative",
        });
        return;
      }

      // 打开创建试题集对话框
      this.createQuestionSetDig = true;
    },

    // 点击创建试题集对话框的确定按钮
    handleConfirmCreateQuestionSetBtnClick() {
      // 校验试题集名称
      if (!this.questionSetName) {
        this.$q.notify({
          message: "试题集名称不能为空",
          type: "negative",
        });
        return;
      }

      // 创建试题集
      this.createQuestionSet();
    },
  },
};
</script>

<style></style>
