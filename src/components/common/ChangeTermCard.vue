<template>
  <q-card style="max-width: 90vw">
    <CardBar title="切换学期" icon="event_repeat" />
    <q-card-section>
      <!-- 显示当前学期 -->
      <div class="q-mb-sm">
        当前行政学期：
        <span class="text-primary">{{ collegeCurrTermName }}</span>
      </div>
      <div class="q-mb-sm">
        当前用户学期：
        <span :class="{ 'text-primary': collegeCurrTermId === currTermId }">{{
          currTermName
        }}</span>
      </div>
      <q-select
        dense
        v-model="selectedTerm"
        :options="termList"
        option-label="name"
        option-value="_id"
        label="请选择学期"
        square
        outlined
      >
        <template v-slot:prepend>
          <q-icon name="event_repeat" />
        </template>
      </q-select>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-close-popup
        icon="cloud_sync"
        label="同步为行政学期"
        color="positive"
        flat
        @click="handleSyncTermBtnClick"
      />
      <q-btn
        v-close-popup
        icon="done"
        label="确定"
        color="primary"
        @click="handleConfirmChangeTermBtnClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ChangeTermCard",

  data() {
    return {
      selectedTerm: "",
    };
  },

  components: {
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("user", {
      termList: "termList",
      currTermName: "termName",
      currTermId: "termId",
      collegeCurrTermId: "collegeCurrTermId",
      collegeCurrTermName: "collegeCurrTermName",
    }),
  },

  methods: {
    // 确认切换学期
    async handleConfirmChangeTermBtnClick() {
      try {
        await this.$store.dispatch("user/changeTerm", this.selectedTerm);
        // 提示切换成功
        this.$q.notify({
          message: "切换学期成功，部分页面需手动刷新后生效",
          type: "positive",
        });
        // 关闭对话框
      } catch (error) {
        this.$q.notify({
          message: "切换学期失败",
          type: "negative",
        });
      }
    },

    // 同步为行政学期
    async handleSyncTermBtnClick() {
      try {
        await this.$store.dispatch("user/changeTerm", {
          _id: this.collegeCurrTermId,
        });
        // 提示切换成功
        this.$q.notify({
          message: "同步学期成功，部分页面需手动刷新后生效",
          type: "positive",
        });
        // 关闭对话框
      } catch (error) {
        this.$q.notify({
          message: "同步学期失败",
          type: "negative",
        });
      }
    },
  },
};
</script>

<style></style>
