import { apiGetCourses } from "src/api/student";
import { apiGetCourseWithUnfinishedHmw } from "src/api/student";

//获取课程列表
export function getCourseList({ commit, dispatch }) {
  apiGetCourses().then(({ data }) => {
    const courseList = [];
    data.data.reduce((pre, curr) => {
      const course = {
        id: curr._id,
        name: curr.course.name,
        teacherName: curr.teacher.user.nickname,
        teacherAvatar: curr.teacher.user.avatar,
        unfinishedHomework: null,
        unfinishedHomeworkNum: 0,
      };
      pre.push(course);
      return pre;
    }, courseList);
    commit("setCourseList", courseList);
  });
}

//获取未完成作业数量
export function getCourseWithUnfinishedHmw({ state }) {
  return new Promise((resolve, reject) => {
    apiGetCourseWithUnfinishedHmw().then(({ data }) => {
      if (data.data === 2000) {
        data.data.forEach((curr) => {
          const course = state.courseList.find((c) => c.id === curr.id);
          course.unfinishedHomework = curr.homework.filter((h) => {
            if (
              h.studenthomework.length == 0 ||
              h.studenthomework[0].answerProgress < 1
            ) {
              return true;
            }
          });
          Vue.set(
            course,
            "unfinshedHomeworkNum",
            course.unfinishedHomework.length
          );
          Vue.set(course, "readyToShowUnfinishedHmwNum", true);
        });
        resolve();
      } else {
        reject(data.msg);
      }
    });
  });
}
