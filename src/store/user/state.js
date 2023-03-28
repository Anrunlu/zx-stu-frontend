import { getToken } from "src/utils/auth";
export default function () {
  return {
    // 公共信息
    token: getToken(),
    userId: "",
    nickname: "",
    username: "",
    type: "",
    avatar: "",
    termName: "",
    termId: "",
    termList: [],
    collegeId: "",
    collegeName: "",
    collegeCurrTermName: "",
    collegeCurrTermId: "",
    // 教师信息
    teacherId: "",
    officeName: "",
    officeId: "",
    // 学生信息
    studentId: "",
    originClassroomName: "",
    originClassroomId: "",
    // 未读公告数量
    unreadAnnouncementCount: 0,
    //判断是不是whh
    isWHH: false,
  };
}
