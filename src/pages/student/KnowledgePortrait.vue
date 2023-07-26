<template>
  <q-page>
    <q-table
      flat
      :card-class="isWHH ? 'bg-red-1' : ''"
      :data="knowledgeList"
      :columns="columns"
      row-key="_id"
      :pagination="tablePagination"
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
        </div>
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
import { apiGetStuKnowledgeScoreByCourse } from "src/api/student/knowledeg";
import { mapGetters } from "vuex";
export default {
  name: "KnowledgePortrait",
  data() {
    return {
      tableLoading: true,
      pagination: {
        rowsPerPage: 0,
      },
      filter: "",
      optResourceType: "",
      optCourse: "", //当前选择的课程
      knowledgeList: [],
      iconList: [],
      columns: [
        {
          name: "name",
          label: "知识点",
          field: "name",
          align: "center",
          sortable: true,
        },

        {
          name: "masterLevel",
          label: "掌握程度",
          field: "masterLevel",
          align: "center",
          sortable: true,
        },
        // {
        //   name: "action",
        //   align: "center",
        //   label: "操作",
        // },
      ],
    };
  },

  computed: {
    ...mapGetters("student", ["courseList", "currSelectedCourse"]),
    ...mapGetters("settings", ["tableDense", "tablePagination"]),
    ...mapGetters("user", ["isWHH", "studentId"]),
  },

  methods: {
    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
      this.getKnowledgeScore();
    },

    //获取知识点掌握情况
    async getKnowledgeScore() {
      const payload = {
        course_id: this.currSelectedCourse._id,
        student_id: this.studentId,
      };
      const { data } = await apiGetStuKnowledgeScoreByCourse(payload);
      const knowledgeList = data.data.map(
        ({ totalGetScore, totalOriginScore, _id }) => {
          const masterLevel = (totalGetScore / totalOriginScore) * 100;
          return {
            ..._id,
            masterLevel,
          };
        }
      );
      this.knowledgeList = knowledgeList;
    },
  },

  created() {
    this.$store.dispatch("student/getCourseList");
  },
};
</script>

<style scoped>
.list {
  background-color: rgb(255, 255, 179);
}
</style>
