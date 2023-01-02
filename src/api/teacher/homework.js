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

// 创建作业
export function apiCreateHomeworks(data) {
  return loadingFn(request)({
    url: `/tea/homework`,
    method: "POST",
    data,
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

// 获取某作业的整体作答情况
export function apiGetHomeworkOverallAnswerStatus(data) {
  return loadingFn(request)({
    url: "/tea/homework/getHomeworkOverallAnswerStatus",
    method: "POST",
    data,
  });
}

// 获取某作业内题目的正答率(题目视图)
export function apiGetStatisticsForCertainHomework(data) {
  return loadingFn(request)({
    url: "/tea/homework/getStatisticsForCertainHomework",
    method: "POST",
    data,
  });
}

// 获取学生作答详情
export function apiGetStudentHomeworkDetails(data) {
  return loadingFn(request)({
    url: "/tea/homework/getHomeworkWithStudentAnswer",
    method: "POST",
    data,
  });
}
