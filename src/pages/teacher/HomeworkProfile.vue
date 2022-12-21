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
              <div class="q-gutter-md">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                quo quam facere, minus amet neque nemo architecto eius maiores
                dolores animi repellat repudiandae veritatis molestias nam sunt
                optio quod? Quis.
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 主体区域 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8">
            <q-table
              :data="overallStuAnswerStatus"
              :columns="stuAnswerStatusColumns"
              :dense="tableDense"
              :pagination="pagination"
              :filter="stufilter"
              row-key="_id"
            >
              <template v-slot:top-left>
                <div class="q-gutter-sm row">
                  <q-btn
                    color="primary"
                    icon="filter_list"
                    label="筛选"
                  ></q-btn>
                  <q-btn color="positive" icon="download" label="导出"></q-btn>
                </div>
              </template>

              <template v-slot:top-right>
                <q-input
                  color="primary"
                  dense
                  debounce="300"
                  v-model="stufilter"
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
                      props.value > 0
                        ? 'blue-4'
                        : props.value == 1
                        ? 'green-4'
                        : 'grey-4'
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
                      <q-tooltip> 作业延期 </q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      size="sm"
                      color="primary"
                      icon="fact_check"
                    >
                      <q-tooltip> 重新批判</q-tooltip>
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
          <span style="font-size: 0.5rem; color: #9e9e9e">上次更新：</span>
        </div>
      </div>
      <div class="float-right q-mr-sm">
        <q-btn flat square label="保存" icon="save" @click="handleSaveClick" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters } from "vuex";
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
      pagination: {
        rowsPerPage: 0,
        sortBy: "username",
      },
      // 学生筛选
      stufilter: "",
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

  computed: {
    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
    }),
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
