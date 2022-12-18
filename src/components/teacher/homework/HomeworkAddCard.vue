<template>
  <!-- 创建作业 -->
  <q-card style="width: 700px; max-width: 80vw">
    <q-form @submit="handleEditingHomeworkFormSubmit">
      <!-- 标题栏 -->
      <CardBar title="发布作业" icon="add" />

      <q-card-section class="q-pa-sm">
        <q-list class="row">
          <!-- 使用的试题集 -->
          <q-item class="col-12">
            <q-item-section>
              <q-select
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
                :options="currSelectedTeaCourse.classrooms"
                option-label="name"
                option-value="_id"
                emit-value
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
                option-label="label"
                option-value="value"
                emit-value
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
import { mapGetters } from "vuex";
export default {
  name: "HomeworkAddCard",
  props: {},

  data() {
    return {
      // 当前作业详情
      currHomeworkDetails: {
        title: "",
        category: "",
        starttime: "",
        endtime: "",
        isShowKnowledge: "",
        isShowAnswer: "",
        isShowScores: "",
        questionSet: {
          _id: "",
          title: "",
        },
        receiver: {
          _id: "",
          name: "",
        },
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

    // 处理表单提交
    handleEditingHomeworkFormSubmit() {
      // 发布作业
    },
  },

  created() {},
};
</script>
