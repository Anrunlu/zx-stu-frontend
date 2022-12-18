<template>
  <!-- 添加课程 -->
  <q-card style="width: 500px; max-width: 80vw">
    <!-- 标题栏 -->
    <CardBar title="添加课程" icon="class" />

    <q-card-section>
      <q-select
        square
        outlined
        use-input
        dense
        @filter="filterFnForAddCourse"
        v-model="currSelectCourseForAddTeaCourse"
        :options="filteredCourseList"
        option-label="name"
        option-value="_id"
        label="请选择课程"
        :rules="[(val) => !!val || '这是必填项']"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="class" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        icon="done"
        label="确定"
        color="primary"
        @click="handleAddTeaCourse"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { apiCreateTeaCourse, apiGetCourses } from "src/api/teacher/course";
import { mapGetters } from "vuex";
export default {
  name: "AddTeaCourseCard",
  props: {},

  data() {
    return {
      currSelectCourseForAddTeaCourse: null,
      filteredCourseList: [],
      courseList: [],
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
    }),
  },

  methods: {
    // 获取课程列表
    async getCourses() {
      const { data } = await apiGetCourses();
      this.courseList = data.data.courses;
      this.filteredCourseList = data.data.courses;
    },

    // 添加teaCourse
    async handleAddTeaCourse() {
      // 判断是否选择了课程
      if (!this.currSelectCourseForAddTeaCourse) {
        this.$q.notify({
          message: "请选择课程",
          type: "warning",
        });
        return;
      }

      // 判断是否已经添加了该课程
      const isExist = this.teaCourseList.some(
        (item) => item.courseId === this.currSelectCourseForAddTeaCourse._id
      );
      if (isExist) {
        this.$q.notify({
          message: "添加失败，该课程已存在",
          type: "negative",
        });
        return;
      }

      // 发送添加请求
      const { data } = await apiCreateTeaCourse({
        course_id: this.currSelectCourseForAddTeaCourse._id,
      });

      this.$q.notify({
        message: `添加课程成功`,
        type: "positive",
        timeout: 300,
      });

      // 刷新页面
      this.currSelectCourseForAddTeaCourse = null;
      this.$store.dispatch("teaCourse/getTeaCourseInfo");
    },

    // 添加课程选择框选项过滤函数
    filterFnForAddCourse(val, update) {
      if (val === "") {
        update(async () => {
          await this.getCourses();
          this.filteredCourseList = this.courseList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredCourseList = this.courseList.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },

  created() {
    this.getCourses();
  },
};
</script>
