<template>
  <q-page>
    <!-- 课程卡片 -->
    <div class="row justify-center items-start">
      <q-card
        class="q-ma-sm col-md-4 col-11"
        v-for="(teaCourse, index) in teaCourseList"
        :key="index"
      >
        <!-- 教学班表格 -->
        <q-table
          :data="teaCourse.classrooms"
          :columns="teaCourseClassroomColumns"
          row-key="id"
          hide-pagination
          @row-click="handleTeaClassroomClick"
        >
          <template v-slot:top-left>
            <q-chip square>
              <q-avatar icon="class" color="primary" text-color="white" />
              {{ teaCourse.name }}
            </q-chip>
            <div class="q-gutter-sm row q-mt-sm">
              <q-btn
                dense
                flat
                color="positive"
                icon="add"
                label="添加教学班"
                @click="handleAddClassroomClick(teaCourse)"
              ></q-btn>
              <q-btn
                dense
                flat
                color="red"
                icon="delete"
                size="xs"
                label="删除课程"
                @click="handleRemoveTeaCourese(teaCourse)"
              ></q-btn>
            </div>
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
                  @click.stop="handleRenameTeaClassroom(props.row)"
                  ><q-tooltip> 重命名教学班 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="primary"
                  icon="person_add"
                  @click.stop="handleAddStudentToTeaClassroom(props.row)"
                  ><q-tooltip> 添加学生 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="red"
                  icon="delete"
                  @click.stop="handleDeleteTeaClassroom(teaCourse, props.row)"
                  ><q-tooltip> 删除教学班</q-tooltip></q-btn
                >
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey q-gutter-sm">
              <span class="text-h6"> 暂无数据 </span>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- 添加课程按钮 -->
    <q-page-sticky position="top-right" :offset="[25, -10]">
      <q-btn
        class="q-ma-xs bg-purple"
        round
        icon="add"
        size="32px"
        color="primary"
        @click="handleAddTeaCourseBtnClick"
        ><q-tooltip
          content-class="bg-indigo"
          content-style="font-size: 16px"
          :offset="[10, 10]"
          >添加课程</q-tooltip
        ></q-btn
      >
    </q-page-sticky>

    <!-- 添加教学班对话框 -->
    <q-dialog v-model="showAddClassroomDig" persistent>
      <AddTeaClassroomCard
        @closeAddTeaClassroomDialog="showAddClassroomDig = false"
      />
    </q-dialog>

    <!-- 教学班学生列表对话框 -->
    <q-dialog
      v-model="showTeaClsroomStuListDig"
      @hide="(teaClsroomStuList = []), (currSelectedTeaClassroomName = '')"
    >
      <q-table
        class="full-width"
        :data="teaClsroomStuList"
        :columns="teaClsroomStuListColumns"
        row-key="userid"
        :pagination="teaClsroomStuListTablePagination"
      >
        <template v-slot:top-left>
          <div class="q-gutter-sm row">
            <q-chip square>
              <q-avatar icon="people" color="secondary" text-color="white" />
              {{ currSelectedTeaClassroomName }}
            </q-chip>
          </div>
        </template>
        <template v-slot:top-right>
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn
                flat
                dense
                size="sm"
                color="primary"
                icon="settings"
                @click="resetStuPassword(props.row)"
                ><q-tooltip> 重置密码 </q-tooltip></q-btn
              >
              <q-btn
                flat
                dense
                size="md"
                color="red"
                icon="delete"
                @click="
                  handleRemoveStudentToCombinedClassroomWithUsername(props.row)
                "
                ><q-tooltip> 从教学班移除学生 </q-tooltip></q-btn
              >
            </div>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey q-gutter-sm">
            <span class="text-h6"> 暂无数据 </span>
          </div>
        </template>
      </q-table>
    </q-dialog>

    <!-- 向教学班添加学生对话框 -->
    <q-dialog v-model="showAddStuToTeaClsroomDig">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section>
          <div class="text-h5 q-ml-sm">
            添加学生到教学班
            <q-btn
              round
              flat
              dense
              icon="close"
              class="float-right"
              color="grey-8"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="stuWaitToAddUsername"
            type="text"
            label="请输入学生学号"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="person_add" @click.stop />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="确定"
            color="primary"
            @click="handleAddStudentToCombinedClassroomWithUsername"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 添加课程对话框 -->
    <q-dialog v-model="showAddTeaCourseDig">
      <AddTeaCourseCard />
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiRemoveTeaCourse,
  apiGetTeaClsroomStuList,
  apiRenameTeaClsroom,
  apiRemoveTeaClsroom,
  apiAddStudentsToCombinedClassroomByUsername,
  apiResetStuPassword,
  apiRemoveStudentsFromCombinedClassroom,
} from "src/api/teacher/course";
import AddTeaCourseCard from "src/components/common/teacher/course/AddTeaCourseCard.vue";
import AddTeaClassroomCard from "src/components/common/teacher/course/AddTeaClassroomCard.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // 课程列表
      courseList: [],
      // 过滤后的课程列表
      filteredCourseList: [],

      // 向教学班添加学生时选中的教学班
      currSelectTeaClassroom: null,

      // 当前点击的教学班名称
      currSelectedTeaClassroomName: "",

      // 课程班级列表表头列表
      teaCourseClassroomColumns: [
        {
          name: "className",
          label: "班级名",
          align: "center",
          field: "name",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],

      // 教学班学生列表数据
      teaClsroomStuList: [],
      // 教学班学生列表表头列表
      teaClsroomStuListColumns: [
        {
          name: "classroom",
          label: "班级",
          align: "center",
          field: "classroom",
          sortable: true,
        },
        {
          name: "username",
          label: "学号",
          align: "center",
          field: "username",
          sortable: true,
        },
        {
          name: "nickname",
          label: "姓名",
          align: "center",
          field: "nickname",
          sortable: true,
        },
        {
          name: "sex",
          label: "性别",
          align: "center",
          field: "sex",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      // 教学班学生列表分页设置
      teaClsroomStuListTablePagination: {
        sortBy: "username",
        descending: false,
        rowsPerPage: 10,
      },

      // 向教学班待添加的学生学号
      stuWaitToAddUsername: "",

      // 添加教学班对话框
      showAddClassroomDig: false,
      // 教学班学生列表对话框
      showTeaClsroomStuListDig: false,
      // 添加teaCourse对话框
      showAddTeaCourseDig: false,
      // 向教学班添加学生对话框
      showAddStuToTeaClsroomDig: false,
    };
  },

  components: {
    AddTeaCourseCard,
    AddTeaClassroomCard,
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
    }),
  },

  methods: {
    /* ====== NOTICE: 以下为对接API完成异步请求相关方法 ====== */

    // 获取教学班学生列表
    async getTeaClsroomStuList(classroomId) {
      const { data } = await apiGetTeaClsroomStuList(classroomId);
      // 过滤数据
      const teaClsroomStuList = [];
      data.data.reduce((pre, curr) => {
        const stu = {
          userid: curr.user._id,
          classroom: curr.joinedClassrooms[0].name,
          username: curr.user.username,
          nickname: curr.user.nickname,
          sex: curr.user.sex,
          grade: curr.grade,
          _id: curr._id,
        };
        pre.push(stu);
        return pre;
      }, teaClsroomStuList);
      this.teaClsroomStuList = teaClsroomStuList;
    },

    // 移除teaCourse
    async handleRemoveTeaCourese(teaCourse) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除【${teaCourse.name}】，操作不可恢复！`,
          ok: {
            label: "删除",
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
          await apiRemoveTeaCourse(teaCourse.id);
          // 提示删除成功
          this.$q.notify({
            message: "删除成功",
            type: "positive",
          });
          // 刷新页面
          this.$store.dispatch("teaCourse/getTeaCourseInfo");
        })
        .onCancel(() => {
          this.$q.notify({
            message: "操作取消",
            type: "warning",
            timeout: 300,
          });
        });
    },

    // 重命名教学班
    async handleRenameTeaClassroom(classroom) {
      this.$q
        .dialog({
          title: "提示",
          message: "请输入新的教学班名称",
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk(async (val) => {
          const newName = val.trim();
          if (newName === "") {
            this.$q.notify({
              message: `班级名不能为空`,
              type: "warning",
              timeout: 300,
            });
            return;
          }
          // 发送请求
          const payload = {
            classroom_id: classroom.id,
            name: newName,
          };
          await apiRenameTeaClsroom(payload);
          // 提示修改成功
          this.$q.notify({
            message: "修改成功",
            type: "positive",
          });
          // 刷新页面
          this.$store.dispatch("teaCourse/getTeaCourseInfo");
        })
        .onCancel(() => {})
        .onDismiss(() => {});
    },

    // 删除教学班
    async handleDeleteTeaClassroom(teaCourse, classroom) {
      this.$q
        .dialog({
          title: "请确认",
          message: `移除教学班【${classroom.name}】，操作不可恢复！`,
          ok: {
            label: "移除",
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
          const payload = {
            teacourse_id: teaCourse.id,
            classroom_id: classroom._id,
          };
          await apiRemoveTeaClsroom(payload);
          this.$q.notify({
            message: `移除成功`,
            color: "positive",
            icon: "done",
            position: "bottom",
            timeout: 300,
          });
          // 刷新页面
          this.$store.dispatch("teaCourse/getTeaCourseInfo");
        })
        .onCancel(() => {
          this.$q.notify({
            message: "操作取消",
            type: "warning",
            timeout: 300,
          });
        });
    },

    // 通过username(学号)数组向教学班添加学生
    async handleAddStudentToCombinedClassroomWithUsername() {
      // 检查学号是否为空
      if (this.stuWaitToAddUsername === "") {
        this.$q.notify({
          message: `请输入学号`,
          type: "warning",
          timeout: 300,
        });
        return;
      }

      // 构造请求Dto
      const payload = {
        classroom_id: this.currSelectTeaClassroom._id,
        student_usernames: [this.stuWaitToAddUsername],
      };

      // 发送请求
      try {
        await apiAddStudentsToCombinedClassroomByUsername(payload);
        // 提示添加成功
        this.$q.notify({
          message: "添加成功",
          type: "positive",
        });
        // 重置数据
        this.stuWaitToAddUsername = "";
        this.currSelectTeaClassroom = null;
        // 关闭对话框
        this.showAddStuToTeaClsroomDig = false;
        // 刷新页面
        this.$store.dispatch("teaCourse/getTeaCourseInfo");
      } catch (error) {
        this.$q.notify({
          message: `添加失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 从教学班移除学生
    async handleRemoveStudentToCombinedClassroomWithUsername(stu) {
      const payload = {
        classroom_id: this.currSelectTeaClassroom._id,
        student_ids: [stu._id],
      };

      try {
        await apiRemoveStudentsFromCombinedClassroom(payload);
        // 提示添加成功
        this.$q.notify({
          message: "移除成功",
          type: "positive",
        });
        // 刷新页面
        this.getTeaClsroomStuList(this.currSelectTeaClassroom._id);
        // 重置数据
        this.currSelectTeaClassroom = null;
      } catch (error) {
        this.$q.notify({
          message: `移除失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 重置学生密码
    async resetStuPassword(stu) {
      try {
        await apiResetStuPassword(stu.userid);
        // 提示重置成功
        this.$q.notify({
          message: "密码重置成功",
          type: "positive",
        });
      } catch (error) {
        this.$q.notify({
          message: `密码重置失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    /* ====== NOTICE: 以下为处理UI点击相关方法 ====== */

    // 点击教学班
    handleTeaClassroomClick(evt, row) {
      this.getTeaClsroomStuList(row._id);
      this.showTeaClsroomStuListDig = true;
      this.currSelectedTeaClassroomName = row.name;
      this.currSelectTeaClassroom = row;
    },

    // 点击添加teaCourse按钮
    handleAddTeaCourseBtnClick() {
      this.showAddTeaCourseDig = true;
    },

    // 点击添加教学班按钮
    handleAddClassroomClick(teaCourse) {
      this.showAddClassroomDig = true;
      // 设置当前选中的教学课程
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);
    },

    // 点击添加学生到教学班按钮
    handleAddStudentToTeaClassroom(row) {
      this.showAddStuToTeaClsroomDig = true;
      this.currSelectTeaClassroom = row;
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");
  },
};
</script>

<style></style>
