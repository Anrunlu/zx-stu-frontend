<template>
  <q-card
    :id="questionDetails._id"
    class="q-my-sm shadow-1 cursor-pointer"
    style="border-radius: 7px"
    :class="{
      'shadow-2 actived': isActive,
      'bg-yellow-1': isWHH,
    }"
    @click="handleQuestionCardClick"
    @dblclick="handleQuestionCardDblClick"
  >
    <q-card-section>
      <!-- 题干区域 -->
      <div>
        <QuestionChip
          :questionType="questionDetails.type"
          :colorization="false"
        />
        <ObjectShortId
          :id="questionDetails._id"
          :color="'grey'"
          objectName="题目"
        />
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
      <div
        class="text-subtitle1 q-pt-sm q-content"
        v-html="questionDetails.content"
        v-katex
        v-viewer
      ></div>
      <!-- 选项区域 -->
      <q-list>
        <q-item
          clickable
          v-for="(option, index) in questionDetails.answer"
          :key="index"
          @blur="handleSelectChoiceItem(questionDetails, option)"
        >
          <!-- 非填空题mark -->
          <q-item-section avatar v-if="questionDetails.type != '填空'">
            <q-icon
              :class="{
                'q-pa-xs rounded-borders bg-blue-2': option.selected,
              }"
              :color="
                isShowHomeworkDetails.isEnd &&
                isShowHomeworkDetails.isShowAnswerAfterEndtime
                  ? `${option.isRight ? 'positive' : 'grey'}`
                  : option.selected
                  ? 'positive'
                  : 'grey'
              "
              >{{ option.mark }}
              <q-badge
                color="red"
                floating
                rounded
                v-if="
                  option.selected &&
                  !option.isRight &&
                  isShowHomeworkDetails.isShowAnswerAfterEndtime &&
                  isShowHomeworkDetails.isEnd
                "
              >
                x
              </q-badge>
              <q-badge
                color="positive"
                floating
                rounded
                v-if="
                  option.selected &&
                  option.isRight &&
                  isShowHomeworkDetails.isShowAnswerAfterEndtime &&
                  isShowHomeworkDetails.isEnd
                "
              >
                √
              </q-badge>
            </q-icon>
          </q-item-section>
          <!-- 填空题mark -->
          <q-item-section avatar v-else>
            <q-icon color="grey">空{{ index + 1 }}</q-icon>
          </q-item-section>
          <!-- 选项内容 -->
          <q-item-section v-if="questionDetails.type != '填空'">
            <div
              class="text-body2 option"
              v-katex
              v-html="option.content"
              v-viewer
            ></div>
          </q-item-section>
          <q-item-section v-if="questionDetails.type == '填空'">
            <q-input
              v-model="option.content"
              type="text"
              @blur="handleSelectChoiceItem(questionDetails, option)"
            />
          </q-item-section>
        </q-item>

        <q-item
          v-if="
            isShowHomeworkDetails.isShowKnowledge &&
            questionDetails.knowledges.length != 0
          "
        >
          <q-item-section>
            <!-- 知识点区域 -->
            <div class="q-mt-md">
              <div class="row">
                <q-chip
                  v-for="(knowledge, index) in questionDetails.knowledges"
                  icon="o_lightbulb"
                  size="sm"
                  square
                  :label="knowledge.name"
                  :key="index"
                />
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="questionDetails.studentQA[0]">
          <q-item-section v-if="questionDetails.studentQA[0].comment">
            <span class="text-h5">
              <q-chip label="教师评语" color="blue" outline />
              {{ questionDetails.studentQA[0].comment }}</span
            >
          </q-item-section>
        </q-item>
      </q-list>
      <!-- 底部信息区域 -->
      <div class="q-mt-sm">
        <q-chip
          dense
          outline
          size="sm"
          square
          v-if="
            isShowHomeworkDetails.isShowScoreAfterEndtime &&
            isShowHomeworkDetails.isEnd
          "
          :color="questionDetails.getScore > 0 ? 'green-5' : 'grey'"
          :label="`${questionDetails.getScore}分`"
        />
        <span class="float-right q-mt-mb text-grey" style="font-size: 0.6rem"
          >{{
            questionDetails.submited
              ? `${questionDetails.lastSubmitedTime}`
              : "未作答"
          }}

          <q-tooltip> 最后提交时间 </q-tooltip>
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import ObjectShortId from "src/components/common/ObjectShortId.vue";
import { mapGetters } from "vuex";
export default {
  name: "StudentQAViewCard", // 展示选择和填空题目
  props: {
    index: {
      type: Number,
      required: false,
    },
    questionDetails: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
    isShowHomeworkDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },

  components: {
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
    ObjectShortId,
  },

  computed: {
    ...mapGetters("user", {
      isWHH: "isWHH",
      nickname: "nickname",
      username: "username",
    }),
  },

  methods: {
    handleQuestionCardClick() {
      this.$emit("questionCardClick", this.questionDetails);
    },
    handleQuestionCardDblClick() {
      this.$emit("questionCardDblClick", this.questionDetails);
    },
    //   console.log(q,choice)
    //   // 如果作业已结束，不允许选择
    //   if (this.isEnd) {
    //     this.$bvToast.toast("作业已截止，无法作答", {
    //       title: "提示",
    //       variant: "warning",
    //       solid: true,
    //     });
    //     return;
    //   }

    //   if (q.type === "单选" || q.type === "判断") {
    //     q.answer.forEach((a) => {
    //       a.selected = false;
    //     });
    //   }
    //   choice.selected = !choice.selected;
    //   await this.handlePostAnswer(q);
    // },
    // // 提交作答
    // async handlePostAnswer(q) {
    //   // 构造上传参数
    //   const payload = {
    //     question_id: q.id,
    //     homework_id: this.hwId,
    //     questionSet_id: this.questionSetId,
    //     stuAnswer: [],
    //   };
    //   q.answer.forEach((a) => {
    //     if (a.selected) {
    //       payload.stuAnswer.push({ mark: a.mark });
    //     }
    //   });

    //   // 如果没有选择任何选项，不提交
    //   if (payload.stuAnswer.length === 0) {
    //     return;
    //   }

    //   // 提交作答
    //   const { data } = await postAnswer(payload);
    //   // 更新作答状态
    //   if (data.code === 2000) {
    //     q.submited = true;
    //     q.lastSubmitedTime = formatTimeWithWeekDayAndSecond(new Date());
    //   }
    // },
    handleSelectChoiceItem(q, chioce) {
      this.$emit("selectChoiceItem", q, chioce);
    },
  },
};
</script>

<style>
.option p {
  margin: 0;
}
img {
  /* 防止图片溢出 */
  max-width: 100% !important;
}
.actived {
  border: 1px skyblue solid;
}
</style>
