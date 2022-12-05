export function questions(state) {
  return state.questions;
}

// 题车统计信息
export function questionsCountInfo(state) {
  return {
    // 总数
    total: state.questions.length,
    // 单选题
    singleChoice: state.questions.filter((question) => question.type === "单选")
      .length,
    // 多选题
    multipleChoice: state.questions.filter(
      (question) => question.type === "多选"
    ).length,
    // 判断题
    trueOrFalse: state.questions.filter((question) => question.type === "判断")
      .length,
    // 填空题
    fillInBlank: state.questions.filter((question) => question.type === "填空")
      .length,
    // 解答题
    jieda: state.questions.filter((question) => question.type === "解答")
      .length,
  };
}

export function questionTypes(state) {
  return state.questionTypes;
}

export function questionClass(state) {
  return state.questionClass;
}

export function questionIcon(state) {
  return state.questionIcon;
}

export function questionBadgeColor(state) {
  return state.questionBadgeColor;
}
