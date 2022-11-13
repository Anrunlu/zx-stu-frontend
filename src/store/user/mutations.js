import { getToken } from "src/utils/auth";

function getDefaultState() {
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
    // 教师信息
    teacherId: "",
    officeName: "",
    officeId: "",
    // 学生信息
    studentId: "",
    originClassroomName: "",
    originClassroomId: "",
  };
}

export function resetState(state) {
  Object.assign(state, getDefaultState());
}

// 公共信息
export function setToken(state, token) {
  state.token = token;
}

export function setUserId(state, userId) {
  state.userId = userId;
}

export function setNickname(state, nickname) {
  state.nickname = nickname;
}

export function setUsername(state, username) {
  state.username = username;
}

export function setType(state, type) {
  state.type = type;
}

export function setAvatar(state, avatar) {
  state.avatar = avatar;
}

export function setTermName(state, termName) {
  state.termName = termName;
}

export function setTermId(state, termId) {
  state.termId = termId;
}

export function setTermList(state, termList) {
  state.termList = termList;
}

export function setCollegeId(state, collegeId) {
  state.collegeId = collegeId;
}

// 教师信息
export function setTeacherId(state, teacherId) {
  state.teacherId = teacherId;
}

export function setOfficeName(state, officeName) {
  state.officeName = officeName;
}

export function setOfficeId(state, officeId) {
  state.officeId = officeId;
}

// 学生信息
export function setStudentId(state, studentId) {
  state.studentId = studentId;
}

export function setOriginClassroomName(state, originClassroomName) {
  state.originClassroomName = originClassroomName;
}

export function setOriginClassroomId(state, originClassroomId) {
  state.originClassroomId = originClassroomId;
}
