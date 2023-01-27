<template>
  <!-- 创建导图 -->
  <q-card style="width: 600px; max-width: 90vw">
    <q-form @submit="handlePublishCourseMindSubmit">
      <!-- 标题栏 -->
      <CardBar title="创建导图" icon="add" />

      <q-card-section class="q-pa-sm">
        <q-list class="row">
          <!-- 导图标题 -->
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

          <!-- 导图类别 -->
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
            <q-item-section top avatar>
              <div>
                <q-toggle
                  name="music_genre"
                  v-model="currCourseMindDetails.allowedEdit"
                  label="不允许其他人编辑"
                  icon="lock"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn type="submit" color="primary" icon="edit_square">
          确定并开始编辑
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { apiCreateCourseMinds } from "src/api/teacher/courseMind";
import { mapGetters } from "vuex";
export default {
  name: "CourseMindAddCard",
  props: {},

  data() {
    return {
      currCourseMindDetails: {
        title: "",
        category: "",
        // 是否允许其他人编辑
        allowedEdit: false,
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
    // 发布导图
    async createCourseMind() {
      console.log("发布导图");

      // 新页面打开编辑器
      const url = `course_mind_detail/xxxx`;

      window.open(url, "_blank");

      return;

      const createCourseMindsDto = {
        title: this.currCourseMindDetails.title,
        teacourse_id: this.currSelectedTeaCourse._id,
        course_id: this.currSelectedTeaCourse.courseId,
        receiverType: "Classroom",
        receiverIds: this.currCourseMindDetails.receivers.map(
          (receiver) => receiver._id
        ),
        starttime: this.currCourseMindDetails.starttime,
        endtime: this.currCourseMindDetails.endtime,
        questionSet_ids: [this.questionSet._id],
        category: this.currCourseMindDetails.category,

        isShowScoreAfterEndtime:
          this.currCourseMindDetails.isShowScoreAfterEndtime,
        isShowAnswerAfterEndtime:
          this.currCourseMindDetails.isShowAnswerAfterEndtime,
        isShowKnowledge: this.currCourseMindDetails.isShowKnowledge,
      };

      if (this.currCourseMindDetails.category === "课堂导图") {
        createCourseMindsDto.starttime = new Date();
        createCourseMindsDto.endtime = new Date("2999-12-31");
      }

      try {
        const { data } = await apiCreateCourseMinds(createCourseMindsDto);
        if (data.data.ok) {
          // 弹窗提示
          this.$q
            .dialog({
              title: "提示",
              message: "导图发布成功，是否前往查看？",
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
            .onOk(() => {
              // 跳转到导图详情页
              this.$router.push({
                path: "courseMind",
                query: {
                  category: this.currCourseMindDetails.category,
                },
              });
            })
            .onCancel(() => {
              // 通知父组件创建成功
              this.$emit("createCourseMindsSuccess");
            })
            .onDismiss(() => {});
        }
      } catch (error) {
        this.$q.notify({
          message: "发布失败",
          type: "negative",
        });
      }
    },

    // 处理表单提交
    handlePublishCourseMindSubmit() {
      // 发布导图
      this.createCourseMind();
    },
  },

  created() {},
};
</script>
