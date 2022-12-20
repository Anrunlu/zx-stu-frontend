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
          row-key="_id"
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
                icon="o_delete"
                size="xs"
                label="移除课程"
                @click="handleRemoveTeaCoureseBtnClick(teaCourse)"
              ></q-btn>
            </div>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="q-gutter-sm">
                <q-btn
                  flat
                  dense
                  size="md"
                  color="primary"
                  icon="edit"
                  @click.stop="handleRenameTeaClassroom(props.row)"
                  ><q-tooltip> 重命名教学班 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="red"
                  icon="o_delete"
                  @click.stop="handleDeleteTeaClassroom(teaCourse, props.row)"
                  ><q-tooltip> 移除教学班</q-tooltip></q-btn
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
    <q-page-sticky position="top-right" :offset="[25, 10]">
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

    <!-- 教学班学生列表对话框 -->
    <q-dialog v-model="showTeaClsroomStuListDig" persistent>
      <TeaClassroomStuTable />
    </q-dialog>

    <!-- 添加课程对话框 -->
    <q-dialog v-model="showAddTeaCourseDig" persistent>
      <AddTeaCourseCard />
    </q-dialog>

    <!-- 添加教学班对话框 -->
    <q-dialog v-model="showAddClassroomDig" persistent>
      <AddTeaClassroomCard
        @closeAddTeaClassroomDialog="showAddClassroomDig = false"
      />
    </q-dialog>

    <!-- 移除教学课程对话框 -->
    <q-dialog v-model="showRemoveTeaCourseDig" persistent>
      <ObjectConfirmRemoveCard
        :shortId="currClickedTeaCourse.shortId"
        objectName="教学课程"
        @confirmRemove="removeTeaCourese"
      >
      </ObjectConfirmRemoveCard>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiRemoveTeaCourse,
  apiRenameTeaClsroom,
  apiRemoveTeaClsroom,
} from "src/api/teacher/course";
import AddTeaCourseCard from "src/components/teacher/course/AddTeaCourseCard.vue";
import AddTeaClassroomCard from "src/components/teacher/course/AddTeaClassroomCard.vue";
import TeaClassroomStuTable from "src/components/teacher/course/TeaClassroomStuTable.vue";
import { mapGetters } from "vuex";
export default {
  name: "Course",
  data() {
    return {
      // 教学课程列表表头列表
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

      // 当前点击的教学课程
      currClickedTeaCourse: {},

      // 添加教学班对话框
      showAddClassroomDig: false,
      // 教学班学生列表对话框
      showTeaClsroomStuListDig: false,
      // 添加teaCourse对话框
      showAddTeaCourseDig: false,
      // 移除teaCourse对话框
      showRemoveTeaCourseDig: false,
    };
  },

  components: {
    AddTeaCourseCard,
    AddTeaClassroomCard,
    TeaClassroomStuTable,
    ObjectConfirmRemoveCard: () =>
      import("src/components/common/ObjectConfirmRemoveCard.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
    }),
  },

  methods: {
    /* ====== NOTICE: 以下为对接API完成异步请求相关方法 ====== */

    // 移除 teaCourse
    async removeTeaCourese() {
      try {
        await apiRemoveTeaCourse(this.currClickedTeaCourse._id);
        // 提示移除成功
        this.$q.notify({
          message: "移除成功",
          type: "positive",
        });
        // 关闭移除对话框
        this.showRemoveTeaCourseDig = false;
        // 刷新页面
        this.$store.dispatch("teaCourse/getTeaCourseInfo");
      } catch {
        this.$q.notify({
          message: "移除失败",
          type: "negative",
        });
      }
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
          ok: {
            label: "确定",
            push: true,
            color: "positive",
          },
          cancel: {
            label: "取消",
            push: true,
          },
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

    // 移除教学班
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
          return;
        });
    },

    /* ====== NOTICE: 以下为处理UI点击相关方法 ====== */

    // 点击移除教学课程按钮
    handleRemoveTeaCoureseBtnClick(teaCourse) {
      this.currClickedTeaCourse = teaCourse;
      this.showRemoveTeaCourseDig = true;
    },

    // 点击教学班
    handleTeaClassroomClick(evt, row) {
      this.showTeaClsroomStuListDig = true;
      this.$store.commit("teaCourse/setCurrSelectedTeaClassroom", row);
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
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");
  },
};
</script>

<style></style>
