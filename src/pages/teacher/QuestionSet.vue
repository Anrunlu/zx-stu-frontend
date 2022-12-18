<template>
  <q-page>
    <q-table
      flat
      :data="questionSetList"
      :columns="questionSetListColumns"
      row-key="_id"
      :filter="questionSetFilter"
      @row-click="handleQuestionTableRowClick"
      :pagination="tablePagination"
      :dense="tableDense"
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
          <!-- 创建题集 -->
          <q-btn color="accent" outline icon="add" label="创建题集">
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 100px">
                <q-item
                  to="questionBank"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section avatar>
                    <q-icon name="forum" />
                  </q-item-section>
                  <q-item-section>题库创建</q-item-section>
                </q-item>
                <q-item
                  to="questionBank"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section avatar>
                    <q-icon name="title" />
                  </q-item-section>
                  <q-item-section>题号导入</q-item-section>
                </q-item>
                <q-item
                  to="questionBank"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section avatar>
                    <q-icon name="auto_mode" />
                  </q-item-section>
                  <q-item-section>自动组题</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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
                <!-- 标题栏 -->
                <CardBar title="引用本试题集的作业" icon="poll" />

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
              @click.stop="handleTableCellRemoveBtnClick(props.row)"
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
        <CardBar title="筛选题集" icon="filter_list" />
        <q-card-section>
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

    <!-- 删除试题集对话框 -->
    <q-dialog v-model="removeQuestionSetDig">
      <q-card>
        <CardBar title="删除试题集" icon="warning" bgColor="negative" />
        <q-card-section>
          移除题集【{{ currClickedRowQuestionSet.shortId }}】将<span
            style="color: red"
            >同时删除引用本试题集的作业</span
          >，操作不可恢复！
          <ol>
            <li
              v-for="(homework, index) in currClickedRowQuestionSet.homeworks"
              :key="index"
            >
              【{{ homework.receiver.name }}】{{ homework.title }}
            </li>
          </ol>

          <q-input
            v-model="removeQuestionSetConfirmText"
            type="text"
            outlined
            square
            dense
            :label="`请输入“${currClickedRowQuestionSet.shortId}”以确认删除`"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="negative"
            icon="delete"
            label="确认删除"
            @click="handleRemoveQuestionSetDigConfirmBtnClick"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";
import { copyToClipboard } from "quasar";
import { formatTimeWithWeekDay } from "src/utils/time";
import {
  apiFilterQuestionSets,
  apiRemoveQuestionSet,
} from "src/api/teacher/questionSet";
import { getObjectShortId } from "src/utils/common";

export default {
  name: "QuestionSet",
  data() {
    return {
      // 题集列表
      questionSetList: [],
      // 题集列表表头
      questionSetListColumns: [
        {
          name: "shortId",
          label: "题集编号",
          align: "left",
          field: "shortId",
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
      // 删除题集对话框
      removeQuestionSetDig: false,
      // 删除题集确认文本
      removeQuestionSetConfirmText: "",
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
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
          _id: questionSet._id,
          shortId: getObjectShortId(questionSet),
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

    // 点击创建题集按钮
    handleQuestionSetTableAddQuestionSetBtnClick() {},

    // 点击题集列表的行
    handleQuestionTableRowClick(evt, row) {
      this.currClickedRowQuestionSet = row;
    },

    // 点击题集列表的删除按钮
    handleTableCellRemoveBtnClick(row) {
      this.currClickedRowQuestionSet = row;
      this.removeQuestionSetDig = true;
    },

    // 点击试题集编号
    handleTableCellIdClick(row) {
      // 复制id到剪贴板
      copyToClipboard(row._id).then(() => {
        this.$q.notify({
          message: "试题集编号已复制到剪贴板",
          type: "positive",
        });
      });
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

    // 点击删除题集对话框的确定按钮
    async handleRemoveQuestionSetDigConfirmBtnClick() {
      // 校验
      if (
        this.removeQuestionSetConfirmText !==
        this.currClickedRowQuestionSet.shortId
      ) {
        this.$q.notify({
          message: "输入的确认文本不匹配",
          type: "negative",
        });
        return;
      }

      // 移除题集
      try {
        await apiRemoveQuestionSet(this.currClickedRowQuestionSet._id);
        this.$q.notify({
          message: "移除成功",
          type: "positive",
        });
        // 重置确认文本
        this.removeQuestionSetConfirmText = "";
        // 重新获取题集列表
        this.getQuestionSetList();
        this.removeQuestionSetDig = false;
      } catch (error) {
        this.$q.notify({
          message: "移除失败",
          type: "negative",
        });
      }
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
