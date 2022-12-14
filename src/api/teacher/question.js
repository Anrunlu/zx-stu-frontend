import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取题目详细信息
export function apiGetQuestionDetail(questionId) {
  return loadingFn(request)({
    url: `/tea/question/${questionId}`,
    method: "GET",
  });
}

// 创建题目
export function apiCreateQuestion(data) {
  return loadingFn(request)({
    url: `/tea/question`,
    method: "POST",
    data,
  });
}

// 修改题目
export function apiModifyQuestion(questionId, data) {
  return loadingFn(request)({
    url: `/tea/question/${questionId}`,
    method: "PUT",
    data,
  });
}

// 删除题目
export function apiRemoveQuestion(questionId) {
  return loadingFn(request)({
    url: `/tea/question/${questionId}`,
    method: "DELETE",
  });
}
