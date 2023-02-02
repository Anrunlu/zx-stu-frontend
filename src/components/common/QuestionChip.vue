<template>
  <q-chip
    :color="colorization ? `${questionBadgeColor[questionType]}-3` : 'primary'"
    text-color="white"
    :label="questionType"
    :icon="questionIcon[questionType]"
    :size="size"
    square
  />
</template>

<script>
export default {
  name: "QuestionChip",
  props: {
    questionType: {
      type: String,
    },
    size: {
      type: String,
      default: "sm",
    },
    // 是否进行颜色化
    colorization: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      questionIcon: {
        单选: "radio_button_checked",
        多选: "check_box",
        判断: "done",
        填空: "border_color",
        解答: "description",
      },

      questionBadgeColor: {
        单选: "blue",
        多选: "green",
        判断: "red",
        填空: "orange",
        解答: "purple",
      },
    };
  },
};
</script>

<style></style>
