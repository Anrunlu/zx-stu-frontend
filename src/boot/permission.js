import getPageTitle from "src/utils/getPageTitle";
import { getToken, removeToken } from "src/utils/auth";
import { LoadingBar, Notify } from "quasar";

export default ({ router, store, Vue }) => {
  // 路由守卫
  router.beforeEach(async (to, from, next) => {
    LoadingBar.start();
    document.title = getPageTitle(to.meta.title);
    const hasToken = getToken();
    if (hasToken) {
      // 本地存储token
      await store.dispatch("user/getUserInfo");
      const userType = store.getters["user/type"];
      if (to.path === "/login" || to.path === "/") {
        next({
          path: `/${userType}/dashboard`,
        });
        LoadingBar.stop();
      } else {
        // 本地没有token
        if (userType == to.meta.type) {
          next({
            replace: true,
          });
          LoadingBar.stop();
        } else {
          Notify.create({
            message: "无权限",
            color: "red",
            icon: "error",
            position: "center",
          });
        }
      }
    } else {
      if (!to.meta.isPublic) {
        next({
          path: "/login",
          query: {
            redirect: to.fullPath,
          },
        });
        LoadingBar.stop();
      } else {
        next();
        LoadingBar.stop();
      }
    }
  });
  router.afterEach(() => {
    LoadingBar.stop();
  });
};
