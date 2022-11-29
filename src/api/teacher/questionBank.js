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
