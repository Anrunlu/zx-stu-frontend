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
            @click="handleViewExampleBtnClick"
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
            <div class="q-px-sm">
              <ckeditor
                :editor="editor"
                v-model="importQuestionContent"
                :config="editorConfig"
              />
            </div>
          </template>

          <template v-slot:separator>
            <q-avatar
              color="primary"
              text-color="white"
              size="30px"
              icon="drag_indicator"
            />
          </template>

          <template v-slot:after>
            <div class="q-px-md" v-if="questionList.length > 0">
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
                  v-for="(questionDetails, index) in questionList"
                  :key="index"
                >
                  <q-card
                    class="bg-red-3 text-white shadow-1"
                    v-if="questionDetails.isErr"
                  >
                    <q-card-section>
                      <div class="text-h6">第 {{ index + 1 }} 题</div>
                      <div class="text-h6">
                        解析出错，错误信息：{{ questionDetails.errMsg }}
                      </div>
                    </q-card-section>
                  </q-card>

                  <q-card class="shadow-1" v-else>
                    <q-card-section>
                      <QuestionViewCommon
                        :questionDetails="questionDetails"
                        :index="index + 1"
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
            <div class="q-pa-md text-h3 text-grey" v-else>
              <div class="row justify-center">
                <div class="col-auto">
                  <ol style="line-height: 2.5rem">
                    <li>请在左侧编辑框中按规定格式录入题目文本</li>
                    <li>
                      录入完毕后请点击&nbsp;
                      <span class="text-primary">
                        <q-icon name="visibility" />
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
          label="识别题目"
          icon="visibility"
          @click="handleParseQuestion"
        />
        <q-btn
          flat
          square
          color="positive"
          label="确定导入"
          icon="cloud_upload"
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
import { parseQuestionContentToQuestion } from "src/utils/question";

export default {
  name: "QuestionImport",
  props: ["courseId"],
  data() {
    return {
      splitterModel: 40,
      editor: Editor,
      importQuestionContent: "",
      importQuestionContentExample: `<p>表达式<code>type(3+4j) in (int, float, complex)</code>的值为？</p><p>A、True</p><p>B、False</p><p>C、1</p><p>D、0</p><p>解析：这是解析，解析是可选值哦！</p><p>答案：A</p><p>&nbsp;</p><p>语音编码有哪些？</p><p>A、波形编码</p><p>B、参量编码</p><p>C、音源编码</p><p>D、混合编码</p><p>答案：ABCD</p><p>&nbsp;</p><p>我国第一部编年史是《资治通鉴》。</p><p>解析：《资治通鉴》是北宋时期司马光编纂的一本编年体史书。这套书在中国史书中具有十分突出和特殊的地位。</p><p>答案：对</p><p>&nbsp;</p><p>我国的四大发明是____,____,____,____。</p><p>答案：造纸术|火药|指南针|印刷术</p><p>&nbsp;</p><p>格式化输出杨辉三角，运行效果图如下，可用字符串格式化输出。（注：这是简单解答题录入，如需录入复杂解答题，请使用复杂解答题录入功能）<br><img src="https://cyberdownload.anrunlu.net/Frbl7jNFT06tZADvT_T2MoB1Laep"><br>答案：无</p>`,
      questionList: [],
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
          items: ["imageUpload", "code", "|", "undo", "redo"],
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

  watch: {},

  methods: {
    // 查看示例
    handleViewExampleBtnClick() {
      this.importQuestionContent = this.importQuestionContentExample;
      this.handleParseQuestion();
    },

    // 识别题目
    handleParseQuestion() {
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

      // 统计数量
      const amount = {
        total: questionList.length,
        err: questionList.filter((item) => item.isErr).length,
        success: questionList.filter((item) => !item.isErr).length,
        单选: questionList.filter((item) => item.type === "单选").length,
        多选: questionList.filter((item) => item.type === "多选").length,
        判断: questionList.filter((item) => item.type === "判断").length,
        填空: questionList.filter((item) => item.type === "填空").length,
        解答: questionList.filter((item) => item.type === "解答").length,
      };

      this.amount = amount;
      this.questionList = questionList;

      this.$q.dialog({
        title: "识别结果",
        message: `<p style='line-height:2rem'>
                  共识别&nbsp;<b>${amount.total}</b>&nbsp;题目<br/>
                  解析成功&nbsp;<b>${amount.success}</b>&nbsp;题目<br/>
                  解析失败&nbsp;<b>${amount.err}</b>&nbsp;题目<br/>
                  请查验无误后点击&nbsp;<b>确定导入</b>&nbsp;按钮进行导入
                  </p>`,
        persistent: true,
        html: true,
        ok: "知道了",
      });
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
.option p {
  margin: 0;
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
