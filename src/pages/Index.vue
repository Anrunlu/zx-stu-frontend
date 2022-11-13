<template>
  <div id="app">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { MyClipboardAdapterPlugin } from "@/utils/ckeditor/MyClipboardPlugin";
import { MyCustomUploadAdapterPlugin } from "@/utils/ckeditor/MyUploadPlugin";

export default {
  name: "app",
  data() {
    return {
      editor: Editor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        extraPlugins: [MyClipboardAdapterPlugin, MyCustomUploadAdapterPlugin],
      },
    };
  },
};
</script>
