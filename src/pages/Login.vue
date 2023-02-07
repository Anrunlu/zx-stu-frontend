<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-grey-1 q-pt-xl">
        <div class="absolute-top-right">
          <q-btn
            class="q-pa-sm"
            color="primary"
            flat
            round
            icon="feedback"
            @click="feedBackDig = true"
          >
            <q-tooltip>反馈通道</q-tooltip></q-btn
          >
        </div>

        <div class="row justify-center q-pt-xl">
          <!-- logo -->
          <div class="col-11 text-center">
            <q-img
              :width="$q.screen.gt.sm ? '300px' : '250px'"
              src="~assets/teacherLogo.png"
              spinner-color="primary"
              spinner-size="82px"
            />
          </div>

          <!-- 登录框 -->
          <div class="col-10 col-sm-6 col-md-4 col-xl-3 q-pt-xl">
            <q-card>
              <q-card-section class="row justify-between items-end">
                <div class="text-h5 col">登录</div>
                <div class="col desktop-only">
                  <a class="float-right">扫码登录</a>
                </div>
              </q-card-section>
              <q-card-section>
                <!-- 用户名 -->
                <q-input
                  class="logon-input"
                  clearable
                  bottom-slots
                  label="账号"
                  v-model="userLoginDto.username"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
                <!-- 密码 -->
                <q-input
                  class="logon-input"
                  bottom-slots
                  label="密码"
                  :type="isShowPwd ? 'password' : 'text'"
                  v-model="userLoginDto.password"
                  @keyup.enter.native="handleLogin"
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isShowPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isShowPwd = !isShowPwd"
                    />
                  </template>
                </q-input>
                <div class="row justify-between items-center">
                  <q-checkbox left-label label="记住我" v-model="isRemeberMe" />

                  <div class="col">
                    <a class="float-right">忘记密码</a>
                  </div>
                </div>
                <!-- 登录按钮 -->
                <q-btn
                  class="full-width q-mt-sm"
                  color="primary"
                  icon-right="send"
                  label="登录"
                  @click="handleLogin"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- 底部信息 -->
        <div
          id="login-footer"
          class="fixed-bottom text-center text-grey q-pb-lg"
        >
          <div v-if="$q.screen.gt.sm">
            <a href="https://c605.cn">关于我们</a>
            <span class="q-px-sm"> | </span>
            <a>网络空间安全学院数字大脑平台 All Rights Reserved. </a>
          </div>

          <div v-else>
            <a>网络空间安全学院数字大脑平台 All Rights Reserved. </a>
            <br />
            <a href="https://c605.cn">关于我们</a>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Base64 } from "js-base64";
export default {
  name: "Login",
  data() {
    return {
      isShowPwd: true,
      feedBackDig: false,
      isRemeberMe: false,
      // 登录信息
      userLoginDto: {
        username: "",
        password: "",
      },
    };
  },

  methods: {
    // 处理用户登录
    async handleLogin() {
      // 帐号密码传输加密
      const userInfo = {
        username: Base64.encode(this.userLoginDto.username),
        password: Base64.encode(this.userLoginDto.password),
      };

      // // 执行用户登录动作
      await this.$store.dispatch("user/login", userInfo);

      // 延时等待 store 里面存入信息，然后显示
      setTimeout(() => {
        const nickname = this.$store.getters["user/nickname"];

        // 显示登录成功信息
        this.$q.notify({
          message: `欢迎回来 ${nickname}`,
          color: "positive",
          icon: "sentiment_satisfied_alt",
          position: "bottom",
          timeout: 1500,
        });
      }, 500);

      this.$router.push(this.$route.query.redirect || "/").catch((e) => {});
    },
  },
};
</script>
<style>
.bg-normal-gradient {
  background-image: linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%);
}
.bg-dark-gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form-card a {
  cursor: pointer;
}
#login-footer a {
  text-decoration: none;
  color: grey;
}
#login-footer a:hover {
  cursor: pointer;
  color: grey;
  text-decoration: underline;
}
</style>
