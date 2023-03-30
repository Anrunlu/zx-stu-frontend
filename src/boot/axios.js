import axios from "axios";

import { getToken, removeToken } from "src/utils/auth";
import { Notify, Loading, Dialog } from "quasar";

export const request = axios.create({
  baseURL: process.env.API_URL,
  timeout: 150000,
});

export default ({ app, router, store }) => {
  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      if (store.getters["user/token"]) {
        config.headers.Authorization = "Bearer " + getToken() || "";
        // 自定义请求头
        config.headers["X-app-version"] = process.env.APP_VERSION;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // 响应拦截器
  request.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      Loading.hide();
      if (err.response.status === 401) {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
        });
        removeToken();
        router.push("/login");
      } else if (err.response.status === 500) {
        Notify.create({
          message: "服务器异常，请稍后再试",
          type: "negative",
        });
      } else if (err.response.status === 404) {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
        });
      } else if (err.response.data.error.includes("版本已过期")) {
        const fileUrl = err.response.data.error.split("下载地址：")[1];

        Dialog.create({
          title: "提示",
          message: err.response.data.error,
          ok: {
            label: "确定",
            color: "primary",
          },
        }).onOk(() => {
          window.open(fileUrl);
        });
      } else {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
        });
      }

      return Promise.reject(err);
    }
  );
};
