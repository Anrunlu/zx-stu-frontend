function getDefaultState() {
  return {
    teaCourseList: [], // 教师课程信息列表
  };
}

export function resetState(state) {
  Object.assign(state, getDefaultState());
}

export function setTeaCourseList(state, teaCourseList) {
  state.teaCourseList = teaCourseList;
}

export function setCurrSelectedTeaCourse(state, currSelectedTeaCourse) {
  state.currSelectedTeaCourse = currSelectedTeaCourse;
}

export function setCurrSelectedTeaClassroom(state, currSelectedTeaClassroom) {
  state.currSelectedTeaClassroom = currSelectedTeaClassroom;
}
