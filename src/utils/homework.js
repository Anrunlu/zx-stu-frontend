import {
  computeHomeworkStatusByTime,
  formatTimeWithWeekDay,
  formatTimeWithWeekDayAndSecond,
} from "./time";
import { getObjectShortId, toFixed2 } from "./common";
import { marked } from "marked";
import Vue from "vue";
import { concatQuestionWithQuestionMeta } from "./questionSet";
import { apiGetHomeworkOverallAnswerStatus } from "src/api/teacher/homework";

// markdown转换为html
function markdownToHtml(value) {
  let htmlContent = marked(value);

  // 如果遇到 a 链接，改为 iframe
  // htmlContent = htmlContent.replace(
  //   /<a href="(.+?)" target="_blank">(.+?)<\/a>/g,
  //   `
  //   <iframe src="$1&amp;wdEmbedCode=0" width="100%" height="1000px" frameborder="0"></iframe>

  //   `
  // );

  return htmlContent;
}

// 预处理作业详情
export function preProcessHomeworkDetails(homeworkDetails) {
  homeworkDetails.shortId = getObjectShortId(homeworkDetails);
  homeworkDetails.endtimeFormatted = formatTimeWithWeekDay(
    homeworkDetails.endtime
  );
  homeworkDetails.statusByTime = computeHomeworkStatusByTime(homeworkDetails);

  calcHomeworkCorrectProgress(homeworkDetails).then((res) => {
    Vue.set(homeworkDetails, "correctProgress", res);
  });
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
  stuAnswerStatus.homeworkFinalScore = stuAnswerStatus.score;
}

// 预处理选择题
export function pretreatmentChoiceQuestions(choiceQuestions) {
  const res = choiceQuestions.map((q) => {
    // 初始化所有选项，格式化选项内容
    q.answer.forEach((a) => {
      a.content = marked(a.content);
      Vue.set(a, "selected", false);
    });

    if (q.studentQA.length > 0) {
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
        }

        return a;
      });
    } else {
      Vue.set(q, "submited", false);
      Vue.set(q, "getScore", 0);
      Vue.set(q, "studentQA", [
        {
          stuAnswer: [
            {
              content: "",
            },
          ],
          score: 0,
        },
      ]);
    }

    // 格式化题目内容
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

// 处理学生作业作答详情
export function pretreatmentStudentHomeworkDetails(studentHomeworkDetails) {
  const questionSets = studentHomeworkDetails.questionSets;
  // 过滤题型和统计各类型题目数
  const quesCategory = [];
  // 选择题，包括单、多选和判断
  let choiceQuestions = questionSets[0].questions.filter(
    (question) =>
      question.type === "单选" ||
      question.type === "多选" ||
      question.type === "判断"
  );
  if (choiceQuestions.length > 0) {
    quesCategory.push({
      type: "选择题",
      num: choiceQuestions.length,
      submitedNum: choiceQuestions.filter((q) => q.studentQA.length > 0).length,
    });
  }
  // 填空题
  let fillBlankQuestions = questionSets[0].questions.filter(
    (question) => question.type === "填空"
  );
  if (fillBlankQuestions.length > 0) {
    quesCategory.push({
      type: "填空题",
      num: fillBlankQuestions.length,
      submitedNum: fillBlankQuestions.filter((q) => q.studentQA.length > 0)
        .length,
    });
  }
  // 编程题
  const programQuestions = questionSets[0].questions.filter(
    (question) => question.type === "编程"
  );
  if (programQuestions.length > 0) {
    quesCategory.push({
      type: "编程题",
      num: programQuestions.length,
      submitedNum: programQuestions.filter((q) => q.studentQA.length > 0)
        .length,
    });
  }
  // 解答题
  const jiedaQuestions = questionSets[0].questions.filter(
    (question) => question.type === "解答"
  );
  if (jiedaQuestions.length > 0) {
    quesCategory.push({
      type: "解答题",
      num: jiedaQuestions.length,
      submitedNum: jiedaQuestions.filter((q) => q.studentQA.length > 0).length,
    });
  }

  // 设置 hasObjQues 和 hasSubQues 和 correctMode
  const hasObjQues = quesCategory.some(
    (q) => q.type === "选择题" || q.type === "填空题"
  );
  const hasSubQues = quesCategory.some((q) => q.type === "解答题");

  studentHomeworkDetails.hasObjQues = hasObjQues;
  studentHomeworkDetails.hasSubQues = hasSubQues;

  // 预处理选择题
  choiceQuestions = pretreatmentChoiceQuestions(choiceQuestions);
  // 预处理填空题
  fillBlankQuestions = pretreatmentFillBlankQuestions(fillBlankQuestions);
  // 预处理解答题
  pretreatmentJiedaQuestions(jiedaQuestions);

  const questions = [
    ...choiceQuestions,
    ...fillBlankQuestions,
    ...programQuestions,
    ...jiedaQuestions,
  ];

  const questionsMeta = questionSets[0].questionsMeta; // 题目元数据

  // 合并题目和题目元数据
  // concatQuestionWithQuestionMeta(questions, questionsMeta);

  studentHomeworkDetails.questions = questions;
  studentHomeworkDetails.quesCategory = quesCategory;
  studentHomeworkDetails.choiceQuestions = choiceQuestions;
  studentHomeworkDetails.fillBlankQuestions = fillBlankQuestions;
  studentHomeworkDetails.jiedaQuestions = jiedaQuestions;
  studentHomeworkDetails.programQuestions = programQuestions;

  return studentHomeworkDetails;
}

// 计算作业批改进度
export async function calcHomeworkCorrectProgress(homeworkDetails) {
  const getHomeworkOverallAnswerStatusDto = {
    homework_id: homeworkDetails._id,
    receiver_id: homeworkDetails.receiver._id,
    receiver_type: "Classroom",
    tcc_id: homeworkDetails.tcc,
  };

  const { data } = await apiGetHomeworkOverallAnswerStatus(
    getHomeworkOverallAnswerStatusDto
  );

  const allStuAnswerStatus = data.data;

  // 计算作业批改进度
  let baseNum = 0;

  let correctedSum = 0;

  allStuAnswerStatus.forEach((status) => {
    if (status.answerProgress >= 1) {
      baseNum += 1;
      correctedSum += status.correctProgress;
    }
  });

  const correctProgress = correctedSum / baseNum;

  return toFixed2(correctProgress);
}
