import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import Katex from "vue-katex-auto-render";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));

export default async ({ Vue }) => {
  Vue.directive("katex", Katex);
};
