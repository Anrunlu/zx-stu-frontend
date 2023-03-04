<template>
  <q-page>
    <q-table
      flat
      :data="homeworkList"
      :columns="homeworkColumns"
      row-key="_id"
      @row-click="handleHomeworkClick"
      :pagination="tablePagination"
      :dense="tableDense"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <!-- 选择课程 -->
          <q-btn-dropdown
            :label="!currSelectedCourse ? '选择课程' : currSelectedCourse.name"
            color="primary"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeOptCourse(course)"
                :key="index"
                v-for="(course, index) in courseList"
              >
                <q-item-section>
                  <q-item-label>{{ course.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 选择作业类型 -->
          <q-btn-dropdown
            v-if="currSelectedCourse"
            :icon="
              currSelectedCategory.icon
                ? currSelectedCategory.icon
                : 'touch_app'
            "
            :label="
              !currSelectedCategory.value
                ? '作业类型'
                : currSelectedCategory.label
            "
            color="positive"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeHomeworkCategory(category)"
                :key="index"
                v-for="(category, index) in courseTypeList"
              >
                <q-item-section avatar>
                  <q-icon :name="category.icon" />
                </q-item-section>
                <q-item-section>
                  {{ category.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </template>

      <template v-slot:body-cell-shortId="props">
        <q-td :props="props">
          <q-icon name="fingerprint" size="xs" color="grey-6" />{{
            props.row.shortId
          }}
        </q-td>
      </template>

      <template v-slot:top-right="props">
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "退出全屏" : "全屏"
          }}</q-tooltip>
        </q-btn>
      </template>

      <!-- 时间状态 -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            square
            size="sm"
            :icon="props.row.isEnd === true ? 'alarm_off' : 'alarm'"
            :color="props.row.isEnd === true ? 'grey-4' : 'positive'"
            :text-color="props.row.isEnd === true ? 'grey' : 'white'"
            dense
            :label="props.row.isEnd === true ? '已截止' : '未截止'"
          />

          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
            :label="props.row.endtime"
          >
            截止时间{{ props.row.endtime }}
          </q-tooltip>
        </q-td>
      </template>

      <!-- 完成状态 -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-chip
              v-if="
                props.row.studentHomework == null ||
                (props.row.studentHomework.answerProgress === 0 &&
                  props.row.isEnd === true)
              "
              flat
              dense
              size="sm"
              color="red"
              icon="work"
              label="未作答"
              text-color="white"
            ></q-chip>
            <q-btn
              v-else-if="
                props.row.studentHomework == null ||
                (props.row.studentHomework.answerProgress === 0 &&
                  props.row.isEnd === false)
              "
              flat
              dense
              size="md"
              color="primary"
              icon="work"
              label="未作答"
            ></q-btn>
            <q-chip
              v-else-if="
                props.row.studentHomework.answerProgress < 1 &&
                props.row.isEnd === false
              "
              flat
              dense
              size="sm"
              color="primary"
              icon="pending"
              text-color="white"
              :label="
                '已完成(' +
                (props.row.studentHomework.answerProgress * 100).toFixed(0) +
                '%)'
              "
            ></q-chip>
            <q-chip
              v-else-if="
                props.row.studentHomework.answerProgress < 1 &&
                props.row.isEnd === true
              "
              flat
              dense
              size="sm"
              color="primary"
              icon="work"
              text-color="white"
              :label="
                '仅完成(' +
                (props.row.studentHomework.answerProgress * 100).toFixed(0) +
                '%)'
              "
            ></q-chip>
            <q-chip
              v-else
              flat
              dense
              size="sm"
              color="positive"
              icon="fas fa-award"
              label="已完成"
              text-color="white"
            ></q-chip>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6"> 暂无数据 </span>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { getObjectShortId } from "src/utils/common";
import { apiGetHomeworks } from "src/api/student/homework";
import { formatTimeWithWeekDay } from "src/utils/time";
import { mapGetters } from "vuex";
export default {
  name: "Homework",
  data() {
    return {
      // 当前选中的作业分类
      currSelectedCategory: { value: "", label: "", icon: "" },
      // 作业列表
      homeworkList: [],
      // 作业列表表头
      homeworkColumns: [
        {
          name: "shortId",
          label: "作业编号",
          align: "left",
          field: "shortId",
          sortable: true,
        },
        {
          name: "title",
          label: "作业名",
          align: "center",
          field: "title",
          sortable: true,
        },
        {
          name: "endtime",
          label: "截止时间",
          align: "center",
          field: "endtime",
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: "状态",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "进度",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      courseTypeList: "homeworkCategoryOptions",
    }),
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
  },
  methods: {
    // 处理点击作业列表中的某一行
    handleHomeworkClick(evt, row) {
      this.$router.push(`/student/homeworkdetails/${row._id}`);
    },

    //获取所有课程
    async handleGetAllCourse() {
      await this.$store.dispatch("student/getCourseList");
    },

    //获取课程类型作业信息
    async handleGetHomeworks() {
      this.homeworkList = [];
      const payload = {
        tcc_id: this.currSelectedCourse.id,
        category: this.currSelectedCategory.value,
        student_id: this.$store.getters["user/studentId"][0]._id,
      };
      const { data } = await apiGetHomeworks(payload);
      if (data.code === 2000) {
        data.data.forEach((element) => {
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
          }
        });
        this.homeworkList = data.data;
        // 添加课程与作业类型进LocalStorage
        localStorage.setItem("course", JSON.stringify(this.optCourse));
        localStorage.setItem(
          "homeworkType",
          JSON.stringify(this.optHomeworkType)
        );
      }
    },
    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
      // 如果当前选中的作业分类不为空，则重新获取作业列表
      if (this.currSelectedCategory.value) {
        this.handleGetHomeworks(this.currSelectedCategory.value);
      }
    },
    // 处理作业分类选项改变
    handleChangeHomeworkCategory(category) {
      this.currSelectedCategory = category;
      this.handleGetHomeworks();
    },
  },
  watch: {
    currSelectedCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.homeworkList = [];
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
      this.currSelectedCategory = this.homeworkCategoryOptions.find(
        (item) => item.value === category
      );
    } else {
      // 否则设置为默认值
      this.currSelectedCategory = this.courseTypeList[2];
    }
    this.handleGetHomeworks();
  },
};
</script>

<style></style>
