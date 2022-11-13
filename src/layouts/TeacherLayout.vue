<template>
  <q-layout view="lHh LpR lFf">
    <q-header
      reveal
      :class="$q.dark.isActive ? 'header_dark' : 'header_normal'"
    >
      <q-toolbar>
        <q-btn
          @click="left = !left"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
        />
        <q-toolbar-title>知新教管-教师端</q-toolbar-title>
        <q-btn
          class="q-mr-xs"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-btn flat round dense icon="email" class="q-mr-xs" />
        <q-btn flat round dense icon="fas fa-sign-out-alt" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer
      class="left-navigation text-white"
      show-if-above
      v-model="left"
      side="left"
      :width="230"
      elevated
    >
      <div
        class="full-height"
        :class="$q.dark.isActive ? 'drawer_dark' : 'drawer_normal'"
      >
        <div style="height: calc(100% - 117px); padding: 10px">
          <q-toolbar>
            <q-avatar>
              <img src="https://cyberdownload.anrunlu.net/zxV2_logo.png" />
            </q-avatar>
            <div class="q-ml-md text-center">
              <q-toolbar-title>张三 </q-toolbar-title>
              <div
                class="text-overline q-ma-none q-pa-none"
                style="line-height: 1rem; color: #f2d541"
              >
                2019414172
              </div>
              <div
                class="text-overline q-ma-none q-pa-none"
                style="line-height: 1rem; color: #f29f05"
              >
                信息安全
              </div>
            </div>
          </q-toolbar>
          <hr />
          <q-scroll-area style="height: 100%">
            <q-list padding>
              <q-item
                active-class="tab-active"
                to="dashboard"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>

                <q-item-section> Dashboard </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="management"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="book_online" />
                </q-item-section>

                <q-item-section> 课程管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="/teacher/coursegraph"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="bubble_chart" />
                </q-item-section>

                <q-item-section> 课程图谱 </q-item-section>
              </q-item>
              <q-item
                active-class="tab-active"
                to="/teacher/editstudentgraph"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="agriculture" />
                </q-item-section>

                <q-item-section> 课程导图 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="question_bank"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="fas fa-question" size="sm" />
                </q-item-section>

                <q-item-section> 题库管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="questionSetManagement"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="topic" />
                </q-item-section>

                <q-item-section> 题集管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="homework"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="work" />
                </q-item-section>

                <q-item-section> 作业管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="classwork"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="cast_for_education" />
                </q-item-section>

                <q-item-section> 课堂互动 </q-item-section>
              </q-item>
              <q-item
                active-class="tab-active"
                to="knowledge_portrait"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="flutter_dash" />
                </q-item-section>

                <q-item-section> 知识画像 </q-item-section>
              </q-item>
              <q-item
                active-class="tab-active"
                to="testmanagement"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="fas fa-diagnoses" />
                </q-item-section>

                <q-item-section> 考试系统 </q-item-section>
              </q-item>
              <q-item
                active-class="tab-active"
                to="grade"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="leaderboard" size="sm" />
                </q-item-section>

                <q-item-section> 成绩管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="source"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="cloud_circle" size="sm" />
                </q-item-section>

                <q-item-section> 教学资源 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to="profile"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="manage_accounts" />
                </q-item-section>

                <q-item-section> 个人设置 </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="row no-wrap">
        <div class="col">
          <div class="full-height">
            <q-scroll-area class="col q-pr-sm full-height" visible>
              <!-- <keep-alive> -->
              <router-view />
              <!-- </keep-alive> -->
            </q-scroll-area>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      isShowScan: false,
      result: "", // 扫码结果信息
      error: "", // 错误信息
      qrcode: true,
      torchActive: false,
      camera: "auto",
      isApp: false,
      announcementDetailDig: false,
      left: false,
      appInfoDig: false,
      appVersion: "1.2.8",
      newAppFileUrl: "",
      announcementList: [],
      optannouncement: "",
      updateContent: "",
    };
  },

  methods: {
    async logout() {
      this.$socket.close();
      await this.$store.dispatch("user/userLogout");
      this.$q.notify({
        type: "warning",
        message: "Logged out",
      });
      // location.reload();
      // this.$socket.io.opts.query = { token: "" };
      // this.$router.push("/login");
      this.$socket.io.opts.query = { token: "" };
      location.reload();
    },
  },
  async created() {},
};
</script>

<style>
#particles-js {
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.q-drawer {
  background-image: url("https://cyberdownload.anrunlu.net/dengta.jpg") !important;
  background-size: cover !important;
}

.drawer_normal {
  background-color: rgba(1, 1, 1, 0.4);
}

.drawer_dark {
  background-color: #010101f2;
}

.navigation-item {
  border-radius: 5px;
}

.tab-active {
  background-color: green;
}

body {
  background: #f1f1f1 !important;
}

.header_normal {
  background: linear-gradient(
    145deg,
    rgb(32, 106, 80) 15%,
    rgb(21, 57, 102) 70%
  );
}

.header_dark {
  background: linear-gradient(145deg, rgb(61, 14, 42) 15%, rgb(14, 43, 78) 70%);
}
.error {
  font-weight: bold;
  color: red;
}
.cameraMessage {
  width: 100%;
  height: 60px;
}
.qr-scanner {
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    );
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #1110;
}
.qr-scanner .box {
  width: 213px;
  height: 213px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
}
.qr-scanner .txt {
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  text-align: center;
  /* color: #f9f9f9; */
  margin: 0 auto;
  position: absolute;
  top: 70%;
  left: 0;
}
.qr-scanner .myQrcode {
  text-align: center;
  color: #00ae10;
}
.qr-scanner .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

.qr-scanner .box:after,
.qr-scanner .box:before,
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;

  border: 0.2rem solid transparent;
}

.qr-scanner .box:after,
.qr-scanner .box:before {
  top: 0;
  border-top-color: #00ff33;
}

.qr-scanner .angle:after,
.qr-scanner .angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.qr-scanner .box:before,
.qr-scanner .angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.qr-scanner .box:after,
.qr-scanner .angle:after {
  right: 0;
  border-right-color: #00ff33;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
