<template>
  <q-page>
    <q-table
      flat
      :data="questionList"
      :columns="questionColumns"
      row-key="id"
      :pagination="questionListTablePagination"
      :filter="questionFilter"
      :dense="questionListTableDense"
      :selected.sync="questionCar"
      selection="multiple"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <!-- 选择课程 -->
          <q-btn-dropdown
            :label="
              !currSelectedTeaCourse ? '选择课程' : currSelectedTeaCourse.name
            "
            color="primary"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeTeaCourse(teaCourse)"
                :key="index"
                v-for="(teaCourse, index) in teaCourseList"
              >
                <q-item-section>
                  <q-item-label>{{ teaCourse.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 高级筛选 -->
          <q-btn
            color="positive"
            icon="filter_list"
            label="高级筛选"
            @click="handleQuestionTableFilterBtnClick"
          />
        </div>
      </template>

      <template v-slot:top-right="props">
        <q-input
          dense
          debounce="300"
          v-model="questionFilter"
          placeholder="搜索题目"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "退出全屏" : "全屏"
          }}</q-tooltip>
        </q-btn>
      </template>

      <template v-slot:body-cell-status="props">
        <q-linear-progress size="25px" :value="props.row.status" color="accent">
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="accent"
              :label="props.row.status"
            />
          </div>
        </q-linear-progress>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click.stop=""
            >
              <q-tooltip> 修改题目 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="access_time"
              @click.stop=""
            >
              <q-tooltip> 延长某一个学生作答时间 </q-tooltip>
            </q-btn>
            <!-- <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="fact_check"
              @click.stop="isReCriticismFn(props.row), (reCriticismDig = true)"
            >
              <q-tooltip> 重新批判该次题目 </q-tooltip>
            </q-btn> -->
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click.stop=""
            >
              <q-tooltip> 删除题目 </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6"> 暂无数据 </span>
        </div>
      </template>
    </q-table>

    <!-- 高级筛选对话框 -->
    <q-dialog v-model="questionTableFilterDig">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section>
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
          <div class="text-h5">筛选题目</div>
          <q-separator class="q-mt-md" />
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <!-- 按题目类型 -->
            <q-item class="col-12">
              <q-item-section>
                <q-select
                  outlined
                  square
                  clearable
                  multiple
                  use-chips
                  :options="questionTableFilterOptions.typeOptions"
                  v-model="questionTableFilterOptions.type"
                  label="按题目类型"
                  dense
                >
                  <template v-slot:prepend>
                    <q-icon name="forum" />
                  </template>
                </q-select>
              </q-item-section>
            </q-item>

            <!-- 按创建起止时间 -->
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  outlined
                  square
                  dense
                  label="按创建起止时间(点击左侧图标进行选择)"
                  :value="questionTableFilterOptionsCreatedAtfromTo"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="questionTableFilterOptions.createdAtfromTo"
                          mask="YYYY-MM-DD"
                          range
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="确定"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="close"
                      @click="
                        questionTableFilterOptions.createdAtfromTo = {
                          from: '',
                          to: '',
                        }
                      "
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </q-item-section>
            </q-item>

            <q-item class="col-12">
              <q-item-section top avatar>
                <div>
                  <q-toggle
                    name="isSelfOnly"
                    v-model="questionTableFilterOptions.isSelfOnly"
                    label="仅显示我创建的"
                    icon="person"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            flat
            label="重置"
            @click="handleQuestionTableFilterDigResetBtnClick"
          />
          <q-btn
            color="primary"
            @click="handleQuestionTableFilterDigConfirmBtnClick"
          >
            确定
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 题车悬浮按钮 -->
    <q-page-sticky
      position="bottom"
      :offset="[-20, 18]"
      v-if="questionCar.length > 0"
    >
      <q-btn-group push rounded>
        <q-btn
          icon="add_shopping_cart"
          color="primary"
          :label="`已选(总${questionCarCountInfo.total}|单选${questionCarCountInfo.singleChoice}|多选${questionCarCountInfo.multipleChoice}|判断${questionCarCountInfo.trueOrFalse}|填空${questionCarCountInfo.fillInBlank}|解答${questionCarCountInfo.jieda})`"
          @click="handleViewQuestionCarBtnClick"
          ><q-tooltip
            content-class="bg-indigo"
            content-style="font-size: 16px"
            :offset="[10, 10]"
            >点击查看题车</q-tooltip
          >
        </q-btn>
        <q-btn
          icon="clear_all"
          color="red-5"
          @click="handleQuestionCarClearBtnClick"
        >
          <q-tooltip
            content-class="bg-indigo"
            content-style="font-size: 16px"
            :offset="[10, 10]"
            >清空题车</q-tooltip
          >
        </q-btn>
      </q-btn-group>
    </q-page-sticky>

    <!-- 题车对话框 -->
    <q-dialog v-model="questionCarDig">
      <q-card style="width: 1100px; max-width: 80vw">
        <q-card-section class="bg-primary text-white q-py-sm">
          <div class="text-h5">
            <q-icon name="add_shopping_cart" />
            题车
            <q-btn
              round
              flat
              dense
              icon="close"
              class="float-right"
              color="white"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-sm">
          <q-btn color="primary" icon="settings" label="设置分数" />
        </q-card-section>
        <q-card-section>
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              :icon="questionIcon[qType.label]"
              :label="`${qType.label}(${questionCarCountInfo[qType.value]})`"
              :key="index"
              :class="questionClass[qType.label]"
              v-for="(qType, index) in questionTypes"
            >
              <draggable
                class="list-group"
                :list="questionCar"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
              >
                <q-list
                  v-for="(question, index) in questionCar.filter(
                    (question) => question.type === qType.label
                  )"
                  :key="index"
                  bordered
                  class="rounded-borders cursor-move"
                  dense
                >
                  <q-item class="bg-white">
                    <q-item-section avatar>
                      <q-chip
                        :color="questionBadgeColor[question.type]"
                        text-color="white"
                        :label="question.type"
                        :icon="questionIcon[question.type]"
                        square
                        size="sm"
                      />
                    </q-item-section>

                    <q-item-section style="font-size: 18px" class="text-grey-9">
                      {{ `${index + 1}、${question.content}` }}
                    </q-item-section>

                    <q-item-section class="col-1">
                      <span>{{ question.creator }}</span>
                    </q-item-section>

                    <span style="width: 145px" class="inline-block text-grey-9"
                      ><span> {{ question.updatedAt }}</span></span
                    >

                    <!-- <q-item-section class="col-2">
                <div class="q-pa-sm q-gutter-md">
                  <q-badge
                    filled
                    class="q-pa-sm text-bold"
                    v-bind:key="index"
                    v-for="(tag, index) in question.tags"
                    :color="tag.color"
                    style="font-size: 15px"
                    >{{ tag.name }}
                  </q-badge>
                </div>
              </q-item-section> -->

                    <q-item-section side>
                      <div class="text-grey-8 q-gutter-xs">
                        <q-btn
                          size="12px"
                          color="primary"
                          flat
                          dense
                          round
                          icon="edit"
                        />
                        <q-btn
                          size="12px"
                          color="red"
                          flat
                          dense
                          round
                          icon="delete"
                          @click="
                            handleQuestionCarQuestionRemoveBtnClick(question.id)
                          "
                        />
                        <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </draggable>
            </q-expansion-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="关闭" />
          <q-btn flat label="创建试题集" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { formatTimeWithWeekDay } from "src/utils/time";
import { apiFilterQuestions } from "src/api/teacher/questionBank";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      // 题目列表
      questionList: [],
      // 题目列表表头
      questionColumns: [
        {
          name: "index",
          label: "序号",
          align: "left",
          field: "index",
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
          name: "difficulty",
          label: "难度",
          align: "center",
          field: "difficulty",
          sortable: true,
        },
        {
          name: "creator",
          label: "出题人",
          align: "center",
          field: "creator",
          sortable: true,
        },
        {
          name: "updatedAt",
          label: "创建/更新时间",
          align: "center",
          field: "updatedAt",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      // 题目列表表格紧凑模式
      questionListTableDense: true,
      // 当前选中的题目分类
      currSelectedQuestionType: "",
      // 题目过滤
      questionFilter: "",
      // 题目列表分页设置
      questionListTablePagination: {
        rowsPerPage: 30,
      },
      // 当前点击的那一会题目
      currClickedRowHomework: {},
      // 题目类型选项
      questionCategoryOptions: [
        "课前预习",
        "课堂题目",
        "课后题目",
        "课程实验",
        "课程论文",
        "课程设计",
        "毕业设计",
        "期中考试",
        "期末考试",
      ],
      // 筛选条件
      questionTableFilterOptions: {
        // 题目类型
        typeOptions: ["单选", "多选", "判断", "填空", "解答"],
        // 已筛选题目类型
        type: [],
        // 创建时间起止
        createdAtfromTo: {
          from: "",
          to: "",
        },
        // 仅我创建的
        isSelfOnly: false,
      },
      // 题车
      questionCar: [],
      // 高级筛选对话框
      questionTableFilterDig: false,
      // 题车对话框
      questionCarDig: false,

      questionClass: {
        单选: "border-single-choice",
        多选: "border-multiple-choice",
        判断: "border-true-or-false",
        填空: "border-fill-in-blank",
        解答: "border-jieda",
      },

      questionIcon: {
        单选: "radio_button_checked",
        多选: "check_box",
        判断: "compare_arrows",
        填空: "border_color",
        解答: "description",
      },

      questionBadgeColor: {
        单选: "blue",
        多选: "green",
        判断: "red",
        填空: "orange",
        解答: "purple",
      },

      questionTypes: [
        {
          label: "单选",
          value: "singleChoice",
        },
        {
          label: "多选",
          value: "multipleChoice",
        },
        {
          label: "判断",
          value: "trueOrFalse",
        },
        {
          label: "填空",
          value: "fillInBlank",
        },
        {
          label: "解答",
          value: "jieda",
        },
      ],
    };
  },

  components: {
    draggable,
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    // 高级筛选起止时间
    questionTableFilterOptionsCreatedAtfromTo() {
      if (!this.questionTableFilterOptions.createdAtfromTo) {
        return "";
      }

      if (
        this.questionTableFilterOptions.createdAtfromTo.from &&
        this.questionTableFilterOptions.createdAtfromTo.to
      ) {
        return `从${this.questionTableFilterOptions.createdAtfromTo.from} 到 ${this.questionTableFilterOptions.createdAtfromTo.to}`;
      } else {
        return "";
      }
    },

    // 题车题目的统计信息
    questionCarCountInfo() {
      return {
        // 总数
        total: this.questionCar.length,
        // 单选题
        singleChoice: this.questionCar.filter(
          (question) => question.type === "单选"
        ).length,
        // 多选题
        multipleChoice: this.questionCar.filter(
          (question) => question.type === "多选"
        ).length,
        // 判断题
        trueOrFalse: this.questionCar.filter(
          (question) => question.type === "判断"
        ).length,
        // 填空题
        fillInBlank: this.questionCar.filter(
          (question) => question.type === "填空"
        ).length,
        // 解答题
        jieda: this.questionCar.filter((question) => question.type === "解答")
          .length,
      };
    },

    // 拖拽组件设置
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  methods: {
    async getQuestionList() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "negative",
        });
        return;
      }

      // 构造查询条件
      const queryCondition = {
        type: this.questionTableFilterOptions.type,
        isSelfOnly: this.questionTableFilterOptions.isSelfOnly,
      };

      // 构造创建起止时间条件
      if (
        this.questionTableFilterOptions.createdAtfromTo.from &&
        this.questionTableFilterOptions.createdAtfromTo.to
      ) {
        queryCondition.createdAtfromTo = [
          new Date(this.questionTableFilterOptions.createdAtfromTo.from),
          new Date(this.questionTableFilterOptions.createdAtfromTo.to),
        ];
      }

      const payload = {
        course_id: this.currSelectedTeaCourse.courseId,
        ...queryCondition,
      };

      const { data } = await apiFilterQuestions(payload);

      const questions = data.data;

      this.questionList = questions.map((question, index) => {
        return {
          id: question._id,
          index: index + 1,
          creator: question.creator.nickname,
          type: question.type,
          // 截取一部分内容
          content: question.content.slice(0, 20),
          difficulty: question.difficulty,
          updatedAt: formatTimeWithWeekDay(question.updatedAt),
        };
      });
    },

    // 设置当前选中的教学课程
    handleChangeTeaCourse(teaCourse) {
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

      // 获取题目列表
      this.getQuestionList();
    },

    // 点击表格上的高级筛选按钮
    handleQuestionTableFilterBtnClick() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "negative",
        });
        return;
      }

      // 打开高级筛选对话框
      this.questionTableFilterDig = true;
    },

    // 点击高级筛选对话框的确定按钮
    handleQuestionTableFilterDigConfirmBtnClick() {
      this.getQuestionList();
    },

    // 点击高级筛选对话框的重置按钮
    handleQuestionTableFilterDigResetBtnClick() {
      // 重置筛选条件
      this.questionTableFilterOptions.type = [];
      this.questionTableFilterOptions.createdAtfromTo = {
        from: "",
        to: "",
      };
      this.questionTableFilterOptions.isSelfOnly = false;

      // 获取题目列表
      this.getQuestionList();
      // 关闭高级筛选对话框
      this.questionTableFilterDig = false;
    },

    // 点击查看题车按钮
    handleViewQuestionCarBtnClick() {
      // 按照题目类型排序
      this.questionCar = this.questionCar.sort((a, b) => {
        return a.type.localeCompare(b.type);
      });
      // this.questionCar = this.questionCar.sort((a, b) => a.type - b.type);
      this.questionCarDig = true;
    },

    // 点击题车中移除题目按钮
    handleQuestionCarQuestionRemoveBtnClick(questionId) {
      // 根据题目id从题车中移除题目
      this.questionCar = this.questionCar.filter(
        (question) => question.id !== questionId
      );
    },

    // 点击清空题车按钮
    handleQuestionCarClearBtnClick() {
      // 弹窗提示
      this.$q
        .dialog({
          title: "请确认",
          message: `确定要清空题车吗？`,
          ok: {
            label: "清空",
            push: true,
            color: "negative",
          },
          cancel: {
            label: "取消",
            push: true,
          },
          persistent: true,
        })
        .onOk(async () => {
          // 清空题车
          this.questionCar = [];
        })
        .onCancel(() => {
          return;
        });
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");

    // 获取题目列表
    this.getQuestionList();
  },
};
</script>

<style>
.border-single-choice {
  border-left: 5px solid blue !important;
}

.border-multiple-choice {
  border-left: 5px solid green !important;
}

.border-true-or-false {
  border-left: 5px solid red !important;
}

.border-fill-in-blank {
  border-left: 5px solid orange !important;
}

.border-jieda {
  border-left: 5px solid purple !important;
}
</style>
