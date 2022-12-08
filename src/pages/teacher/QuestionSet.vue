<template>
  <q-page>
    <q-table
      flat
      :data="questionSetList"
      :columns="questionSetListColumns"
      row-key="id"
      :pagination="questionSetListTablePagination"
      :filter="questionSetFilter"
      :dense="questionSetListTableDense"
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
          v-model="questionSetFilter"
          placeholder="搜索题集"
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

      <template v-slot:body-cell-citationTimes="props">
        <q-td :props="props">
          <q-chip
            class="cursor-pointer"
            size="sm"
            dense
            square
            icon="poll"
            :color="props.row.citationTimes > 0 ? 'primary' : 'grey'"
            text-color="white"
            :label="props.row.citationTimes"
          >
            <q-popup-proxy v-if="props.row.citationTimes > 0">
              <q-card>
                <q-card-section
                  class="bg-primary text-white text-subtitle1 q-py-sm"
                >
                  <q-icon name="poll" />
                  引用本试题集的作业
                </q-card-section>
                <q-list>
                  <q-item
                    clickable
                    v-ripple
                    :key="index"
                    v-for="(homework, index) in props.row.homeworks"
                  >
                    <q-item-section
                      >【{{ homework.receiver.name }}】{{
                        homework.title
                      }}</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-card>
            </q-popup-proxy>
          </q-chip>
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
              <q-tooltip> 编辑题集 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click.stop=""
            >
              <q-tooltip> 删除题集 </q-tooltip>
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
    <q-dialog v-model="questionSetTableFilterDig">
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
          <div class="text-h5">筛选题集</div>
          <q-separator class="q-mt-md" />
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <!-- 按创建起止时间 -->
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  outlined
                  square
                  dense
                  label="按创建起止时间(点击左侧图标进行选择)"
                  :value="questionSetTableFilterOptionsCreatedAtfromTo"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="
                            questionSetTableFilterOptions.createdAtfromTo
                          "
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
                        questionSetTableFilterOptions.createdAtfromTo = {
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
                    v-model="questionSetTableFilterOptions.isSelfOnly"
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
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { formatTimeWithWeekDay } from "src/utils/time";
import { apiFilterQuestionSets } from "src/api/teacher/questionSet";

export default {
  name: "QuestionSet",
  data() {
    return {
      // 题集列表
      questionSetList: [],
      // 题集列表表头
      questionSetListColumns: [
        {
          name: "index",
          label: "序号",
          align: "center",
          field: "questionTableIndex",
          sortable: true,
        },
        {
          name: "title",
          label: "题集名称",
          align: "center",
          field: "title",
          sortable: true,
        },
        {
          name: "citationTimes",
          label: "被引用",
          align: "center",
          field: "citationTimes",
          sortable: true,
        },
        {
          name: "creator",
          label: "组题人",
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
      // 题集列表表格紧凑模式
      questionSetListTableDense: true,
      // 题集过滤
      questionSetFilter: "",
      // 题集列表分页设置
      questionSetListTablePagination: {
        rowsPerPage: 30,
      },
      // 当前点击的题集
      currClickedRowQuestionSet: {},
      // 筛选条件
      questionSetTableFilterOptions: {
        // 创建时间起止
        createdAtfromTo: {
          from: "",
          to: "",
        },
        // 仅我创建的
        isSelfOnly: false,
      },
      // 高级筛选对话框
      questionSetTableFilterDig: false,
    };
  },

  components: {},

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    // 高级筛选起止时间
    questionSetTableFilterOptionsCreatedAtfromTo() {
      if (!this.questionSetTableFilterOptions.createdAtfromTo) {
        return "";
      }

      if (
        this.questionSetTableFilterOptions.createdAtfromTo.from &&
        this.questionSetTableFilterOptions.createdAtfromTo.to
      ) {
        return `从${this.questionSetTableFilterOptions.createdAtfromTo.from} 到 ${this.questionSetTableFilterOptions.createdAtfromTo.to}`;
      } else {
        return "";
      }
    },
  },

  methods: {
    // 获取题集列表
    async getQuestionSetList() {
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
        isSelfOnly: this.questionSetTableFilterOptions.isSelfOnly,
      };

      // 构造创建起止时间条件
      if (
        this.questionSetTableFilterOptions.createdAtfromTo.from &&
        this.questionSetTableFilterOptions.createdAtfromTo.to
      ) {
        queryCondition.createdAtfromTo = [
          new Date(this.questionSetTableFilterOptions.createdAtfromTo.from),
          new Date(this.questionSetTableFilterOptions.createdAtfromTo.to),
        ];
      }

      const payload = {
        course_id: this.currSelectedTeaCourse.courseId,
        ...queryCondition,
      };

      const { data } = await apiFilterQuestionSets(payload);

      const questions = data.data;

      this.questionSetList = questions.map((questionSet, index) => {
        return {
          id: questionSet._id,
          questionTableIndex: index + 1,
          creator: questionSet.creator.nickname,
          title: questionSet.title,
          updatedAt: formatTimeWithWeekDay(questionSet.updatedAt),
          citationTimes: questionSet.homeworks.length,
          homeworks: questionSet.homeworks,
        };
      });
    },

    // 设置当前选中的教学课程
    handleChangeTeaCourse(teaCourse) {
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

      // 获取题集列表
      this.getQuestionSetList();
    },

    // 点击题集列表的行
    handleQuestionTableRowClick(evt, row) {
      this.currClickedRowQuestionSet = row;
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
      this.questionSetTableFilterDig = true;
    },

    // 点击高级筛选对话框的确定按钮
    handleQuestionTableFilterDigConfirmBtnClick() {
      this.getQuestionSetList();
      this.questionSetTableFilterDig = false;
    },

    // 点击高级筛选对话框的重置按钮
    handleQuestionTableFilterDigResetBtnClick() {
      // 重置筛选条件
      this.questionSetTableFilterOptions.type = [];
      this.questionSetTableFilterOptions.createdAtfromTo = {
        from: "",
        to: "",
      };
      this.questionSetTableFilterOptions.isSelfOnly = false;

      // 获取题集列表
      this.getQuestionSetList();
      // 关闭高级筛选对话框
      this.questionSetTableFilterDig = false;
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");

    // 获取题集列表
    this.getQuestionSetList();
  },
};
</script>

<style></style>
