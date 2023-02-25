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
                v-for="(course, index) in courseList"
              >
                <q-item-section>
                  <q-item-label>{{ course.name }}</q-item-label>
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
          <!-- 发布作业 -->
          <!-- <q-btn
            color="accent"
            outline
            icon="publish"
            label="发布作业"
            @click="handlePublishHomeworkBtnClick"
          /> -->
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

      <template v-slot:body-cell-correctProgress="props">
        <q-td :props="props">
          <q-chip
            square
            size="sm"
            :icon="props.value >= 1 ? 'task_alt' : 'schedule'"
            :color="
              props.value >= 1
                ? 'positive'
                : props.value > 0
                ? 'primary'
                : 'grey-5'
            "
            text-color="white"
            dense
            :label="`${props.value * 100}%`"
          />
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
              @click.stop="handleModifyHomeworkClick(props.row)"
            >
              <q-tooltip> 修改作业 </q-tooltip>
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
              @click.stop="handleRemoveHomeworkClick(props.row)"
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
    <q-dialog v-model="homeworkEditDig" persistent>
      <HomeworkEditCard
        :homeworkId="currClickedRowHomework._id"
        @closeEditingHomeworkDialog="handleCloseEditingHomeworkDialog"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { apiGetCourses } from "src/api/student";
import { apiGetHomeworks } from "src/api/student/homework";
import { mapGetters } from "vuex";
import { copyToClipboard } from "quasar";
export default {
  name: "Homework",
  data() {
    return {
      // 作业列表
      homeworkList: [],
      // 作业列表表头
      homeworkColumns: [
        {
          name: "title",
          label: "作业名",
          align: "center",
          field: "title",
          sortable: true,
        },
        {
          name: "endtime",
          label: "截止时间",
          align: "center",
          field: "endtime",
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: "状态",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "进度",
          sortable: true,
        },
      ],
      //课程列表
      courseList: [],
      // 当前选中的作业分类
      currSelectedCategory: { value: "", label: "", icon: "" },
      // 作业过滤
      homeworkFilter: "",
      // 当前点击的作业
      currClickedRowHomework: {},
      // 作业编辑对话框
      homeworkEditDig: false,
      //未完成作业
      UnfinishedCourseTypeHomework: [],
      //作业类型
      courseTypeList: [
        "课前预习",
        "互动课堂",
        "课后作业",
        "课程实验",
        "期中考试",
        "期末考试",
      ],
    };
  },

  components: {
    HomeworkEditCard: () =>
      import("src/components/teacher/homework/HomeworkEditCard.vue"),
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

  watch: {
    currSelectedTeaCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.homeworkList = [];
        }
      },
      deep: true,
    },
  },

  methods: {
    // 获取作业列表
    // async handleGetHomeworkList() {
    //   // 校验是否选择了课程
    //   if (!this.currSelectedTeaCourse) {
    //     this.$q.notify({
    //       message: "请先选择课程",
    //       type: "warning",
    //     });
    //     return;
    //   }

    //   // 构造请求参数
    //   const payload = {
    //     status: "正常",
    //     teacourse_id: this.currSelectedTeaCourse.id,
    //     category: this.currSelectedCategory.value,
    //   };

    //   // 发送请求
    //   try {
    //     const { data } = await apiGetHomeworks(payload);
    //     data.data.forEach((homework) => {
    //       preProcessHomeworkDetails(homework);
    //     });
    //     this.homeworkList = data.data;
    //   } catch (error) {
    //     this.$q.notify({
    //       message: "获取作业列表失败",
    //       type: "negative",
    //     });
    //   }
    // },

    // // 删除作业
    // async removeHomework() {
    //   // 移除作业
    //   try {
    //     await apiRemoveHomework(this.currClickedRowHomework._id);
    //     this.$q.notify({
    //       message: "删除成功",
    //       type: "positive",
    //     });
    //     // 重新获取作业列表
    //     this.handleGetHomeworkList();
    //     this.removeHomeworkDig = false;
    //     this.currClickedRowHomework = {};
    //   } catch (error) {
    //     this.$q.notify({
    //       message: "删除失败",
    //       type: "negative",
    //     });
    //   }
    // },

    // // 设置当前选中的教学课程
    // handleChangeTeaCourse(teaCourse) {
    //   this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

    //   // 如果当前选中的作业分类不为空，则重新获取作业列表
    //   if (this.currSelectedCategory.value) {
    //     this.handleGetHomeworkList(this.currSelectedCategory.value);
    //   }
    // },

    // 处理作业分类选项改变
    handleChangeHomeworkCategory(category) {
      this.currSelectedCategory = category;
      this.handleGetHomeworkList();
    },

    // // 处理点击发布作业按钮
    // handlePublishHomeworkBtnClick() {
    //   // 校验是否选择了课程
    //   if (!this.currSelectedTeaCourse) {
    //     this.$q.notify({
    //       message: "请先选择课程",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   this.$q.notify({
    //     message: "已跳转到题集管理页面，请点击试题集发布按钮完成作业发布",
    //     position: "top",
    //     icon: "announcement",
    //     progress: true,
    //     color: "accent",
    //     textColor: "white",
    //     classes: "glossy",
    //   });
    //   this.$router.push("questionSet");
    // },

    // 处理点击作业列表中的某一行
    handleHomeworkClick(evt, row) {
      this.currClickedRowHomework = row;
      // 跳转到作业概览页面
      // 在新标签页打开
      // 新标签页打开
      const routeData = this.$router.resolve(`/homework/${row._id}`);
      window.open(routeData.href, "_blank");
    },

    // 点击作业编号
    handleTableCellIdClick(row) {
      // 复制id到剪贴板
      copyToClipboard(row._id).then(() => {
        this.$q.notify({
          message: "作业编号已复制到剪贴板",
          type: "positive",
        });
      });
    },

    // 处理作业编辑对话框关闭事件
    handleCloseEditingHomeworkDialog() {
      this.homeworkEditDig = false;
      // 刷新作业列表
      this.handleGetHomeworkList();
    },

    //获取所有课程
    async handleGetAllCourse() {
      const { data } = await apiGetCourses();
      if (data.code === 2000) {
        this.courseList = data.data.map((item) => {
          item.course.tcc_id = item._id;
          if (item.teacher == null) {
            item.course.name =
              item.course.name + "（" + "该老师已退出知新系统" + "）";
          } else {
            item.course.name =
              item.course.name + "（" + item.teacher.user.nickname + "）";
          }
          return item.course;
        });
      }
      console.log(this.courseList);
      this.handleGetAllCourseTypeHomeworks();
    },

    //获取所有课程未完成作业
    async handleGetAllCourseTypeHomeworks() {
      this.UnfinishedCourseTypeHomework = [];
      this.courseList.forEach(async (element) => {
        this.courseTypeList.forEach(async (eleme) => {
          const payload = {
            tcc_id: element.tcc_id,
            category: eleme,
            student_id: this.$store.getters["user/studentId"][0]._id,
          };
          const { data } = await apiGetHomeworks(payload);

          if (data.data.length != 0) {
            data.data.forEach((ele) => {
              if (ele.studentHomework) {
                if (ele.studentHomework.answerProgress < 1) {
                  this.UnfinishedCourseTypeHomework.push(
                    element.name.split("（")[0]
                  );
                }
              } else {
                this.UnfinishedCourseTypeHomework.push(
                  element.name.split("（")[0]
                );
              }
            });
          }
        });
      });
      var newArr = [...new Set(this.UnfinishedCourseTypeHomework)]; //利用了Set结构不能接收重复数据的特点
      this.UnfinishedCourseTypeHomework = newArr;
      console.log(this.UnfinishedCourseTypeHomework);
    },

    //获取课程作业信息
    async handleGetHomeworks() {
      this.homeworkList = [];
      const payload = {
        tcc_id: this.optCourse.tcc_id,
        category: this.optHomeworkType,
        student_id: this.$store.getters["user/studentId"][0]._id,
      };
      const { data } = await apiGetHomeworks(payload);
      console.log(data)
      if (data.code === 2000) {
        data.data.forEach((element) => {
          element.isEnd = false;
          let now = new Date();
          // if(!element.starttime){
          //   element.starttime=new Date('2000-01-01')
          // }
          // let startTime = Date.parse(new Date(element.starttime));
          // // let startTime = element.starttime.setHours(element.starttime.getHours() + 8)
          // element.starttime=startTime
          if (element.studentHomework && element.studentHomework.endtime) {
            let end = new Date(element.studentHomework.endtime);
            let d = end.getTime() - now.getTime();
            if (d < 0) {
              //已截止
              element.isEnd = true;
            }
            element.endtime = this.formatDate(element.studentHomework.endtime);
          } else {
            let end = new Date(element.endtime);
            let d = end.getTime() - now.getTime();
            if (d < 0) {
              //已截止
              element.isEnd = true;
            }
            element.endtime = this.formatDate(element.endtime);
            //console.log(object);
          }
        });
        // res.data.data.forEach((el) => {
        //   if (time.data.data >= el.starttime) {
        //     this.homeworkList.push(el);
        //   }
        // });
        this.homeworkList = data.data;
        // 添加课程与作业类型进LocalStorage
        localStorage.setItem("course", JSON.stringify(this.optCourse));
        localStorage.setItem("homeworkType", this.optHomeworkType);
      }
    },
  },

  created() {
    this.handleGetHomeworks();
    // this.handleGetAllCourse();
  },
};
</script>

<style></style>
