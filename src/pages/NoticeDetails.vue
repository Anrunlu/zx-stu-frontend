<template>
  <q-layout view="hHh Lpr fFf" class="bg-grey-1">
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
      <q-page class="q-mx-md">
        <!-- 标题 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8 q-mb-sm">
            <q-card-section>
              <div class="q-gutter-md">
                <q-chip square outline>
                  <q-avatar icon="title" color="primary" text-color="white" />
                  {{ announcementDetails.title }}
                </q-chip>
                <div class="float-right">
                  <q-btn
                    color="grey"
                    flat
                    :label="announcementDetails.creator.nickname"
                  />
                  <q-btn
                    color="grey"
                    flat
                    :label="announcementDetails.createdAt"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- 内容 -->
        <div class="row justify-center">
          <q-card class="col-12 col-md-8">
            <q-card-section>
              <div class="q-gutter-md">
                <div v-viewer v-html="announcementDetails.content"></div>
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
    };
  },

  components: {},

  methods: {
    async getAnnouncementDetails() {
      try {
        const { data } = await apiGetAnnouncementDetails(this.announcementId);

        preProcessAnnouncementDetails(data.data);

        this.announcementDetails = data.data;
        console.log(this.announcementDetails);
      } catch (error) {
        console.log(error);
        this.$q.notify({
          message: "获取公告详情失败",
          type: "negative",
        });
      }
    },

    async markAnnouncementAsRead() {
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

    handleMarkAsReadBtnClick() {
      this.markAnnouncementAsRead();
    },

    handleCloseBtnClick() {
      window.close();
    },
  },

  created() {
    this.getAnnouncementDetails();

    // 获取路由上的isRead参数
    const isRead = this.$route.query.isRead;
    // 如果有isRead参数，且为true，则标记为已读
    if (isRead === "true") {
      this.markAnnouncementAsRead();
    }
  },
};
</script>

<style>
.q-gutter-md img {
  max-width: 100% !important;
  display: block;
  margin: 0 auto;
}
</style>
