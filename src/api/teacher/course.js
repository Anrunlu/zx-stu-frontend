import { request } from "@/boot/axios";

// 获取课程列表
export function getCourses() {
  return request({
    url: "/tea/teachinfo/currentTermCourses",
    method: "GET",
  });
}

// 获取教师课程信息
export function getTeaCourseInfo() {
  return request({
    url: "/tea/teachinfo/teaCourse",
    method: "GET",
  });
}

// 获取作业列表
export function getHomeworks(data) {
  return request({
    url: "/tea/homework/queryByTeaClassroom",
    method: "POST",
    data,
  });
}
