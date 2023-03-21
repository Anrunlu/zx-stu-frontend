import {
  computeHomeworkStatusByTime,
  formatTimeWithWeekDay,
  formatTimeWithWeekDayAndSecond,
} from "./time";
import { getObjectShortId, toFixed2 } from "./common";
import { marked } from "marked";
import Vue from "vue";

// 预处理公告列表
export function preProcessAnnouncementList(announcementList) {
  announcementList.forEach((announcement) => {
    announcement.createdAt = formatTimeWithWeekDayAndSecond(
      announcement.createdAt
    );
  });
}
