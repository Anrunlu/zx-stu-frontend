<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="drive_folder_upload" />
        <div>导入题目</div>
        <div class="q-ml-xs">
          <q-btn
            dense
            flat
            color="white"
            icon="contact_support"
            size="sm"
            label="文档格式说明"
          />
          <q-btn
            dense
            flat
            color="white"
            icon="wysiwyg"
            label="查看示例"
            size="sm"
            @click.stop="handleViewExampleBtnClick"
          />
        </div>

        <q-space />
        <!-- 全屏按钮 -->
        <q-btn
          v-if="!$q.platform.is.mobile"
          dense
          flat
          @click="$q.fullscreen.toggle()"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        >
          <q-tooltip>
            {{ $q.fullscreen.isActive ? "退出全屏" : "全屏" }}
          </q-tooltip>
        </q-btn>
        <!-- 关闭按钮 -->
        <q-btn dense flat icon="close" @click="handleClosePageClick">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-mt-md">
        <q-splitter v-model="splitterModel" style="height: 92vh">
          <template v-slot:before>
            <div class="q-px-sm" id="import-question-editor">
              <ckeditor
                :editor="editor"
                v-model="importQuestionContent"
                :config="editorConfig"
              />
            </div>
          </template>

          <template v-slot:separator>
            <q-btn
              id="import-question-parse-btn"
              color="accent"
              icon="swap_horiz"
              size="md"
              round
              @click="handleParseQuestion"
            >
              <q-tooltip> 识别题目 </q-tooltip>
            </q-btn>
          </template>

          <template v-slot:after>
            <div id="import-question-preview">
              <div class="q-px-md" v-show="questionList.length > 0">
                <q-card class="shadow-1">
                  <q-btn-toggle
                    v-model="currSelectedQuestionType"
                    toggle-color="primary"
                    text-color="grey-7"
                    size="sm"
                    :options="
                      [
                        {
                          label: '成功' + `(${amount['success']})`,
                          value: '成功',
                          icon: 'check_circle',
                        },
                        {
                          label: '失败' + `(${amount['err']})`,
                          value: '失败',
                          icon: 'error',
                        },
                      ].concat(
                        questionTypeOptions.map((item) => {
                          return {
                            label: item.label + `(${amount[item.value]})`,
                            value: item.value,
                            icon: item.icon,
                          };
                        })
                      )
                    "
                  />
                </q-card>

                <div
                  style="max-height: 88vh"
                  class="scroll q-mt-sm q-pb-xl q-gutter-md"
                >
                  <div
                    v-for="(questionDetails, index) in currSelectedQuestionList"
                    :key="index"
                  >
                    <q-card
                      class="bg-red-3 text-white shadow-1"
                      v-if="questionDetails.isErr"
                    >
                      <q-card-section>
                        <div class="text-h6">
                          第 {{ questionDetails.index }} 题
                        </div>
                        <div class="text-h6">
                          解析出错，错误信息：{{ questionDetails.errMsg }}
                        </div>
                      </q-card-section>
                    </q-card>

                    <q-card class="shadow-1" v-else>
                      <q-card-section>
                        <QuestionViewCommon
                          :questionDetails="questionDetails"
                          :index="questionDetails.index"
                          :showIndex="true"
                          :showExplain="true"
                          :questionChipColorization="false"
                          class="q-my-sm"
                        />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
              <div
                class="q-pa-md text-h3 text-grey"
                v-show="questionList.length == 0"
              >
                <div class="row justify-center">
                  <div class="col-auto">
                    <ol style="line-height: 2.5rem">
                      <li>请在左侧编辑框中按规定格式录入题目文本</li>
                      <li>
                        录入完毕后请点击&nbsp;
                        <span class="text-accent">
                          <q-icon name="swap_horiz" />
                          识别题目
                        </span>
                        &nbsp;按钮进行题目识别
                      </li>
                      <li>
                        核验无误后请点击&nbsp;
                        <span class="text-positive">
                          <q-icon name="cloud_upload" />
                          确定导入
                        </span>
                        &nbsp;按钮进行题目导入
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-splitter>
      </q-page>
    </q-page-container>
    <q-footer bordered class="bg-white text-primary">
      <div class="float-left q-ml-sm">
        <div class="q-py-sm">
          <span style="font-size: 0.5rem; color: #9e9e9e"
            >出题：{{ nickname }}</span
          >
        </div>
      </div>
      <div class="float-right q-mr-sm">
        <q-btn
          flat
          square
          label="重置编辑框"
          @click="handleRestEditorContent"
        />
        <q-btn
          id="import-question-confirm-import-btn"
          flat
          square
          color="positive"
          label="确定导入"
          icon="cloud_upload"
          @click="handleConfirmImportBtnClick"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "src/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "src/utils/ckeditor/MyUploadPlugin";
import { mapGetters } from "vuex";
import {
  checkQuestion,
  parseQuestionContentToQuestion,
  standardizeQuestionToUpload,
} from "src/utils/question";
import { apiImportQuestions } from "src/api/teacher/question";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

export default {
  name: "QuestionImport",
  props: ["courseId"],
  data() {
    return {
      splitterModel: 40,
      editor: Editor,
      importQuestionContent: "",
      importQuestionContentExample: `<p id='q-content-example'>表达式<code>type(3+4j) in (int, float, complex)</code>的值为？</p><p>A、True</p><p>B、False</p><p>C、1</p><p>D、0</p><p>解析：这是解析，解析是可选值哦！</p><p>答案：A</p><p>&nbsp;</p><p><span class=\"math-tex\">\\(x_1,x_2\\)</span>是方程<span class=\"math-tex\">\\(x^2+x+k=0\\)</span>的两个实根，若恰<span class=\"math-tex\">\\({x_1}^2+x_1x_2+{x_2}^2=2k^2\\)</span>成立，<span class=\"math-tex\">\\(k\\)</span>的值为？</p><p>a、<span class=\"math-tex\">\\(-1\\)</span></p><p>b、<span class=\"math-tex\">\\(\\frac{1}{2}\\)</span>或<span class=\"math-tex\">\\(-1\\)</span></p><p>C、<span class=\"math-tex\">\\(\\frac{1}{2}\\)</span></p><p>d、<span class=\"math-tex\">\\(-\\frac{1}{2}\\)</span>或<span class=\"math-tex\">\\(1\\)</span></p><p>答案：A</p><p>&nbsp;</p><p>语音编码有哪些？</p><p>A、波形编码</p><p>B、参量编码</p><p>C、音源编码</p><p>D、混合编码</p><p>答案：ABCD</p><p>&nbsp;</p><p>我国第一部编年史是《资治通鉴》。</p><p>解析：《资治通鉴》是北宋时期司马光编纂的一本编年体史书。这套书在中国史书中具有十分突出和特殊的地位。</p><p>答案：对</p><p>&nbsp;</p><p>我国的四大发明是____,____,____,____。</p><p>答案：造纸术|火药|指南针|印刷术</p><p>&nbsp;</p><p>格式化输出杨辉三角，运行效果图如下，可用字符串格式化输出。（注：如需录入复杂解答题，请使用题目单个添加功能）<br><img src=\"https://cyberdownload.anrunlu.net/Frbl7jNFT06tZADvT_T2MoB1Laep\"><br>答案：无</p>`,
      questionList: [],
      currSelectedQuestionList: [],
      currSelectedQuestionType: "成功",
      // 数量统计
      amount: {
        total: 0,
        err: 0,
        success: 0,
        单选: 0,
        多选: 0,
        判断: 0,
        填空: 0,
        解答: 0,
      },
    };
  },

  computed: {
    editorConfig() {
      return {
        toolbar: {
          items: ["imageUpload", "math", "code", "|", "undo", "redo"],
        },
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
      };
    },

    ...mapGetters("user", {
      username: "username",
      nickname: "nickname",
    }),

    ...mapGetters("settings", {
      questionTypeOptions: "questionTypeOptions",
    }),
  },

  components: {
    QuestionViewCommon: () =>
      import("src/components/common/QuestionViewCommon.vue"),
  },

  watch: {
    questionList: {
      handler() {
        this.amount.total = this.questionList.length;
        this.amount.err = this.questionList.filter((item) => item.isErr).length;
        this.amount.success = this.questionList.filter(
          (item) => !item.isErr
        ).length;
        this.amount.单选 = this.questionList.filter(
          (item) => item.type === "单选"
        ).length;
        this.amount.多选 = this.questionList.filter(
          (item) => item.type === "多选"
        ).length;
        this.amount.判断 = this.questionList.filter(
          (item) => item.type === "判断"
        ).length;
        this.amount.填空 = this.questionList.filter(
          (item) => item.type === "填空"
        ).length;
        this.amount.解答 = this.questionList.filter(
          (item) => item.type === "解答"
        ).length;
      },
      deep: true,
    },

    currSelectedQuestionType: {
      handler(newVal) {
        if (newVal === "成功") {
          this.currSelectedQuestionList = this.questionList.filter(
            (item) => !item.isErr
          );
        } else if (newVal === "失败") {
          this.currSelectedQuestionList = this.questionList.filter(
            (item) => item.isErr
          );
        } else {
          this.currSelectedQuestionList = this.questionList.filter(
            (item) => item.type === newVal
          );
        }
      },
      deep: true,
    },
  },

  methods: {
    // 导入题目
    async importQuestion() {
      const questionsToImport = [];

      // 处理解析后的题目列表，准备上传导入
      this.questionList
        .filter((q) => !q.isErr)
        .forEach((q) => {
          // 检查题目
          const checked = checkQuestion(q);
          if (!checked) {
            return;
          }

          const question = {
            type: q.type,
            content: q.content,
            answer: q.answer,
            explain: q.explain,
            difficulty: 0, // TODO: 难度暂时设置为0
            strict: false, // TODO: 严格模式暂时设置为false
            subjective: q.type == "解答" ? true : false, // TODO: 是否主观批阅暂时根据题目类型判断
          };
          questionsToImport.push(standardizeQuestionToUpload(question));
        });

      const importQuestionsDto = {
        course_id: this.courseId,
        questions: questionsToImport,
      };

      // 导入前确认提示
      this.$q
        .dialog({
          title: "请确认",
          message: `即将导入${questionsToImport.length}道题目，是否继续？`,
          persistent: true,
          ok: "继续",
          cancel: "取消",
        })
        .onOk(async () => {
          try {
            const { data } = await apiImportQuestions(importQuestionsDto);
            this.$q.notify({
              message: "导入成功",
              type: "positive",
            });
          } catch (e) {
            console.log(e);
            this.$q.notify({
              message: "导入失败",
              type: "negative",
            });
          }
        });
    },

    // 识别题目
    handleParseQuestion({ showResInfo = true }) {
      const preQuestionList = parseQuestionContentToQuestion(
        this.importQuestionContent
      );
      // 默认每个题目都是选中导入状态
      const questionList = preQuestionList.map((item) => {
        return {
          ...item,
          selectToImport: true,
        };
      });

      this.questionList = questionList;
      this.currSelectedQuestionType = "成功";
      this.currSelectedQuestionList = questionList.filter(
        (item) => !item.isErr
      );

      if (!showResInfo) {
        return;
      }

      setTimeout(() => {
        this.$q.dialog({
          title: "识别结果",
          message: `<p style='line-height:2rem'>
                  共识别&nbsp;<b>${this.amount.total}</b>&nbsp;题目<br/>
                  解析成功&nbsp;<b>${this.amount.success}</b>&nbsp;题目<br/>
                  解析失败&nbsp;<b>${this.amount.err}</b>&nbsp;题目<br/>
                  查验无误后请点击&nbsp;<b>确定导入</b>&nbsp;按钮进行导入
                  </p>`,
          persistent: true,
          html: true,
          ok: "知道了",
        });
      }, 200);
    },

    // 重置编辑框
    handleRestEditorContent() {
      // 提示
      this.$q
        .dialog({
          title: "提示",
          message: "确定要重置编辑框吗？",
          persistent: true,
          ok: "确定",
          cancel: "取消",
        })
        .onOk(() => {
          this.importQuestionContent = "";
          this.questionList = [];
          this.currSelectedQuestionList = [];
          this.currSelectedQuestionType = "成功";
        });
    },

    // 确定导入按钮点击
    handleConfirmImportBtnClick() {
      // 如果有 err 题目未处理，进行提示
      const errQuestionList = this.questionList.filter((item) => item.isErr);

      if (errQuestionList.length > 0) {
        this.$q
          .dialog({
            title: "提示",
            message:
              "还有解析失败的题目未处理，确定导入将会忽略这些题目，是否继续？",
            persistent: true,
            ok: "继续",
            cancel: "取消",
          })
          .onOk(() => {
            // 导入
            this.importQuestion();
          });
      } else {
        // 导入
        this.importQuestion();
      }
    },

    // 查看示例
    handleViewExampleBtnClick() {
      this.importQuestionContent = this.importQuestionContentExample;
      // this.handleParseQuestion();
      this.handleStartGuide();
    },

    // 引导
    handleStartGuide() {
      const driver = new Driver({
        animate: false,
        doneBtnText: "完成",
        closeBtnText: "关闭",
        nextBtnText: "下一个",
        prevBtnText: "上一个",
      });

      // Define the steps for introduction
      driver.defineSteps([
        {
          element: "#import-question-editor",
          popover: {
            className: "first-step-popover-class",
            title: "题目录入区域",
            description: "在此区域按照题目模板录入题目",
            position: "right",
          },
        },
        {
          element: "#import-question-parse-btn",
          popover: {
            title: "识别题目",
            description: "录入完毕后点击此按钮进行题目识别",
            position: "right",
            nextBtnText: "开始识别",
          },
          onNext: () => {
            driver.preventMove();
            this.handleParseQuestion({ showResInfo: false });
            setTimeout(() => {
              driver.moveNext();
            }, 200);
          },
        },
        {
          element: "#import-question-res-toolbar",
          popover: {
            title: "题目预览区域",
            description:
              "识别完成后，状态栏会显示识别结果，点击状态栏可以切换题目类型，下方的题目预览区域会显示对应类型的题目",
            position: "left",
          },
        },
        {
          element: "#import-question-preview",
          popover: {
            title: "题目预览区域",
            description:
              "识别完成后，状态栏会显示识别结果，点击状态栏可以切换题目类型，下方的题目预览区域会显示对应类型的题目",
            position: "left",
          },
        },
        {
          element: "#import-question-confirm-import-btn",
          popover: {
            title: "确定导入",
            description:
              "题目预览无误后，点击此按钮进行导入，导入成功后将会跳转到题目列表页面",
            position: "top-right",
          },
        },
      ]);

      // Start the introduction
      driver.start();
    },

    // 关闭页面
    handleClosePageClick() {
      window.close();
    },
  },

  created() {},
};
</script>

<style>
.ck-math-form {
  padding: 10px !important;
}

.ck.ck-content:not(.ck-comment__input *) {
  height: 86vh;
  overflow-y: auto;
}
@media screen and (max-width: 1920px) {
  .ck.ck-content:not(.ck-comment__input *) {
    /* height: 76vh; */
    height: 83vh;
    overflow-y: auto;
  }
}
</style>
