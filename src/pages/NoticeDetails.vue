<template>
  <q-layout view="hHh Lpr fFf" class="bg-white">
    <q-header elevated>
      <q-bar class="bg-primary text-white shadow-1">
        <q-icon name="edit_note" />

        <div class="text-body2">{{ announcementDetails.category }}</div>

        <q-space />

        <q-btn
          dense
          flat
          icon="close"
          @click="handleCloseBtnClick"
          v-if="!$q.platform.is.mobile"
        >
          <q-tooltip>关闭</q-tooltip>
        </q-btn>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page class="q-py-lg">
        <!-- 内容 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-9 shadow-1">
            <q-card-section>
              <div>
                <div class="text-h4">{{ announcementDetails.title }}</div>
                <div class="text-grey">
                  <span
                    >{{ announcementDetails.creator.nickname }}
                    {{ announcementDetails.createdAt }}</span
                  >
                </div>
              </div>
              <q-separator spaced inset />
              <div id="announcement-content" class="q-gutter-md q-mt-lg">
                <div
                  class="q-px-sm"
                  v-viewer
                  v-html="announcementDetails.content"
                ></div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>

    <q-footer bordered class="bg-white text-primary">
      <q-btn
        class="float-right"
        flat
        :disable="announcementDetails.isRead"
        :color="announcementDetails.isRead ? 'grey' : 'primary'"
        :icon="
          announcementDetails.isRead ? 'mark_email_read' : 'o_mark_chat_read'
        "
        :label="announcementDetails.isRead ? '已读' : '标记为已读'"
        @click="handleMarkAsReadBtnClick"
      />
    </q-footer>
  </q-layout>
</template>

<script>
import {
  apiGetAnnouncementDetails,
  apiMarkAnnouncementAsRead,
} from "src/api/student/announcement";
import { preProcessAnnouncementDetails } from "src/utils/announcement";
export default {
  name: "NoticeDetails",
  props: {
    announcementId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      announcementDetails: {
        title: "",
        category: "",
        content: "",
        isRead: false,
        creator: {
          nickname: "",
        },
      },
      isReadFromQuery: "false",
    };
  },

  components: {},

  methods: {
    async getAnnouncementDetails() {
      try {
        const { data } = await apiGetAnnouncementDetails(this.announcementId);

        preProcessAnnouncementDetails(data.data);

        this.announcementDetails = data.data;

        this.isLink();
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取公告详情失败",
          type: "negative",
        });
      }
    },

    async markAnnouncementAsRead() {
      if (this.announcementDetails.isRead) {
        return;
      }

      const payload = {
        ancmt_id: this.announcementId,
      };

      try {
        const { data } = await apiMarkAnnouncementAsRead(payload);

        this.announcementDetails.isRead = true;

        this.$q.notify({
          message: "标记已读成功",
          type: "positive",
        });
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "标记已读失败",
          type: "negative",
        });
      }
    },

    // 判断是否链接类型的公告
    isLink() {
      // 如果是链接类型，直接跳转
      if (this.announcementDetails.category === "链接") {
        window.open(this.announcementDetails.content);
      }
    },

    handleMarkAsReadBtnClick() {
      this.markAnnouncementAsRead();
    },

    handleCloseBtnClick() {
      if (this.isReadFromQuery == "true") {
        window.close();
      } else {
        this.$router.go(-1);
      }
    },
  },

  async created() {
    await this.getAnnouncementDetails();
    this.markAnnouncementAsRead();
  },
};
</script>

<style>
#announcement-content img {
  max-width: 100% !important;
  display: block;
  margin: 0 auto;
}

#announcement-content {
  font-size: 1.1rem;
}
</style>
