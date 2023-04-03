import {
  apiGetProfile,
  apiGetTermList,
  apiLogin,
  apiModifyProfile,
} from "src/api/auth";
import {
  apiGetUnreadAnnouncementCount,
  apiGetUnreadAnnouncementList,
} from "src/api/student/announcement";
import { removeToken, setToken } from "src/utils/auth";

// 用户登录
export function login({ commit }, userInfo) {
  const { username, password } = userInfo;
  return new Promise((resolve, reject) => {
    apiLogin({ username, password })
      .then((response) => {
        const { data } = response;
        commit("setToken", data.data.token);
        setToken(data.data.token);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 获取未读公告列表
export function unreadAnnouncementList({ commit, state }) {
  return new Promise((resolve, reject) => {
    apiGetUnreadAnnouncementList()
      .then((response) => {
        const { data } = response;
        commit("setUnreadAnnouncementCount", data.data.length);

        const forceAnnouncementList = data.data.filter((item) => item.isforce);

        // 如果有强制公告，就弹出强制公告
        if (forceAnnouncementList.length > 0) {
          const forceAnnouncement = forceAnnouncementList[0];
          // 新标签页打开强制公告
          const routeData = this.$router.resolve(
            `/announcement/${forceAnnouncement._id}?isRead=true`
          );
          window.open(routeData.href, "_blank");
        }
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 获取学期列表
export function termList({ commit, state }) {
  return new Promise((resolve, reject) => {
    apiGetTermList()
      .then((response) => {
        const { data } = response;
        // 过滤学期名和id
        const termList = data.data.map((term) => {
          return {
            name: term.name,
            _id: term._id,
          };
        });
        commit("setTermList", termList);

        // 设置学院当前学期名
        const collegeCurrTermName = termList.find(
          (term) => term._id === state.collegeCurrTermId
        ).name;

        commit("setCollegeCurrTermName", collegeCurrTermName);

        // 设置用户当前学期名
        const term = termList.find((term) => term._id === state.termId);

        if (term) {
          commit("setTermName", term.name);
        } else {
          commit("setTermName", collegeCurrTermName);
        }
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 获取未读公告数量
export function unreadAnnouncementCount({ commit, state }) {
  return new Promise((resolve, reject) => {
    apiGetUnreadAnnouncementList()
      .then((response) => {
        const { data } = response;
        commit("setUnreadAnnouncementCount", data.data.length);

        const forceAnnouncementList = data.data.filter((item) => item.isforce);

        // 如果有强制公告，就弹出强制公告
        if (forceAnnouncementList.length > 0) {
          const forceAnnouncement = forceAnnouncementList[0];
          // 新标签页打开强制公告
          const routeData = this.$router.resolve(
            `/announcement/${forceAnnouncement._id}?isRead=true`
          );
          window.open(routeData.href, "_blank");
        }
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 获取用户信息
export function getUserInfo({ commit, dispatch }) {
  return new Promise((resolve, reject) => {
    apiGetProfile()
      .then((response) => {
        const { data } = response;
        commit("setUserId", data.data._id);
        commit("setUsername", data.data.username);
        commit("setNickname", data.data.nickname);
        commit("setCollegeId", data.data.college._id);
        commit("setTermId", data.data.currTerm);
        commit("setCollegeCurrTermId", data.data.college.currTerm);
        commit("setStudentId", data.data.student);
        commit("setAvatar", data.data.avatar);
        commit("setType", data.data.userType);
        dispatch("termList");
        dispatch("unreadAnnouncementCount");
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 切换学期
export function changeTerm({ commit, dispatch }, term) {
  return new Promise((resolve, reject) => {
    apiModifyProfile({ currTerm: term._id })
      .then((response) => {
        const { data } = response;
        if (data.code === 2000) {
          commit("setTermId", term._id);

          // 重新获取用户数据
          dispatch("getUserInfo");
          // 重新获取 teaCourse 数据
          dispatch("student/getCourseList", null, { root: true });
          // // 重置当前选择的课程
          commit("student/setCurrSelectedCourse", null, { root: true });
          resolve();
        } else {
          reject(data.msg);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 用户登出
export function logout({ commit }) {
  return new Promise((resolve) => {
    commit("resetState");
    removeToken();
    window.localStorage.clear();
    // 刷新页面
    window.location.reload();
    resolve();
  });
}
