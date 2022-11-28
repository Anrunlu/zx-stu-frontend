<template>
  <!-- 编辑作业 -->
  <!-- 当 mode = publish 为发布作业; mode = modify 为修改作业  -->
  <q-card style="width: 700px; max-width: 80vw">
    <q-form @submit="handleEditingHomeworkFormSubmit">
      <q-card-section>
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="grey-8"
          v-close-popup
        ></q-btn>
        <div class="text-h5">编辑作业</div>
        <q-separator class="q-mt-md" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-list class="row">
          <!-- 使用的试题集 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
                v-if="mode === 'publish'"
                outlined
                square
                clearable
                option-label="title"
                option-value="_id"
                label="请选择试题集"
                :rules="[(val) => !!val || '请选择试题集']"
                hide-bottom-space
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="topic" />
                </template>
              </q-select>
              <q-input
                v-else
                outlined
                square
                color="black"
                v-model="currHomeworkDetails.questionSet.title"
                label="使用的试题集(作业发布后不可修改)"
                disable
                :rules="[(val) => !!val || '请选择试题集']"
                hide-bottom-space
                dense
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

          <!-- 发布到的教学班 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
                outlined
                square
                use-chips
                color="black"
                v-model="currHomeworkDetails.receiver.name"
                label="发布到的教学班"
                :disable="mode === 'modify'"
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

          <!-- 作业类别 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
                outlined
                square
                :options="homeworkCategoryOptions"
                color="black"
                v-model="currHomeworkDetails.category"
                label="作业类别"
                :rules="[(val) => !!val || '请选择作业类别']"
                hide-bottom-space
                dense
                ><template v-slot:prepend>
                  <q-icon name="app_registration" /> </template
              ></q-select>
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
                label="开始日期"
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
                label="截至日期"
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
          :icon="mode === 'publish' ? 'cloud_upload' : 'cached'"
        >
          {{ mode === "publish" ? "发布" : "更新" }}
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";
import {
  apiGetHomeworkDetails,
  apiModifyHomework,
} from "src/api/teacher/homework";
import { date } from "quasar";
export default {
  name: "EditingHomeworkCard",
  props: {
    // 作业id
    homeworkId: {
      type: String,
      default: "",
    },
    // 编辑模式，publish 为新发布，modify 为更新
    mode: {
      type: String,
      default: "publish",
    },
  },

  data() {
    return {
      // 当前作业详情
      currHomeworkDetails: {
        id: "",
        title: "",
        category: "",
        starttime: "",
        endtime: "",
        isShowKnowledge: "",
        isShowAnswer: "",
        isShowScores: "",
        questionSet: {
          id: "",
          title: "",
        },
        receiver: {
          id: "",
          name: "",
        },
        // 是否显示知识点
        isShowKnowledge: false,
        // 作业截止后开放答案
        isShowAnswerAfterEndtime: false,
        // 作业截止后显示成绩
        isShowScoreAfterEndtime: false,
      },

      // 作业类型选项
      homeworkCategoryOptions: [
        "课前预习",
        "课堂作业",
        "课后作业",
        "课程实验",
        "课程论文",
        "课程设计",
        "毕业设计",
        "期中考试",
        "期末考试",
      ],
    };
  },

  computed: {
    ...mapGetters("teaCourse", {
      teaCourseList: "teaCourseList",
    }),
  },

  methods: {
    // 获取作业详情
    async getHomeworkDetails() {
      try {
        const { data } = await apiGetHomeworkDetails(this.homeworkId);
        const resHomework = data.data;
        this.currHomeworkDetails.id = resHomework.id;
        this.currHomeworkDetails.title = resHomework.title;
        this.currHomeworkDetails.category = resHomework.category;
        this.currHomeworkDetails.starttime = date.formatDate(
          resHomework.starttime,
          "YYYY-MM-DD HH:mm"
        );
        this.currHomeworkDetails.endtime = date.formatDate(
          resHomework.endtime,
          "YYYY-MM-DD HH:mm"
        );
        this.currHomeworkDetails.isShowScores = resHomework.isShowScores;
        this.currHomeworkDetails.questionSet.id =
          resHomework.questionSets[0].id;
        this.currHomeworkDetails.questionSet.title =
          resHomework.questionSets[0].title;
        this.currHomeworkDetails.receiver.id = resHomework.receiver.id;
        this.currHomeworkDetails.receiver.name = resHomework.receiver.name;
        this.currHomeworkDetails.isShowKnowledge = resHomework.isShowKnowledge;
        this.currHomeworkDetails.isShowAnswerAfterEndtime =
          resHomework.isShowAnswerAfterEndtime;
        this.currHomeworkDetails.isShowScoreAfterEndtime =
          resHomework.isShowScoreAfterEndtime;
      } catch (error) {
        // 提示获取失败
        this.$q.notify({
          message: "获取作业详情失败",
          type: "negative",
        });
      }
    },

    // 发布作业

    // 更新作业
    async modifyHomework() {
      // 构造请求参数
      const payload = {
        title: this.currHomeworkDetails.title,
        category: this.currHomeworkDetails.category,
        starttime: new Date(this.currHomeworkDetails.starttime),
        endtime: new Date(this.currHomeworkDetails.endtime),
        isShowScoreAfterEndtime:
          this.currHomeworkDetails.isShowScoreAfterEndtime,
        isShowAnswerAfterEndtime:
          this.currHomeworkDetails.isShowAnswerAfterEndtime,
        isShowKnowledge: this.currHomeworkDetails.isShowKnowledge,
      };

      // 发送请求
      try {
        await apiModifyHomework(this.homeworkId, payload);
        // 提示更新成功
        this.$q.notify({
          message: "更新成功",
          type: "positive",
        });
        // 通知父组件关闭对话框
        this.$emit("closeEditingHomeworkDialog");
      } catch (error) {
        // 提示更新失败
        this.$q.notify({
          message: "更新失败",
          type: "negative",
        });
      }
    },

    // 处理表单提交
    handleEditingHomeworkFormSubmit() {
      // 发布作业
      if (this.mode === "publish") {
      }
      // 更新作业
      else if (this.mode === "modify") {
        this.modifyHomework();
      }
    },
  },

  created() {
    this.getHomeworkDetails();
  },
};
</script>
