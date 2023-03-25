<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <q-splitter
      v-if="mode == 'focus'"
      v-model="splitterModel"
      style="height: 90vh"
      :horizontal="!$q.platform.is.desktop"
    >
      <template v-slot:before>
        <q-card class="full-height">
          <q-card-section>
            <div class="row q-gutter-sm">
              <QuestionChip
                :questionType="questionDetails.type"
                :colorization="false"
              />
              <ObjectShortId
                :id="questionDetails._id"
                :color="'grey'"
                objectName="题目"
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
            <q-separator spaced />
            <div v-katex v-viewer v-html="questionDetails.content"></div>
          </q-card-section>
        </q-card>
      </template>

      <template v-slot:separator>
        <q-btn
          round
          size="lg"
          :color="questionDetails.isSubmit ? 'positive' : 'primary'"
          @click="handlePostJieDaAnswer"
          >{{ !questionDetails.isSubmit ? "提交" : "更新" }}
        </q-btn>
      </template>

      <template v-slot:after>
        <ckeditor
          :editor="editor"
          :config="editorConfig"
          @blur="handlePostJieDaAnswer"
          v-model="questionDetails.studentQA[0].stuAnswer[0].content"
        ></ckeditor>
      </template>
    </q-splitter>

    <q-card
      v-else
      :id="questionDetails._id"
      class="q-my-sm shadow-1"
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
          <ObjectShortId
            :id="questionDetails._id"
            :color="'grey'"
            objectName="题目"
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
        <div v-katex v-viewer v-html="questionDetails.content"></div>
      </q-card-section>
      <q-card-section
        v-if="
          isShowHomeworkDetails.isShowKnowledge &&
          questionDetails.knowledges.length != 0
        "
      >
        <!-- 知识点区域 -->
        <div class="q-mt-md">
          <div class="row">
            <q-chip
              v-for="(knowledge, index) in questionDetails.knowledges"
              icon="o_lightbulb"
              size="sm"
              square
              :label="knowledge.name"
              :key="index"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <ckeditor
          @blur="handlePostJieDaAnswer"
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
      <!-- 底部信息区域 -->
      <div class="q-mt-sm">
        <q-chip
          dense
          outline
          size="sm"
          square
          v-if="
            isShowHomeworkDetails.isShowScoreAfterEndtime &&
            isShowHomeworkDetails.isEnd
          "
          :color="questionDetails.studentQA[0].score > 0 ? 'green-5' : 'grey'"
          :label="`${questionDetails.studentQA[0].score}分`"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import ObjectShortId from "src/components/common/ObjectShortId.vue";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
export default {
  name: "StudentHomeworkJiedaQuestionCard",
  props: {
    index: {
      type: Number,
      required: false,
    },
    mode: {
      type: String,
      required: false,
      default: "waterfall",
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
    isShowHomeworkDetails: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      splitterModel: 40,
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
    ObjectShortId,
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
.ck-math-form {
  padding: 10px !important;
}

.ck.ck-content:not(.ck-comment__input *) {
  height: 87vh;
  overflow-y: auto;
}
@media screen and (max-width: 1920px) {
  .ck.ck-content:not(.ck-comment__input *) {
    /* height: 76vh; */
    height: 87vh;
    overflow-y: auto;
  }
}
</style>
