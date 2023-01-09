<template>
  <q-card style="width: 800px; max-width: 90vw">
    <!-- 标题栏 -->
    <CardBar title="题目预览" icon="visibility">
      <template v-slot:left>
        <ObjectShortId
          :id="questionId"
          :shortId="questionDetails.shortId"
          objectName="题目"
        />
      </template>

      <template v-slot:right v-if="!pure">
        <q-btn
          round
          flat
          dense
          icon="arrow_back"
          color="white"
          @click="$emit('prevQuestion', questionId)"
        >
          <q-tooltip> 上一题 </q-tooltip>
        </q-btn>
        <q-btn
          round
          flat
          dense
          icon="arrow_forward"
          color="white"
          @click="$emit('nextQuestion', questionId)"
          ><q-tooltip> 下一题 </q-tooltip></q-btn
        >
      </template>
    </CardBar>

    <q-card-section style="max-height: 70vh" class="scroll">
      <!-- 题干区域 -->
      <div>
        <QuestionChip :questionType="questionDetails.type" />
        <div
          class="text-subtitle1 q-pt-sm"
          v-html="questionDetails.content"
          v-katex
        ></div>
      </div>
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
              v-html="option.content"
            ></div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- 解答题答案区域 -->
      <div v-else>
        <div
          class="text-body2 q-pt-sm"
          v-html="questionDetails.answer.content"
        ></div>
      </div>
    </q-card-section>

    <q-card-actions align="right" v-if="!pure">
      <q-btn
        class="q-ml-sm"
        color="positive"
        :icon="inQuestionCar ? 'remove_shopping_cart' : 'add_shopping_cart'"
        :label="inQuestionCar ? '移出题车' : '加入题车'"
        @click="handleAddQuestionToCarBtnClick"
      />
      <q-btn
        class="q-ml-sm"
        color="primary"
        icon="edit"
        label="编辑"
        @click="handleEditQuestionBtnClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { apiGetQuestionDetail } from "src/api/teacher/question";
import QuestionChip from "src/components/common/QuestionChip.vue";
import { preProcessQuestionDetails } from "src/utils/question";

export default {
  name: "QuestionViewCard",
  props: {
    questionId: {
      type: String,
      required: true,
    },
    inQuestionCar: {
      type: Boolean,
      required: false,
    },
    pure: {
      // 纯净模式，不显示多余按钮
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      questionDetails: {},
      questionEditDig: false,
    };
  },

  components: {
    QuestionChip,
    CardBar: () => import("src/components/common/CardBar.vue"),
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
  },

  watch: {
    questionId: {
      immediate: true,
      handler(newQuestionId) {
        this.getQuestionDetail(newQuestionId);
      },
    },
  },

  methods: {
    // 获取题目详细信息
    async getQuestionDetail(questionId) {
      try {
        const { data } = await apiGetQuestionDetail(questionId);
        this.questionDetails = data.data;
        // 预处理题目详细信息
        preProcessQuestionDetails(this.questionDetails);
      } catch (error) {
        // 提示获取失败
        this.$q.notify({
          message: "获取题目详细信息失败",
          type: "negative",
        });
      }
    },

    // 加入题车按钮点击事件
    handleAddQuestionToCarBtnClick() {
      if (this.inQuestionCar) {
        // 告知题库组件，从题车移除题目
        this.$emit("removeQuestionFromCar", this.questionDetails._id);
        return;
      }
      // 告知题库组件，添加题目到题车
      this.$emit("addQuestionToCar", this.questionDetails._id);
    },

    // 编辑题目按钮点击事件
    handleEditQuestionBtnClick() {
      const routeData = this.$router.resolve(
        `/teacher/question/${this.questionDetails._id}`
      );
      window.open(routeData.href, "_blank");
      return;
    },
  },

  created() {
    this.getQuestionDetail(this.questionId);
  },
};
</script>

<style>
.option p {
  margin: 0;
}
</style>
