<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  mounted() {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.info("PWA mode");
    } else {
      console.info("Browser mode");
      window.addEventListener("beforeinstallprompt", (e) => {
        // 阻止原生横幅提示的默认行为
        e.preventDefault();

        // 保存事件以便稍后提示
        this.$store.commit("SET_PROMPT_EVENT", e);

        // 显示自定义横幅提示
        this.showPrompt = true;
      });
    }
  },
};
</script>
