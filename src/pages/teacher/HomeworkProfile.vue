<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="query_stats" />
        <div>{{ homeworkDetails.title }}</div>
        <ObjectShortId :id="homeworkId" objectName="作业" />
        <q-space />
        <!-- 关闭按钮 -->
        <q-btn dense flat icon="close" @click="handleClosePageClick">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-my-md">
        <!-- 题目元信息 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8 q-mb-sm">
            <q-card-section>
              <div class="q-gutter-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                quo quam facere, minus amet neque nemo architecto eius maiores
                dolores animi repellat repudiandae veritatis molestias nam sunt
                optio quod? Quis.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 题目主体区域 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8">
            <q-card-section>
              <div class="q-gutter-md"></div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <div class="float-left q-ml-sm">
        <div class="q-py-sm">
          <span style="font-size: 0.5rem; color: #9e9e9e">出题：</span>
          <span style="font-size: 0.5rem; color: #9e9e9e" class="q-ml-md"
            >上次更新：</span
          >
        </div>
      </div>
      <div class="float-right q-mr-sm">
        <q-btn flat square label="保存" icon="save" @click="handleSaveClick" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import {
  apiGetHomeworkDetails,
  apiGetHomeworkOverallAnswerStatus,
} from "src/api/teacher/homework";
import {
  preProcessHomeworkDetails,
  preProcessStuAnswerStatus,
} from "src/utils/homework";

export default {
  name: "HomeworkProfile",
  props: ["homeworkId"],
  data() {
    return {
      // 作业详情
      homeworkDetails: {},
      // 全部学生作答情况
      overallStuAnswerStatus: [],
      // 已完成学生作答情况
      finishedStuAnswerStatus: [],
      // 未完成学生作答情况
      unfinishedStuAnswerStatus: [],
    };
  },

  components: {
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
  },

  methods: {
    // 获取作业详细信息
    async getHomeworkDetail() {
      try {
        const { data } = await apiGetHomeworkDetails(this.homeworkId);
        preProcessHomeworkDetails(data.data);
        this.homeworkDetails = data.data;

        // 获取教学班学生作答情况
        this.getHomeworkOverallAnswerStatus();
      } catch (error) {
        this.$q.notify({
          message: "获取作业信息失败",
          type: "negative",
        });
      }
    },

    // 获取教学班学生作答情况
    async getHomeworkOverallAnswerStatus() {
      const getHomeworkOverallAnswerStatusDto = {
        homework_id: this.homeworkDetails._id,
        receiver_id: this.homeworkDetails.receiver._id,
        receiver_type: "Classroom",
        tcc_id: this.homeworkDetails.tcc,
      };

      try {
        const { data } = await apiGetHomeworkOverallAnswerStatus(
          getHomeworkOverallAnswerStatusDto
        );
        data.data.forEach((stuAnswerStatus) => {
          preProcessStuAnswerStatus(stuAnswerStatus);
        });

        this.overallStuAnswerStatus = data.data;
        this.finishedStuAnswerStatus = data.data.filter(
          (stuAnswerStatus) => stuAnswerStatus.isFinished
        );
        this.unfinishedStuAnswerStatus = data.data.filter(
          (stuAnswerStatus) => !stuAnswerStatus.isFinished
        );
      } catch (error) {
        this.$q.notify({
          message: "获取作答情况失败",
          type: "negative",
        });
      }
    },

    // 点击保存按钮
    handleSaveClick() {
      // 保存题目
    },

    // 关闭页面
    handleClosePageClick() {
      window.close();
    },
  },

  created() {
    this.getHomeworkDetail();
  },
};
</script>
