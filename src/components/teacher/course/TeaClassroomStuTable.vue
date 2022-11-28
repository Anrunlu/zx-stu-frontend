<template>
  <div style="width: 800px; max-width: 80vw">
    <!-- 教学班学生表格 -->
    <q-card>
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="text-subtitle1">
          <q-icon name="people" />
          {{ currSelectedTeaClassroom.name }}
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="white"
            v-close-popup
          ></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="q-py-none">
        <q-table
          class="full-width"
          flat
          :data="teaClassroomStuList"
          :columns="teaClassroomStuListColumns"
          row-key="userid"
          :filter="stufilter"
          :pagination="teaClassroomStuListTablePagination"
        >
          <template v-slot:top-left>
            <div class="q-gutter-sm row q-mt-sm">
              <q-btn
                dense
                flat
                color="positive"
                icon="person_add"
                label="添加学生"
                @click="handleAddStudentToTeaClassroom"
              ></q-btn>
            </div>
          </template>
          <template v-slot:top-right>
            <q-input
              dense
              debounce="300"
              v-model="stufilter"
              placeholder="搜索学生"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
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
                  @click="handleRemoveStudentsFromCombinedClassroom(props.row)"
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
      </q-card-section>
    </q-card>

    <!-- 向教学班添加学生对话框 -->
    <q-dialog v-model="showAddStuToTeaClassroomDig">
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
  </div>
</template>

<script>
import {
  apiAddStudentsToCombinedClassroomByUsername,
  apiGetTeaClassroomStuList,
  apiRemoveStudentsFromCombinedClassroom,
  apiResetStuPassword,
} from "src/api/teacher/course";
import { mapGetters } from "vuex";
export default {
  name: "TeaClassroomStuTable",
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

      // 搜索学生过滤
      stufilter: "",

      // 教学班学生列表分页设置
      teaClassroomStuListTablePagination: {
        sortBy: "username",
        descending: false,
        rowsPerPage: 10,
      },

      // 向教学班添加学生对话框
      showAddStuToTeaClassroomDig: false,
      // 向教学班待添加的学生学号
      stuWaitToAddUsername: "",
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
        classroom_id: this.currSelectedTeaClassroom._id,
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
        // 关闭对话框
        this.showAddStuToTeaClassroomDig = false;
        // 刷新页面
        this.getTeaClassroomStuList();
      } catch (error) {
        this.$q.notify({
          message: `添加失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 从教学班移除学生
    async handleRemoveStudentsFromCombinedClassroom(stu) {
      // 弹出确认框
      const confirm = await this.$q.dialog({
        title: "请确认",
        message: `移除学生【${stu.nickname}】，操作不可恢复！`,
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
      });

      confirm.onCancel(() => {
        // 取消
        return;
      });

      confirm.onOk(async () => {
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
      });
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

    // 点击添加学生到教学班按钮
    handleAddStudentToTeaClassroom() {
      this.showAddStuToTeaClassroomDig = true;
    },
  },

  created() {
    this.getTeaClassroomStuList();
  },
};
</script>
