<template>
  <q-page>
    <div class="row q-gutter-md q-ma-sm justify-center">
      <div
        class="col-11 col-md-3"
        v-for="(c, i) in courseList"
        :key="i"
        @click="toHomework(c)"
      >
        <q-card class="course-card shadow-4">
          <q-card-section class="text-h3"> {{ c.name }} </q-card-section>
          <q-card-section>
            <q-avatar size="40px" color="primary" text-color="white">
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
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Index",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
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
    },
  },
  created() {
    this.handleGetCourse();
  },
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
.course-card:hover {
  background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important;
  cursor: pointer;
}
</style>
