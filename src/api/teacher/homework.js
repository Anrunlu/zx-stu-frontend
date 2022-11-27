import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

export function apiGetHomeworks(data) {
  return loadingFn(request)({
    url: "/tea/homework/queryByTeaCourse",
    method: "POST",
    data,
  });
}
