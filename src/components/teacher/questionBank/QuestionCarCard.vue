<template>
  <q-card style="width: 1100px; max-width: 80vw">
    <!-- 标题栏 -->
    <CardBar
      :title="`题车(共${questionsCountInfo.total}题)`"
      icon="add_shopping_cart"
    />
    <q-card-section class="q-pb-sm">
      <q-btn
        outline
        :color="questionsCountInfo.totalScore == 100 ? 'positive' : 'negative'"
        :icon="questionsCountInfo.totalScore == 100 ? 'check' : 'warning'"
        :label="`当前总分(${questionsCountInfo.totalScore})`"
      >
        <q-tooltip> 总分须为100分 </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section style="height: 70vh" class="scroll">
      <q-list bordered class="rounded-borders">
        <div v-for="(qType, index) in questionTypes" :key="index">
          <q-expansion-item
            expand-separator
            :class="questionClass[qType.label]"
            v-if="questionsCountInfo[qType.value] > 0"
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
                    平均化
                    <q-tooltip v-if="!qType.lockScore">
                      锁定后，题目分数将平均化且不可修改
                    </q-tooltip>
                  </q-toggle>
                </div>
              </q-item-section>
            </template>

            <q-list bordered class="rounded-borders cursor-move" dense>
              <draggable
                :list="questions"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <q-item
                  class="bg-white"
                  v-for="(question, index) in questions.filter(
                    (question) => question.type === qType.label
                  )"
                  :key="index"
                  clickable
                  @click="handleQuestionListItemClick(question)"
                  dense
                >
                  <q-item-section avatar>
                    <QuestionChip :questionType="question.type" />
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

                  <div class="row items-center" @click.stop="">
                    <q-chip
                      dense
                      :label="`${question.presetScore}分`"
                      :color="question.presetScore > 0 ? 'positive' : ''"
                      :disable="qType.lockScore"
                      text-color="white"
                      style="cursor: pointer"
                      @click.stop=""
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
                            handleSetQuestionPresetscore(
                              scope,
                              qType,
                              question.id
                            )
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
                              v-close-popup
                              flat
                              dense
                              color="positive"
                              icon="check_circle"
                              @click.stop="
                                handleSetQuestionPresetscore(
                                  scope,
                                  qType,
                                  question.id
                                )
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
                        color="red"
                        flat
                        dense
                        round
                        icon="delete_sweep"
                        @click.stop="
                          handleQuestionCarQuestionRemoveBtnClick(question.id)
                        "
                        ><q-tooltip> 从题车移除 </q-tooltip></q-btn
                      >
                    </div>
                  </q-item-section>
                </q-item>
              </draggable>
            </q-list>
          </q-expansion-item>
        </div>
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

    <!-- 题目预览对话框 -->
    <q-dialog v-model="questionViewDig">
      <QuestionViewCard
        ref="questionViewCard"
        :questionId="currClickedQuestion.id"
        :in-question-car="currClickedQuestion.inQuestionCar"
        @removeQuestionFromCar="handleRemoveQuestionFromCarReq"
        @prevQuestion="handlePrevQuestionReq"
        @nextQuestion="handleNextQuestionReq"
      />
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { apiCreateQuestionSet } from "src/api/teacher/questionSet";
import draggable from "vuedraggable";
import QuestionChip from "src/components/common/QuestionChip.vue";
import QuestionViewCard from "src/components/teacher/questionBank/QuestionViewCard.vue";
export default {
  name: "QuestionCarCard",
  data() {
    return {
      // 基于题车创建试题集对话框
      createQuestionSetDig: false,
      // 题目预览对话框
      questionViewDig: false,
      // 当前点击的题目
      currClickedQuestion: {},
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
    QuestionChip,
    QuestionViewCard,
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("questionCar", {
      questionClass: "questionClass",
      questionIcon: "questionIcon",
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

    // 点击题车中的题目
    handleQuestionListItemClick(question) {
      this.currClickedQuestion = question;
      this.questionViewDig = true;
    },

    // 题车平均化分数
    handleQuestionCarLockScoreToggleClick(qType) {
      // 判断是否已经平均化分数
      if (qType.lockScore) {
        // 如果平均化分数，则将分数平均分给同类型的每一个题目
        this.$store.commit("questionCar/averagingQuestionsScore", {
          qType,
          questionsCountInfo: this.questionsCountInfo,
        });
      }
    },

    // 点击题车中移除题目按钮
    handleQuestionCarQuestionRemoveBtnClick(questionId) {
      // 从题车移除
      this.$store.commit("questionCar/removeQuestion", questionId);
    },

    // 设置题目分数, 第一个参数勿动
    handleSetQuestionPresetscore(scope, qType, questionId) {
      this.$store.commit("questionCar/setQuestionPresetScore", {
        questionId,
        presetScore: scope.value * 1,
      });

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

    // 处理子组件传递过来的题目从题车中移除的请求
    handleRemoveQuestionFromCarReq(questionId) {
      // 从题车移除
      this.$store.commit("questionCar/removeQuestion", questionId);
      // 关闭题目预览对话框
      this.questionViewDig = false;
    },

    // 处理子组件切换上一题的请求
    handlePrevQuestionReq(currQuestionId) {
      // 获取当前题目的索引
      const currQuestionIndex = this.questions.findIndex(
        (question) => question.id === currQuestionId
      );
      // 获取上一题的索引
      const prevQuestionIndex = currQuestionIndex - 1;
      // 如果上一题的索引小于0，说明已经是第一题了，直接返回
      if (prevQuestionIndex < 0) {
        this.$q.notify({
          message: "已经是第一题了",
          type: "warning",
        });
        return;
      }

      // 切换到上一题
      this.currClickedQuestion = this.questions[prevQuestionIndex];
    },

    // 处理子组件切换下一题的请求
    handleNextQuestionReq(currQuestionId) {
      // 获取当前题目的索引
      const currQuestionIndex = this.questions.findIndex(
        (question) => question.id === currQuestionId
      );
      // 获取下一题的索引
      const nextQuestionIndex = currQuestionIndex + 1;
      // 如果下一题的索引大于题目列表的长度，说明已经是最后一题了，直接返回
      if (nextQuestionIndex >= this.questions.length) {
        this.$q.notify({
          message: "已经是最后一题了",
          type: "warning",
        });
        return;
      }

      // 切换到下一题
      this.currClickedQuestion = this.questions[nextQuestionIndex];
    },
  },
};
</script>

<style></style>
