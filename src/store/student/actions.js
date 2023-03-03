import { apiGetCourses } from "src/api/student";
import { apiGetCourseWithUnfinishedHmw } from "src/api/student";
import Vue from "vue";
//获取课程列表
export function getCourseList({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    apiGetCourses()
      .then(({ data }) => {
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
        dispatch("getCourseWithUnfinishedHmw");
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//获取未完成作业数量
export function getCourseWithUnfinishedHmw({ state, commit }) {
  return new Promise((resolve, reject) => {
    apiGetCourseWithUnfinishedHmw().then(({ data }) => {
      const copyCourseList = [];
      if (data.code === 2000) {
        data.data.forEach((curr) => {
          const course = Object.assign(
            {},
            state.courseList.find((c) => c.id === curr._id)
          );
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
            "unfinishedHomeworkNum",
            course.unfinishedHomework.length
          );
          Vue.set(course, "unfinishedHomework", true);
          copyCourseList.push(course);
        });
        commit("setCourseList", copyCourseList);
        resolve();
      } else {
        reject(data.msg);
      }
    });
  });
}
