<template>
  <q-card>
    <!-- 标题栏 -->
    <CardBar title="题目编辑" icon="edit"> </CardBar>

    <q-card-section style="max-height: 90vh" class="scroll">
      <div class="row justify-center">
        <div class="col-8 q-gutter-md">
          <div class="row">
            <!-- 题目类型 -->
            <q-select
              class="col-4"
              v-model="questionDetails.type"
              :options="questionTypes"
              square
              outlined
              dense
              disable
            >
              <template v-slot:selected>
                题目类型：
                <QuestionChip
                  :questionType="questionDetails.type"
                  v-if="questionDetails.type"
                />
                <q-badge v-else>*none*</q-badge>
              </template>
            </q-select>
          </div>

          <!-- 题干区域 -->
          <div>
            <q-chip
              size="sm"
              class="q-mx-none q-mb-sm"
              square
              outline
              icon="title"
              color="primary"
              text-color="white"
              label="题干"
            />
            <ckeditor
              :editor="editor"
              v-model="questionDetails.content"
              :config="editorConfig"
            ></ckeditor>
          </div>

          <!-- 客观题选项区域 -->
          <q-list v-if="questionDetails.type != '解答'">
            <div>
              <q-chip
                clickable
                size="sm"
                class="q-mx-none q-mb-sm"
                square
                outline
                icon="checklist_rtl"
                color="primary"
                text-color="white"
                label="选项"
                @click="optionAreaShowContent = '选项'"
              />
              <q-chip
                clickable
                size="sm"
                class="q-mx-none q-mb-sm q-ml-sm"
                square
                outline
                icon="feed"
                color="secondary"
                text-color="white"
                label="解析"
                @click="optionAreaShowContent = '解析'"
              />
            </div>

            <div v-if="optionAreaShowContent === '选项'">
              <q-item
                v-for="(option, index) in questionDetails.answer"
                :key="index"
              >
                <q-item-section
                  class="cursor-pointer"
                  avatar
                  v-if="questionDetails.type != '填空'"
                  @click="handleOptionMarkClick(option)"
                >
                  <q-icon :color="option.isRight ? 'positive' : 'primary'">{{
                    option.mark
                  }}</q-icon>
                </q-item-section>
                <q-item-section avatar v-else>
                  <q-icon :color="option.isRight ? 'positive' : 'primary'">{{
                    option.mark.slice(1, 2)
                  }}</q-icon>
                </q-item-section>
                <q-item-section>
                  <q-editor
                    v-model="option.content"
                    min-height="2rem"
                    square
                    v-if="questionDetails.type != '判断'"
                  />
                  <div class="text-body2" v-html="option.content" v-else></div>
                </q-item-section>
                <!-- 右侧按钮 -->
                <q-item-section side v-if="questionDetails.type != '判断'">
                  <q-btn
                    size="sm"
                    dense
                    round
                    outline
                    color="red-4"
                    icon="remove"
                    @click.stop=""
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="questionDetails.type != '判断'">
                <q-item-section>
                  <q-btn
                    style="width: 18%; margin: 0 auto"
                    dense
                    flat
                    color="green-4"
                    icon="add"
                    label="添加选项"
                  />
                </q-item-section>
              </q-item>
            </div>

            <!-- 题目解析 -->
            <div v-else-if="optionAreaShowContent === '解析'">
              <ckeditor
                :editor="editor"
                v-model="questionDetails.explain"
                :config="editorConfig"
              ></ckeditor>
            </div>
          </q-list>

          <!-- 解答题答案区域 -->
          <div v-else>
            <q-chip
              size="sm"
              class="q-mx-none q-mb-sm"
              square
              outline
              icon="fact_check"
              color="primary"
              text-color="white"
              label="答案"
            />
            <ckeditor
              :editor="editor"
              v-model="questionDetails.answer.content"
              :config="editorConfig"
            ></ckeditor>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
import { marked } from "marked";
import { apiGetQuestionDetail } from "src/api/teacher/questionBank";
import QuestionChip from "src/components/common/QuestionChip.vue";

export default {
  name: "QuestionEditCard",
  props: ["questionId"],
  data() {
    return {
      // 编辑器配置
      editor: Editor,
      editorConfig: {
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
      },

      // 题目详细信息
      questionDetails: {
        type: "",
        content: "",
      },

      // 题目类型
      questionTypes: ["单选", "多选", "判断", "填空", "解答"],

      // 题目下方显示内容
      optionAreaShowContent: "选项",
    };
  },

  components: {
    QuestionChip,
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  watch: {
    questionId: {
      immediate: true,
      handler(newQuestionId) {
        this.getQuestionDetail(newQuestionId);
      },
    },
  },

  methods: {
    // 获取题目详细信息
    async getQuestionDetail(questionId) {
      try {
        const { data } = await apiGetQuestionDetail(questionId);
        this.questionDetails = data.data;
        // 格式化题目内容
        this.questionDetails.content = marked(data.data.content);
        // 格式化客观题选项内容
        if (this.questionDetails.type != "解答") {
          this.questionDetails.answer.forEach((option) => {
            option.content = marked(option.content);
            // 过滤掉首尾的p标签
            option.content = option.content.slice(3, -5);
          });
        }
      } catch (error) {
        // 提示获取失败
        this.$q.notify({
          message: "获取题目详细信息失败",
          type: "negative",
        });
      }
    },

    // 点击选项标记
    handleOptionMarkClick(option) {
      // 切换选项正确性
      if (
        this.questionDetails.type === "单选" ||
        this.questionDetails.type === "判断"
      ) {
        // 单选题：只有一个正确选项
        this.questionDetails.answer.forEach((option) => {
          option.isRight = false;
        });
        option.isRight = true;
      } else if (this.questionDetails.type === "多选") {
        // 多选题：有多个正确选项
        option.isRight = !option.isRight;
      }
    },
  },

  created() {
    this.getQuestionDetail(this.questionId);
  },
};
</script>

<style></style>
