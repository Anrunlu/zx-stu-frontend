<template>
  <q-page class="q-pa-sm">
    <div>
      <q-table
        :pagination.sync="pagination"
        :data="resourceList"
        :columns="columns"
        row-key="_id"
        :filter="filter"
        flat
        :loading="tableLoading"
      >
        <!-- 表头 -->
        <template v-slot:top-left>
          <!-- 左上方使用插槽 -->
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
                    (optCourse = item),
                      (optResourceType = ''),
                      (resourceList = [])
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
        </template>
        <template v-slot:no-data="">
          <div class="full-width row flex-center text-grey q-gutter-sm">
            <span class="text-h6"> 暂无数据 </span>
          </div>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn
                flat
                dense
                size="md"
                color="primary"
                icon="fas fa-eye"
                @click="resourcePreview(props.row)"
              >
                <q-tooltip> 审阅资源 </q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                size="md"
                color="secondary"
                icon="fas fa-download"
                @click="downloadTeacherSource(props.row)"
              >
                <q-tooltip> 下载资源 </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { apiGetCourse } from "src/api/student/resource";
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
      columns: [
        {
          name: "index",
          label: "序号",
          align: "center",
          field: "index",
          sortable: true,
        },
        {
          name: "uploadTime",
          label: "上传时间",
          align: "center",
          field: "uploadTime",
          sortable: true,
        },
        {
          name: "title",
          label: "资源名",
          field: "filename",
          sortable: true,
          align: "center",
        },
        // {
        //   name: "description",
        //   label: "资源描述",
        //   field: (row) => row.description,
        //   align: "center",
        // },
        { name: "action", label: "操作", align: "center" },
      ],
      resourceList: [],
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
      let res = await apiGetTeaResources({
        filecategory: this.optResourceType,

        course_id: this.optCourse._id,
      });
      if (res.data.code === 2000) {
        this.resourceList = res.data.data.map((item, index) => {
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

<style>
.loading {
  position: fixed;
  background: url("/loading.gif") center center no-repeat;
  position: fixed;
  margin-left: -15%;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -999;
}
</style>
