<template>
  <!-- 编辑导图元数据 -->
  <q-card style="width: 600px; max-width: 90vw">
    <q-form @submit="handlePublishCourseMindSubmit">
      <CardBar title="编辑导图" icon="edit" />
      <q-card-section class="q-pa-sm">
        <q-list class="row">
          <q-item class="col-12">
            <q-item-section>
              <q-input
                outlined
                square
                color="black"
                v-model="currCourseMindDetails.title"
                label="导图标题"
                :rules="[(val) => val.length > 0 || '请输入导图标题']"
                hide-bottom-space
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="subject" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section>
              <q-select
                outlined
                square
                :options="courseMindCategoryOptions"
                option-label="label"
                option-value="value"
                emit-value
                color="black"
                v-model="currCourseMindDetails.category"
                label="导图类别"
                :rules="[(val) => !!val || '请选择导图类别']"
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

          <q-item class="col-12">
            <q-item-section>
              <q-input
                outlined
                square
                color="black"
                v-model="currCourseMindDetails.description"
                label="导图描述(可选)"
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="o_comment" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section top avatar>
              <div>
                <q-toggle
                  name="music_genre"
                  v-model="currCourseMindDetails.isShare"
                  label="允许他人编辑"
                  icon="share"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn type="submit" color="primary" icon="sync"> 更新 </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import {
  apiGetCourseMindDetails,
  apiModifyCourseMind,
} from "src/api/teacher/courseMind";
import { mapGetters } from "vuex";
export default {
  name: "CourseMindEditCard",
  props: {
    // 导图id
    courseMindId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      currCourseMindDetails: {
        title: "",
        category: "",
        description: "",
        // 是否允许其他人编辑
        isShare: false,
      },
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("teaCourse", {
      currSelectedTeaCourse: "currSelectedTeaCourse",
    }),

    ...mapGetters("settings", {
      courseMindCategoryOptions: "courseMindCategoryOptions",
    }),
  },

  methods: {
    // 获取导图详情
    async getCourseMindDetails() {
      try {
        const { data } = await apiGetCourseMindDetails(this.courseMindId);
        this.currCourseMindDetails = data.data;
      } catch (error) {
        console.log(error);
        this.$q.notify({
          type: "negative",
          message: "获取导图详情失败",
        });
      }
    },

    // 更新导图元信息
    async modifyCourseMindMetaInfo() {
      const modifyCourseMindMetaInfoDto = {
        title: this.currCourseMindDetails.title,
        category: this.currCourseMindDetails.category,
        description: this.currCourseMindDetails.description,
        isShare: this.currCourseMindDetails.allowedEdit,
      };

      try {
        await apiModifyCourseMind(
          this.courseMindId,
          modifyCourseMindMetaInfoDto
        );
        this.$q.notify({
          message: "修改成功",
          type: "positive",
        });
        // 通知父组件关闭对话框
        this.$emit("closeEditingCourseMindDialog");
      } catch (error) {
        this.$q.notify({
          message: "修改失败",
          type: "negative",
        });
      }
    },

    // 处理表单提交
    handlePublishCourseMindSubmit() {
      // 修改导图
      this.modifyCourseMindMetaInfo();
    },
  },

  created() {
    this.getCourseMindDetails();
  },
};
</script>
