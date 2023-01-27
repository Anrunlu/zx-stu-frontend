<template>
  <q-page>
    <q-table
      flat
      :data="courseMindList"
      :columns="courseMindColumns"
      row-key="_id"
      @row-click="handleCourseMindClick"
      :filter="courseMindFilter"
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
          <!-- 选择导图类型 -->
          <q-btn-dropdown
            :icon="
              currSelectedCategory.icon
                ? currSelectedCategory.icon
                : 'touch_app'
            "
            :label="
              !currSelectedCategory.value
                ? '导图类型'
                : currSelectedCategory.label
            "
            color="positive"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeCourseMindCategory(category)"
                :key="index"
                v-for="(category, index) in courseMindCategoryOptions"
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
          <!-- 新建导图 -->
          <q-btn
            color="accent"
            outline
            icon="add"
            label="新建导图"
            @click="handleCreateCourseMindBtnClick"
          />
        </div>
      </template>

      <template v-slot:top-right="props">
        <q-input
          dense
          debounce="300"
          v-model="courseMindFilter"
          placeholder="搜索导图"
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

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click.stop="handleModifyCourseMindClick(props.row)"
            >
              <q-tooltip> 修改导图 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click.stop="handleRemoveCourseMindClick(props.row)"
            >
              <q-tooltip> 删除导图 </q-tooltip>
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

    <!-- 创建导图对话框 -->
    <q-dialog v-model="courseMindAddDig" persistent>
      <CourseMindAddCard
        :questionSet="currClickedRowQuestionSet"
        @createHomeworksSuccess="handleCreatedHomeworkSuccess"
      />
    </q-dialog>

    <!-- 删除导图对话框 -->
    <q-dialog v-model="removeCourseMindDig" persistent>
      <ObjectConfirmRemoveCard
        :shortId="currClickedRowCourseMind.shortId"
        objectName="导图"
        @confirmRemove="removeCourseMind"
      >
      </ObjectConfirmRemoveCard>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiGetCourseMinds,
  apiRemoveCourseMind,
} from "src/api/teacher/courseMind";
import { mapGetters } from "vuex";
import { copyToClipboard } from "quasar";
import { formatTimeWithWeekDay } from "src/utils/time";
import { preProcessCourseMindDetails } from "src/utils/courseMind";

export default {
  name: "CourseMind",
  data() {
    return {
      // 导图列表
      courseMindList: [],
      // 导图列表表头
      courseMindColumns: [
        {
          name: "shortId",
          label: "导图编号",
          align: "left",
          field: "shortId",
          sortable: true,
        },
        {
          name: "title",
          label: "导图标题",
          field: "title",
          align: "center",
          sortable: true,
        },
        {
          name: "creator",
          label: "创建者",
          align: "center",
          field: (row) => row.creator.nickname,
          sortable: true,
        },
        {
          name: "updatedAt",
          label: "更新时间",
          align: "center",
          field: (row) => formatTimeWithWeekDay(row.updatedAt),
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      // 当前选中的导图分类
      currSelectedCategory: { value: "", label: "", icon: "" },
      // 导图过滤
      courseMindFilter: "",
      // 当前点击的导图
      currClickedRowCourseMind: {},
      // 导图编辑对话框
      courseMindEditDig: false,
      // 创建导图对话框
      courseMindAddDig: false,
      // 删除导图对话框
      removeCourseMindDig: false,
    };
  },

  components: {
    CourseMindAddCard: () =>
      import("src/components/teacher/courseMind/CourseMindAddCard.vue"),
    ObjectConfirmRemoveCard: () =>
      import("src/components/common/ObjectConfirmRemoveCard.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      courseMindCategoryOptions: "courseMindCategoryOptions",
    }),
  },

  watch: {
    currSelectedTeaCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.courseMindList = [];
        }
      },
      deep: true,
    },
  },

  methods: {
    // 获取导图列表
    async handleGetCourseMindList() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "warning",
        });
        return;
      }

      // 构造请求参数
      const payload = {
        status: "正常",
        teacourse_id: this.currSelectedTeaCourse.id,
        category: this.currSelectedCategory.value,
      };

      // 发送请求
      try {
        const { data } = await apiGetCourseMinds(payload);
        data.data.forEach((courseMind) => {
          preProcessCourseMindDetails(courseMind);
        });
        this.courseMindList = data.data;
      } catch (error) {
        this.$q.notify({
          message: "获取导图列表失败",
          type: "negative",
        });
      }
    },

    // 删除导图
    async removeCourseMind() {
      // 移除导图
      try {
        await apiRemoveCourseMind(this.currClickedRowCourseMind._id);
        this.$q.notify({
          message: "删除成功",
          type: "positive",
        });
        // 重新获取导图列表
        this.handleGetCourseMindList();
        this.removeCourseMindDig = false;
        this.currClickedRowCourseMind = {};
      } catch (error) {
        this.$q.notify({
          message: "删除失败",
          type: "negative",
        });
      }
    },

    // 设置当前选中的教学课程
    handleChangeTeaCourse(teaCourse) {
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

      // 如果当前选中的导图分类不为空，则重新获取导图列表
      if (this.currSelectedCategory.value) {
        this.handleGetCourseMindList(this.currSelectedCategory.value);
      }
    },

    // 处理导图分类选项改变
    handleChangeCourseMindCategory(category) {
      this.currSelectedCategory = category;
      this.handleGetCourseMindList();
    },

    // 处理点击新建导图按钮
    handleCreateCourseMindBtnClick() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "warning",
        });
        return;
      }
      this.courseMindAddDig = true;
    },

    // 处理点击导图列表中的某一行
    handleCourseMindClick(evt, row) {
      this.currClickedRowCourseMind = row;
      // 跳转到导图概览页面
      // 在新标签页打开
      // 新标签页打开
      const routeData = this.$router.resolve(`/courseMind/${row._id}`);
      window.open(routeData.href, "_blank");
    },

    // 点击导图编号
    handleTableCellIdClick(row) {
      // 复制id到剪贴板
      copyToClipboard(row._id).then(() => {
        this.$q.notify({
          message: "导图编号已复制到剪贴板",
          type: "positive",
        });
      });
    },

    // 表格上修改导图按钮点击事件
    handleModifyCourseMindClick(row) {
      this.currClickedRowCourseMind = row;
      this.courseMindEditDig = true;
    },

    // 表格上的删除导图按钮点击事件
    handleRemoveCourseMindClick(row) {
      this.currClickedRowCourseMind = row;
      this.removeCourseMindDig = true;
    },

    // 处理导图编辑对话框关闭事件
    handleCloseEditingCourseMindDialog() {
      this.courseMindEditDig = false;
      // 刷新导图列表
      this.handleGetCourseMindList();
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");

    // 获取导图列表
    this.handleGetCourseMindList();
  },
};
</script>

<style></style>
