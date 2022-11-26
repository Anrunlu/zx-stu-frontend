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
                  @click.stop=""
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
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h5 q-ml-sm">
            添加教学班
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
        <q-tabs
          v-model="addClassroomTabMode"
          class="bg-primary text-white shadow-2"
          inline-label
        >
          <q-tab
            name="throughOriginClassroom"
            icon="folder_shared"
            label="基于行政班创建"
          />
          <q-tab
            name="throughOfficialFile"
            icon="cloud_upload"
            label="使用花名册导入"
          />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="addClassroomTabMode" animated>
          <!-- 通过自然班添加 -->
          <q-tab-panel name="throughOriginClassroom">
            <q-card-section align="right">
              <q-input
                outlined
                dense
                debounce="300"
                v-model="combinedClassroomWaitToCreate.name"
                placeholder="请输入将要创建的教学班名称"
                ><template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-select
                use-input
                @filter="filterFnForAddClassroom"
                @input="handleInputOriginClassroomNameChange"
                multiple
                class="q-mt-md"
                outlined
                clearable
                v-model="combinedClassroomWaitToCreate.originClassroomList"
                :options="filteredOriginClassroomList"
                option-label="name"
                option-value="id"
                dense
                label="请选择或输入行政班(可多选)"
              >
                <template v-slot:prepend>
                  <q-icon name="class" />
                </template>
              </q-select> </q-card-section
          ></q-tab-panel>
          <!-- 通过花名册添加 -->
          <q-tab-panel name="throughOfficialFile">
            <q-card-section align="right">
              <q-input
                outlined
                dense
                debounce="300"
                v-model="combinedClassroomWaitToCreate.name"
                placeholder="请输入将要创建的教学班名称"
                ><template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <q-file
                dense
                class="q-mt-md"
                outlined
                v-model="excelFile"
                label="请上传课堂花名册 Excel 文件"
              >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop />
                </template>
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop="excelFile = null"
                    class="cursor-pointer"
                  />
                </template>
              </q-file> </q-card-section
          ></q-tab-panel>
        </q-tab-panels>
        <q-card-actions align="right">
          <q-btn
            v-if="addClassroomTabMode === 'throughOfficialFile'"
            flat
            color="primary"
            icon="cloud_download"
            label="下载花名册模板"
          />
          <q-btn
            color="primary"
            label="确定"
            @click="handleClickCreateCombinedClassroom"
          />
        </q-card-actions>
      </q-card>
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

    <!-- 添加课程对话框 -->
    <q-dialog v-model="showAddTeaCourseDig">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6 q-ml-sm">
            添加课程
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
          <q-select
            outlined
            use-input
            @filter="filterFnForAddCourse"
            v-model="currSelectCourseForAddTeaCourse"
            :options="filteredCourseList"
            option-label="name"
            option-value="_id"
            label="请选择课程"
          >
            <template v-slot:prepend>
              <q-icon name="class" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="确定"
            color="primary"
            @click="handleAddTeaCourse"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiRemoveTeaCourse,
  apiGetTeaClsroomStuList,
  apiGetTeaCourseInfo,
  apiGetCourses,
  apiCreateTeaCourse,
  apiRenameTeaClsroom,
  apiRemoveTeaClsroom,
  apiOriginClassroomList,
  apiCreatecombinedClassroomThroughOriginClassroom,
} from "src/api/teacher/course";
export default {
  data() {
    return {
      // teaCourse 数据
      teaCourseList: [],
      // 课程列表
      courseList: [],
      // 过滤后的课程列表
      filteredCourseList: [],
      // 添加课程时选中的课程
      currSelectCourseForAddTeaCourse: null,

      // 当前点击的教学班名称
      currSelectedTeaClassroomName: "",
      // 当前点击的TeaCourseId
      currSelectedTeaCourseId: "",

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

      // 添加教学班Tab模式
      addClassroomTabMode: "throughOriginClassroom",

      // 自然班列表
      originClassroomList: [],
      // 过滤后的自然班列表
      filteredOriginClassroomList: [],
      // 花名册文件
      excelFile: null,
      // 待添加的教学班
      combinedClassroomWaitToCreate: {
        name: "",
        originClassroomList: [],
      },

      // 添加教学班对话框
      showAddClassroomDig: false,
      // 教学班学生列表对话框
      showTeaClsroomStuListDig: false,
      // 添加teaCourse对话框
      showAddTeaCourseDig: false,
    };
  },

  methods: {
    /* ====== NOTICE: 以下为对接API完成异步请求相关方法 ====== */

    // 获取教师课程信息
    async getTeaCourseInfo() {
      const { data } = await apiGetTeaCourseInfo();
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
        };
        pre.push(stu);
        return pre;
      }, teaClsroomStuList);
      this.teaClsroomStuList = teaClsroomStuList;
    },

    // 获取课程列表
    async getCourses() {
      const { data } = await apiGetCourses();
      this.courseList = data.data.courses;
      this.filteredCourseList = data.data.courses;
    },

    // 获取自然班列表
    async getOriginClassroomList() {
      const { data } = await apiOriginClassroomList();
      this.originClassroomList = data.data;
      this.filteredOriginClassroomList = data.data;
    },

    // 添加teaCourse
    async handleAddTeaCourse() {
      // 判断是否选择了课程
      if (!this.currSelectCourseForAddTeaCourse) {
        this.$q.notify({
          message: "请选择课程",
          type: "warning",
        });
        return;
      }

      // 判断是否已经添加了该课程
      const isExist = this.teaCourseList.some(
        (item) => item.courseId === this.currSelectCourseForAddTeaCourse._id
      );
      if (isExist) {
        this.$q.notify({
          message: "添加失败，该课程已存在",
          type: "negative",
        });
        return;
      }

      // 发送添加请求
      const { data } = await apiCreateTeaCourse({
        course_id: this.currSelectCourseForAddTeaCourse._id,
      });

      this.$q.notify({
        message: `添加课程成功`,
        type: "positive",
        timeout: 300,
      });

      // 刷新页面
      this.currSelectCourseForAddTeaCourse = null;
      this.getTeaCourseInfo();
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
          this.getTeaCourseInfo();
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
          this.getTeaCourseInfo();
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
          this.getTeaCourseInfo();
        })
        .onCancel(() => {
          this.$q.notify({
            message: "操作取消",
            type: "warning",
            timeout: 300,
          });
        });
    },

    // 创建教学班(基于行政班)
    async handleCreatecombinedClassroomThroughOriginClassroom(
      teaCourseId,
      combinedClassroomWaitToCreate
    ) {
      // 校验
      if (combinedClassroomWaitToCreate.name === "") {
        this.$q.notify({
          message: `教学班名称不能为空`,
          type: "warning",
          timeout: 300,
        });
        return;
      }

      if (combinedClassroomWaitToCreate.originClassroomList.length === 0) {
        this.$q.notify({
          message: `请选择行政班`,
          type: "warning",
          timeout: 300,
        });
        return;
      }

      // 请求Dto
      const payload = {
        name: combinedClassroomWaitToCreate.name,
        teaCourse_id: teaCourseId,
        classroom_ids: combinedClassroomWaitToCreate.originClassroomList.map(
          (item) => item._id
        ),
      };

      // 发送请求
      try {
        await apiCreatecombinedClassroomThroughOriginClassroom(payload);
        // 提示创建成功
        this.$q.notify({
          message: "创建成功",
          type: "positive",
        });
        // 重置数据
        this.combinedClassroomWaitToCreate = {
          name: "",
          originClassroomList: [],
        };
        this.currSelectedTeaCourseId = "";
        // 关闭对话框
        this.showAddClassroomDig = false;
        // 刷新页面
        this.getTeaCourseInfo();
      } catch (error) {
        this.$q.notify({
          message: `创建失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 创建教学班(基于学号列表)
    async handleCreateCombinedClassroomWithUsernameList() {},

    /* ====== NOTICE: 以下为处理UI点击相关方法 ====== */

    // 点击教学班
    handleTeaClassroomClick(evt, row) {
      this.getTeaClsroomStuList(row._id);
      this.showTeaClsroomStuListDig = true;
      this.currSelectedTeaClassroomName = row.name;
    },

    // 点击添加teaCourse按钮
    handleAddTeaCourseBtnClick() {
      this.showAddTeaCourseDig = true;
    },

    // 点击添加教学班按钮
    handleAddClassroomClick(teaCourse) {
      this.showAddClassroomDig = true;
      this.currSelectedTeaCourseId = teaCourse.id;
    },

    // 监听添加教学班input组件值的变化
    handleInputOriginClassroomNameChange(selectedClsrooms) {
      this.combinedClassroomWaitToCreate.name = "";
      for (let i = 0; i < selectedClsrooms.length; i++) {
        this.combinedClassroomWaitToCreate.name += selectedClsrooms[i].name;
        if (i !== selectedClsrooms.length - 1) {
          this.combinedClassroomWaitToCreate.name += "+";
        }
      }
    },

    // 点击添加教学班对话框的确认按钮
    handleClickCreateCombinedClassroom() {
      // 判断通过何种方式创建教学班
      if (this.addClassroomTabMode === "throughOriginClassroom") {
        this.handleCreatecombinedClassroomThroughOriginClassroom(
          this.currSelectedTeaCourseId,
          this.combinedClassroomWaitToCreate
        );
      } else if (this.addClassroomTabMode === "throughOfficialFile") {
        this.handleCreateCombinedClassroomWithUsernameList();
      }
    },

    /* ====== NOTICE: 以下为页面相关工具 ====== */

    // 添加课程选择框选项过滤函数
    filterFnForAddCourse(val, update) {
      if (val === "") {
        update(async () => {
          await this.getCourses();
          this.filteredCourseList = this.courseList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredCourseList = this.courseList.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    // 添加教学班选择框选项过滤函数
    filterFnForAddClassroom(val, update) {
      if (val === "") {
        update(async () => {
          await this.getOriginClassroomList();
          this.filteredOriginClassroomList = this.originClassroomList;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.filteredOriginClassroomList = this.originClassroomList.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },

  created() {
    this.getTeaCourseInfo();
  },
};
</script>

<style></style>
