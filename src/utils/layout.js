import { Cookies } from "quasar";

const LayoutKey = "zx_layout";

export function getLayout() {
  return Cookies.get(LayoutKey) || "";
}

export function setLayout(name) {
  Cookies.set(LayoutKey, name, { path: "/" });
}

export function removeLayout() {
  Cookies.remove(LayoutKey, { path: "/" });
}
