<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="edit" />
        <div>题目编辑</div>
        <q-space />
        <!-- 关闭按钮 -->
        <q-btn dense flat icon="close" @click="handleClosePageClick">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-my-md">
        <!-- 题目元信息 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8 q-mb-sm">
            <q-card-section>
              <div class="q-gutter-md">
                <QuestionChip
                  :questionType="questionDetails.type"
                  v-if="questionDetails.type"
                />
                <q-badge v-else>*none*</q-badge>
                <q-rating
                  v-model="questionDetails.difficulty"
                  size="xs"
                  color="grey"
                  :color-selected="ratingColors"
                >
                  <template v-slot:tip-1>
                    <q-tooltip>简单</q-tooltip>
                  </template>
                  <template v-slot:tip-2>
                    <q-tooltip>一般</q-tooltip>
                  </template>
                  <template v-slot:tip-3>
                    <q-tooltip>普通</q-tooltip>
                  </template>
                  <template v-slot:tip-4>
                    <q-tooltip>困难</q-tooltip>
                  </template>
                  <template v-slot:tip-5>
                    <q-tooltip>很困难</q-tooltip>
                  </template>
                </q-rating>
                <q-checkbox
                  v-if="questionDetails.type === '填空'"
                  dense
                  size="sm"
                  v-model="questionDetails.subjective"
                  label="主观填空题"
                >
                  <q-tooltip> 主观填空题需要手动批改 </q-tooltip>
                </q-checkbox>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 题目主体区域 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8">
            <q-card-section>
              <div class="q-gutter-md">
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
                  <!-- 切换选项和解析显示 -->
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

                  <!-- 题目选项 -->
                  <div v-if="optionAreaShowContent === '选项'">
                    <q-item
                      v-for="(option, index) in questionDetails.answer"
                      :key="index"
                    >
                      <!-- 选项标记 -->
                      <q-item-section
                        class="cursor-pointer"
                        avatar
                        v-if="questionDetails.type != '填空'"
                        @click="handleOptionMarkClick(option)"
                      >
                        <q-icon
                          :color="option.isRight ? 'positive' : 'primary'"
                          >{{ option.mark }}</q-icon
                        >
                      </q-item-section>
                      <q-item-section avatar v-else>
                        <q-icon
                          :color="option.isRight ? 'positive' : 'primary'"
                          >{{ option.mark.slice(1, 2) }}</q-icon
                        >
                      </q-item-section>

                      <!-- 选项内容 -->
                      <q-item-section>
                        <div v-if="questionDetails.type != '填空'">
                          <ckeditor
                            :editor="editor"
                            v-model="option.content"
                            :config="questionOptionEditorConfig"
                            v-if="questionDetails.type != '判断'"
                          ></ckeditor>
                          <div
                            class="text-body2 option"
                            v-html="option.content"
                            v-else
                          ></div>
                        </div>
                        <div v-else>
                          <q-input
                            v-if="!questionDetails.subjective"
                            v-model="option.content"
                            square
                            dense
                            outlined
                            placeholder="请输入答案，多个答案请用竖线`|`隔开"
                          />
                          <ckeditor
                            :editor="editor"
                            v-model="option.content"
                            :config="questionOptionEditorConfig"
                            v-else
                          ></ckeditor>
                        </div>
                      </q-item-section>

                      <!-- 右侧按钮 -->
                      <q-item-section
                        side
                        v-if="questionDetails.type != '判断'"
                      >
                        <!-- 移除选项 -->
                        <q-btn
                          size="sm"
                          dense
                          round
                          outline
                          color="red-4"
                          icon="remove"
                          @click.stop="handleRemoveOptionClick(option)"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item v-if="questionDetails.type != '判断'">
                      <q-item-section>
                        <!-- 添加选项 -->
                        <q-btn
                          style="width: 18%; margin: 0 auto"
                          dense
                          flat
                          color="green-4"
                          icon="add"
                          :label="
                            questionDetails.type != '填空'
                              ? '添加选项'
                              : '添加填空'
                          "
                          @click="handleAddOptionClick"
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

                <!-- 解答题解析区域 -->
                <div v-else>
                  <q-chip
                    size="sm"
                    class="q-mx-none q-mb-sm"
                    square
                    outline
                    icon="feed"
                    color="primary"
                    text-color="white"
                    label="解析"
                  />
                  <ckeditor
                    :editor="editor"
                    v-model="questionDetails.explain"
                    :config="editorConfig"
                  ></ckeditor>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <div class="float-left q-ml-sm">
        <div class="q-py-sm">
          <span style="font-size: 0.5rem; color: #9e9e9e"
            >出题：{{
              `${questionDetails.creator.nickname}|${questionDetails.createdAt}`
            }}</span
          >
          <span style="font-size: 0.5rem; color: #9e9e9e" class="q-ml-md"
            >上次更新：{{
              `${questionDetails.lastModifyBy.nickname}|${questionDetails.updatedAt}`
            }}</span
          >
        </div>
      </div>
      <div class="float-right q-mr-sm">
        <q-btn flat square label="保存" icon="save" @click="handleSaveClick" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
import { marked } from "marked";
import {
  apiGetQuestionDetail,
  apiModifyQuestion,
} from "src/api/teacher/questionBank";
import QuestionChip from "src/components/common/QuestionChip.vue";
import { formatTimeWithWeekDay } from "src/utils/time";

export default {
  name: "QuestionEdit",
  props: ["questionId"],
  data() {
    return {
      // 编辑器配置
      editor: Editor,
      // 题目详细信息
      questionDetails: {
        type: "",
        content: "",
        difficulty: 0,
        creator: {
          nickname: "",
        },
        lastModifyBy: {
          nickname: "",
        },
        subjective: false,
      },
      // 题目下方显示内容
      optionAreaShowContent: "选项",
      // ratingColors
      ratingColors: [
        "light-green-3",
        "light-green-6",
        "green",
        "green-9",
        "green-10",
      ],
    };
  },

  computed: {
    editorConfig() {
      return {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "fontColor",
            "highlight",
            "removeFormat",
            "underline",
            "bulletedList",
            "numberedList",
            "|",
            "alignment",
            "|",
            "math",
            "codeBlock",
            "imageUpload",
            "uploadFile",
            "blockQuote",
            "insertTable",
            "|",
            "findAndReplace",
            "undo",
            "redo",
          ],
        },
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
      };
    },
    questionOptionEditorConfig() {
      return {
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
        toolbar: {
          items: [
            "bold",
            "italic",
            "link",
            "|",
            "math",
            "codeBlock",
            "imageUpload",
            "uploadFile",
          ],
        },
        image: {
          toolbar: [
            "imageTextAlternative",
            "toggleImageCaption",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
          ],
        },
        language: "zh-cn",
      };
    },
  },

  components: {
    QuestionChip,
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
        // 格式化时间
        this.questionDetails.createdAt = formatTimeWithWeekDay(
          data.data.createdAt
        );
        this.questionDetails.updatedAt = formatTimeWithWeekDay(
          data.data.updatedAt
        );
        // 处理上次更新人等信息
        if (!this.questionDetails.lastModifyBy) {
          this.questionDetails.lastModifyBy = {
            nickname: this.questionDetails.creator.nickname,
          };
        }
        // 格式化客观题选项内容
        if (
          this.questionDetails.subjective == false &&
          this.questionDetails.type != "填空"
        ) {
          this.questionDetails.answer.forEach((option) => {
            option.content = marked(option.content);
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

    // 修改题目信息
    async modifyQuestion() {
      // 检查是否存在正确选项
      if (
        this.questionDetails.type != "解答" &&
        this.questionDetails.type != "填空"
      ) {
        const rightOptions = this.questionDetails.answer.filter(
          (option) => option.isRight
        );

        if (this.questionDetails.type == "多选") {
          if (rightOptions.length < 2) {
            this.$q.notify({
              message: "正确选项数量不能少于2个",
              type: "warning",
            });
            return;
          }
        } else {
          if (rightOptions.length !== 1) {
            this.$q.notify({
              message: "请设置一个正确选项",
              type: "warning",
            });
            return;
          }
        }
      }

      // 构造请求参数
      const modifyQuestionDto = {
        content: this.questionDetails.content,
        difficulty: this.questionDetails.difficulty,
        answer: this.questionDetails.answer,
        explain: this.questionDetails.explain,
      };

      // 如果是主观填空题，需要传入subjective
      if (this.questionDetails.type == "填空") {
        modifyQuestionDto.subjective = this.questionDetails.subjective;
      }

      try {
        await apiModifyQuestion(this.questionId, modifyQuestionDto);
        // 提示修改成功
        this.$q.notify({
          message: "修改成功",
          type: "positive",
        });
      } catch (error) {
        // 提示修改失败
        this.$q.notify({
          message: "修改失败",
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

    // 点击删除选项按钮
    handleRemoveOptionClick(option) {
      // 删除选项
      this.questionDetails.answer = this.questionDetails.answer.filter(
        (item) => item !== option
      );

      // 如果是填空题
      if (this.questionDetails.type === "填空") {
        // 重新生成填空标记
        this.questionDetails.answer.forEach((option, index) => {
          option.mark = `第${String.fromCharCode(49 + index)}空答案`;
        });
      } else {
        // 重新生成选项标记
        this.questionDetails.answer.forEach((option, index) => {
          option.mark = String.fromCharCode(65 + index);
        });
      }
    },

    // 点击添加选项按钮
    handleAddOptionClick() {
      // 判断选项或填空数量是否为空
      if (this.questionDetails.answer.length === 0) {
        // 如果是填空题
        if (this.questionDetails.type === "填空") {
          this.questionDetails.answer.push({
            mark: "第1空答案",
            content: "",
            isRight: true,
          });
        } else {
          this.questionDetails.answer.push({
            mark: "A",
            content: "",
            isRight: false,
          });
        }
        return;
      }

      // 获取最后一个选项的标记
      const lastOptionMark =
        this.questionDetails.answer[this.questionDetails.answer.length - 1]
          .mark;

      // 根据最后一个选项的标记生成新的选项标记
      let newOptionMark = String.fromCharCode(lastOptionMark.charCodeAt(0) + 1);

      // 如果是填空题
      if (this.questionDetails.type === "填空") {
        const lastOptionMark = this.questionDetails.answer[
          this.questionDetails.answer.length - 1
        ].mark.slice(1, 2);
        newOptionMark = String.fromCharCode(lastOptionMark.charCodeAt(0) + 1);
        newOptionMark = `第${newOptionMark}空答案`;
      }

      // 添加选项
      this.questionDetails.answer.push({
        content: "",
        isRight: this.questionDetails.type === "填空" ? true : false,
        mark: newOptionMark,
      });
    },

    // 点击保存按钮
    handleSaveClick() {
      // 保存题目
      this.modifyQuestion();
    },

    // 关闭页面
    handleClosePageClick() {
      window.close();
    },
  },

  created() {
    this.getQuestionDetail(this.questionId);
  },
};
</script>

<style>
.ck-math-form {
  padding: 10px !important;
}
.option p {
  margin: 0;
}
</style>
