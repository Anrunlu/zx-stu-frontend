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
      @row-click="handleQuestionTableRowClick"
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

      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <QuestionChip :questionType="props.row.type" :size="'xs'" />
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
              icon="edit"
              @click.stop=""
            >
              <q-tooltip> 编辑题目 </q-tooltip>
            </q-btn>
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
    <q-dialog v-model="questionCarDig"> <QuestionCar /> </q-dialog>

    <!-- 题目预览对话框 -->
    <q-dialog v-model="questionViewDig">
      <QuestionViewCardVue
        :questionId="currClickedRowHomework.id"
        :in-question-car="currClickedRowHomework.inQuestionCar"
        @addQuestionToCar="handleAddQuestionToCarReq"
        @removeQuestionFromCar="handleRemoveQuestionFromCarReq"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { formatTimeWithWeekDay } from "src/utils/time";
import { apiFilterQuestions } from "src/api/teacher/questionBank";
import QuestionCar from "src/components/teacher/questionBank/QuestionCarCard.vue";
import QuestionViewCardVue from "src/components/teacher/questionBank/QuestionViewCard.vue";
import QuestionChip from "src/components/common/QuestionChip.vue";

export default {
  name: "QuestionBank",
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
          field: "questionTableIndex",
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
      // 当前点击的题目
      currClickedRowHomework: {},
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
      // 高级筛选对话框
      questionTableFilterDig: false,
      // 题车对话框
      questionCarDig: false,
      // 题目编辑对话框
      questionViewDig: false,
    };
  },

  components: {
    QuestionCar,
    QuestionViewCardVue,
    QuestionChip,
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("questionCar", {
      questionCarCountInfo: "questionsCountInfo",
      questionTypes: "questionTypes",
    }),

    questionCar: {
      get() {
        return this.$store.state.questionCar.questions;
      },
      set(val) {
        // 初始化题目是否在题车状态
        this.questionList.forEach((question) => {
          question.inQuestionCar = false;
        });

        this.$store.commit("questionCar/setQuestions", val);
      },
    },

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
  },

  methods: {
    // 获取题目列表
    async getQuestionList() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "warning",
        });
        return;
      }

      // 构造查询条件
      const queryCondition = {
        type: this.questionTableFilterOptions.type || [],
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
          questionTableIndex: index + 1,
          creator: question.creator.nickname,
          presetScore: 0,
          type: question.type,
          // 用于排序
          sortOrder:
            question.type === "单选"
              ? 0
              : question.type === "多选"
              ? 1
              : question.type === "判断"
              ? 2
              : question.type === "填空"
              ? 3
              : 4,
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

    // 点击题目列表的行
    handleQuestionTableRowClick(evt, row) {
      this.currClickedRowHomework = row;
      this.questionViewDig = true;
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
      this.questionTableFilterDig = false;
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
      this.$store.commit("questionCar/sortQuestions");

      this.questionCarDig = true;
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

    // 处理子组件传递过来的题目添加到题车的请求
    handleAddQuestionToCarReq(questionId) {
      // 根据题目id获取题目信息
      const question = this.questionList.find(
        (question) => question.id === questionId
      );
      // 添加到题车
      this.$store.commit("questionCar/addQuestion", question);
    },

    // 处理子组件传递过来的题目从题车中移除的请求
    handleRemoveQuestionFromCarReq(questionId) {
      // 从题车移除
      this.$store.commit("questionCar/removeQuestion", questionId);
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
