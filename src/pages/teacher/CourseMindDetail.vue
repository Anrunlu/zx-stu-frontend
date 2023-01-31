<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="o_schema" />
        <div>{{ courseMindDetails.title }}</div>
        <ObjectShortId :id="courseMindId" objectName="导图" />
        <span class="q-ml-sm" style="font-size: 13px"
          >上次更新：{{
            `${courseMindDetails.lastModifyBy.nickname} | ${courseMindDetails.updatedAt}`
          }}</span
        >
        <q-space />
        <!-- 关闭按钮 -->
        <q-btn
          class="q-mr-xs"
          dense
          outline
          icon="save"
          label="保存"
          @click="handleSaveBtnClick"
        >
        </q-btn>
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
import {
  apiGetCourseMindDetails,
  apiModifyCourseMind,
} from "src/api/teacher/courseMind";
import { formatTimeWithWeekDay } from "src/utils/time";

export default {
  name: "CourseMind",
  props: {
    courseMindId: {
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
    };
  },

  components: {
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
  },

  async mounted() {
    const content = await this.getCourseMindDetails();

    this.ME = new MindElixir({
      el: "#map",
      // direction: MindElixir.RIGHT,
      draggable: true, // default true
      contextMenu: true, // default true
      toolBar: true, // default true
      nodeMenu: true, // default true
      keypress: true, // default true
    });

    this.ME.init(content);
  },

  methods: {
    // 获取导图详情
    async getCourseMindDetails() {
      try {
        const { data } = await apiGetCourseMindDetails(this.courseMindId);
        this.courseMindDetails = data.data;
        this.courseMindDetails.updatedAt = formatTimeWithWeekDay(
          this.courseMindDetails.updatedAt
        );

        // 返回导图内容，以便于初始化
        const content = data.data.content;
        return content;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          type: "negative",
          message: "获取导图详情失败",
        });
      }
    },

    // 保存导图
    async saveCourseMind() {
      const content = this.ME.getAllData();

      const modifyCourseMindDto = {
        content,
      };

      try {
        await apiModifyCourseMind(this.courseMindId, modifyCourseMindDto);
        this.$q.notify({
          message: "保存成功",
          type: "positive",
        });
        // 重新获取导图详情
        this.getCourseMindDetails();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "保存失败",
          type: "negative",
        });
      }
    },

    // 点击保存按钮
    handleSaveBtnClick() {
      this.saveCourseMind();
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
