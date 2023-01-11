<template>
  <div>
    <!-- 顶部信息区域 -->
    <div>
      <QuestionChip :questionType="questionDetails.type" />
      <ObjectShortId
        v-if="showShortId"
        :shortId="questionDetails.shortId"
        :id="questionDetails.id"
        :color="'grey'"
        objectName="题目"
      />
      <!-- 序号 -->
      <q-chip
        v-if="showIndex"
        class="float-right"
        color="grey"
        dense
        outline
        size="sm"
        square
        :label="index"
      />
    </div>
    <!-- 题干区域 -->
    <div
      class="text-subtitle1 q-pt-sm"
      v-html="questionDetails.content"
      v-katex
      v-viewer
    ></div>
    <!-- 客观题选项区域 -->
    <q-list v-if="questionDetails.type != '解答'">
      <q-item
        clickable
        v-ripple
        v-for="(option, index) in questionDetails.answer"
        :key="index"
      >
        <q-item-section avatar v-if="questionDetails.type != '填空'">
          <q-icon :color="option.isRight ? 'positive' : 'primary'">{{
            option.mark
          }}</q-icon>
        </q-item-section>
        <q-item-section avatar v-else>
          <q-icon :color="option.isRight ? 'positive' : 'primary'">{{
            option.mark.slice(1, 2)
          }}</q-icon>
        </q-item-section>
        <q-item-section>
          <div
            class="text-body2 option"
            v-katex
            v-viewer
            v-html="option.content"
          ></div>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- 解答题答案区域 -->
    <div v-else>
      <div
        class="text-body2 q-pt-sm"
        v-viewer
        v-katex
        v-html="questionDetails.answer.content"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuestionViewCommon",
  props: {
    index: {
      type: Number,
      required: false,
    },
    questionDetails: {
      type: Object,
      required: true,
      default: () => {
        return {
          content: "",
        };
      },
    },
    showShortId: {
      type: Boolean,
      default: false,
      required: false,
    },
    showIndex: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  components: {
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
  },
};
</script>

<style>
.option p {
  margin: 0;
}
</style>
