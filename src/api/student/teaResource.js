import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取教学资源列表
export function apiGetTeaResources(data) {
  return loadingFn(request)({
    url: "/tea/tearesource/filter",
    method: "POST",
    data,
  });
}