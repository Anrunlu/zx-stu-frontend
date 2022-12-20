<template>
  <!-- 创建作业 -->
  <q-card style="width: 700px; max-width: 80vw">
    <q-form @submit="handlePublishHomeworkSubmit">
      <!-- 标题栏 -->
      <CardBar title="发布作业" icon="add" />

      <q-card-section class="q-pa-sm">
        <q-list class="row">
          <!-- 使用的试题集 -->
          <q-item class="col-12">
            <q-item-section>
              <q-input
                outlined
                square
                :value="questionSet.title"
                dense
                readonly
                label="试题集"
              >
                <template v-slot:prepend>
                  <q-icon name="topic" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- 作业标题 -->
          <q-item class="col-12">
            <q-item-section>
              <q-input
                outlined
                square
                color="black"
                v-model="currHomeworkDetails.title"
                label="作业标题"
                :rules="[(val) => val.length > 0 || '请输入作业标题']"
                hide-bottom-space
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="subject" />
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- 作业类别 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
                outlined
                square
                :options="homeworkCategoryOptions"
                option-label="label"
                option-value="value"
                emit-value
                color="black"
                v-model="currHomeworkDetails.category"
                label="作业类别"
                :rules="[(val) => !!val || '请选择作业类别']"
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

          <!-- 发布到的教学班 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
                outlined
                square
                use-chips
                multiple
                :options="currSelectedTeaCourse.classrooms"
                option-label="name"
                option-value="_id"
                v-model="currHomeworkDetails.receivers"
                label="教学班(可多选)"
                :rules="[(val) => !!val || '请选择教学班']"
                hide-bottom-space
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="people" />
                </template>
              </q-select>
            </q-item-section>
          </q-item>

          <!-- 开始时间 -->
          <q-item
            class="col-6"
            v-if="currHomeworkDetails.category != '课堂作业'"
          >
            <q-item-section>
              <q-input
                outlined
                square
                dense
                v-model="currHomeworkDetails.starttime"
                :rules="[(val) => val.length > 0 || '请输入开始时间']"
                hide-bottom-space
                label="开始时间"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="currHomeworkDetails.starttime"
                        mask="YYYY-MM-DD HH:mm"
                        minimal
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="确定"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="currHomeworkDetails.starttime"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="确定"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <!-- 截止时间 -->
          <q-item
            class="col-6"
            v-if="currHomeworkDetails.category != '课堂作业'"
          >
            <q-item-section>
              <q-input
                outlined
                square
                dense
                v-model="currHomeworkDetails.endtime"
                :rules="[(val) => val.length > 0 || '请输入截止时间']"
                hide-bottom-space
                label="截止时间"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="currHomeworkDetails.endtime"
                        mask="YYYY-MM-DD HH:mm"
                        minimal
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="确定"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="currHomeworkDetails.endtime"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="确定"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-item-section>
          </q-item>

          <q-item class="col-12">
            <q-item-section top avatar>
              <div>
                <q-toggle
                  name="music_genre"
                  v-model="currHomeworkDetails.isShowKnowledge"
                  label="显示知识点"
                  icon="lightbulb"
                />

                <q-toggle
                  name="music_genre"
                  v-model="currHomeworkDetails.isShowAnswerAfterEndtime"
                  label="作业截止后开放答案"
                  icon="question_answer"
                />

                <q-toggle
                  name="music_genre"
                  v-model="currHomeworkDetails.isShowScoreAfterEndtime"
                  label="作业截止后显示成绩"
                  icon="leaderboard"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          type="submit"
          color="primary"
          class="q-px-sm"
          icon="cloud_upload"
        >
          发布
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { apiCreateHomeworks } from "src/api/teacher/homework";
import { mapGetters } from "vuex";
export default {
  name: "HomeworkAddCard",
  props: {
    questionSet: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      // 当前作业详情
      currHomeworkDetails: {
        title: "",
        category: "",
        starttime: "",
        endtime: "",
        receivers: [],
        // 是否显示知识点
        isShowKnowledge: false,
        // 作业截止后开放答案
        isShowAnswerAfterEndtime: false,
        // 作业截止后显示成绩
        isShowScoreAfterEndtime: false,
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
      homeworkCategoryOptions: "homeworkCategoryOptions",
    }),
  },

  methods: {
    // 获取题集列表

    // 发布作业
    async createHomeworks() {
      const createHomeworksDto = {
        title: this.currHomeworkDetails.title,
        teacourse_id: this.currSelectedTeaCourse._id,
        course_id: this.currSelectedTeaCourse.courseId,
        receiverType: "Classroom",
        receiverIds: this.currHomeworkDetails.receivers.map(
          (receiver) => receiver._id
        ),
        starttime: this.currHomeworkDetails.starttime,
        endtime: this.currHomeworkDetails.endtime,
        questionSet_ids: [this.questionSet._id],
        category: this.currHomeworkDetails.category,

        isShowScoreAfterEndtime:
          this.currHomeworkDetails.isShowScoreAfterEndtime,
        isShowAnswerAfterEndtime:
          this.currHomeworkDetails.isShowAnswerAfterEndtime,
        isShowKnowledge: this.currHomeworkDetails.isShowKnowledge,
      };

      try {
        const { data } = await apiCreateHomeworks(createHomeworksDto);
        if (data.data.ok) {
          // 弹窗提示
          this.$q
            .dialog({
              title: "提示",
              message: "作业发布成功，是否前往查看？",
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
              // 跳转到作业详情页
              this.$router.push({
                path: "homework",
                query: {
                  category: this.currHomeworkDetails.category,
                },
              });
            })
            .onCancel(() => {
              // 通知父组件创建成功
              this.$emit("createHomeworksSuccess");
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
    handlePublishHomeworkSubmit() {
      // 校验时间
      // 截止时间不能早于开始时间
      if (
        new Date(this.currHomeworkDetails.endtime) <
        new Date(this.currHomeworkDetails.starttime)
      ) {
        this.$q.notify({
          message: "截止时间不能早于开始时间",
          type: "negative",
        });
        return;
      }

      // 发布作业
      this.createHomeworks();
    },
  },

  created() {},
};
</script>
