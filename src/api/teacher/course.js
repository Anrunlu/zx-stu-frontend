import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取课程列表
export function getCourses() {
  return loadingFn(request)({
    url: "/tea/teachinfo/currentTermCourses",
    method: "GET",
  });
}

// 获取教师课程信息
export function getTeaCourseInfo() {
  return loadingFn(request)({
    url: "/tea/teachinfo/teaCourse",
    method: "GET",
  });
}

// 获取教学班学生信息
export function getTeaClsroomStuList(classroom_id) {
  return loadingFn(request)({
    url: `/tea/teachinfo/combinedClassroomStudents/${classroom_id}`,
    method: "get",
  });
}

// 获取作业列表
export function getHomeworks(data) {
  return loadingFn(request)({
    url: "/tea/homework/queryByTeaClassroom",
    method: "POST",
    data,
  });
}
