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

// 获取自然班列表
export function apiOriginClassroomList(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/classrooms",
    method: "GET",
  });
}

// 创建教学班(基于行政班)
export function apiCreatecombinedClassroomThroughOriginClassroom(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/combinedClassroom",
    method: "POST",
    data,
  });
}

// 创建教学班(基于学号列表)
export function apiCreateCombinedClassroomWithUsernameList(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/createCombinedClassroomWithUsernameList",
    method: "POST",
    data,
  });
}

// 通过username(学号)数组向教学班添加学生
export function apiAddStudentsToCombinedClassroomByUsername(data) {
  return loadingFn(request)({
    url: "/tea/teachinfo/addStudentsToCombinedClassroomByUsername",
    method: "POST",
    data,
  });
}
