import { getProfile, getTermList, login } from "src/api/auth";
import { removeToken, setToken } from "src/utils/auth";

// 用户登录
export function userLogin({ commit }, userInfo) {
  const { username, password } = userInfo;
  return new Promise((resolve, reject) => {
    login({ username, password })
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

// 获取学期列表
export function termList({ commit }) {
  return new Promise((resolve, reject) => {
    getTermList()
      .then((response) => {
        const { data } = response;
        // 过滤学期名和id
        const termList = data.data.map((term) => {
          return {
            name: term.name,
            id: term.id,
          };
        });
        commit("setTermList", termList);
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
    getProfile()
      .then((response) => {
        const { data } = response;
        commit("setUserId", data.data._id);
        commit("setUsername", data.data.username);
        commit("setNickname", data.data.nickname);
        commit("setCollegeId", data.data.college._id);
        commit("setTermId", data.data.currTerm);
        commit("setStudentId", data.data.student);
        commit("setAvatar", data.data.avatar);
        commit("setType", data.data.userType);
        dispatch("termList");
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 切换学期
export function userChangeTerm({ commit, dispatch }, termId) {
  return new Promise((resolve, reject) => {
    putProfile({ currTerm: termId })
      .then((response) => {
        const { data } = response;
        if (data.code === 2000) {
          commit("setTermId", termId);

          // 提示修改学期成功
          // Swal.mixin({
          //   toast: true,
          //   title: "修改学期成功",
          //   icon: "success",
          //   timer: 1500,
          //   showConfirmButton: false,
          // }).fire();

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

export function userLogout({ commit }) {
  return new Promise((resolve) => {
    commit("resetState");
    removeToken();
    window.localStorage.clear();
    resolve();
  });
}
