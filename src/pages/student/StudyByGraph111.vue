<template>
  <!--选择课程-->
  <div class="q-pa-sm">
    <q-card class="q-pa-sm">
      <q-btn-dropdown
        color="primary"
        :label="optCourse.name ? optCourse.name : '请选择课程'"
        dropdown-icon="change_history"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="
              (optCourse = item),
                (optHomeworkType = ''),
                (homeworkList = []),
                handleSearchClike()
            "
            v-for="item in courseList"
            :key="item.course_id"
          >
            <q-item-section>
              <q-item-label>{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item></q-list
        ></q-btn-dropdown
      >
      <div class="row">
        <!--树状图-->
        <div
          class="col-6 col-md-6 scroll"
          style="height: 83vh; z-index: 1"
          id="jsmind_container"
        ></div>

        <!--知识点界面-->
        <q-card class="col-6 col-md-6">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
          >
            <q-tab name="knowledgePointLearning" label="知识点学习" />
            <q-tab name="knowledgeQuestion" label="知识点习题" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel
              name="knowledgePointLearning"
              style="height: 74vh; z-index: 999999"
              class="q-pa-none"
            >
              <ckeditor
                @imgAdd="handleEditorImgAdd"
                :boxShadow="false"
                :autofocus="false"
                ref="qmd"
                style="z-index: 1; border: 1px solid #d9d9d9"
                class="fit"
                v-model="innerTab"
                placeholder="题目内容"
                :editor="editor"
              ></ckeditor>
            </q-tab-panel>
            <q-tab-panel name="knowledgeQuestion">
              <q-table
                style="height: 74vh"
                class="my-sticky-header-table"
                :data="homeworkList"
                :columns="homeworkColumns"
                row-key="name"
                flat
                sticky-last-column
                sticky-header
                @row-click="handleGetHomeworkInfo"
                bordered
              >
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <div class="q-gutter-sm">
                      <q-btn
                        v-if="
                          props.row.studentHomework == null ||
                          (props.row.studentHomework.answerProgress === 0 &&
                            props.row.isEnd === true)
                        "
                        flat
                        dense
                        size="md"
                        color="red"
                        icon="work"
                        label="未作答"
                      ></q-btn>
                      <q-btn
                        v-else-if="
                          props.row.studentHomework == null ||
                          (props.row.studentHomework.answerProgress === 0 &&
                            props.row.isEnd === false)
                        "
                        flat
                        dense
                        size="md"
                        color="red"
                        icon="work"
                        label="未作答"
                      ></q-btn>
                      <q-btn
                        v-else-if="
                          props.row.studentHomework.answerProgress < 1 &&
                          props.row.isEnd === false
                        "
                        flat
                        dense
                        size="md"
                        color="primary"
                        icon="pending"
                        :label="
                          '已完成(' +
                          (
                            props.row.studentHomework.answerProgress * 100
                          ).toFixed(0) +
                          '%)'
                        "
                      ></q-btn>
                      <q-btn
                        v-else-if="
                          props.row.studentHomework.answerProgress < 1 &&
                          props.row.isEnd === true
                        "
                        flat
                        dense
                        size="md"
                        color="red"
                        icon="work"
                        :label="
                          '仅完成(' +
                          (
                            props.row.studentHomework.answerProgress * 100
                          ).toFixed(0) +
                          '%)'
                        "
                      ></q-btn>
                      <q-btn
                        v-else
                        flat
                        dense
                        size="md"
                        color="green"
                        icon="fas fa-award"
                        label="已完成"
                      ></q-btn>
                    </div>
                  </q-td>
                </template>
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <div class="q-gutter-sm">
                      <q-btn
                        v-if="props.row.isEnd === true"
                        flat
                        dense
                        size="md"
                        color="red"
                        icon="block"
                        label="已截止"
                      ></q-btn>
                      <q-btn
                        v-else
                        flat
                        dense
                        size="md"
                        color="primary"
                        icon="schedule"
                        label="未截止"
                      ></q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </q-card>
  </div>
</template>
<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import "jsmind/style/jsmind.css";
import jsMind from "jsmind/js/jsmind.js";
window.jsMind = jsMind;

require("jsmind/js/jsmind.draggable-node.js");
require("jsmind/js/jsmind.screenshot.js");

require("src/utils/jsmind.menu.js");
import {
  apiGetCourse,
  apiGetHomeworkByKnowledge,
  apiGetCompleteKnowledgeByStudent,
  apiEditKG,
} from "src/api/student/studyByGraph";
export default {
  data() {
    return {
      // 编辑器配置
      editor: Editor,
      tab: "knowledgePointLearning",
      // innerTab: "innerMails",
      splitterModel: 20,
      optCourse: "",
      homeworkList: [],
      optHomeworkType: "",
      courseList: [],
      jm: null,
      mind: "",
      options: "",
      DBList: [],
      flag: 0,
      homeworkCompleted: "",
      innerTab: "该知识点暂无介绍",
      homeworkColumns: [
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
      layer: "",
    };
  },
  methods: {
    async handleEditorImgAdd() {
      this.$q.notify({
        message: `您没有权限上传图片`,
        timeout: 300,
        color: "negative",
        icon: "error",
        position: "bottom",
      });
      return;
    },
    handleGetHomeworkInfo(env, homework) {
      this.$router.push(`/student/homeworkdetails/${homework._id}`);
    },
    async handleSearchClike() {
      let res = await this.findConTerm(
        this.optCourse.name.split("（")[0].replace(/ /g, "")
      );
      await this.getCompleteKnowledge();
      this.init_data(res, this.optCourse.name.split("（")[0]);
    },
    //知识点后台查询
    async findConTerm(searchData) {
      if (this.selectKGDBName == "") {
        this.$q.notify({
          message: `请选择数据库！`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
      }
      const data = {
        userno: "2017416616",
        conterm: searchData,
        dbname: "KG_" + this.optCourse.cid,
      };
      let response = await apiEditKG(data);
      if (response.data.data.termid.length === 0) {
        this.$q.notify({
          message: `查询无果！`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
      }
      return response.data.data;
    },
    async getAllData(data) {
      let res = await this.findConTerm(data.text);
      var edges = res.graph.edges;
      var nodes = res.graph.nodes;
      var flag = 0;
      this.layer++;

      if (res.termid.length > 0) {
        edges.forEach((a) => {
          if (a.label == "包含") {
            flag = 1;
          }
        });
        if (flag == 1) {
          edges.forEach((a) => {
            if (a.label == "包含") {
              for (var i = 0; i < res.graph.nodes.length; i++) {
                if (nodes[i].id == a.to) {
                  var dataBase = {
                    id: "",
                    topic: "",
                    children: [],
                    text: "",
                  };
                  if (this.homeworkCompleted.includes(nodes[i].id)) {
                    dataBase.topic =
                      "<div style='color:#0aff06'>" +
                      nodes[i].label +
                      "(已完成)</div>";
                  } else {
                    dataBase.topic = nodes[i].label;
                  }

                  dataBase.id = this.layer + "_" + nodes[i].id;
                  dataBase.text = nodes[i].label;
                  this.getAllData(dataBase);
                  data.children.push(dataBase);
                  this.jm.show(this.mind);
                  break;
                }
              }
            }
          });
        }
      } else {
        return;
      }
    },
    init_data(res, name) {
      var mind = {
        /* 元数据，定义思维导图的名称、作者、版本等信息 */
        meta: {
          name: "jsMind-demo-tree",
          author: "hizzgdev@163.com",
          version: "0.2",
        },
        /* 数据格式声明 */
        format: "node_tree",
        /* 数据内容 */
        data: {
          id: "root",
          topic: name,
          children: [],
        },
      };

      if (res.termid.length > 0) {
        var edges = res.graph.edges;
        var nodes = res.graph.nodes;

        edges.forEach((a) => {
          if (a.label == "包含") {
            for (var i = 0; i < res.graph.nodes.length; i++) {
              if (nodes[i].id == a.to) {
                var dataBase = {
                  id: "",
                  topic: "",
                  children: [],
                  text: "",
                };
                if (this.homeworkCompleted.includes(nodes[i].id)) {
                  dataBase.topic =
                    "<div style='color:#0aff06'>" + nodes[i].label + "</div>";
                } else {
                  dataBase.topic = nodes[i].label;
                }

                dataBase.id = this.layer + "_" + nodes[i].id;
                dataBase.text = nodes[i].label;
                this.getAllData(dataBase);
                mind.data.children.push(dataBase);
                break;
              }
            }
          }
        });
      }

      //创建树图容器
      var options = {
        container: "jsmind_container",
        editable: false,
        theme: "primary",
        menuOpts: {
          showMenu: true,
          injectionList: [
            {
              target: "edit",
              text: "选择此知识点",
              callback: async (node) => {
                this.homeworkList = [];
                const res = await apiGetHomeworkByKnowledge({
                  kid: node.id.split("_")[1],
                  tcc_id: this.optCourse.tcc_id,
                });
                if (res.data.code === 2000) {
                  this.innerTab = res.data.data[0].knowledge.description;
                  if (res.data.data[0].title) {
                    res.data.data.forEach((element) => {
                      element.isEnd = false;
                      let now = new Date();
                      if (
                        element.studentHomework &&
                        element.studentHomework.endtime
                      ) {
                        let end = new Date(element.studentHomework.endtime);
                        let d = end.getTime() - now.getTime();
                        if (d < 0) {
                          //已截止
                          element.isEnd = true;
                        }
                        element.endtime = this.formatDate(
                          element.studentHomework.endtime
                        );
                      } else {
                        let end = new Date(element.endtime);
                        let d = end.getTime() - now.getTime();
                        if (d < 0) {
                          //已截止
                          element.isEnd = true;
                        }
                        element.endtime = this.formatDate(element.endtime);
                        // //console.log(object);
                      }
                    });
                    this.homeworkList = res.data.data;
                  }
                }
              },
            },
            {
              target: "showAll",
              text: "展开全部知识点",
              callback: function (node) {},
            },
            {
              target: "hideAll",
              text: "收起全部知识点",
              callback: function (node) {},
            },
          ],
        },
      };
      if (this.flag == 0) {
        this.jm = new jsMind(options);
        this.flag = 1;
      }
      this.mind = mind;
      this.jm.show(mind);
    },
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
    async getCompleteKnowledge() {
      const res = await apiGetCompleteKnowledgeByStudent({
        course: this.optCourse._id,
      });
      this.homeworkCompleted = res.data.data.knowledgeDesription;
      for (var i = 0; i < this.homeworkCompleted.length; i++) {
        this.homeworkCompleted[i] = this.homeworkCompleted[i].kid;
      }
    },
    //获取所有课程
    async handleGetAllCourse() {
      let res = await apiGetCourse();
      if (res.data.code === 2000) {
        this.courseList = res.data.data.map((item) => {
          item.course.tcc_id = item._id;
          if (item.teacher == null) {
            item.course.name =
              item.course.name + "（" + "该老师已退出知新系统" + "）";
          } else {
            item.course.name =
              item.course.name + "（" + item.teacher.user.nickname + "）";
          }
          return item.course;
        });
      }
    },
  },
  mounted() {
    this.$socket.connect();
    if (localStorage.getItem("course")) {
      this.optCourse = JSON.parse(localStorage.getItem("course"));
      this.handleSearchClike();
    }
    this.handleGetAllCourse();
  },
  created() {
    this.$socket.connect();
  },
};
</script>

<style lang="sass" scoped>
.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
