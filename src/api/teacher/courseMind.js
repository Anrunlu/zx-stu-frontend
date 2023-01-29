import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取导图列表
export function apiGetCourseMinds(data) {
  return loadingFn(request)({
    url: "/tea/courseMind/filter",
    method: "POST",
    data,
  });
}

// 获取导图详情
export function apiGetCourseMindDetails(courseMindId) {
  return loadingFn(request)({
    url: `/tea/courseMind/${courseMindId}`,
    method: "GET",
  });
}

// 创建导图
export function apiCreateCourseMinds(data) {
  return loadingFn(request)({
    url: `/tea/courseMind`,
    method: "POST",
    data,
  });
}

// 修改导图
export function apiModifyCourseMind(courseMindId, data) {
  return loadingFn(request)({
    url: `/tea/courseMind/${courseMindId}`,
    method: "PUT",
    data,
  });
}

// 删除导图
export function apiDeleteCourseMind(courseMindId) {
  return loadingFn(request)({
    url: `/tea/courseMind/${courseMindId}`,
    method: "DELETE",
  });
}
