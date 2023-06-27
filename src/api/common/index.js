import { mapRequest, request } from "src/boot/axios";
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

// 验证是否绑定邮箱
export function apiCheckIsBindEmail(data) {
  return loadingFn(request)({
    url: "/auth/cache/checkIsBindEmail",
    method: "post",
    data
  });
}
// 绑定邮箱
export function apiBindEmail(data) {
  return loadingFn(request)({
    url: "/auth/cache/bindEmail",
    method: "post",
    data
  });
}

export function apiGetAddress() {
  return loadingFn(mapRequest)({
    url:"?address=北京市海淀区彩和坊路海淀西大街74号&key=XHSBZ-NHJLG-Y6FQT-QQ3AK-N7YB5-GDBK5",
    method: "get",
  })
}
