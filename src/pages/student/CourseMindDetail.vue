<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="o_schema" />
        <div>{{ course.name }}</div>
        <q-space />

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
        <div id="map" style="width: 100vw; height: 96vh"></div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MindElixir, { E } from "mind-elixir";
import { editKG } from 'src/api/graph/graph';
import { apiGetCourseDetails } from 'src/api/student/teaResource';

export default {
  name: "CourseMind",
  props: {
    courseId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      ME: null,
      MEcontent: null,
      courseMindDetails: {
        lastModifyBy: {},
      },
      course: {
        name: "",
        _id: "",
      },
      searchTerm: "",
      tree: {},
    };
  },

  components: {},

  async mounted() {
    await this.getCourseDetails();
    const graph = await this.findConTerm(this.course.name);
    const nodeData = this.graphToTree(graph);

    this.ME = new MindElixir({
      el: "#map",
      // direction: MindElixir.RIGHT,
      draggable: true, // default true
      contextMenu: true, // default true
      toolBar: true, // default true
      nodeMenu: true, // default true
      keypress: true, // default true
    });

    this.ME.init({ nodeData, linkData: {}, direction: 1 });
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

    // 知识点后台查询
    async findConTerm(searchData) {
      const payload = {
        conterm: [searchData.trim()],
        dbname: this.courseId,
      };
      let { data } = await editKG(payload);
      if (data.data.graph.nodes.length === 0) {
        this.$q.notify({
          message: `查询无果！`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
      }
      const graph = data.data.graph;

      return graph;
    },

    // 将图构造为知识点树
    graphToTree(graph) {
      const nodes = graph.nodes;
      const edges = graph.edges;
      const root = nodes[0];
      const tree = {
        id: root.id,
        topic: root.label,
        children: [],
        parent: null,
      };

      const nodeMap = new Map();
      nodeMap.set(root.id, tree);

      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const newNode = {
          id: node.id,
          topic: node.label,
          children: [],
          parent: null,
        };
        nodeMap.set(node.id, newNode);
      }

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const source = nodeMap.get(edge.from);
        const target = nodeMap.get(edge.to);
        source.children.push(target);
        target.parent = source;
      }

      return tree;
    },

    // 点击关闭按钮
    handleCloseBtnClick() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.lt {
  width: 40px;
}
</style>
