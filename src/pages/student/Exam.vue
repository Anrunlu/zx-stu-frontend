<template>
  <q-page class="q-pa-sm">
    <div class="q-mx-sm">
      <div class="q-gutter-sm row">
        <!-- 选择课程 -->
        <q-btn-dropdown
          :label="!currSelectedCourse ? '选择课程' : currSelectedCourse.name"
          :color="isWHH ? 'pink-3' : 'primary'"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              :class="isWHH ? 'list' : ''"
              @click="handleChangeOptCourse(course)"
              :key="index"
              v-for="(course, index) in courseList"
            >
              <q-item-section>
                <q-item-label>{{ course.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list></q-btn-dropdown
        >
        <!-- 选择考试类型 -->
        <q-btn-dropdown
          v-if="currSelectedCourse"
          :icon="
            currSelectedExamCategory.icon
              ? currSelectedExamCategory.icon
              : 'touch_app'
          "
          :label="
            !currSelectedExamCategory.value
              ? '作业类型'
              : currSelectedExamCategory.label
          "
          :color="isWHH ? 'pink-5' : 'positive'"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              :class="isWHH ? 'list' : ''"
              @click="handleChangeHomeworkCategory(category)"
              :key="index"
              v-for="(category, index) in examCategoryOptions"
            >
              <q-item-section avatar>
                <q-icon :name="category.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ category.label }}
                  <q-icon
                    v-if="unFinishedHwkType.indexOf(category.value) != -1"
                    name="sentiment_very_dissatisfied"
                    color="red-5"
                    size="xs"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <!-- 主体部分 -->
    <div v-if="examList.length != 0 && currSelectedCourse">
      <div class="row q-gutter-sm q-ma-sm justify-center q-my-xl">
        <div class="col-11 col-md-6" v-for="(con, i) in examList" :key="i">
          <q-card class="course-card shadow-4 biggestBox">
            <q-card-section style="color: black">
              <q-card-section class="justify-center row">
                <q-btn color="indigo-5" no-caps>{{ con.category }}</q-btn>
              </q-card-section>
              <q-card-section class="col-11 col-md-5 justify-center">
                <q-card-section class="justify-center row">
                  <q-icon name="swap_horiz" size="1.2rem" />
                  <div class="row justify-center" color="primary" disable>
                    考生须知
                  </div>
                  <q-icon name="swap_horiz" size="1.2rem" />
                </q-card-section>
                <div class="row justify-center">
                  考生在考场内必须严格遵守考场纪律，对于违反考场规定者，取消当次考试成绩。
                </div>
              </q-card-section>
            </q-card-section>
            <q-card-section class="justify-center row" style="color: #4182fa">
              <q-icon name="keyboard_arrow_right" size="1.1rem" />
              开始时间：{{ con.starttime }}
            </q-card-section>
            <q-card-section class="justify-center row" style="color: #4182fa">
              <q-icon name="keyboard_arrow_right" size="1.1rem" />
              截止时间：{{ con.endtime }}
            </q-card-section>
            <q-card-section class="justify-center row">
              <q-btn
                style="color: white"
                color="red-5"
                label="开始考试"
                icon-right="send"
                @click="handleExamClick(con)"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div v-if="examList.length === 0 && currSelectedCourse">
      <div class="row q-gutter-sm q-ma-sm justify-center q-my-xl">
        <div class="col-11 col-md-6">
          <q-card class="course-card shadow-4 biggestBoxBottom">
            <div class="biggerBox">
              <div style="margin-top: 100px"></div>
              暂无考试安排，好好复习。
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <!-- <CountdownTime v-slot="timeObj" :time="100">
      <div class="count-down">
        <div class="icon"></div>
        {{ timeObj.hh }}:{{ timeObj.mm }}:{{ timeObj.ss }}
      </div>
    </CountdownTime> -->
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { getObjectShortId } from "src/utils/common";
import { apiGetHomeworks } from "src/api/student/homework";
import { formatTimeWithWeekDay } from "src/utils/time";
export default {
  name: "Exam",
  data() {
    return {
      tableLoading: true,
      // 当前选中的作业分类
      currSelectedExamCategory: { value: "", label: "", icon: "" },
      // 作业列表
      examList: [],
      pagination: {
        rowsPerPage: 0,
      },
      optCourse: "", //当前选择的课程
    };
  },
  // components: {
  //   CountdownTime: () =>
  //     import("src/components/student/studentExam/CountdownTime.vue"),
  // },
  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      examCategoryOptions: "examCategoryOptions",
    }),
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
    // 处理点击开始考试
    handleExamClick(con) {
      this.$router.push(`/examdetails/${con._id}`);
    },

    //获取所有课程
    async handleGetAllCourse() {
      await this.$store.dispatch("student/getCourseList");
    },
    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
      this.handleGetAllCourseTypeHomeworks();
      // 如果当前选中的作业分类不为空，则重新获取作业列表
      if (this.currSelectedExamCategory.value) {
        this.handleGetHomeworks(this.currSelectedExamCategory.value);
      }
    },
    //获取该课程所有类型未完成作业
    async handleGetAllCourseTypeHomeworks() {
      //获取存在未完成作业类型
      this.unFinishedHwkType = [];
      this.examCategoryOptions.forEach(async (element) => {
        const { data } = await apiGetHomeworks({
          tcc_id: this.currSelectedCourse.id,
          category: element.value,
          student_id: this.$store.getters["user/studentId"][0]._id,
        });

        if (data.data.length != 0) {
          data.data.forEach((ele) => {
            if (!ele.studentHomework) {
              this.unFinishedHwkType.push(element.value);
            } else {
              if (ele.studentHomework.answerProgress != 1) {
                this.unFinishedHwkType.push(element.value);
              }
            }
          });
        }
      });
      this.unFinishedHwkType = [...new Set(this.unFinishedHwkType)];
    },

    //获取课程单一类型作业信息
    async handleGetHomeworks() {
      if (this.currSelectedCourse === null) {
        return;
      }
      this.examList = [];
      this.handleGetAllCourseTypeHomeworks();
      const payload = {
        tcc_id: this.currSelectedCourse.id,
        category: this.currSelectedExamCategory.value,
        student_id: this.$store.getters["user/studentId"][0]._id,
      };
      const { data } = await apiGetHomeworks(payload);
      if (data.code === 2000) {
        data.data.forEach((element) => {
          element.readyToShowTccHmwProgress = false;
          element.tccHmwProgress = "0";
          element.shortId = getObjectShortId(element);
          element.isEnd = false;
          let now = new Date();
          if (element.studentHomework && element.studentHomework.endtime) {
            let end = new Date(element.studentHomework.endtime);
            let d = end.getTime() - now.getTime();
            if (d < 0) {
              //已截止
              element.isEnd = true;
            }
            element.endtime = formatTimeWithWeekDay(
              element.studentHomework.endtime
            );
          } else {
            let end = new Date(element.endtime);
            let d = end.getTime() - now.getTime();
            if (d < 0) {
              //已截止
              element.isEnd = true;
            }
            element.endtime = formatTimeWithWeekDay(element.endtime);
            element.starttime = formatTimeWithWeekDay(element.starttime);
          }
        });
        this.examList = data.data;
      }
    },

    // 处理作业分类选项改变
    handleChangeHomeworkCategory(category) {
      this.currSelectedExamCategory = category;
      // 写入路由
      this.$router.push({
        path: "/exam",
        query: {
          category: category.value,
        },
      });
      this.handleGetHomeworks();
    },
  },
  watch: {
    currSelectedCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.examList = [];
        }
      },
      deep: true,
    },
  },
  created() {
    this.handleGetAllCourse();
    // 获取路由 query 参数
    const { category } = this.$route.query;
    // 如果有 category 参数，则设置当前选中的作业分类
    if (category) {
      this.currSelectedExamCategory = this.examCategoryOptions.find(
        (item) => item.value === category
      );
    } else {
      // 否则设置为默认值
      this.currSelectedExamCategory = this.examCategoryOptions[0];
    }
    this.handleGetHomeworks();
  },
};
</script>

<style scoped>
.bacolor {
  background-color: #f5f5f5;
}
.biggestBox {
  background-image: url(https://cyberdownload.anrunlu.net/FtD8JJ5QrfIrC1JTtI6DHd8FdYlF);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.biggestBoxBottom {
  background-image: url(https://cyberdownload.anrunlu.net/FsSKRCDr3w9-3s1hykkoyK15QEka);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
}
.biggerBox {
  height: 450px;
  color: #fff;
  text-align: center;
  font-size: 3rem;
  overflow: hidden;
  font-family: "LiSu";
}
</style>
