export default function () {
  return {
    courseName: "",
    curTccId: "",
    teacherName: "",
    courseList: [], // 当前学期课程列表
    currSelectedCourse: null, // 当前选中课程
    currSelectedHomeworkType: "课后作业", // 当前选择的作业分类，默认为课后作业
  };
}

