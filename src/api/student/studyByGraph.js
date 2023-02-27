import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

//按照知识点获取课程作业
export function apiGetHomeworkByKnowledge(data) {
    return loadingFn(request)({
      url: "/stu/homework/filterHomeworkByKnowledge",
      method: "POST",
      data,
    });
  }

  //学生查询自己上的所有课程
export function apiGetCourse() {
    return loadingFn(request)({
      url: "/stu/course",
      method: "GET",
    });
  }

  //学生作答OJ题目
export function apiGetCompleteKnowledgeByStudent(data) {
    return loadingFn(request)({
      url: "/stu/knowledge/getStudentCompleteKnowledgeQuestion",
      method: "POST",
      data,
    });
  }
  //获取图谱信息
export function apiEditKG(data) {
  return requestGraph({
    url: "/editkg",
    method: "post",
    data
  });
}