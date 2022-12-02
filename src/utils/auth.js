import { Cookies } from "quasar";

const TokenKey = "zx_token";

export function getToken() {
  return Cookies.get(TokenKey) || "";
}

export function setToken(token) {
  Cookies.set(TokenKey, token, { path: "/" });
}

export function removeToken() {
  Cookies.remove(TokenKey, { path: "/" });
}

// 计算密码强度
export function getPwdLevel(pwd) {
  let lvl = 0; // 默认是0级

  if (pwd.length < 6) {
    return lvl;
  }

  // 密码中是否有数字
  if (/[0-9]/.test(pwd)) {
    lvl++;
  }

  // 密码中有没有字母
  if (/[a-zA-Z]/.test(pwd)) {
    lvl++;
  }

  // 密码中有没有特殊符号
  if (/[^0-9a-zA-Z_]/.test(pwd)) {
    lvl++;
  }

  return lvl;
}
