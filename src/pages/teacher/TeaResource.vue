<template>
  <q-page>
    <q-table
      flat
      :data="teaResourceList"
      :columns="teaResourceColumns"
      :visible-columns="teaResourceVisibleColumns"
      row-key="_id"
      @row-click="handleTeaResourceClick"
      :pagination="tablePagination"
      :dense="tableDense"
      :filter="teaResourceFilter"
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
          <!-- 选择教学资源类型 -->
          <q-btn-dropdown
            :label="
              !currSelectedCategory.value
                ? '资源类型'
                : currSelectedCategory.value
            "
            color="positive"
            :icon="
              currSelectedCategory.icon
                ? currSelectedCategory.icon
                : 'touch_app'
            "
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="handleChangeTeaResourceCategory(category)"
                :key="index"
                v-for="(category, index) in teaResourceCategoryOptions"
              >
                <q-item-section avatar>
                  <q-icon :name="category.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ category.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <!-- 上传资源 -->
          <q-btn
            color="accent"
            outline
            icon="o_cloud_upload"
            label="上传资源"
            @click="teaResourceUploadDig = true"
          />
        </div>
      </template>

      <template v-slot:top-right="props">
        <q-input
          dense
          debounce="300"
          v-model="teaResourceFilter"
          placeholder="搜索教学资源"
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

      <template v-slot:body-cell-filename="props">
        <q-td :props="props">
          <q-icon
            :name="`fa-regular ${props.row.resourceTypeAndIcon.icon}`"
            size="xs"
            color="grey"
          />{{ props.value }}
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
              @click.stop="handleModifyTeaResourceClickClick(props.row)"
            >
              <q-tooltip> 修改 </q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click.stop="handleDeleteTeaReasource(props.row)"
            >
              <q-tooltip> 删除 </q-tooltip>
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

    <!-- 教学资源编辑对话框 -->
    <q-dialog v-model="teaResourceEditingDig">
      <q-card style="width: 600px; max-width: 90vw">
        <q-form @submit="handleEditingTeaResourceFormSubmit">
          <CardBar title="编辑资源" icon="edit" />
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <!-- 文件名 -->
              <q-item class="col-12">
                <q-item-section>
                  <q-input
                    outlined
                    square
                    clearable
                    v-model="currClickedRowTeaResource.filename"
                    label="请输入文件名"
                    :rules="[(val) => !!val || '请输入文件名']"
                    hide-bottom-space
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="topic" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" color="primary" icon="sync"> 更新 </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- 上传教学资源对话框 -->
    <q-dialog v-model="teaResourceUploadDig" persistent>
      <TeaResourceUploadCard
        :category="currSelectedCategory"
        @refreshTeaResourceList="handleGetTeaResourceList"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiDeleteTeaResource,
  apiGetTeaResources,
  apiModifyTeaResource,
} from "src/api/teacher/teaResource";
import { mapGetters } from "vuex";
import { copyToClipboard } from "quasar";
import { preProcessTeaResourceList } from "src/utils/teaResource";
export default {
  name: "TeaResource",
  data() {
    return {
      // 教学资源列表
      teaResourceList: [],
      // 教学资源列表表头
      teaResourceColumns: [
        {
          name: "shortId",
          label: "资源编号",
          align: "left",
          field: "shortId",
          sortable: true,
        },
        {
          name: "filename",
          label: "资源名",
          field: "filename",
          align: "left",
          sortable: true,
        },
        {
          name: "resourceTypeAndIcon",
          label: "资源类型和图标",
          field: "resourceTypeAndIcon",
        },
        {
          name: "description",
          label: "资源描述",
          field: "description",
          align: "center",
        },
        {
          name: "creator",
          label: "上传者",
          field: (row) => row.creator.nickname,
          align: "center",
          sortable: true,
        },
        {
          name: "createdAt",
          label: "上传时间",
          field: "createdAt",
          align: "center",
          sortable: true,
        },
        {
          name: "action",
          align: "center",
          label: "操作",
        },
      ],
      teaResourceVisibleColumns: [
        "shortId",
        "filename",
        "description",
        "creator",
        "createdAt",
        "action",
      ],
      // 当前选中的教学资源分类
      currSelectedCategory: {},
      // 教学资源过滤
      teaResourceFilter: "",
      // 当前点击的那一会教学资源
      currClickedRowTeaResource: {},
      // 教学资源编辑对话框
      teaResourceEditingDig: false,
      // 上传教学资源对话框
      teaResourceUploadDig: false,
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
    TeaResourceUploadCard: () =>
      import("src/components/teacher/teaResource/teaResourceUploadCard.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      tableDense: "tableDense",
      tablePagination: "tablePagination",
      teaResourceCategoryOptions: "teaResourceCategoryOptions",
    }),
  },

  watch: {
    currSelectedTeaCourse: {
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.teaResourceList = [];
        }
      },
      deep: true,
    },
  },

  methods: {
    // 获取资源列表
    async handleGetTeaResourceList() {
      // 校验是否选择了课程
      if (!this.currSelectedTeaCourse) {
        this.$q.notify({
          message: "请先选择课程",
          type: "warning",
        });
        return;
      }

      // 校验是否选择了资源分类
      if (!this.currSelectedCategory.value) {
        this.$q.notify({
          message: "请先选择资源分类",
          type: "warning",
        });
        return;
      }

      // 构造请求参数
      const payload = {
        course_id: this.currSelectedTeaCourse.courseId,
        filecategory: this.currSelectedCategory.value,
      };

      // 发送请求
      try {
        const { data } = await apiGetTeaResources(payload);

        preProcessTeaResourceList(data.data);

        this.teaResourceList = data.data;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取教学资源列表失败",
          type: "negative",
        });
      }
    },

    // 修改教学资源
    async modifyTeaResource() {
      // 校验
      if (!this.currClickedRowTeaResource.filename) {
        this.$q.notify({
          message: "请输入文件名",
          type: "negative",
        });
        return;
      }

      // 构造请求参数
      const payload = {
        tearesource_id: this.currClickedRowTeaResource.id,
        filename: this.currClickedRowTeaResource.filename,
      };

      // 发送请求
      try {
        await apiModifyTeaResource(payload);
        this.$q.notify({
          message: "修改成功",
          type: "positive",
        });
      } catch (error) {
        this.$q.notify({
          message: "修改失败",
          type: "negative",
        });
        await this.handleGetTeaResourceList(this.currSelectedCategory);
      }
    },

    // 删除教学资源
    async handleDeleteTeaReasource(row) {
      this.currClickedRowTeaResource = row;
      this.$q
        .dialog({
          title: "请确认",
          message: `移除【${this.currClickedRowTeaResource.filename}】，操作不可恢复！`,
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
            tearesource_id: this.currClickedRowTeaResource.id,
          };
          await apiDeleteTeaResource(payload);
          this.$q.notify({
            message: `移除成功`,
            type: "positive",
          });
          this.currClickedRowTeaResource = {};
          // 刷新列表
          await this.handleGetTeaResourceList(this.currSelectedCategory);
        })
        .onCancel(() => {
          return;
        });
    },

    // 设置当前选中的教学课程
    handleChangeTeaCourse(teaCourse) {
      this.$store.commit("teaCourse/setCurrSelectedTeaCourse", teaCourse);

      // 如果当前选中的教学资源分类不为空，则重新获取教学资源列表
      if (this.currSelectedCategory.value) {
        this.handleGetTeaResourceList();
      }
    },

    // 设置当前选择的教学资源分类
    handleChangeTeaResourceCategory(category) {
      this.currSelectedCategory = category;
      this.handleGetTeaResourceList();
    },

    // 点击集资源编号
    handleTableCellIdClick(row) {
      // 复制id到剪贴板
      copyToClipboard(row.id).then(() => {
        this.$q.notify({
          message: "资源编号已复制到剪贴板",
          type: "positive",
        });
      });
    },

    // 处理点击教学资源列表中的某一行
    handleTeaResourceClick(evt, row) {
      this.currClickedRowTeaResource = row;

      let url = "";

      // https://view.officeapps.live.com/op/view.aspx?src={fileUrl}

      // 如果是常见的 office 类型且 fileUrl 不包含 view.officeapps.live.com，则构造新 url 使用 office 在线预览
      if (
        (row.filetype === "doc" ||
          row.filetype === "docx" ||
          row.filetype === "ppt" ||
          row.filetype === "pptx" ||
          row.filetype === "xls" ||
          row.filetype === "xlsx") &&
        !row.fileUrl.includes("view.officeapps.live.com")
      ) {
        url = `https://view.officeapps.live.com/op/view.aspx?src=${row.fileUrl}`;
      } else {
        url = row.fileUrl;
      }

      // 新页面打开
      window.open(url, "_blank");
    },

    // 处理更新教学资源对话框表单提交事件
    handleEditingTeaResourceFormSubmit() {
      this.modifyTeaResource();
    },

    // 表格上修改教学资源按钮点击事件
    handleModifyTeaResourceClickClick(row) {
      this.currClickedRowTeaResource = row;
      this.teaResourceEditingDig = true;
    },

    // 处理教学资源编辑对话框关闭事件
    handleCloseEditingTeaResourceDialog() {
      this.teaResourceEditingDig = false;
      // 刷新教学资源列表
      this.handleGetTeaResourceList(this.currSelectedCategory);
    },
  },

  created() {
    // 获取教师课程列表，store 事件
    this.$store.dispatch("teaCourse/getTeaCourseInfo");
  },
};
</script>

<style></style>
