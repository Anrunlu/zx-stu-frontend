<template>
  <!-- TODO:这是一个抽象的table暂时未实现 -->

  <q-table
    flat
    :data="objectList"
    :columns="objectColumns"
    row-key="_id"
    :pagination="objectListTablePagination"
    :filter="objectFilter"
    :dense="objectListTableDense"
    :selected.sync="selectedObjects"
    selection="multiple"
    @row-click="handleObjectTableRowClick"
  >
    <!-- 左侧功能区 -->
    <template v-slot:top-left>
      <div class="q-gutter-sm">
        <!-- 定义左侧按钮插槽 -->
        <slot name="top-left" />
      </div>
    </template>

    <!-- 右侧功能区 -->
    <template v-slot:top-right="props">
      <div class="row q-gutter-sm">
        <q-input dense debounce="300" v-model="objectFilter" placeholder="搜索">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- 刷新按钮 -->
        <q-btn
          flat
          round
          dense
          icon="refresh"
          @click="handleObjectTableRefreshBtnClick"
        >
          <q-tooltip> 刷新 </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "退出全屏" : "全屏"
          }}</q-tooltip>
        </q-btn>
      </div>
    </template>

    <!-- shortId -->
    <template v-slot:body-cell-shortId="props">
      <q-td
        :props="props"
        @click.stop="handleTableCellIdClick(props.row)"
        class="cursor-pointer"
      >
        <q-icon name="fingerprint" size="xs" color="grey-6" />{{
          props.row.shortId
        }}
      </q-td>
    </template>

    <!-- 其他插槽 -->
    <slot />

    <!-- 无数据状态显示 -->
    <template v-slot:no-data>
      <div class="full-width row flex-center text-grey q-gutter-sm">
        <span class="text-h6"> 暂无数据 </span>
      </div>
    </template>
  </q-table>
</template>

<script>
import { copyToClipboard } from "quasar";
export default {
  name: "ObjectsTable",
  props: {
    objectList: {
      type: Array,
      default: () => [],
    },
    objectColumns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedObjects: [],
      objectFilter: "",
      objectListTablePagination: {
        rowsPerPage: 30,
      },
      objectListTableDense: true,
    };
  },
  methods: {
    // 点击编号
    handleTableCellIdClick(row) {
      // 复制到剪贴板
      copyToClipboard(row.id).then(() => {
        this.$q.notify({
          message: "编号已复制到剪贴板",
          type: "positive",
        });
      });
    },

    handleObjectTableRowClick(row) {
      this.$emit("questionTableRowClick", row);
    },

    handleObjectTableRefreshBtnClick() {
      this.$emit("questionTableRefreshBtnClick");
    },
  },
};
</script>

<style></style>
