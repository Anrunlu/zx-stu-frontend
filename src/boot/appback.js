export default async (/* { app, router, Vue ... } */) => {
  let time = ""; // 保存第一次按键时间；
  // 监听返回按钮
  document.addEventListener("plusready", function () {
    plus.key.addEventListener(
      "backbutton",
      function (evt) {
        let webview = plus.webview.currentWebview();

        let url = location.hash;

        if (url == "#/index" || url.includes("#/login")) {
          //根据自己需求判断首页路径

          // 处于app首页,满足退出app操作
          plus.nativeUI.toast("再按一次退出应用", {
            duration: "short",
          });

          if (new Date() - time < 1000) {
            // 小于1s,退出app

            webview.close();
          } else {
            // 大于2s，重置时间戳，

            time = new Date();
          }

          return;
        } else {
          history.go(-1); // 不满足退出操作，返回
        }
      },
      false
    );
  });
};
