<template>
  <q-page>
    <q-table
      flat
      :data="homeworkList"
      :columns="homeworkColumns"
      row-key="index"
      @row-click="handleHomeworkClick"
      :pagination="homeworkListTablePagination"
      :filter="homeworFilter"
      :dense="homeworkListTableDense"
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
            :label="
              !currSelectedCategory ? '选择作业类型' : currSelectedCategory
            "
            color="positive"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleGetHomeworkList(category)"
                :key="index"
                v-for="(category, index) in homeworkCategoryOptions"
              >
                <q-item-section>
                  <q-item-label>{{ category }}</q-item-label>
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
          v-model="homeworFilter"
          placeholder="搜索"
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
              @click.stop=""
            >
              <q-tooltip> 修改作业 </q-tooltip>
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
  </q-page>
</template>

<script>
import { apiGetHomeworks } from "src/api/teacher/homework";
import { mapGetters } from "vuex";
import { formatTimeWithWeekDay } from "src/utils/time";
export default {
  data() {
    return {
      // 作业列表
      homeworkList: [],
      // 作业列表表头
      homeworkColumns: [
        {
          name: "index",
          label: "序号",
          field: "index",
          align: "center",
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
          name: "endtime",
          label: "截止时间",
          align: "center",
          field: (row) => formatTimeWithWeekDay(row.endtime),
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

      // 作业列表表格紧凑模式
      homeworkListTableDense: true,

      // 当前选中的作业分类
      currSelectedCategory: "",

      // 作业过滤
      homeworFilter: "",

      // 作业列表分页设置
      homeworkListTablePagination: {
        rowsPerPage: 30,
      },

      // 作业类型选项
      homeworkCategoryOptions: [
        "课前预习",
        "课堂作业",
        "课后作业",
        "课程实验",
        "课程论文",
        "课程设计",
        "毕业设计",
        "期中考试",
        "期末考试",
      ],
    };
  },

  components: {},

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
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

      this.currSelectedCategory = category;

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
            index: index + 1,
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
      if (this.currSelectedCategory) {
        this.handleGetHomeworkList(this.currSelectedCategory);
      }
    },

    // 处理点击作业列表中的某一行
    handleHomeworkClick(row) {
      console.log(row);
      // this.$router.push({
      //   name: "homeworkDetail",
      //   params: {
      //     homeworkId: row.id,
      //   },
      // });
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");
  },
};
</script>

<style></style>
