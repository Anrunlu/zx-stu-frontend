<template>
  <q-card
    :id="questionDetails._id"
    class="q-my-sm shadow-1 cursor-pointer"
    style="border-radius: 7px"
    :class="{
      'shadow-2 actived': isActive,
    }"
    @click="handleQuestionCardClick"
    @dblclick="handleQuestionCardDblClick"
  >
    <q-card-section>
      <!-- 题干区域 -->
      <div>
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
      </div>
      <!-- 选项区域 -->
      <q-list>
        <q-item v-for="(option, index) in questionDetails.answer" :key="index">
          <!-- 非填空题mark -->
          <q-item-section avatar v-if="questionDetails.type != '填空'">
            <q-icon
              :class="{
                'q-pa-xs rounded-borders bg-red-2':
                  option.selected && !option.isRight,
              }"
              :color="
                option.isRight
                  ? 'positive'
                  : option.selected
                  ? 'primary'
                  : 'grey'
              "
              >{{ option.mark }}

              <q-badge
                color="red"
                floating
                rounded
                v-if="option.selected && !option.isRight"
              >
                x
              </q-badge>
            </q-icon>
          </q-item-section>
          <!-- 填空题mark -->
          <q-item-section avatar v-else>
            <q-icon color="grey">{{ option.mark.slice(1, 2) }}</q-icon>
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
          <!-- 填空题学生答案和正确答案 -->
          <q-item-section v-if="questionDetails.type == '填空'">
            <div
              class="text-body2 option"
              v-katex
              v-html="option.stuAnswer"
              v-viewer
            ></div>
          </q-item-section>
          <q-item-section v-if="questionDetails.type == '填空'">
            <div
              class="text-body2 option text-green-5"
              v-katex
              v-html="option.content"
              v-viewer
            ></div>
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
          :color="questionDetails.getScore > 0 ? 'green-5' : 'grey'"
          :label="`${questionDetails.getScore}分`"
        />
        <span class="float-right q-mt-sm text-grey" style="font-size: 0.6rem"
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
export default {
  name: "StudentQAViewCard", // 用于作业批改页面，仅展示选择和填空题目
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
  },
  data() {
    return {};
  },

  components: {
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
  },

  methods: {
    handleQuestionCardClick() {
      this.$emit("questionCardClick", this.questionDetails);
    },
    handleQuestionCardDblClick() {
      this.$emit("questionCardDblClick", this.questionDetails);
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
