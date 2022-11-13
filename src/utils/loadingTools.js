import { Loading, QSpinnerGears } from "quasar";

// 请求方法自动loading
export function loadingFn(fn) {
  return function () {
    Loading.show({
      spinner: QSpinnerGears,
      message: "数据加载中...",
    });
    return fn
      .apply(this, arguments)
      .then((res) => {
        if (res.data.code === 2000) {
          Loading.hide();
          return res;
        } else {
          Loading.hide();
          return Promise.reject(res);
        }
      })
      .catch((err) => {
        Loading.hide();
        return Promise.reject(err);
      });
  };
}
