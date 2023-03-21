import {
  computeHomeworkStatusByTime,
  formatTimeWithWeekDay,
  formatTimeWithWeekDayAndSecond,
} from "./time";

// 预处理公告列表
export function preProcessAnnouncementList(announcementList) {
  announcementList.forEach((announcement) => {
    announcement.createdAt = formatTimeWithWeekDayAndSecond(
      announcement.createdAt
    );
  });
}

// 预处理公告详情
export function preProcessAnnouncementDetails(announcementDetails) {
  announcementDetails.createdAt = formatTimeWithWeekDayAndSecond(
    announcementDetails.createdAt
  );
}
