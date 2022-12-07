import { formatTimeWithWeekDay } from "src/utils/time";

function getDefaultState() {
  return {
    questions: [], // 题车

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

export function resetState(state) {
  Object.assign(state, getDefaultState());
}

export function addQuestion(state, question) {
  // 为题目添加一个已加入题车的标识
  question.inQuestionCar = true;
  state.questions.push(question);
}

export function setQuestions(state, questions) {
  // 为每个题目添加一个已加入题车的标识
  questions.forEach((question) => {
    question.inQuestionCar = true;
  });
  state.questions = questions;
}

export function sortQuestions(state) {
  state.questions.sort((a, b) => a.sortOrder - b.sortOrder);
}

// 将分数平均分给同类型的每一个题目
export function averagingQuestionsScore(state, payload) {
  state.questions.forEach((question) => {
    if (question.type === payload.qType.label) {
      question.presetScore =
        payload.qType.currSettingScore /
        payload.questionsCountInfo[payload.qType.value];

      // 保留两位小数
      question.presetScore = Math.floor(question.presetScore * 100) / 100;
    }
  });
}
