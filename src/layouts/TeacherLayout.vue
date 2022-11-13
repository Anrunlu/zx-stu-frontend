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
        <q-toolbar-title>知新教师端</q-toolbar-title>
        <q-btn
          class="q-mr-xs"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
        <q-btn flat round dense icon="notifications" class="q-mr-xs" />
        <q-btn flat round dense icon="exit_to_app" @click="logout" />
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
              <img :src="avatar" />
            </q-avatar>
            <div class="q-ml-md text-center">
              <q-toolbar-title> {{ nickname }} </q-toolbar-title>
              <div
                class="text-overline q-ma-none q-pa-none"
                style="line-height: 1rem; color: #f2d541"
              >
                {{ username }}
              </div>
              <div
                class="text-overline q-ma-none q-pa-none"
                style="line-height: 1rem; color: #f29f05"
              >
                {{ officeName }}
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
                to="course"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="folder_shared" />
                </q-item-section>

                <q-item-section> 课程管理 </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                to=""
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
                  <q-icon name="forum" size="sm" />
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
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isShowScan: false,
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

  computed: {
    ...mapGetters("user", {
      username: "username",
      nickname: "nickname",
      avatar: "avatar",
      officeName: "officeName",
    }),
  },

  methods: {
    // 退出登录
    async logout() {
      await this.$store.dispatch("user/userLogout");
      this.$q.notify({
        message: "退出成功",
        color: "positive",
        icon: "fas fa-check",
      });
      this.$router.push(`/login`);
    },
  },
  async created() {},
};
</script>

<style>
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
</style>
