<template>
  <q-layout view="hHh Lpr lff" :class="isWHH ? 'bg-red-1' : 'bg-grey-1'">
    <!-- 头部 -->
    <q-header
      elevated
      :class="isWHH ? 'bg-red-2 text-grey-8' : 'bg-white text-grey-8'"
      height-hint="64"
    >
      <!-- 头部工具栏 -->
      <q-toolbar class="GPL__toolbar" style="height: 50px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title shrink class="row items-center no-wrap">
          <img src="~assets/studentLogo.png" width="130" />
          <span class="q-ml-sm" v-if="$q.screen.gt.sm"
            ><q-btn
              color="gray"
              flat
              :label="termName"
              @click="handleChangeTermBtnClick"
            >
              <q-tooltip> 切换学期 </q-tooltip>
            </q-btn></span
          >
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="pink-4"
            icon="color_lens"
            @click="hanldeChangeThemeClick"
          >
            <q-tooltip>主题测试</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="notifications"
            to="notice"
          >
            <q-badge
              v-if="unreadAnnouncementCount > 0"
              color="red"
              text-color="white"
              floating
            >
              {{ unreadAnnouncementCount }}
            </q-badge>
            <q-tooltip>{{
              unreadAnnouncementCount > 0
                ? `${unreadAnnouncementCount}消息未读`
                : "暂未消息"
            }}</q-tooltip>
          </q-btn>

          <q-btn dense flat no-wrap>
            <q-avatar rounded size="25px" color="primary" text-color="white">
              <img v-if="avatar" :src="avatar" />
              <span v-else>{{ nickname.slice(0, 1) }}</span>
            </q-avatar>
            <q-icon name="arrow_drop_down" size="16px" />

            <q-menu auto-close>
              <q-list dense>
                <q-item class="GPL__menu-link-signed-in">
                  <q-item-section>
                    <div>
                      <strong>{{ nickname }}</strong>
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable class="GPL__menu-link">
                  <q-item-section @click="$router.push('profile')">
                    个人设置</q-item-section
                  >
                </q-item>
                <q-item clickable class="GPL__menu-link">
                  <q-item-section @click="logout">退出登录</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- 抽屉 -->
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!leftDrawerOpen || miniState"
      elevated
      :width="210"
      :breakpoint="500"
      @click.capture="drawerClick"
      side="left"
    >
      <q-scroll-area :class="isWHH ? 'bg-red-2 fit' : 'fit'">
        <q-list padding>
          <q-item
            v-for="link in links1"
            :key="link.label"
            :to="link.to"
            clickable
            exact
            :active-class="isWHH ? 'bg-pink-3' : 'bg-white text-blue'"
            v-ripple.early
            :href="link.href"
            @click="handleLinkClick(link)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.label }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links2"
            :key="link.label"
            :to="link.to"
            clickable
            exact
            v-ripple.early
            :active-class="isWHH ? 'bg-pink-3' : 'bg-white text-blue'"
            :href="link.href"
            @click="handleLinkClick(link)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.label }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item
            v-for="link in links3"
            :key="link.label"
            :to="link.to"
            clickable
            exact
            v-ripple.early
            :active-class="isWHH ? 'bg-pink-3' : 'bg-white text-blue'"
            :href="link.href"
            @click="handleLinkClick(link)"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -10px">
        <q-btn
          dense
          round
          unelevated
          :color="isWHH ? 'pink-5' : 'primary'"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
    </q-drawer>

    <!-- 主体 -->
    <q-page-container class="GPL__page-container">
      <router-view />
      <q-page-sticky
        v-if="$q.screen.gt.sm"
        position="bottom-right"
        :offset="[10, 88]"
      >
        <q-btn round color="accent" icon="o_forum" href="https://bbs.z-xin.net">
          <q-tooltip> 知新社区 </q-tooltip>
        </q-btn>
      </q-page-sticky>
    </q-page-container>

    <!-- 切换学期对话框 -->
    <q-dialog v-model="changeTermDig" persistent>
      <ChangeTermCard />
    </q-dialog>

    <!-- 实时通知组件 -->
    <ImmediatelyAncmt />
  </q-layout>
</template>

<script>
import { openAuthedSocket } from "src/utils/socketio";
import { mapGetters } from "vuex";
import Tucao from "src/utils/tucao";
export default {
  data() {
    return {
      miniState: false,
      leftDrawerOpen: true,
      changeTermDig: false,
      search: "",
      createMenu: [
        { icon: "topic", text: "试题集", to: "questionSet/create" },
        { icon: "work", text: "作业" },
      ],
    };
  },

  components: {
    ImmediatelyAncmt: () =>
      import("src/components/common/ImmediatelyAncmt.vue"),
    ChangeTermCard: () => import("src/components/common/ChangeTermCard.vue"),
  },

  computed: {
    ...mapGetters("user", {
      userId: "userId",
      username: "username",
      nickname: "nickname",
      avatar: "avatar",
      officeName: "officeName",
      termName: "termName",
      unreadAnnouncementCount: "unreadAnnouncementCount",
      isWHH: "isWHH",
    }),

    ...mapGetters("settings", {
      links1: "layoutLeftDrawerLinks1",
      links2: "layoutLeftDrawerLinks2",
      links3: "layoutLeftDrawerLinks3",
    }),
  },

  methods: {
    // 退出登录
    async logout() {
      await this.$store.dispatch("user/logout");
      // 退出登录后，关闭socket连接
      this.$socket.close();
      // 跳转到登录页面
      setTimeout(() => {
        this.$router.push("/login");
      }, 1500);
    },

    // 点击抽屉
    drawerClick(e) {
      if (this.miniState) {
        this.miniState = false;
        e.stopPropagation();
      }
    },

    // 点击切换学期
    handleChangeTermBtnClick() {
      this.changeTermDig = true;
    },

    // 点击切换布局
    handleChangeLayout() {
      // setLayout();
      // // 刷新页面
      // window.location.reload();
    },

    // 点击链接
    handleLinkClick(link) {
      if (link.href && link.label === "问题反馈") {
        const payload = {
          // nickname,avatar,openid 必填
          nickname: this.nickname,
          avatar: this.avatar,
          openid: this.userId,
        };
        const productId = "450375";
        Tucao.request(productId, payload);
      }
    },

    //切换主题
    hanldeChangeThemeClick() {
      this.$store.commit("user/setIsWHH", !this.isWHH);
    },
  },

  sockets: {
    // socket连接成功
    connect() {
      console.log("socket已连接");
    },
  },

  created() {
    // 建立socket连接
    openAuthedSocket(this);

    // 如果是移动端，自动折叠抽屉
    if (this.$q.platform.is.mobile) {
      this.leftDrawerOpen = false;
    }
  },
};
</script>

<style lang="sass">
.q-router-link--active
  background-color:#e4eceb
.GPL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__menu-link:hover
    background: #0366d6
    color: white
  &__menu-link-signed-in
  &__menu-link-status
    &:hover
      & > div
        background: white !important
  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
</style>
