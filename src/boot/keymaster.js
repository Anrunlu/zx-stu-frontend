import keymaster from "keymaster";

const bindKeyHandler = (fn) => {
  return () => {
    fn();
    return false;
  };
};

export const shortcut = {
  bind: (seed, func) => keymaster(seed, bindKeyHandler(func)),
  ...keymaster,
};

export default async ({ Vue }) => {
  Vue.prototype.$shortcut = shortcut;
};
