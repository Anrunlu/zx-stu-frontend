import { apiGetTeaCourseInfo } from "src/api/teacher/course";
import { getObjectShortId } from "src/utils/common";

// 获取教师课程信息列表
export function getTeaCourseInfo({ commit, dispatch }) {
  apiGetTeaCourseInfo().then(({ data }) => {
    const teaCourseList = [];
    data.data.reduce((pre, curr) => {
      const course = {
        id: curr._id,
        _id: curr._id,
        shortId: getObjectShortId(curr),
        courseId: curr.course._id,
        name: curr.course.name,
        classrooms: curr.classrooms,
        classroomsNum: 0,
      };
      pre.push(course);
      return pre;
    }, teaCourseList);
    commit("setTeaCourseList", teaCourseList);
  });
}
