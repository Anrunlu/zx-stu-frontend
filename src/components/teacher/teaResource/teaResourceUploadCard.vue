<template>
  <!-- 上传资源 -->
  <q-card style="width: 700px; max-width: 90vw">
    <CardBar title="上传资源" icon="cloud_upload" />
    <q-card-section>
      <q-list class="row">
        <!-- 资源类别 -->
        <q-item class="col-12">
          <q-item-section>
            <q-select
              outlined
              square
              :options="teaResourceCategoryOptions"
              option-label="label"
              option-value="value"
              emit-value
              color="black"
              v-model="uploadDto.category"
              label="资源类别"
              :rules="[(val) => !!val || '请选择资源类别']"
              hide-bottom-space
              options-selected-class="text-deep-blue"
              dense
              ><template v-slot:prepend>
                <q-icon name="app_registration" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ scope.opt.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>

        <!-- 文件描述 -->
        <q-item class="col-12">
          <q-item-section>
            <q-input
              outlined
              square
              dense
              label="资源描述(可选)"
              v-model="uploadDto.description"
            >
              <template v-slot:prepend>
                <q-icon name="o_comment" />
              </template>
            </q-input>
          </q-item-section>
        </q-item>

        <!-- uploader -->
        <q-item class="col-12">
          <q-item-section>
            <MyUploader
              ref="uploader"
              class="full-width"
              flat
              multiple
              bordered
              square
              :allowUpload="allowUpload"
              @finished="onUploadFinished"
            >
              <template v-slot:header="scope">
                <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                  <q-btn
                    v-if="scope.queuedFiles.length > 0"
                    icon="clear_all"
                    @click="scope.removeQueuedFiles"
                    round
                    dense
                    flat
                  >
                    <q-tooltip>清空上传队列</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="scope.uploadedFiles.length > 0"
                    icon="done_all"
                    @click="scope.removeUploadedFiles"
                    round
                    dense
                    flat
                  >
                    <q-tooltip>清空已上传文件</q-tooltip>
                  </q-btn>
                  <q-spinner
                    v-if="scope.isUploading"
                    class="q-uploader__spinner"
                  />
                  <div class="col">
                    <div class="q-uploader__title">
                      请添加文件(支持拖拽|支持多选)
                    </div>
                    <div class="q-uploader__subtitle">
                      {{ scope.uploadSizeLabel }} /
                      {{ scope.uploadProgressLabel }}
                    </div>
                  </div>
                  <q-btn
                    v-if="scope.canAddFiles"
                    type="a"
                    icon="add_box"
                    @click="scope.pickFiles"
                    round
                    dense
                    flat
                  >
                    <q-uploader-add-trigger />
                    <q-tooltip>添加文件</q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="scope.canUpload"
                    icon="cloud_upload"
                    @click="scope.upload"
                    round
                    dense
                    flat
                  >
                    <q-tooltip>开始上传</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="scope.isUploading"
                    icon="clear"
                    @click="scope.abort"
                    round
                    dense
                    flat
                  >
                    <q-tooltip>终止上传</q-tooltip>
                  </q-btn>
                </div>
              </template>
            </MyUploader>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <!-- <q-card-actions align="right">
      <q-btn color="primary" icon="cloud_upload" label="上传" @click="upload" />
    </q-card-actions> -->
  </q-card>
</template>

<script>
import { apiUploadResources } from "src/api/teacher/teaResource";
import { mapGetters } from "vuex";
export default {
  name: "TeaResourceUploadCard",
  props: {
    category: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      // 待上传信息
      uploadDto: {
        category: "",
        description: "",
      },
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
    MyUploader: () => import("src/components/common/MyUploader.js"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      teaResourceCategoryOptions: "teaResourceCategoryOptions",
    }),

    allowUpload() {
      // uploadDto.category 为空或 undefined，不允许上传
      return !!this.uploadDto.category;
    },
  },

  watch: {
    category: {
      handler(newVal) {
        this.uploadDto.category = newVal.value;
      },
      immediate: true,
    },
  },

  methods: {
    async uploadTeaResource(files) {
      const uploadedFilesDto = [];

      files.forEach((file) => {
        let fileDto = {
          filename: file.name,
          fileUrl: file.fileUrl,
          filetype: file.name.split(".").pop(),
          filecategory: this.uploadDto.category,
          description: this.uploadDto.description,
        };
        uploadedFilesDto.push(fileDto);
      });

      const payload = {
        course_id: this.currSelectedTeaCourse.courseId,
        files: uploadedFilesDto,
      };

      try {
        await apiUploadResources(payload);

        // 提示上传成功
        this.$q.notify({
          message: "上传成功",
          type: "positive",
        });

        // 清空已上传队列
        this.$refs.uploader.removeUploadedFiles();

        // 通知父组件
        this.$emit("uploadFinished");
      } catch (error) {
        console.log(error);
        // 提示上传失败
        this.$q.notify({
          message: "上传失败",
          type: "negative",
        });
      }
    },

    onUploadFinished(uploadedFiles) {
      this.uploadTeaResource(uploadedFiles);
    },
  },

  created() {},
};
</script>
