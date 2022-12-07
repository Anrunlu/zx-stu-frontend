<template>
  <q-card style="width: 800px; max-width: 80vw">
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="text-h5">
        <q-icon name="visibility" />
        题目预览
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

    <q-card-section>
      <!-- 题干区域 -->
      <div>
        <QuestionChip :questionType="questionDetails.type" />
        <div
          class="text-subtitle1 q-pt-sm"
          v-html="questionDetails.content"
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
            <div class="text-body2" v-html="option.content"></div>
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

    <q-card-actions align="right">
      <q-btn
        class="q-ml-sm"
        color="positive"
        icon="add_shopping_cart"
        :disable="inQuestionCar"
        :label="inQuestionCar ? '已加入题车' : '加入题车'"
        @click="handleAddQuestionToCarBtnClick"
      />
      <q-btn class="q-ml-sm" color="primary" icon="edit" label="编辑" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import { marked } from "marked";
import { apiGetQuestionDetail } from "src/api/teacher/questionBank";
import QuestionChip from "src/components/common/QuestionChip.vue";
export default {
  name: "QuestionViewCard",
  props: ["questionId", "inQuestionCar"],
  data() {
    return {
      questionDetails: {},
    };
  },

  components: {
    QuestionChip,
  },

  methods: {
    // 获取题目详细信息
    async getQuestionDetail() {
      try {
        const { data } = await apiGetQuestionDetail(this.questionId);
        this.questionDetails = data.data;
        // 格式化题目内容
        this.questionDetails.content = marked(this.questionDetails.content);
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
      // 告知题库组件，添加题目到题车
      this.$emit("addQuestionToCar", this.questionDetails.id);
    },
  },

  created() {
    this.getQuestionDetail();
  },
};
</script>

<style></style>
