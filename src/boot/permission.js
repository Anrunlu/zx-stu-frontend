import getPageTitle from "src/utils/getPageTitle";
import { getToken, removeToken } from "src/utils/auth";
import { LoadingBar, Notify } from "quasar";

export default ({ router, store, Vue }) => {
  // 路由守卫
  router.beforeEach(async (to, from, next) => {
    const userType = store.getters["user/type"]; // 获取用户类型，如果没有登录，返回空字符串
    document.title = getPageTitle(to.meta.title, userType); // 设置页面标题

    // 如果 to.path 包含 student_homework 说明是批改作业页面，为了减少不必要的请求，直接放行
    if (to.path.includes("student_homework")) {
      next();
      return;
    }

    LoadingBar.start(); // 开始进度条

    if (to.meta.isPublic) {
      // 如果路由元信息中的 isPublic 为 true
      next({
        replace: true,
      }); // 则放行
      LoadingBar.stop();
      return;
    }

    const hasToken = getToken();

    if (hasToken) {
      // 如果本地有 token

      await store.dispatch("user/getUserInfo"); // 获取用户信息
      const userType = store.getters["user/type"]; // 获取用户类型

      if (to.path === "/login" || to.path === "/") {
        // 如果是登录页或者首页
        next({
          path: `/${userType}/course`,
        }); // 则放行并跳转到对应的用户首页
        LoadingBar.stop();
      } else {
        // 如果不是登录页或者首页
        if (userType == to.meta.type) {
          // 如果用户类型和路由元信息中的用户类型一致
          next({
            replace: true,
          }); // 则放行
          LoadingBar.stop();
        } else {
          // 如果用户类型和路由元信息中的用户类型不一致
          Notify.create({
            message: "无权限",
            type: "negative",
          }); // 则提示无权限，并跳转到来时的页面
          next({
            path: from.path,
            replace: true,
          });
        }
      }
    } else {
      // 如果本地没有 token
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      }); // 则跳转到登录页
      LoadingBar.stop();
    }
  });

  router.afterEach(() => {
    LoadingBar.stop(); // 结束进度条
  });
};
