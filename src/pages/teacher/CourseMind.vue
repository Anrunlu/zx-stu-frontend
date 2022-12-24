<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="o_schema" />
        <div>课程导图</div>
        <q-space />
        <!-- 关闭按钮 -->
        <q-btn dense flat icon="close">
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-my-sm">
        <div id="map" style="width: 100vw; height: 96vh"></div>
      </q-page>
      <!-- <q-page-sticky position="top-right" :offset="[18, 18]" expand>
        <q-btn color="primary" icon="check" label="OK" @click="onClick" />
      </q-page-sticky> -->
    </q-page-container>
  </q-layout>
</template>

<script>
import MindElixir, { E } from "mind-elixir";

export default {
  name: "CourseMind",
  data() {
    return {
      ME: null,
    };
  },
  mounted() {
    this.ME = new MindElixir({
      el: "#map",
      direction: MindElixir.LEFT,
      draggable: true, // default true
      contextMenu: true, // default true
      toolBar: true, // default true
      nodeMenu: true, // default true
      keypress: true, // default true
    });
    this.ME.init(MindElixir.new("new topic"));
  },

  methods: {
    onClick() {
      console.log(this.ME.getAllData());
    },
  },
};
</script>

<style>
.lt {
  width: 40px;
}
</style>
