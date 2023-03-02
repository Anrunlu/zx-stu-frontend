import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

//学生查询自己正在上的课
export function apiGetOpeningClasswork() {
  return loadingFn(request)({
    url: "/stu/course/openingClasswork",
    method: "GET",
  });
}

//按照条件获取课程作业
export function apiGetHomeworks(data) {
  return loadingFn(request)({
    url: "/stu/homework/filter",
    method: "POST",
    data,
  });
}

//按照知识点获取课程作业
export function apiGetHomeworkByKnowledge(data) {
  return loadingFn(request)({
    url: "/stu/homework/filterHomeworkByKnowledge",
    method: "POST",
    data,
  });
}

//获取作业详情
export function apiGetHomeworkInfo(homework_id) {
  return loadingFn(request)({
    url: `/stu/homework/${homework_id}`,
    method: "GET",
  });
}

// 提交作答
export function apiPostAnswer(data) {
  return request({
    url: "/stu/question/answerForQuestion",
    method: "POST",
    data
  });
}

//学生作答OJ题目
export function apiPostAnswerForOJQuestion(data) {
  return loadingFn(request)({
    url: "/stu/question/answerForOJQuestion",
    method: "POST",
    data,
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
