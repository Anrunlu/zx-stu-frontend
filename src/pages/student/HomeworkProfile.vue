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
        <!-- 元信息 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8 q-mb-sm">
            <q-card-section>
              <div class="q-gutter-md row">
                <q-chip square outline>
                  <q-avatar icon="people" color="primary" text-color="white" />
                  {{ homeworkDetails.receiver.name }}
                </q-chip>
                <!-- span标签内容垂直居中 -->
                <span
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  >班级完成率：{{ homeworkProgress }}%</span
                >
                <span
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  >平均分：{{ homeworkAvgScore }}</span
                >

                <!-- 右侧按钮 -->
                <q-space />
                <q-btn
                  flat
                  color="primary"
                  icon="swipe"
                  label="题目视图"
                  @click="handleSwitchViewClick('questionView')"
                  v-if="currentView === 'stuAnswerStatusView'"
                >
                  <q-tooltip> 切换为题目视图 </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  color="positive"
                  icon="swipe"
                  label="学生视图"
                  @click="handleSwitchViewClick('stuAnswerStatusView')"
                  v-else
                >
                  <q-tooltip> 切换为学生视图 </q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 主体区域 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8">
            <q-table
              :data="stuAnswerStatus"
              :columns="stuAnswerStatusColumns"
              :dense="tableDense"
              :pagination="stuAnswerStatusPagination"
              :filter="filter"
              row-key="_id"
              @row-click="handleStuAnswerStatusViewTableRowClick"
              v-show="currentView === 'stuAnswerStatusView'"
            >
              <template v-slot:top-left>
                <div class="q-gutter-sm row">
                  <!-- 选择课程 -->
                  <q-btn-dropdown
                    label="筛选"
                    color="primary"
                    icon="filter_list"
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'finished'"
                      >
                        <q-item-section avatar>
                          <q-icon name="task_alt" color="positive" />
                        </q-item-section>
                        <q-item-section
                          >已完成({{
                            finishedStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'unfinished'"
                      >
                        <q-item-section avatar>
                          <q-icon name="o_cancel" color="red" />
                        </q-item-section>
                        <q-item-section
                          >未完成({{
                            unfinishedStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'all'"
                      >
                        <q-item-section avatar>
                          <q-icon name="people" color="primary" />
                        </q-item-section>
                        <q-item-section
                          >全部({{
                            overallStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    color="positive"
                    icon="download"
                    label="导出"
                    @click="handleExportClick"
                  ></q-btn>
                  <q-btn
                    outline
                    color="secondary"
                    icon="refresh"
                    label="刷新"
                    @click="handleRefreshClick"
                  >
                  </q-btn>
                </div>
              </template>

              <template v-slot:top-right>
                <q-input
                  color="primary"
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="搜索(输入姓名或学号)"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-nickname="props">
                <q-td :props="props">
                  <!-- TODO:抽离成 UsernameWithAvatarChip 组件 -->
                  <q-chip square color="white" size="sm">
                    <q-avatar color="secondary" text-color="white">
                      <img v-if="props.row.avatar" :src="props.row.avatar" />
                      <span v-else>{{ props.row.nickname.slice(0, 1) }}</span>
                    </q-avatar>
                    {{ props.row.nickname }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-answerProgress="props">
                <q-td :props="props">
                  <q-badge
                    square
                    :color="
                      props.row.isFinished
                        ? 'green-4'
                        : props.value > 0
                        ? 'blue-4'
                        : 'red-4'
                    "
                    text-color="white"
                    size="sm"
                  >
                    {{
                      props.row.isFinished
                        ? "已完成"
                        : props.value > 0
                        ? `${(props.value * 100).toFixed(2)}%`
                        : "未作答"
                    }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-correctProgress="props">
                <q-td :props="props">
                  <q-badge
                    square
                    :color="
                      props.value == 1
                        ? 'green-3'
                        : props.value > 0
                        ? 'blue-3'
                        : 'grey-3'
                    "
                    text-color="white"
                    size="sm"
                  >
                    {{
                      props.value == 1
                        ? "已完成"
                        : `${(props.value * 100).toFixed(2)}%`
                    }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn
                      flat
                      dense
                      size="sm"
                      color="primary"
                      icon="update"
                      @click.stop=""
                    >
                      <q-tooltip> 作业延期(功能即将上线...) </q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      size="sm"
                      color="red-4"
                      icon="published_with_changes"
                      @click.stop=""
                    >
                      <q-tooltip> 客观题重新评判(功能即将上线...)</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>

            <q-table
              :data="questionList"
              :columns="questionListColumns"
              :dense="tableDense"
              :pagination.sync="questionListPagination"
              :filter="filter"
              row-key="_id"
              @row-click="handleQuestionViewTableRowClick"
              v-show="currentView === 'questionView'"
            >
              <template v-slot:top-left>
                <div class="q-gutter-sm row">
                  <!-- 选择课程 -->
                  <q-btn-dropdown
                    label="筛选"
                    color="primary"
                    icon="filter_list"
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'finished'"
                      >
                        <q-item-section avatar>
                          <q-icon name="task_alt" color="positive" />
                        </q-item-section>
                        <q-item-section
                          >已完成({{
                            finishedStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'unfinished'"
                      >
                        <q-item-section avatar>
                          <q-icon name="o_cancel" color="red" />
                        </q-item-section>
                        <q-item-section
                          >未完成({{
                            unfinishedStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentStatus = 'all'"
                      >
                        <q-item-section avatar>
                          <q-icon name="people" color="primary" />
                        </q-item-section>
                        <q-item-section
                          >全部({{
                            overallStuAnswerStatus.length
                          }})</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <q-btn
                    color="positive"
                    icon="download"
                    label="导出"
                    @click="handleExportClick"
                  ></q-btn>
                  <q-btn
                    outline
                    color="secondary"
                    icon="refresh"
                    label="刷新"
                    @click="handleRefreshClick"
                  >
                  </q-btn>
                </div>
              </template>

              <template v-slot:top-right>
                <q-input
                  color="primary"
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="搜索"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-shortId="props">
                <q-td
                  :props="props"
                  @click.stop="handleTableCellIdClick(props.row)"
                  class="cursor-pointer"
                >
                  <q-icon name="fingerprint" size="xs" color="grey-6" />{{
                    props.row.shortId
                  }}
                </q-td>
              </template>

              <template v-slot:body-cell-type="props">
                <q-td :props="props">
                  <QuestionChip :questionType="props.row.type" :size="'xs'" />
                </q-td>
              </template>

              <template v-slot:body-cell-scoringRate="props">
                <q-td :props="props">
                  <q-linear-progress
                    rounded
                    stripe
                    size="17px"
                    :value="props.value"
                    :color="
                      props.value >= 0.85
                        ? 'green-3'
                        : props.value >= 0.7
                        ? 'blue-3'
                        : 'red-3'
                    "
                  >
                    <div class="absolute-full flex flex-center">
                      <span class="text-white text-caption">{{
                        props.row.scoringRateLabel
                      }}</span>
                    </div>
                  </q-linear-progress>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <div class="q-gutter-sm">
                    <q-btn
                      flat
                      dense
                      size="sm"
                      color="red-4"
                      icon="published_with_changes"
                    >
                      <q-tooltip> 重新评判</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <div class="float-left q-ml-sm">
        <div class="q-py-sm">
          <span style="font-size: 0.5rem; color: #9e9e9e"
            >最近更新：{{ lastUpdateTime }}</span
          >
        </div>
      </div>
      <!-- <div class="float-right q-mr-sm">
        <q-btn flat square label="保存" icon="save" />
      </div> -->
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { copyToClipboard } from "quasar";
import {
  apiGetHomeworkDetails,
  apiGetHomeworkOverallAnswerStatus,
  apiGetStatisticsForCertainHomework,
} from "src/api/teacher/homework";
import {
  preProcessHomeworkDetails,
  preProcessStuAnswerStatus,
} from "src/utils/homework";
import { toFixed2 } from "src/utils/common";
import ExportJsonExcel from "js-export-excel";

export default {
  name: "HomeworkProfile",
  props: ["homeworkId"],
  data() {
    return {
      // 当前显示的视图
      currentView: "stuAnswerStatusView",
      stuAnswerStatus: [],
      // 当前选中的状态
      currentStatus: "all",
      stuAnswerStatusColumns: [
        {
          name: "nickname",
          label: "姓名",
          field: "nickname",
          align: "left",
          sortable: true,
        },
        {
          name: "username",
          label: "学号",
          field: "username",
          align: "left",
          sortable: true,
        },
        {
          name: "answerProgress",
          label: "作答进度",
          field: "answerProgress",
          align: "left",
          sortable: true,
        },
        {
          name: "correctProgress",
          label: "批阅进度",
          field: "correctProgress",
          align: "left",
          sortable: true,
        },
        {
          name: "score",
          label: "得分",
          field: "score",
          align: "left",
          sortable: true,
        },
        {
          name: "lastSubmitTime",
          label: "最近提交时间",
          field: "lastSubmitTime",
          align: "left",
          sortable: true,
        },
        {
          name: "action",
          label: "操作",
          align: "center",
        },
      ],

      stuAnswerStatusPagination: {
        rowsPerPage: 0,
        sortBy: "username",
      },
      // 数据最近更新时间
      lastUpdateTime: "",
      // 学生筛选
      filter: "",
      // 作业总进度
      homeworkProgress: 0,
      // 作业平均分
      homeworkAvgScore: 0,
      // 作业详情
      homeworkDetails: {
        // 接收者
        receiver: {
          name: "",
        },
      },
      // 全部学生作答情况
      overallStuAnswerStatus: [],
      // 已完成学生作答情况
      finishedStuAnswerStatus: [],
      // 未完成学生作答情况
      unfinishedStuAnswerStatus: [],
      // 题目列表
      questionList: [],
      questionListColumns: [
        {
          name: "shortId",
          label: "题目编号",
          align: "left",
          sortable: true,
        },
        {
          name: "type",
          label: "类型",
          align: "center",
          field: "type",
          sortable: true,
        },
        {
          name: "content",
          label: "内容",
          align: "center",
          field: "content",
          sortable: true,
        },
        {
          name: "scoringRate",
          label: "得分率",
          align: "center",
          field: "scoringRate",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      questionListPagination: {
        rowsPerPage: 0,
        sortBy: "scoringRate",
      },
      // 题集名称
      questionSetName: "",
    };
  },

  components: {
    ObjectShortId: () => import("src/components/common/ObjectShortId.vue"),
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
  },

  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
    }),
  },

  watch: {
    currentStatus(newVal, oldVal) {
      this.changeStuAnswerStatus(newVal);
    },
  },

  methods: {
    // 获取作业详细信息
    async getHomeworkDetail() {
      try {
        const { data } = await apiGetHomeworkDetails(this.homeworkId);
        preProcessHomeworkDetails(data.data);
        this.homeworkDetails = data.data;
      } catch (error) {
        this.$q.notify({
          message: "获取作业信息失败",
          type: "negative",
        });
      }
    },

    // 获取教学班学生作答情况(学生视图)
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

        // 计算总进度
        this.homeworkProgress = Math.round(
          (data.data.filter((stuAnswerStatus) => stuAnswerStatus.isFinished)
            .length /
            data.data.length) *
            100
        ).toFixed(2);

        // 计算平均分
        let totalScore = 0;
        data.data.forEach((stuAnswerStatus) => {
          totalScore += stuAnswerStatus.score;
        });
        this.homeworkAvgScore = Math.round(
          totalScore / data.data.length
        ).toFixed(2);

        this.overallStuAnswerStatus = data.data;
        this.finishedStuAnswerStatus = data.data.filter(
          (stuAnswerStatus) => stuAnswerStatus.isFinished
        );
        this.unfinishedStuAnswerStatus = data.data.filter(
          (stuAnswerStatus) => !stuAnswerStatus.isFinished
        );

        this.changeStuAnswerStatus(this.currentStatus);

        // 设置最近更新时间
        this.lastUpdateTime = new Date().toLocaleString();
      } catch (error) {
        this.$q.notify({
          message: "获取作答情况失败",
          type: "negative",
        });
      }
    },

    // 获取题目和正答率相关信息(题目视图)
    async getStatisticsForCertainHomework() {
      const getStatisticsForCertainHomeworkDto = {
        homework_id: this.homeworkDetails._id,
        classroom_id: this.homeworkDetails.receiver._id,
        questionSet_id: this.homeworkDetails.questionSets[0]._id,
      };

      try {
        const { data } = await apiGetStatisticsForCertainHomework(
          getStatisticsForCertainHomeworkDto
        );

        // 处理题目列表，计算题目得分率等

        this.questionList = data.data.homeworkStatistics.map((info) => {
          let currQuestionPresetScore = 0;

          if (this.homeworkDetails.questionSets[0].questionsMeta.length == 0) {
            currQuestionPresetScore = 100;
          } else {
            currQuestionPresetScore =
              this.homeworkDetails.questionSets[0].questionsMeta.find(
                (questionMeta) => questionMeta.question_id === info.question._id
              ).presetScore;
          }

          const currQuestionMaxScore =
            currQuestionPresetScore * this.overallStuAnswerStatus.length;

          const scoringRate = info.totalScore / currQuestionMaxScore;

          return {
            ...info.question,
            shortId: info.question._id.slice(-5).toUpperCase(),
            content:
              info.question.content.slice(0, 20).replace(/<[^>]+>/g, "") +
              "...",
            scoringRate,
            scoringRateLabel: toFixed2(scoringRate * 100) + "%",
          };
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取统计信息失败",
          type: "negative",
        });
      }
    },

    // 点击学生视图表格行
    handleStuAnswerStatusViewTableRowClick(evt, row) {
      this.$router.push({
        path: "/student_homework/" + this.homeworkId,
        query: {
          u: row.username,
        },
      });
    },

    // 点击题目视图表格行
    handleQuestionViewTableRowClick(evt, row) {
      this.$router.push({
        path: "/student_homework/" + this.homeworkId,
        query: {
          u: row.username,
          m: "focus",
          q: row._id,
        },
      });
    },

    // 切换学生作答情况
    changeStuAnswerStatus(status) {
      if (status === "all") {
        this.stuAnswerStatus = this.overallStuAnswerStatus;
      } else if (status === "finished") {
        this.stuAnswerStatus = this.finishedStuAnswerStatus;
      } else if (status === "unfinished") {
        this.stuAnswerStatus = this.unfinishedStuAnswerStatus;
      }
    },

    // 切换视图
    handleSwitchViewClick(view) {
      if (view === "questionView") {
        this.getStatisticsForCertainHomework();
      } else {
        this.getHomeworkOverallAnswerStatus();
      }
      this.currentView = view;
    },

    // 刷新作业信息
    handleRefreshClick() {
      if (this.currentView === "questionView") {
        this.getStatisticsForCertainHomework();
      } else {
        this.getHomeworkOverallAnswerStatus();
      }
    },

    // 点击题目列表的id(题目编号)
    handleTableCellIdClick(row) {
      // 复制id到剪贴板
      copyToClipboard(row._id).then(() => {
        this.$q.notify({
          message: "题目编号已复制到剪贴板",
          type: "positive",
        });
      });
    },

    // 点击导出按钮
    handleExportClick() {
      let option = {};

      let fileName = `${this.homeworkDetails.title}-${this.homeworkDetails.receiver.name}-作业统计信息`;
      let sheetData = [];
      let sheetName = "";
      let sheetHeader = [];

      // 判断视图
      if (this.currentView == "stuAnswerStatusView") {
        sheetData = this.stuAnswerStatus.map((stuAnswerStatus) => {
          return {
            学号: stuAnswerStatus.username,
            姓名: stuAnswerStatus.nickname,
            作答状态: stuAnswerStatus.isFinished ? "已完成" : "未完成",
            批阅状态:
              stuAnswerStatus.correctProgress === 1 ? "已完成" : "未完成",
            得分: stuAnswerStatus.score,
          };
        });
        sheetName = "学生作答情况";
        sheetHeader = ["学号", "姓名", "作答状态", "批阅状态", "得分"];
      } else {
        sheetData = this.questionList.map((question) => {
          return {
            题目编号: question._id,
            题目内容: question.content,
            得分率: question.scoringRateLabel,
          };
        });
        sheetName = "题目得分率";
        sheetHeader = ["题目编号", "题目内容", "得分率"];
      }

      option.fileName = fileName;
      option.datas = [
        {
          sheetData: sheetData,
          sheetName: sheetName,
          sheetFilter: sheetHeader,
          sheetHeader: sheetHeader,
        },
      ];

      const toExcel = new ExportJsonExcel(option);
      toExcel.saveExcel();
    },

    // 关闭页面
    handleClosePageClick() {
      window.close();
    },
  },

  async created() {
    await this.getHomeworkDetail();
    // 获取教学班学生作答情况
    await this.getHomeworkOverallAnswerStatus();
  },
};
</script>
