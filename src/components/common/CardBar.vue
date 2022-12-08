<template>
  <div>
    <q-bar class="bg-primary text-white shadow-1">
      <q-icon :name="icon" />
      <div>{{ title }}</div>

      <q-space />

      <!-- 定义右侧功能插槽 -->
      <slot name="right"> </slot>

      <!-- 关闭按钮 -->
      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>关闭</q-tooltip>
      </q-btn>
    </q-bar>
  </div>
</template>

<script>
export default {
  name: "CardBar",
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
  },
};
</script>

<style></style>
