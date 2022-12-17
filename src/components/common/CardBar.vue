<template>
  <div>
    <q-toolbar v-if="toolbar" :class="`bg-${bgColor} text-white shadow-1`">
      <q-btn flat round dense :icon="icon" />
      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>

      <!-- 定义左侧功能插槽 -->
      <slot name="left"> </slot>

      <q-space />

      <!-- 定义右侧功能插槽 -->
      <slot name="right"> </slot>

      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>关闭</q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-bar v-else :class="`bg-${bgColor} text-white shadow-1`">
      <q-icon :name="icon" />
      <div>{{ title }}</div>

      <!-- 定义左侧功能插槽 -->
      <slot name="left"> </slot>

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
    toolbar: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    bgColor: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style></style>
