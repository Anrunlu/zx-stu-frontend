<template>
  <q-page class="q-pa-sm">
    <div class="q-pa-sm">
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
              v-for="(item, index) in courseList"
              :key="index"
              @click="
                (optCourse = item), (optResourceType = ''), (resourceList = [])
              "
            >
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list></q-btn-dropdown
        >
        <!-- 选择资源类型 -->
        <q-btn-dropdown
          v-if="optCourse"
          color="positive"
          dropdown-icon="change_history"
          :label="optResourceType ? optResourceType : '请选择资源类型'"
        >
          <!-- dropdown-icon标签是后面的三角符号 -->
          <q-list>
            <!-- 调入接口遍历内容并显示 -->
            <q-item
              clickable
              v-close-popup
              @click="(optResourceType = item), handleGetTeacherSource()"
              v-for="(item, index) in courseTypeList"
              :key="index"
            >
              <q-item-section>
                <q-item-label>
                  {{ item }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Resources",
  data() {
    return {
      tableLoading: true,
      pagination: {
        rowsPerPage: 0,
      },
      // 考试类型：
      courseTypeList: [
        //考试类型列表
        "期中考试",
        "期末考试",
      ],
      optResourceType: "",
      optCourse: "", //当前选择的课程
      resourceList: [],
    };
  },
  computed: {
        ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      homeworkCategoryOptions: "homeworkCategoryOptions",
    }),
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
  },
  methods:{
    //获取所有课程
    async handleGetAllCourse() {
      await this.$store.dispatch("student/getCourseList");
    },
  },
  created() {
    this.handleGetAllCourse();
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
    #4facfe 0%,
    #00f2fe 100%
  ) !important; */
}
.course-card:hover {
  cursor: pointer;
}
</style>
