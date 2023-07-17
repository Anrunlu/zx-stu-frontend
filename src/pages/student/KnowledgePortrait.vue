<template>
  <q-page>
    <q-table
      flat
      :card-class="isWHH ? 'bg-red-1' : ''"
      :data="resourceList"
      :columns="columns"
      row-key="_id"
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
      resourceList: [],
      iconList: [],
      columns: [

        {
          name: "filename",
          label: "知识点",
          field: "filename",
          align: "center",
          sortable: true,
        },

        {
          name: "createdAt",
          label: "上传时间",
          field: "createdAt",
          align: "center",
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

  methods: {
    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
    },
  },
  computed: {
    ...mapGetters("student", ["courseList", "currSelectedCourse"]),
    ...mapGetters("settings", ["tableDense", "tablePagination"]),
    ...mapGetters("user", ["isWHH"]),
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
