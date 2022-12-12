import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 过滤题目
export function apiFilterQuestions(data) {
  return loadingFn(request)({
    url: "/tea/question/filterQuestions",
    method: "POST",
    data,
  });
}

// 获取题目详细信息
export function apiGetQuestionDetail(questionId) {
  return loadingFn(request)({
    url: `/tea/question/${questionId}`,
    method: "GET",
  });
}

// 获取题目详细信息
export function apiModifyQuestion(questionId, data) {
  return loadingFn(request)({
    url: `/tea/question/${questionId}`,
    method: "PUT",
    data,
  });
}
