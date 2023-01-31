import { apiGetQuestionDetail } from "src/api/teacher/question";
import { preProcessQuestionList } from "src/utils/question";

/**
 * 更换题目
 * @param {Object} changeInfo
 * @param {String} changeInfo.oldQuestionId
 * @param {String} changeInfo.newQuestionId
 */
export function changeQuestion({ commit, state }, changeInfo) {
  const { oldQuestionId, newQuestionId } = changeInfo;

  return new Promise((resolve, reject) => {
    // 获取新的题目
    apiGetQuestionDetail(newQuestionId)
      .then((res) => {
        const newQuestion = res.data.data;
        const questionList = preProcessQuestionList([newQuestion]);

        // 原题目的索引
        const oldQuestionIndex = state.questions.findIndex(
          (question) => question._id === oldQuestionId
        );

        // 替换原题目
        commit("setQuestions", [
          ...state.questions.slice(0, oldQuestionIndex),
          ...questionList,
          ...state.questions.slice(oldQuestionIndex + 1),
        ]);

        resolve({ ok: true });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
