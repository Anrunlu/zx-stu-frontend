<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <q-card
      :id="questionDetails._id"
      class="q-my-sm shadow-1 cursor-pointer"
      :class="{
        'shadow-2': isActive,
      }"
      @click="handleQuestionCardClick"
      @dblclick="handleQuestionCardDblClick"
    >
      <q-card-section class="q-pa-sm">
        <div class="row q-gutter-sm">
          <QuestionChip
            :questionType="questionDetails.type"
            :colorization="false"
          />
          <q-space />
          <!-- 序号 -->
          <q-chip
            class="float-right"
            color="grey"
            dense
            outline
            size="sm"
            square
            :label="index"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div v-html="questionDetails.content"></div>
      </q-card-section>
      <q-card-section>
        <ckeditor
          :editor="editor"
          :config="editorConfig"
          v-model="questionDetails.studentQA[0].stuAnswer[0].content"
        ></ckeditor>
      </q-card-section>
      <q-card-section>
        <q-btn
          :color="questionDetails.isSubmit ? 'positive' : 'primary'"
          :icon="questionDetails.isSubmit ? 'cached' : 'check'"
          @click="handlePostJieDaAnswer"
          >{{ !questionDetails.isSubmit ? "提交" : "更新" }}
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
export default {
  name: "StudentHomeworkJiedaQuestionCard",
  props: {
    index: {
      type: Number,
      required: false,
    },
    questionDetails: {
      type: Object,
      default: () => {
        return {
          id: "",
          type: "",
          difficulty: 0,
          presetScore: 0,
          content: "",
          studentQA: [
            {
              stuAnswer: [
                {
                  content: "",
                },
              ],
              score: 0,
            },
          ],
        };
      },
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      // 编辑器配置
      editor: Editor,
      studentqaAnnotationDig: false,
      questionViewDig: false,
      props: {
        index: {
          type: Number,
          required: false,
        },
        questionDetails: {
          type: Object,
          required: true,
        },
        isActive: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
    };
  },

  components: {
    QuestionChip: () => import("src/components/common/QuestionChip.vue"),
  },

  methods: {
    handleQuestionCardClick() {
      this.$emit("questionCardClick", this.questionDetails);
    },
    handleQuestionCardDblClick() {
      this.$emit("questionCardDblClick", this.questionDetails);
    },
    handlePostJieDaAnswer() {
      this.$emit("postJieDaAnswer", this.questionDetails);
    },
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
};
</script>

<style>
#studentqa {
  height: 86vh;
  overflow-y: auto;
}
@media screen and (max-width: 1920px) {
  #studentqa {
    height: 76vh;
    overflow-y: auto;
  }
}
#studentqa img {
  max-width: 85% !important;
  display: block;
  margin: 0 auto;
}
</style>
