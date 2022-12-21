import { computeHomeworkStatusByTime, formatTimeWithWeekDay } from "./time";
import { getObjectShortId } from "./common";

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
