<template>
  <q-card style="min-width: 700px; max-width: 90vw">
    <CardBar title="题集预览" icon="warning" bgColor="negative" />
    <q-card-section>
      <QuestionViewCommon
        :questionDetails="questionDetails"
        v-for="(questionDetails, index) in questions"
        :key="index"
        class="q-my-sm"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "QuestionsViewCard",
  props: {
    questions: {
      type: Array,
      required: true,
    },
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
    QuestionViewCommon: () =>
      import("src/components/common/QuestionViewCommon.vue"),
  },
};
</script>

<style></style>
