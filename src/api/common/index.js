import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

export function apiGetTime() {
  return loadingFn(request)({
    url: "/common/exam/getTime",
    method: "GET",
  });
}
