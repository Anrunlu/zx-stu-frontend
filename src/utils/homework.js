import {
  computeHomeworkStatusByTime,
  formatTimeWithWeekDay,
  formatTimeWithWeekDayAndSecond,
} from "./time";
import { getObjectShortId } from "./common";
import { marked } from "marked";
import Vue from "vue";

// 预处理作业详情
export function preProcessHomeworkDetails(homeworkDetails) {
  homeworkDetails.shortId = getObjectShortId(homeworkDetails);
  homeworkDetails.endtimeFormatted = formatTimeWithWeekDay(
    homeworkDetails.endtime
  );
  homeworkDetails.statusByTime = computeHomeworkStatusByTime(homeworkDetails);
}

// 预处理学生作答概况
export function preProcessStuAnswerStatus(stuAnswerStatus) {
  const state =
    stuAnswerStatus.answerProgress >= 1
      ? "已完成"
      : stuAnswerStatus.answerProgress == 0
      ? "未作答"
      : "未完成";
  stuAnswerStatus.state = state;
  stuAnswerStatus.isFinished = state == "已完成";
}

// 预处理选择题
export function pretreatmentChoiceQuestions(choiceQuestions) {
  const res = choiceQuestions.map((q) => {
    // 初始化所有选项
    q.answer.forEach((a) => {
      Vue.set(a, "selected", false);
    });
    q.answer = q.answer.map((a) => {
      a.content = marked(a.content);
      // 判断是否已作答
      if (q.studentQA) {
        if (q.studentQA.length > 0) {
          // 添加作答标记
          Vue.set(q, "submited", true);
          // 添加最后作答时间标记
          Vue.set(
            q,
            "lastSubmitedTime",
            formatTimeWithWeekDayAndSecond(q.studentQA[0].updatedAt)
          );
          // 得分 TODO:如果复用的话，这里需要修改，因为score可能不存在，目前只在学生作业作答详情页使用
          Vue.set(q, "getScore", q.studentQA[0].score);

          // 设置选中状态
          // 如果是多选题，遍历选中的选项，设置选中状态
          if (q.type === "多选") {
            q.studentQA[0].stuAnswer.forEach((sqa) => {
              if (sqa.mark === a.mark) {
                Vue.set(a, "selected", true);
              }
            });
          } else {
            Vue.set(a, "selected", q.studentQA[0].stuAnswer[0].mark === a.mark);
          }
        } else {
          Vue.set(q, "submited", false);
          Vue.set(a, "selected", false);
        }
      }

      return a;
    });
    q.content = marked(q.content);
    return q;
  });
  return res;
}

// 预处理填空题
export function pretreatmentFillBlankQuestions(fillBlankQuestions) {
  const res = fillBlankQuestions.map((q) => {
    q.answer = q.answer.map((a) => {
      // 判断是否已作答
      if (q.studentQA.length > 0) {
        // 添加作答标记
        Vue.set(q, "submited", true);
        // 添加最后作答时间标记
        Vue.set(
          q,
          "lastSubmitedTime",
          formatTimeWithWeekDayAndSecond(q.studentQA[0].updatedAt)
        );
        // 得分 TODO:如果复用的话，这里需要修改，因为score可能不存在，目前只在学生作业作答详情页使用
        Vue.set(q, "getScore", q.studentQA[0].score);
        // 合并学生作答和填空
        q.studentQA[0].stuAnswer.forEach((sqa) => {
          if (sqa.mark === a.mark) {
            a.content = sqa.content;
          }
        });
      } else {
        Vue.set(q, "submited", false);
      }
      return a;
    });
    return q;
  });
  return res;
}

// markdown转换为html
function markdownToHtml(value) {
  return marked(value);
}

// 预处理解答题
export function pretreatmentJiedaQuestions(jiedaQuestions) {
  if (jiedaQuestions.length == 0) {
    return;
  }
  // 初始化解答题
  jiedaQuestions.forEach((curr) => {
    // 题目内容格式化
    curr.content = markdownToHtml(curr.content);
    // 判断是否已经作答
    if (!curr.studentQA[0]) {
      // 未作答
      curr.isSubmit = false;
      curr.studentQA.push({
        stuAnswer: [
          {
            content: `<h2><span style="color:hsl(0, 75%, 60%);">未作答</span></h2>`,
          },
        ],
        score: 0,
      });
    } else {
      // TODO:暂时向下兼容，后期删除
      // 已作答，转换为html格式渲染
      curr.isSubmit = true;
      curr.studentQA[0].stuAnswer[0].content = markdownToHtml(
        curr.studentQA[0].stuAnswer[0].content
      );
    }
  });
}
