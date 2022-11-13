import { Cookies } from "quasar";

const TokenKey = "zx_token";
const PasswordStrengthKey = "jxpt_password_strength";

export function getToken() {
  return Cookies.get(TokenKey) || "";
}

export function setToken(token) {
  Cookies.set(TokenKey, token, { path: "/" });
}

export function removeToken() {
  Cookies.remove(TokenKey, { path: "/" });
}

export function getPasswordStrength() {
  return sessionStorage.getItem(PasswordStrengthKey);
}

export function setPasswordStrength(token) {
  sessionStorage.setItem(PasswordStrengthKey, token);
}

export function removePasswordStrength() {
  sessionStorage.removeItem(PasswordStrengthKey);
}
