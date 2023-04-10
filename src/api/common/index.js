import { request } from "src/boot/axios";
import { loadingFn } from "src/utils/loadingTools";

export function apiGetTime() {
  return loadingFn(request)({
    url: "/common/exam/getTime",
    method: "GET",
  });
}

export function apiSendUserEmail(data) {
  return loadingFn(request)({
    url: "/auth/cache/sendUserEmail",
    method: "post",
    data
  });
}

// 验证验证码
export function apiVerifyCode(data) {
  return loadingFn(request)({
    url: "/auth/cache/verifyCode",
    method: "post",
    data
  });
}

// 修改个人密码
export function apiUpdatePassword(data) {
  return loadingFn(request)({
    url: "/auth/cache/changeAuthPassword",
    method: "post",
    data
  });
}
