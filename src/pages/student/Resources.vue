<template>
  <q-page class="q-pa-sm">
    <div class="q-pa-sm">
      <div class="q-gutter-sm row">
        <!-- 选择课程 -->
        <q-btn-dropdown
          color="primary"
          :label="optCourse ? optCourse.name : '请选择课程'"
          dropdown-icon="change_history"
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
      <div class="row q-gutter-sm q-ma-sm justify-center">
        <div class="col-11 col-md-4" v-for="(c, i) in resourceList" :key="i">
          <q-card class="course-card shadow-4">
            <q-card-section style="color: black">
              <q-card-section>
                <q-chip dense square text-color="white" color="primary">{{
                  c.index
                }}</q-chip>
                <q-icon
                  :name="`fa-regular ${c.resourceTypeAndIcon.icon}`"
                  size="xs"
                />
                <q-chip style="overflow: hidden"> {{ c.filename }}</q-chip>
              </q-card-section>
              <q-tooltip> {{ c.filename }} </q-tooltip>
              <div style="font-size: 8px">上传时间：{{ c.updatedAt }}</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="q-gutter-sm" align="right">
                <q-btn
                  icon="remove_red_eye"
                  color="indigo"
                  label="审阅资源"
                  size="0.5rem"
                  @click="resourcePreview(c)"
                />
                <q-btn
                  icon="cloud_download"
                  color="indigo"
                  label="下载资源"
                  size="0.5rem"
                  @click="downloadTeacherSource(c)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { preProcessTeaResourceList } from "src/api/student/resource";
import { apiGetTeaResources } from "src/api/teacher/teaResource";
import { formatTimeWithWeekDay } from "src/utils/time";
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
        "常用工具",
        "教学课件",
      ],
      filter: "",
      optResourceType: "",
      optCourse: "", //当前选择的课程
      resourceList: [],
      iconList: [],
    };
  },
  methods: {
    // 处理资源获取
    async handleGetTeacherSource() {
      this.tableLoading = true;
      const { data } = await apiGetTeaResources({
        filecategory: this.optResourceType,
        course_id: this.optCourse._id,
      });
      if (data.code === 2000) {
        preProcessTeaResourceList(data.data);
        this.resourceList = data.data;
        this.resourceList = data.data.map((item, index) => {
          item.downloadUrl = item.fileUrl.match(
            /(cyberdownload.anrunlu.net\/)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
          )[0];
          item.downloadUrl = "https://" + item.downloadUrl;
          item.updatedAt = formatTimeWithWeekDay(item.updatedAt);
          item.index = index + 1;
          return item;
        });
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
  },
  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
    }),
  },
  created() {
    this.$store.dispatch("student/getCourseList");
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
