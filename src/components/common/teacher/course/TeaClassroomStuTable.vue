<template>
  <!-- 教学班学生表格 -->
  <q-table
    class="full-width"
    :data="teaClassroomStuList"
    :columns="teaClassroomStuListColumns"
    row-key="userid"
    :pagination="teaClassroomStuListTablePagination"
  >
    <template v-slot:top-left>
      <div class="q-gutter-sm row">
        <q-chip square>
          <q-avatar icon="people" color="secondary" text-color="white" />
          {{ currSelectedTeaClassroom.name }}
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
</template>

<script>
import {
  apiGetTeaClassroomStuList,
  apiRemoveStudentsFromCombinedClassroom,
  apiResetStuPassword,
} from "src/api/teacher/course";
import { mapGetters } from "vuex";
export default {
  name: "AddStuToTeaClsroomCard",
  props: {},

  data() {
    return {
      // 教学班学生列表数据
      teaClassroomStuList: [],
      // 教学班学生列表表头列表
      teaClassroomStuListColumns: [
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
      teaClassroomStuListTablePagination: {
        sortBy: "username",
        descending: false,
        rowsPerPage: 10,
      },
    };
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaClassroom: "currSelectedTeaClassroom",
    }),
  },

  methods: {
    // 获取教学班学生列表
    async getTeaClassroomStuList() {
      const { data } = await apiGetTeaClassroomStuList(
        this.currSelectedTeaClassroom._id
      );
      // 过滤数据
      const teaClassroomStuList = [];
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
      }, teaClassroomStuList);
      this.teaClassroomStuList = teaClassroomStuList;
    },

    // 从教学班移除学生
    async handleRemoveStudentToCombinedClassroomWithUsername(stu) {
      const payload = {
        classroom_id: this.currSelectedTeaClassroom._id,
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
        this.getTeaClassroomStuList();
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
  },

  created() {
    this.getTeaClassroomStuList();
  },
};
</script>
