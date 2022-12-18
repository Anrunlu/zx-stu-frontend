import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取作业列表
export function apiGetHomeworks(data) {
  return loadingFn(request)({
    url: "/tea/homework/queryByTeaCourse",
    method: "POST",
    data,
  });
}

// 获取作业详情
export function apiGetHomeworkDetails(homeworkId) {
  return loadingFn(request)({
    url: `/tea/homework/${homeworkId}`,
    method: "GET",
  });
}

// 修改作业
export function apiModifyHomework(homeworkId, data) {
  return loadingFn(request)({
    url: `/tea/homework/${homeworkId}`,
    method: "PUT",
    data,
  });
}

// 删除作业
export function apiRemoveHomework(homeworkId) {
  return loadingFn(request)({
    url: `/tea/homework/${homeworkId}`,
    method: "DELETE",
  });
}
