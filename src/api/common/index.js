import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

//获取我收到的公告列表
export function apiGetTime() {
  return loadingFn(request)({
    url: "/common/exam/getTime",
    method: "GET"
  })
}
