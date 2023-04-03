<template>
  <q-page>
    <div class="row q-gutter-md q-my-sm justify-center">
      <div
        class="col-11 col-md-3"
        v-for="(c, i) in courseList"
        :key="i"
        @click="toHomework(c)"
      >
        <q-card :class="isWHH ? 'course-card-whh' : 'course-card'">
          <q-card-section class="text-h3"> {{ c.name }} </q-card-section>
          <q-card-section>
            <q-avatar
              size="40px"
              :color="isWHH ? 'red-2' : 'primary'"
              text-color="white"
            >
              <img v-if="c.teacherAvatar" :src="c.teacherAvatar" />
              <span v-else>{{ c.teacherName.slice(0, 1) }}</span>
            </q-avatar>
            <q-badge color="white" class="q-ml-sm text-black">{{
              c.teacherName
            }}</q-badge>
            <span class="float-right q-mt-sm"
              >剩余作业
              <q-icon v-if="!c.unfinishedHomework" name="more_horiz"></q-icon>
              <q-badge
                v-else
                :color="c.unfinishedHomeworkNum == 0 ? 'green' : 'red'"
                class="q-ml-sm"
                >{{ c.unfinishedHomeworkNum }}</q-badge
              >
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="courseList.length == 0 && dataLodingFinished">
      <div class="row q-mt-lg text-grey justify-center">
        <span class="text-h3 text-center">本学期暂无课程</span>
      </div>
      <div class="row justify-center q-ma-md">
        <q-btn
          class="q-mb-md"
          color="primary"
          icon="event_repeat"
          label="切换学期"
          @click="changeTermDig = true"
        />
      </div>
    </div>
    <!-- 切换学期对话框 -->
    <q-dialog v-model="changeTermDig" persistent>
      <ChangeTermCard />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Index",
  data() {
    return {
      changeTermDig: false,
      dataLodingFinished: false,
    };
  },

  components: {
    ChangeTermCard: () => import("src/components/common/ChangeTermCard.vue"),
  },

  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
    ...mapGetters("user", {
      isWHH: "isWHH",
      nickname: "nickname",
      username: "username",
    }),
  },

  methods: {
    //跳转作业
    toHomework(c) {
      this.$router.push({ path: "/homework" });
      //设置当先选择课程
      this.$store.commit("student/setCurrSelectedCourse", c);
    },

    // 获取课程
    async handleGetCourse() {
      await this.$store.dispatch("student/getCourseList");
      setTimeout(() => {
        this.dataLodingFinished = true;
      }, 1000);
    },
  },
  created() {
    this.handleGetCourse();
    if (this.username === "2021412984" && this.nickname === "王寒寒") {
      this.$store.commit("user/setIsWHH", true);
    }
  },
  // mounted() {
  //   GetUserIP((ip) => {
  //     if (ip == "10.22.1.105") {
  //       this.$store.commit("user/setIsWHH", true);
  //     }
  //   });
  // },
};
</script>
<style scoped>
.course-card {
  min-height: 150px;
  color: #fff;
  border: none;
  /* background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important; */
  background-image: linear-gradient(
    to bottom right,
    #4facfe 0%,
    #00f2fe 100%
  ) !important;
}

.course-card-whh {
  /* whh定制 */
  min-height: 150px;
  color: #fff;
  border: none;
  /* background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important; */
  background-image: url(https://cyberdownload.anrunlu.net/FmMvPHDqJ6iqPpRCJWjZHTHGZbNT);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 20% 40%;
}
.course-card:hover {
  background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important;
  cursor: pointer;
}
</style>
