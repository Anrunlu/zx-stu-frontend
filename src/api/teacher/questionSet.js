import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 创建试题集
export function apiCreateQuestionSet(data) {
  return loadingFn(request)({
    url: "/tea/question-set",
    method: "POST",
    data,
  });
}

// 过滤试题集
export function apiFilterQuestionSets(data) {
  return loadingFn(request)({
    url: "/tea/question-set/filterQuestionSets",
    method: "POST",
    data,
  });
}
