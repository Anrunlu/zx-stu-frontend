<template>
  <!-- 添加教学班 -->
  <q-card style="width: 700px; max-width: 80vw">
    <!-- 标题栏 -->
    <CardBar title="添加教学班" icon="class" />

    <q-tabs v-model="addClassroomTabMode" class="shadow-2" inline-label>
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
            square
            dense
            debounce="300"
            v-model="combinedClassroomWaitToCreate.name"
            placeholder="请输入将要创建的教学班名称"
            :rules="[(val) => !!val || '这是必填项']"
            hide-bottom-space
            ><template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-select
            outlined
            square
            use-input
            @filter="filterFnForAddClassroom"
            @input="handleInputOriginClassroomNameChange"
            multiple
            use-chips
            class="q-mt-md"
            clearable
            v-model="combinedClassroomWaitToCreate.originClassroomList"
            :options="filteredOriginClassroomList"
            option-label="name"
            option-value="id"
            dense
            label="请选择或输入行政班(可多选)"
            :rules="[(val) => !!val || '这是必填项']"
            hide-bottom-space
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
            square
            dense
            debounce="300"
            v-model="combinedClassroomWaitToCreate.name"
            placeholder="请输入将要创建的教学班名称"
            :rules="[(val) => !!val || '这是必填项']"
            hide-bottom-space
            ><template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-file
            outlined
            square
            dense
            class="q-mt-md"
            v-model="officalExcelFile"
            label="请上传教务系统课堂花名册 Excel 文件"
            :rules="[(val) => !!val || '这是必填项']"
            hide-bottom-space
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop="officalExcelFile = null"
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
        @click="handleDownloadOfficialFileTemplateBtnClick"
      />
      <q-btn
        color="primary"
        label="确定"
        @click="handleClickCreateCombinedClassroom"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { saveAs } from "file-saver";
import { mapGetters } from "vuex";
import { read, utils } from "xlsx";
import {
  apiCreatecombinedClassroomThroughOriginClassroom,
  apiCreateCombinedClassroomWithUsernameList,
  apiGetOriginClassroomList,
} from "src/api/teacher/course";

export default {
  name: "AddTeaClassroomCard",
  props: {},

  data() {
    return {
      // 添加教学班Tab模式
      addClassroomTabMode: "throughOriginClassroom",
      // 花名册文件
      officalExcelFile: null,
      // 用于存储待创建的教学班信息
      combinedClassroomWaitToCreate: {
        name: "",
        originClassroomList: [],
      },
      // 自然班列表
      originClassroomList: [],
      // 过滤后的自然班列表
      filteredOriginClassroomList: [],
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
  },

  methods: {
    // 创建教学班(基于行政班)
    async handleCreatecombinedClassroomThroughOriginClassroom(
      teaCourseId,
      combinedClassroomWaitToCreate
    ) {
      // 校验
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
        this.$store.commit("teaCourse/setCurrSelectedTeaCourse", null);
        // 通知父组件关闭对话框
        this.$emit("closeAddTeaClassroomDialog");
        // 刷新页面
        this.$store.dispatch("teaCourse/getTeaCourseInfo");
      } catch (error) {
        this.$q.notify({
          message: `创建失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 创建教学班(基于学号列表)
    async handleCreateCombinedClassroomWithUsernameList(teaCourseId) {
      if (!this.officalExcelFile) {
        this.$q.notify({
          message: `请上传花名册 Excel 文件`,
          type: "warning",
          timeout: 300,
        });
        return;
      }

      // 读取文件
      const res = await this.importExcel(this.officalExcelFile);
      let data = res[0].sheet;

      // 读取 username 字段
      let stuUserNameList = [];
      for (let index = 1; index < data.length; index++) {
        const element = data[index];
        stuUserNameList.push(element.__EMPTY_4);
      }

      // 检查学号列表是否为空
      if (stuUserNameList.length === 0) {
        this.$q.notify({
          message: `花名册中没有学生`,
          type: "warning",
          timeout: 300,
        });
        return;
      }

      // 构造请求Dto
      const payload = {
        classroom_name: this.combinedClassroomWaitToCreate.name,
        teaCourse_id: teaCourseId,
        student_usernames: stuUserNameList,
      };

      // 发送请求
      try {
        await apiCreateCombinedClassroomWithUsernameList(payload);
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
        this.$store.commit("teaCourse/setCurrSelectedTeaCourse", null);
        // 关闭对话框
        this.showAddClassroomDig = false;

        // 刷新页面
        this.$store.dispatch("teaCourse/getTeaCourseInfo");
      } catch (error) {
        this.$q.notify({
          message: `创建失败`,
          type: "negative",
          timeout: 300,
        });
      }
    },

    // 获取自然班列表
    async getOriginClassroomList() {
      const { data } = await apiGetOriginClassroomList();
      this.originClassroomList = data.data;
      this.filteredOriginClassroomList = data.data;
    },

    // 点击下载花名册模版按钮
    handleDownloadOfficialFileTemplateBtnClick() {
      saveAs(
        "https://cyberdownload.anrunlu.net/%E6%95%99%E5%B8%88%E5%88%9B%E5%BB%BA%E6%95%99%E5%AD%A6%E7%8F%AD%E6%A8%A1%E6%9D%BF.xls",
        "花名册模版.xls"
      );
    },

    // 点击添加教学班对话框的确认按钮
    handleClickCreateCombinedClassroom() {
      // 校验
      if (this.combinedClassroomWaitToCreate.name === "") {
        this.$q.notify({
          message: `教学班名称不能为空`,
          type: "warning",
          timeout: 300,
        });
        return;
      }
      // 判断通过何种方式创建教学班
      if (this.addClassroomTabMode === "throughOriginClassroom") {
        this.handleCreatecombinedClassroomThroughOriginClassroom(
          this.currSelectedTeaCourse.id,
          this.combinedClassroomWaitToCreate
        );
      } else if (this.addClassroomTabMode === "throughOfficialFile") {
        this.handleCreateCombinedClassroomWithUsernameList(
          this.currSelectedTeaCourse.id
        );
      }
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

    /* ====== NOTICE: 以下为页面相关工具 ====== */

    // 导入 excel 文件
    async importExcel(file) {
      const types = file.name.split(".")[1];
      const fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
        (item) => item === types
      );
      if (!fileType) {
        this.$q.notify({
          message: `文件类型不正确，请重新选择`,
          type: "negative",
          timeout: 300,
        });
        return;
      }
      const tabJson = await this.file2Xce(file);
      return tabJson;
    },

    // 将文件转换为 json
    async file2Xce(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const data = e.target.result;
          this.wb = read(data, {
            type: "binary",
          });
          const result = [];
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: utils.sheet_to_json(this.wb.Sheets[sheetName]),
            });
          });
          resolve(result);
        };
        reader.readAsBinaryString(file);
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

  created() {},
};
</script>
