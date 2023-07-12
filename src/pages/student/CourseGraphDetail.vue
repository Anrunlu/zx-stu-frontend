<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="o_schema" />
        <div>{{ course.name }}</div>
        <q-space />
        <!-- 关闭按钮 -->
        <q-btn
          dense
          flat
          icon="close"
          @click="handleCloseBtnClick"
          v-if="!$q.platform.is.mobile"
        >
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-my-sm">
        <div class="q-pa-sm">
          <div class="row q-my-md">
            <q-select
              class="fit"
              square
              outlined
              dense
              use-input
              :options="filteredOriginKnowledges"
              option-label="name"
              option-value="name"
              emit-value
              v-model="searchTerm"
              type="text"
              label="搜索节点"
              @keyup.enter.native="handleSearchClick"
              @filter="filterFnForKnowledges"
              @input="handleSearchClick"
            ></q-select>
          </div>
          <div id="mynetwork" style="height: 85vh"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
const vis = require("vis-network/dist/vis-network.min.js");
require("vis-network/dist/dist/vis-network.min.css");
import { apiGetCourseDetails } from "src/api/student/teaResource";
import { apiGetCourseKnowledges } from "src/api/student/studyByGraph";
import { editKG } from "src/api/graph/graph";
export default {
  name: "CourseGraph",
  props: {
    courseId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      course: {
        name: "",
        _id: "",
      },
      originKnowledges: [],
      filteredOriginKnowledges: [],
      highlight: [
        { text: "chicken", style: "background-color:#f37373" },
        { text: "noodle", style: "background-color:#fca88f" },
        { text: /[^\x00-\xff]/gi, style: "background-color:#bbe4cb" },
        {
          text: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/gim,
          style: "background-color:#fff05e",
        },
        "whatever",
        { start: 2, end: 5, style: "background-color:#f330ff" },
      ],
      splitterModel: 50,
      searchTerm: "", //当前搜索的知识点
      el: "app",
      nodes: [],
      edges: [],
      // 字符串的w语言
      wnorl: "",
      // 暂存操作之前的数据w语言的json
      beforeArr: [],
      // 修改用的
      wArr: [],
      /* eslint-disable */
      _network: {},
      container: {},
      options: {
        locale: "cn",
        edges: {
          width: 2,
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.5,
            },
          },
        },
        nodes: {
          color: {
            border: "black",
          },
          heightConstraint: {
            valign: "middle",
          },

          font: {
            color: "white",
            align: "center",
            face: "STKaiti",
          },
          shape: "box",
        },
      },
    };
  },

  methods: {
    // 获取课程详情
    async getCourseDetails() {
      try {
        const { data } = await apiGetCourseDetails(this.courseId);
        this.course = data.data;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取课程详情失败",
          type: "negative",
        });
      }
    },

    // 获取课程知识点
    async getCourseKnowledges() {
      try {
        const { data } = await apiGetCourseKnowledges(this.courseId);
        this.originKnowledges = data.data;
        this.filteredOriginKnowledges = data.data;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取课程知识点失败",
          type: "negative",
        });
      }
    },

    // 处理搜索框点击事件
    async handleSearchClick() {
      // 如果搜索框为空或者为 null ，就不进行搜索
      if (this.searchTerm == "" || this.searchTerm == null) {
        return;
      }
      let res = await this.findConTerm(this.searchTerm);

      let knowledges = res.graph.nodes;

      const knowledgesToAdd = [];
      knowledges.forEach((knowledge) => {
        if (knowledge.flag == "add") {
          const k = {
            kid: knowledge.id,
            name: knowledge.label,
          };
          knowledgesToAdd.push(k);
        }
      });

      this.createGraphInit(res, true);
    },

    //构建图谱
    createGraphInit(res, first) {
      //初始化图谱
      this.nodes = res.graph.nodes;
      this.edges = res.graph.edges;
      //初始化数据对象
      let data = {
        nodes: new vis.DataSet(this.nodes),
        edges: new vis.DataSet(this.edges),
      };
      //画图
      let network = new vis.Network(this.container, data, this.options);
      this._network = network;
      const _this = this;
      //给图谱绑定双击事件
      network.on("doubleClick", async function (params) {
        let clickNodeId = this.getNodeAt(params.pointer.DOM); //获取当前点击节点的id
        for (let index = 0; index < _this.nodes.length; index++) {
          //从当前节点nodes数组中查找点击节点获取label
          const element = _this.nodes[index];
          if (element.id === clickNodeId) {
            let res = await _this.findConTerm(element.label); //通过label查询点击节点信息
            for (let i = 0; i < res.graph.nodes.length; i++) {
              //将请求的数据用来拓展当前的节点数组，去重
              const node = res.graph.nodes[i];
              let tempflag = false;
              for (let idx2 in _this.nodes) {
                //节点去重
                if (node.id === _this.nodes[idx2].id) {
                  tempflag = true;
                  break;
                }
              }
              if (tempflag === false) {
                //节点不存在加入图谱节点数组
                node.color = _this.randomColor();
                _this.nodes.push(node);
                data.nodes.add(node);
              }
            }
            for (let i = 0; i < res.graph.edges.length; i++) {
              //将请求到的数据用来扩展当前的边数组，注意去重
              const edges = res.graph.edges[i];
              let tempflag = false;
              for (let idx2 in _this.edges) {
                //边去重
                if (edges.id === _this.edges[idx2].id) {
                  tempflag = true;
                  break;
                }
              }
              if (tempflag === false) {
                //边不存在加入图谱边数组
                _this.edges.push(edges);
                data.edges.update(res.graph.edges[i]);
              }
            }
            break;
          }
        }
        // // 更新W语言区域
        // _this.wnorl = "";
        // _this.graphTransToW(_this.nodes, _this.edges);
      });
      // // 初始化更新W语言区域
      // if (first === true) {
      //   this.wnorl = "";
      //   this.graphTransToW(this.nodes, this.edges);
      // }
    },

    // 知识点后台查询
    async findConTerm(searchData) {
      const data = {
        conterm: [searchData.trim()],
        // 数据库的名称
        dbname: this.courseId,
      };
      let response = await editKG(data);
      if (response.data.data.graph.nodes.length === 0) {
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

    // 点击关闭按钮
    handleCloseBtnClick() {
      // 关闭窗口
      window.close();
    },

    // 随机颜色
    randomColor() {
      let colors = [
        "#1976d2",
        "#26a69a",
        "#9c27b0",
        "#21ba45",
        "#c10015",
        "#00868B",
        "#8B6914",
        "#8A2BE2",
      ];
      let randomColor = colors[Math.floor(Math.random() * colors.length)];
      return randomColor;
    },

    // 知识点搜索过滤函数
    filterFnForKnowledges(val, update) {
      if (val === "") {
        update(async () => {
          await this.getCourseKnowledges();
          this.filteredOriginKnowledges = this.originKnowledges;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredOriginKnowledges = this.originKnowledges.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },

  async created() {
    await this.getCourseDetails();
    this.searchTerm = this.course.name;
    this.handleSearchClick();
    this.getCourseKnowledges();
  },

  async mounted() {
    // 初始化图谱容器
    this.container = document.getElementById("mynetwork");
    this.createGraphInit(
      {
        graph: {
          nodes: [],
          edges: [],
        },
      },
      true
    );
  },
};
</script>

<style></style>
