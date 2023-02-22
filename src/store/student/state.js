export default function () {
  return {
    courseName: "",
    curTccId: "",
    teacherName: "",
    courseList: [], // 当前学期课程列表
    currCourseHmwList: [], // 当前课程作业列表
    currCourseHmwCategory: "课前预习", // 当前选择的作业分类，默认为 课前预习
    currCourseHmwListWithCategory: [], // 当前类型的作业列表
  };
}
