export default function () {
  return {
    questions: [],

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

    questionClass: {
      单选: "border-single-choice",
      多选: "border-multiple-choice",
      判断: "border-true-or-false",
      填空: "border-fill-in-blank",
      解答: "border-jieda",
    },

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
}
