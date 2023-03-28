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
          <!-- 选择资源类型 -->
          <q-btn-dropdown
            v-if="currSelectedCourse"
            :label="
              optResourceType.label ? optResourceType.label : '请选择资源类型'
            "
            :color="isWHH ? 'pink-5' : 'positive'"
            :icon="optResourceType.icon ? optResourceType.icon : 'touch_app'"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                :class="isWHH ? 'list' : ''"
                @click="(optResourceType = item), handleGetTeacherSource()"
                :key="index"
                v-for="(item, index) in courseTypeList"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ item.value }}</q-item-label>
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

      <template v-slot:body-cell-shortId="props">
        <q-td :props="props" class="cursor-pointer">
          <q-icon name="fingerprint" size="xs" color="grey-6" />{{
            props.row.shortId
          }}
        </q-td>
      </template>

      <template v-slot:body-cell-filename="props">
        <q-td :props="props">
          <q-icon
            :name="`fa-regular ${props.row.resourceTypeAndIcon.icon}`"
            size="xs"
            color="grey"
          />{{ props.value }}
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-chip
              dense
              square
              clickable
              size="sm"
              label="查看"
              text-color="white"
              color="primary"
              icon="fas fa-eye"
              @click="resourcePreview(props.row)"
            >
              <q-tooltip> 审阅资源 </q-tooltip>
            </q-chip>
            <q-chip
              dense
              square
              clickable
              size="sm"
              label="下载"
              text-color="white"
              color="secondary"
              icon="cloud_download"
              @click="downloadTeacherSource(props.row)"
            >
              <q-tooltip> 下载资源 </q-tooltip>
            </q-chip>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { preProcessTeaResourceList } from "src/api/student/resource";
import { apiGetTeaResources } from "src/api/student/teaResource";
var FileSaver = require("file-saver");
export default {
  name: "Resources",
  data() {
    return {
      tableLoading: true,
      pagination: {
        rowsPerPage: 0,
      },
      // 资源类型：
      courseTypeList: [
        //资源类型列表
        { icon: "o_video_library", value: "教学课件", label: "教学课件" },
        { icon: "o_build", value: "常用工具", label: "常用工具" },
      ],
      filter: "",
      optResourceType: "",
      optCourse: "", //当前选择的课程
      resourceList: [],
      iconList: [],
      columns: [
        {
          name: "shortId",
          label: "资源编号",
          align: "left",
          field: "shortId",
          sortable: true,
        },
        {
          name: "filename",
          label: "资源名",
          field: "filename",
          align: "left",
          sortable: true,
        },
        {
          name: "creator",
          label: "上传者",
          field: (row) => row.creator.nickname,
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

  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
  },
  methods: {
    // 处理资源获取
    async handleGetTeacherSource() {
      if (this.currSelectedCourse === null) {
        return;
      }
      const { data } = await apiGetTeaResources({
        filecategory: this.optResourceType.value,
        course_id: this.currSelectedCourse._id,
      });
      if (data.code === 2000) {
        preProcessTeaResourceList(data.data);
        this.resourceList = data.data;
      }
    },
    // 处理资源预览
    resourcePreview(resource) {
      window.open(resource.fileUrl, "_blank");
    },
    // 下载资源
    downloadTeacherSource(resource) {
      FileSaver.saveAs(resource.downloadUrl, resource.filename);
    },

    //判断文件类型
    ToDetermineFileType() {
      return "blue";
    },

    //设置当前选择的课程
    handleChangeOptCourse(course) {
      this.$store.commit("student/setCurrSelectedCourse", course);
      this.optResourceType = {};
      this.resourceList = [];
    },
  },
  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
    }),
    ...mapGetters("user", {
      isWHH: "isWHH",
    }),
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
/* .course-card {
  min-height: 150px;
  color: #fff;
  border: none;
  background-image: linear-gradient(
    to bottom right,
    #4facfe 0%,
    #00f2fe 100%
  ) !important;
}
.course-card:hover {
  cursor: pointer;
} */
</style>
