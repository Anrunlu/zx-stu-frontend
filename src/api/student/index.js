import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取学期内所上所有课程
export function apiGetCourses() {
  return loadingFn(request)({
    url: "/stu/course",
    method: "GET",
  });
}

// 获取学期内所上所有课程包含未完成作业
export function apiGetCourseWithUnfinishedHmw() {
  return loadingFn(request)({
    url: "/stu/course/getJoinedCourse2",
    method: "GET",
  });
}
