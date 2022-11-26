import axios from "axios";

import { getToken, removeToken } from "src/utils/auth";
import { Notify, Loading } from "quasar";

export const request = axios.create({
  baseURL: process.env.API_URL,
  timeout: 150000,
});

export const requestGraph = axios.create({
  baseURL: "https://graph-cyber.darryllin.cn/",
  timeout: 150000,
});

export default ({ app, router, store }) => {
  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      if (store.getters["user/token"]) {
        config.headers.Authorization = "Bearer " + getToken() || "";
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
      } else {
        Notify.create({
          message: err.response.data.error,
          type: "negative",
          timeout: 3000,
        });
      }

      return Promise.reject(err);
    }
  );
};
