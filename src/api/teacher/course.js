import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取课程列表
export function apiGetCourses() {
  return loadingFn(request)({
    url: "/tea/teachinfo/currentTermCourses",
    method: "GET",
  });
}

// 获取教师课程信息
export function apiGetTeaCourseInfo() {
  return loadingFn(request)({
    url: "/tea/teachinfo/teaCourse",
    method: "GET",
  });
}

// 创建 teaCourse
export function apiCreateTeaCourse(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/teaCourse",
    method: "POST",
    data,
  });
}

// 删除 teaCourse
export function apiRemoveTeaCourse(tcc_id) {
  return loadingFn(request)({
    url: `/tea/teachinfo/teaCourse/${tcc_id}`,
    method: "delete",
  });
}

// 获取教学班学生信息
export function apiGetTeaClsroomStuList(classroom_id) {
  return loadingFn(request)({
    url: `/tea/teachinfo/combinedClassroomStudents/${classroom_id}`,
    method: "get",
  });
}

// 重命名教学班
export function apiRenameTeaClsroom(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/combinedClassroom",
    method: "put",
    data,
  });
}

// 移除教学班
export function apiRemoveTeaClsroom(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/removeCombinedClassroomFromTeaCourse",
    method: "delete",
    data,
  });
}
