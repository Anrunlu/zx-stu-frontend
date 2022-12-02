import { request } from "src/boot/axios";

// 获取当前学院的学期列表
export function getTermList() {
  return request({
    url: "/admin/term",
    method: "get",
  });
}

// 用户登录
export function login(userLoginDto) {
  return request({
    url: "/auth/login",
    method: "post",
    data: userLoginDto,
  });
}

// 用户密码是否严格
export function userPasswordStrength() {
  return request({
    url: "/auth/userPasswordStrength",
    method: "get",
  });
}

// 获取APP2.0信息
export function getAppInfo() {
  return request({
    url: "/auth/app/getCurrentApp2Info",
    method: "get",
  });
}

// 获取用户信息
export function apiGetProfile() {
  return request({
    url: "/auth/user",
    method: "get",
  });
}

// 验证验证码
export function authEmail(data) {
  return request({
    url: "/auth/cache/authEmail",
    method: "post",
    data,
  });
}

// 修改个人信息
export function putProfile(data) {
  return request({
    url: "/auth/user",
    method: "put",
    data,
  });
}

// 发送邮件
export function sendEmail(data) {
  return request({
    url: "/auth/cache/sendEmail",
    method: "post",
    data,
  });
}

// 发送邮件到用户
export function sendUserEmail(data) {
  return request({
    url: "/auth/cache/sendUserEmail",
    method: "post",
    data,
  });
}

// 修改个人密码
export function putPWD(data) {
  return request({
    url: "/auth/chgPassword",
    method: "put",
    data,
  });
}
