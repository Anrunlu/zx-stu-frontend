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
      <div class="row q-gutter-md q-ma-sm justify-center">
        <div class="col-11 col-md-9" v-for="(c, i) in resourceList" :key="i">
          <q-card class="course-card shadow-4">
            <q-card-section @click="resourcePreview(c)" style="color: black">
              <q-card-section>
                <span style="font-size: 1.4em color: black">
                  {{ c.index }}</span
                >
                <q-icon
                  :name="`fa-regular ${c.resourceTypeAndIcon.icon}`"
                  size="xs"
                  color="grey"
                />
                <span style="text-overflow:clip overflow:hidden"
                  >{{ c.filename }}
                </span>
              </q-card-section>
              <q-tooltip> {{ c.filename }} </q-tooltip>
              <div align="right" style="font-size: 8px">
                上传时间：{{ formatDate(c.updatedAt) }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section align="right">
              <div class="q-gutter-sm">
                <q-btn
                  color="indigo"
                  label="审阅资源"
                  size="0.4rem"
                  @click="resourcePreview(c)"
                />
                <q-btn
                  color="indigo"
                  label="下载资源"
                  size="0.4rem"
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
import {
  apiGetCourse,
  preProcessTeaResourceList,
} from "src/api/student/resource";
import { apiGetTeaResources } from "src/api/teacher/teaResource";
var FileSaver = require("file-saver");
export default {
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
      courseList: [], //课程列表
      optCourse: "", //当前选择的课程
      resourceList: [],
      iconList: [],
    };
  },
  methods: {
    //格式化时间
    formatDate(date) {
      //格式化事件
      var Time = new Date(date); //解析date并返回一个整数。
      var y = Time.getFullYear(); //年
      var m = Time.getMonth() + 1; //月
      m = m < 10 ? "0" + m : m;
      var d = Time.getDate(); //日
      d = d < 10 ? "0" + d : d;
      var h = Time.getHours(); //时
      h = h < 10 ? "0" + h : h;
      var minute = Time.getMinutes(); //分
      minute = minute < 10 ? "0" + minute : minute;
      return y + "年" + m + "月" + d + "日" + " " + h + ":" + minute;
    },
    //获取所有课程
    async handleGetAllCourse() {
      let res = await apiGetCourse();
      if (res.data.code === 2000) {
        this.courseList = res.data.data.map((item) => {
          item.course.tcc_id = item._id;
          item.course.name =
            item.course.name + "（" + item.teacher.user.nickname + "）";
          return item.course;
        });
      }
    },
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
          item.uploadTime = this.formatDate(item.updatedAt);
          item.index = index + 1;
          return item;
        });
        this.tableLoading = false;
        // 添加课程与作业类型进LocalStorage
        localStorage.setItem("course", JSON.stringify(this.optCourse));
        localStorage.setItem("optResourceType", this.optResourceType);
        console.log(this.resourceList);
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
  },
  created() {
    localStorage.removeItem("homeworkType");
    localStorage.removeItem("course");
    if (localStorage.getItem("course"))
      this.optCourse = JSON.parse(localStorage.getItem("course"));
    if (localStorage.getItem("optResourceType"))
      this.optResourceType = localStorage.getItem("optResourceType");
    if (this.optCourse && this.optResourceType) this.handleGetTeacherSource();
    this.handleGetAllCourse();
    this.tableLoading = false;
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
  background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important;
  cursor: pointer;
}
</style>
