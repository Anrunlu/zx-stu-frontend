import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

//学生查询自己上的所有课程
export function apiGetCourse() {
    return loadingFn(request)({
      url: "/stu/course",
      method: "GET",
    });
  }