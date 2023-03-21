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
