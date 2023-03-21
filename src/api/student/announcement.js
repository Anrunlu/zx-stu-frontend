import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

// 获取公告列表
export function apiGetAnnouncementList(data) {
  return loadingFn(request)({
    url: "/common/announcement/filterReceived",
    method: "POST",
    data,
  });
}

// 获取公告详情
export function apiGetAnnouncementDetails(announcementId) {
  return loadingFn(request)({
    url: `/common/announcement/${announcementId}`,
    method: "GET",
  });
}

// 获取未读公告数量
export function apiGetUnreadAnnouncementCount() {
  return loadingFn(request)({
    url: `/common/announcement/unreadCount`,
    method: "POST",
  });
}

// 标记公告已读
export function apiMarkAnnouncementAsRead(data) {
  return loadingFn(request)({
    url: `/common/announcement/markAsRead`,
    method: "POST",
    data,
  });
}
