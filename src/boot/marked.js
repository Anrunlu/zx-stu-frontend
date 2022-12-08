import { marked } from "marked";
import markedKatex from "marked-katex-extension";

const options = {
  throwOnError: false,
};

marked.use(markedKatex(options));
