<template>
  <q-page>
    <!-- 课程卡片 -->
    <div class="row justify-center items-start">
      <q-card
        class="q-ma-sm col-md-4 col-12"
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
                label="创建班级"
              ></q-btn>
              <q-btn
                dense
                flat
                color="red"
                icon="delete"
                size="xs"
                label="删除课程"
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
                  @click.stop=""
                  ><q-tooltip> 重命名教学班 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="primary"
                  icon="person_add"
                  @click.stop=""
                  ><q-tooltip> 添加学生 </q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  size="md"
                  color="red"
                  icon="delete"
                  @click.stop=""
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
    <q-page-sticky position="top-right" :offset="[25, 20]">
      <q-btn
        class="q-ma-xs bg-purple"
        round
        icon="add"
        size="32px"
        color="primary"
        ><q-tooltip
          content-class="bg-indigo"
          content-style="font-size: 16px"
          :offset="[10, 10]"
          >添加课程</q-tooltip
        ></q-btn
      >
    </q-page-sticky>

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
                @click="resetPassword(props.row)"
                ><q-tooltip> 重置密码 </q-tooltip></q-btn
              >
              <q-btn
                flat
                dense
                size="md"
                color="red"
                icon="delete"
                @click="deleteStudent(props.row)"
                ><q-tooltip> 删除学生 </q-tooltip></q-btn
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
  </q-page>
</template>

<script>
import { getTeaClsroomStuList, getTeaCourseInfo } from "src/api/teacher/course";
import { loadingFn } from "src/utils/loadingTools";
export default {
  data() {
    return {
      // 课程班级数据
      teaCourseList: [],
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
      teaClsroomStuListTablePagination: {
        sortBy: "username",
        descending: false,
        rowsPerPage: 10,
      },
      // 教学班学生列表对话框
      showTeaClsroomStuListDig: false,
    };
  },

  methods: {
    // 获取教师课程信息
    async getTeaCourseInfo() {
      const { data } = await loadingFn(getTeaCourseInfo)();
      const teaCourseList = [];
      data.data.reduce((pre, curr) => {
        const course = {
          id: curr._id,
          courseId: curr.course._id,
          name: curr.course.name,
          classrooms: curr.classrooms,
          classroomsNum: 0,
        };
        pre.push(course);
        return pre;
      }, teaCourseList);
      this.teaCourseList = teaCourseList;
    },

    // 获取教学班学生列表
    async getTeaClsroomStuList(classroomId) {
      const { data } = await loadingFn(getTeaClsroomStuList)(classroomId);
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
        };
        pre.push(stu);
        return pre;
      }, teaClsroomStuList);
      this.teaClsroomStuList = teaClsroomStuList;
    },

    // 处理点击教学班
    handleTeaClassroomClick(evt, row) {
      this.getTeaClsroomStuList(row._id);
      this.showTeaClsroomStuListDig = true;
      this.currSelectedTeaClassroomName = row.name;
    },
  },

  created() {
    this.getTeaCourseInfo();
  },
};
</script>

<style></style>
