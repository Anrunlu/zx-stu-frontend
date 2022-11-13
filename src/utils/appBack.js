var time = ""; // 保存第一次按键时间；

// 监听返回按钮

document.addEventListener("plusready", function () {
  plus.key.addEventListener(
    "backbutton",
    function (evt) {
      var webview = plus.webview.currentWebview();

      var url = location.hash;

      // alert(strSub(url))

      if (url == "#/index" || url == "#/login") {
        //根据自己需求判断首页路径

        // 处于app首页,满足退出app操作

        //此处作为提示作用。根据情况引入自己所用的框架提示。我用的是vant，在文件内首行需引入import { Toast } from "vant";

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
