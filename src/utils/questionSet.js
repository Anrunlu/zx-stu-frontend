import { preProcessQuestionDetails } from "./question";

// 把题目元数据拼接到题目上
export function concatQuestionWithQuestionMeta(questions, questionsMeta) {
  if (questionsMeta.length > 0) {
    // 把题目元数据拼接到题目上
    questions.forEach((question) => {
      const questionMeta = questionsMeta.find(
        (meta) => meta.question_id === question._id
      );
      question.presetScore = questionMeta.presetScore;
      question.creator = questionMeta.creator;
    });
  } else {
    // TODO:为了兼容旧数据，这样处理
    // 如果没有题目元数据，表明题目预设分是100
    const baseScore = 100;
    questions.forEach((q) => {
      q.presetScore = baseScore;
    });
  }
}

// 预处理试题集题目
export function preProcessQuestionSetQuestions(questionSet) {
  const questions = questionSet.questions;
  const questionsMeta = questionSet.questionsMeta;
  concatQuestionWithQuestionMeta(questions, questionsMeta);

  // 处理题目
  questions.forEach((question) => {
    preProcessQuestionDetails(question);
  });

  // 排序
  questions.sort((a, b) => a.sortOrder - b.sortOrder);
}
