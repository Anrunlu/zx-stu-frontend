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
              src="~assets/studentLogo.png"
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
                  :type="isShowPwd ? 'text' : 'password'"
                  v-model="userLoginDto.password"
                  @keyup.enter.native="handleLogin"
                >
                  <template v-slot:prepend>
                    <q-icon name="vpn_key" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isShowPwd ? 'visibility' : 'visibility_off'"
                      class="cursor-pointer"
                      @click="isShowPwd = !isShowPwd"
                    />
                  </template>
                </q-input>
                <div class="row justify-between items-center">
                  <!-- <q-checkbox left-label label="记住我" v-model="isRemeberMe" /> -->

                  <div class="col">
                    <a
                      class="float-right"
                      style="cursor: pointer"
                      @click="handleForgetPwdClick"
                      >忘记密码</a
                    >
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
          v-if="$q.screen.gt.sm"
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
      <q-dialog v-model="emailDig" persistent>
        <q-card style="width: 500px; max-width: 80vw">
          <q-item>
            <q-item-section>
              <q-bar class="bg-white">
                <span>修改密码</span>
                <q-space />
                <!-- 关闭按钮 -->
                <q-btn
                  dense
                  flat
                  icon="close"
                  color="black"
                  @click="emailDig = false"
                >
                  <q-tooltip>关闭</q-tooltip>
                </q-btn>
              </q-bar>
            </q-item-section>
          </q-item>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                class="col q-pl-sm"
                v-model="user.username"
                type="text"
                label="用户名"
                square
                outlined
                dense
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="fingerprint" /> </template
              ></q-input>
              <q-input
                class="col q-pl-sm"
                v-model="user.email"
                type="text"
                label="邮箱"
                square
                outlined
                dense
                hide-bottom-space
              >
                <template v-slot:prepend> <q-icon name="email" /> </template
              ></q-input>
              <!-- 密码修改 -->
              <q-input
                class="col q-pl-sm"
                dense
                outlined
                square
                :type="isShowPwd ? 'password' : 'text'"
                label="新密码"
                v-model="user.password"
                hint="密码必须同时包含数字字母和特殊字符且长度大于6位"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isShowPwd ? 'visibility_off' : 'visibility'"
                    @click="isShowPwd = !isShowPwd"
                  />
                </template>
              </q-input>
              <q-input
                class="col q-pl-sm"
                dense
                outlined
                square
                :type="isShowPwd ? 'password' : 'text'"
                label="确认密码"
                v-model="user.confirmPassword"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isShowPwd ? 'visibility_off' : 'visibility'"
                    @click="isShowPwd = !isShowPwd"
                  />
                </template>
              </q-input>
              <div class="row">
                <q-input
                  v-model="code"
                  type="text"
                  label="请输入验证码"
                  square
                  outlined
                  dense
                  class="col-6 q-ml-sm"
                />
                <q-btn
                  class="col-5 q-ml-sm"
                  color="primary"
                  icon="send"
                  :label="
                    canSendCode ? '发送验证码' : `重新发送(${countDown}s)`
                  "
                  :disable="!canSendCode"
                  @click="handleSendCodeBtnClick"
                />
              </div>
              <div>
                <q-btn
                  class="q-ml-sm"
                  icon="cloud_upload"
                  label="修改密码"
                  color="primary"
                  @click="handleUpdatePasswordClick"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Base64 } from "js-base64";
import {
  apiSendUserEmail,
  apiUpdatePassword,
  apiVerifyCode,
} from "src/api/common";
import { getPwdLevel } from "src/utils/auth";
export default {
  name: "Login",
  data() {
    return {
      isShowPwd: false,
      feedBackDig: false,
      emailDig: false,
      isRemeberMe: false,
      // 登录信息
      userLoginDto: {
        username: "",
        password: "",
      },
      //修改密码
      user: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      code: "",
      //验证码or倒计时
      canSendCode: true,
      //验证码倒计时
      countDown: 60,
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

      this.$router
        .push(this.$route.query.redirect || "/index")
        .catch((e) => {});
    },

    //点击忘记密码
    handleForgetPwdClick() {
      this.emailDig = true;
    },

    //点击发送验证码
    handleSendCodeBtnClick() {
      if (this.user.username === "" || this.user.email === "") {
        this.$q.notify({
          message: "账号或邮箱不可为空",
          type: "warning",
        });
        return;
      } else {
        if (this.canSendCode) {
          this.code = "";
          this.sendCodeByemail();
        }
      }
      this.canSendCode = false;
      this.countDown = 60;
      const timer = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(timer);
          this.canSendCode = true;
        } else {
          this.countDown--;
        }
      }, 1000);
    },

    //点击修改密码
    handleUpdatePasswordClick() {
      if (this.user.password === "" || this.user.confirmPassword === "") {
        this.$q.notify({
          message: `密码不可为空`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
        return;
      }
      // 判断密码强度
      if (getPwdLevel(this.user.password) < 3) {
        this.$q.notify({
          message: "密码必须同时包含数字字母和特殊字符且长度大于6位",
          type: "negative",
        });
        return;
      }
      if (this.user.password != this.user.confirmPassword) {
        this.$q.notify({
          message: `两次密码不一致`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
        return;
      }
      if (this.code === "") {
        this.$q.notify({
          message: `验证码不可为空`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
        return;
      }
      this.updatePassword();
    },
    //发送验证码
    async sendCodeByemail() {
      const payload = {
        email: this.user.email,
        username: this.user.username,
      };
      await apiSendUserEmail(payload);
      // 提示发送成功
      this.$q.notify({
        message: "验证码发送成功",
        type: "positive",
      });
    },

    // 校验验证码
    async verifyCode() {
      // 构造参数
      const payload = {
        username: this.user.username,
        code: this.code,
      };

      const { data } = await apiVerifyCode(payload);

      if (!data.data.code) {
        return false;
      }
      return true;
    },

    //修改密码
    async updatePassword() {
      const res = await this.verifyCode();
      if (!res) {
        // 提示验证码错误
        this.$q.notify({
          message: "验证码错误",
          type: "negative",
        });
        return;
      }
      const payload = {
        username: this.user.username,
        password: this.user.confirmPassword,
      };
      const { data } = await apiUpdatePassword(payload);
      if (data.code === 2000) {
        this.$q.notify({
          message: `密码修改成功，请登录`,
          color: "positive",
          icon: "sentiment_satisfied_alt",
          position: "bottom",
          timeout: 2000,
        });
        this.emailDig = false;
      }
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
