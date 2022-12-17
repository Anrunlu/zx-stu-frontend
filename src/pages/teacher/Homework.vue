<template>
  <q-page>
    <q-table
      flat
      :data="homeworkList"
      :columns="homeworkColumns"
      row-key="_id"
      @row-click="handleHomeworkClick"
      :filter="homeworkFilter"
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
          <!-- 选择作业类型 -->
          <q-btn-dropdown
            :icon="
              currSelectedCategory.icon
                ? currSelectedCategory.icon
                : 'touch_app'
            "
            :label="
              !currSelectedCategory.value
                ? '作业类型'
                : currSelectedCategory.label
            "
            color="positive"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeHomeworkCategory(category)"
                :key="index"
                v-for="(category, index) in homeworkCategoryOptions"
              >
                <q-item-section avatar>
                  <q-icon :name="category.icon" />
                </q-item-section>
                <q-item-section>
                  {{ category.label }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </template>

      <template v-slot:top-right="props">
        <q-input
          dense
          debounce="300"
          v-model="homeworkFilter"
          placeholder="搜索作业"
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

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            square
            size="sm"
            :icon="
              props.row.statusByTime == '已截止'
                ? 'alarm_off'
                : props.row.statusByTime == '未开始'
                ? 'alarm_add'
                : 'alarm'
            "
            :color="
              props.row.statusByTime == '已截止'
                ? ''
                : props.row.statusByTime == '未开始'
                ? 'primary'
                : 'positive'
            "
            :text-color="props.row.statusByTime == '已截止' ? 'grey' : 'white'"
            dense
            :label="props.row.statusByTime"
          />

          <q-tooltip
            :disable="$q.platform.is.mobile"
            v-close-popup
            :label="props.row.endtime"
          >
            截止时间{{ props.row.endtimeFormatted }}
          </q-tooltip>
        </q-td>
      </template>

      <!-- <template v-slot:body-cell-status="props">
        <q-linear-progress size="25px" :value="props.row.status" color="accent">
          <div class="absolute-full flex flex-center">
            <q-badge
              color="white"
              text-color="accent"
              :label="props.row.status"
            />
          </div>
        </q-linear-progress>
      </template> -->

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="insert_chart"
              @click.stop=""
            >
              <q-tooltip> 查看成绩 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click.stop="handleModifyHomeworkClickClick(props.row)"
            >
              <q-tooltip> 修改作业 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="update"
              @click.stop=""
            >
              <q-tooltip> 延长学生作答时间 </q-tooltip>
            </q-btn>
            <!-- <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="fact_check"
              @click.stop="isReCriticismFn(props.row), (reCriticismDig = true)"
            >
              <q-tooltip> 重新批判该次作业 </q-tooltip>
            </q-btn> -->
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click.stop=""
            >
              <q-tooltip> 删除作业 </q-tooltip>
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

    <!-- 作业编辑对话框 -->
    <q-dialog v-model="homeworkEditingDig" persistent>
      <EditingHomeworkCard
        :homeworkId="currClickedRowHomework.id"
        :mode="`modify`"
        @closeEditingHomeworkDialog="handleCloseEditingHomeworkDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { apiGetHomeworks } from "src/api/teacher/homework";
import { mapGetters } from "vuex";
import {
  computeHomeworkStatusByTime,
  formatTimeWithWeekDay,
} from "src/utils/time";
import EditingHomeworkCard from "src/components/teacher/homework/EditingHomeworkCard.vue";
import { getObjectShortId } from "src/utils/common";

export default {
  name: "Homework",
  data() {
    return {
      // 作业列表
      homeworkList: [],
      // 作业列表表头
      homeworkColumns: [
        {
          name: "shortId",
          label: "作业编号",
          align: "left",
          field: "shortId",
          sortable: true,
        },
        {
          name: "title",
          label: "作业标题",
          field: "title",
          align: "center",
          sortable: true,
        },
        {
          name: "teachClassroom",
          label: "教学班",
          align: "center",
          field: (row) => row.receiver.name,
          sortable: true,
        },
        {
          name: "starttime",
          label: "开始时间",
          align: "center",
          field: (row) => formatTimeWithWeekDay(row.starttime),
          sortable: true,
        },
        {
          name: "status",
          label: "作业状态",
          align: "center",
          sortable: true,
        },
        // {
        //   name: "status",
        //   label: "批改进度",
        //   align: "center",
        //   field: "status",
        //   sortable: true,
        // },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      // 当前选中的作业分类
      currSelectedCategory: { value: "", label: "", icon: "" },
      // 作业过滤
      homeworkFilter: "",
      // 当前点击的那一会作业
      currClickedRowHomework: {},
      // 作业编辑对话框
      homeworkEditingDig: false,
    };
  },

  components: {
    EditingHomeworkCard,
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      homeworkCategoryOptions: "homeworkCategoryOptions",
    }),
  },

  methods: {
    async handleGetHomeworkList(category) {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "negative",
        });
        return;
      }

      // 构造请求参数
      const payload = {
        status: "正常",
        teacourse_id: this.currSelectedTeaCourse.id,
        category,
      };

      // 发送请求
      try {
        const { data } = await apiGetHomeworks(payload);
        this.homeworkList = data.data.map((homework, index) => {
          return {
            ...homework,
            shortId: getObjectShortId(homework),
            endtimeFormatted: formatTimeWithWeekDay(homework.endtime),
            statusByTime: computeHomeworkStatusByTime(homework),
          };
        });
      } catch (error) {
        this.$q.notify({
          message: "获取作业列表失败",
          type: "negative",
        });
      }
    },

    // 设置当前选中的教学课程
    handleChangeTeaCourse(teaCourse) {
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

      // 如果当前选中的作业分类不为空，则重新获取作业列表
      if (this.currSelectedCategory.value) {
        this.handleGetHomeworkList(this.currSelectedCategory.value);
      }
    },

    // 处理作业分类选项改变
    handleChangeHomeworkCategory(category) {
      this.currSelectedCategory = category;
      this.handleGetHomeworkList(category.value);
    },

    // 处理点击作业列表中的某一行
    handleHomeworkClick(row) {
      this.currClickedRowHomework = row;
      // this.$router.push({
      //   name: "homeworkDetail",
      //   params: {
      //     homeworkId: row.id,
      //   },
      // });
    },

    // 表格上修改作业按钮点击事件
    handleModifyHomeworkClickClick(row) {
      this.currClickedRowHomework = row;
      this.homeworkEditingDig = true;
    },

    // 处理作业编辑对话框关闭事件
    handleCloseEditingHomeworkDialog() {
      this.homeworkEditingDig = false;
      // 刷新作业列表
      this.handleGetHomeworkList(this.currSelectedCategory.value);
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");

    // 获取作业列表
    this.handleGetHomeworkList("课后作业");
  },
};
</script>

<style></style>
