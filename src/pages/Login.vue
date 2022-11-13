<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-normal-gradient row">
        <div class="absolute-top-right">
          <q-btn
            color="white"
            flat
            round
            icon="feedback"
            @click="feedBackDig = true"
          >
            <q-tooltip>反馈通道</q-tooltip></q-btn
          >
          <q-btn
            color="white"
            flat
            round
            @click="$q.dark.toggle()"
            :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
          />
        </div>
        <!-- 登录框 -->
        <q-card class="login-form-card col-11 col-sm-8 col-md-6">
          <q-card-section>
            <div class="row">
              <!-- 左侧，小屏幕隐藏 -->
              <div class="col-6" v-show="$q.screen.gt.sm">
                <div class="column full-height">
                  <div class="col">
                    <div class="row items-center">
                      <q-avatar size="60px">
                        <img
                          src="https://cyberdownload.anrunlu.net/zxV2_logo.png"
                        />
                      </q-avatar>
                      <!-- 平台名称 -->
                      <div class="text-h5 text-center q-ml-md">
                        知新教学过程管理平台
                      </div>
                    </div>
                  </div>
                  <div class="col-6 q-ma-md">
                    <!-- 平台简介 -->
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Adipisci dolores cupiditate eveniet est odio impedit
                      facere beatae nobis atque autem unde laborum quibusdam
                      asperiores rem, ipsa ut numquam id sequi!
                    </p>
                  </div>
                  <!-- 底部 -->
                  <div class="col-2">
                    <div class="row">
                      <!-- 版权信息等 -->
                      <span class="col text-center" style="padding: 20px 0">
                        网络空间安全学院数字大脑平台
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator vertical inset v-if="$q.screen.gt.sm" />
              <!-- 右侧 -->
              <div class="col flex justify-center items-center">
                <q-card
                  square
                  style="width: 90%; height: 100%"
                  class="no-shadow"
                >
                  <q-card-section class="row justify-between items-end">
                    <div class="text-h5 col">登录</div>
                    <div class="col">
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
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_circle" />
                      </template>
                    </q-input>
                    <!-- 密码 -->
                    <!-- 回车登录 -->
                    <q-input
                      class="logon-input"
                      bottom-slots
                      label="密码"
                      :type="isShowPwd ? 'password' : 'text'"
                      hint=""
                    >
                      <template v-slot:prepend>
                        <q-icon name="vpn_key" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isShowPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                        />
                      </template>
                    </q-input>
                    <div class="row justify-between items-center">
                      <q-checkbox left-label label="记住我" />
                      <div class="col">
                        <a class="float-right">忘记密码</a>
                      </div>
                    </div>
                    <!-- 登录按钮 -->
                    <q-btn
                      class="full-width q-mt-sm"
                      color="primary"
                      icon-right="send"
                      label="登录系统"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      isShowPwd: false,
      feedBackDig: false,
    };
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
</style>
