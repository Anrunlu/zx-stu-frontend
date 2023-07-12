<template>
  <q-page>
    <q-table
      flat
      :card-class="isWHH ? 'bg-red-1' : ''"
      :data="courseMindList"
      :columns="courseMindColumns"
      row-key="_id"
      @row-click="handleCourseMindClick"
      :pagination="tablePagination"
      :dense="$q.platform.is.mobile ? false : true"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
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
            </q-list>
          </q-btn-dropdown>
          <!-- 选择导图类型 -->
          <q-btn-dropdown
            v-if="currSelectedCourse"
            :icon="
              currSelectedCategory.icon
                ? currSelectedCategory.icon
                : 'touch_app'
            "
            :label="
              !currSelectedCategory.value
                ? '导图类型'
                : currSelectedCategory.label
            "
            :color="isWHH ? 'pink-5' : 'positive'"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                :class="isWHH ? 'list' : ''"
                @click="handleChangecourseMindCategory(category)"
                :key="index"
                v-for="(category, index) in courseMindCategoryOptions"
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

      <template v-slot:top-right="props">
        <q-btn
          v-if="!$q.platform.is.mobile"
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
import { formatTimeWithWeekDay } from "src/utils/time";
import { mapGetters } from "vuex";
export default {
  name: "StudyGraph",
  data() {
    return {
      // 当前选中的导图分类
      currSelectedCategory: { value: "", label: "", icon: "" },
      // 导图列表
      courseMindList: [],
      // 导图列表表头
      courseMindColumns: [
        {
          name: "shortId",
          label: "导图编号",
          align: "left",
          field: (row) => getObjectShortId(row),
          sortable: true,
        },
        {
          name: "title",
          label: "导图标题",
          field: "title",
          align: "left",
          sortable: true,
        },
        {
          name: "description",
          label: "导图描述",
          field: "description",
          align: "center",
          sortable: true,
        },
        {
          name: "creator",
          label: "创建者",
          align: "center",
          field: (row) => row.creator.nickname,
          sortable: true,
        },
        {
          name: "updatedAt",
          label: "创建/更新时间",
          align: "center",
          field: (row) => formatTimeWithWeekDay(row.updatedAt),
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      courseMindCategoryOptions: "courseMindCategoryOptions",
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
    // 获取导图列表
    async getCourseMindList() {},

    //获取所有课程
    async handleGetAllCourse() {
      await this.$store.dispatch("student/getCourseList");
    },

    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
    },

    //点击图谱某一行
    handleCourseMindClick() {},

    // 处理导图分类选项改变
    handleChangecourseMindCategory(category) {
      if (category.value === "知识图谱") {
        // 跳转到知识图谱页面，新页面打开

        const routeData = this.$router.resolve(
          `/course_graph/${this.currSelectedCourse._id}`
        );
        window.open(routeData.href, "_blank");
        return;
      }

      if (category.value === "课程大纲") {
        // 跳转到课程大纲页面，新页面打开

        const routeData = this.$router.resolve(
          `/course_mind/${this.currSelectedCourse._id}`
        );
        window.open(routeData.href, "_blank");
        return;
      }
      this.currSelectedCategory = category;
      this.getCourseMindList();
    },
  },
  watch: {
    currSelectedCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.courseList = [];
        }
      },
      deep: true,
    },
  },

  created() {
    this.handleGetAllCourse();
  },
};
</script>

<style>
.list {
  background-color: rgb(255, 255, 179);
}
</style>
