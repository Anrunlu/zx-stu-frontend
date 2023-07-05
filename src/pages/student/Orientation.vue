<template>
  <q-page>
    <q-table
      flat
      :data="classmatesList"
      :columns="classColumns"
      :pagination="tablePagination"
      row-key="_id"
      :dense="$q.platform.is.mobile ? false : true"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <!-- 查看班级位置信息 -->
          <q-btn
            color="accent"
            outline
            label="查看班级学生信息"
            @click="handleClassAddrClick"
          />
        </div>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6"> 暂无数据 </span>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="mapDG" persistent full-width>
      <q-card >
        <CardBar></CardBar>
        <div id="map" style=" height: 70vh"></div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { apiGetClassmatesInfo } from "src/api/student/studyByGraph";
import { mapGetters } from "vuex";
export default {
  name: "Orientation",
  data() {
    return {
      // 班级同学列表
      classmatesList: [],
      // 教学资源列表表头
      classColumns: [
        {
          name: "username",
          label: "学号",
          field: "username",
          align: "left",
          sortable: true,
        },
        {
          name: "nickname",
          label: "姓名",
          align: "left",
          field: "nickname",
          sortable: true,
        },
        {
          name: "sex",
          label: "性别",
          field: "sex",
          align: "center",
          sortable: true,
        },
        {
          name: "location",
          label: "当前位置",
          field: (row) => (row.location ? row.location.addr : "暂无定位"),
          align: "center",
          sortable: true,
        },
        // {
        //   name: "action",
        //   align: "center",
        //   label: "操作",
        // },
      ],
      mapDG: false,
      geometries: [],
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },
  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      homeworkCategoryOptions: "homeworkCategoryOptions",
    }),

    ...mapGetters("user", {
      nickname: "nickname",
      username: "username",
      originClassroomId: "originClassroomId",
      studentId: "studentId",
    }),
  },

  methods: {
    //获取班级同学信息
    async getClassmatesInfo() {
      const classId = this.studentId[0].joinedClassrooms[0].id;
      const { data } = await apiGetClassmatesInfo(classId);
      this.classmatesList = data.data.map((item) => item.user);
      console.log(this.classmatesList);
    },

    handleClassAddrClick() {
      this.mapDG = true;
      this.geometries = [];
      this.classmatesList.forEach((stu) => {
        if (stu.location) {
          this.geometries.push({
            position: new TMap.LatLng(
              stu.location.location.coordinates[1],
              stu.location.location.coordinates[0]
            ),
            content: stu.nickname,
          });
        }
      });
      this.$nextTick(() => {
        this.initMap();
      });
    },

    initMap() {
      const drawContainer = document.getElementById("map");
      const center = new TMap.LatLng(35.595576, 116.96911); //设置中心点坐标
      const map = new TMap.Map(drawContainer, {
        zoom: 8,
        pitch: 40,
        center: center,
        draggable: true,
        scrollable: true,
        mapStyleId: "style 1",
      });
      // 创建点聚合实例
      const markerCluster = new TMap.MarkerCluster({
        id: "cluster",
        map: map,
        enableDefaultStyle: true, // 启用默认样式
        minimumClusterSize: 2, // 形成聚合簇的最小个数
        geometries: this.geometries,
        zoomOnClick: true, // 点击簇时放大至簇内点分离
        gridSize: 60, // 聚合算法的可聚合距离
        averageCenter: false, // 每个聚和簇的中心是否应该是聚类中所有标记的平均值
        maxZoom: 10, // 采用聚合策略的最大缩放级别
      });
      //文本标记实例
      var label = new TMap.MultiLabel({
        id: "label-layer",
        map: map, //设置折线图层显示到哪个地图实例中
        //文字标记样式
        styles: {
          label: new TMap.LabelStyle({
            color: "#3777FF", //颜色属性
            size: 20, //文字大小属性
            offset: { x: 0, y: 0 }, //文字偏移属性单位为像素
            angle: 0, //文字旋转属性
            alignment: "center", //文字水平对齐属性
            verticalAlignment: "middle", //文字垂直对齐属性
          }),
        },
        //文字标记数据
        geometries: this.geometries,
      });
    },
  },

  created() {
    this.getClassmatesInfo();
  },
};
</script>

<style></style>
