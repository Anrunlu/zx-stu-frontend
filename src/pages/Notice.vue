<template>
  <q-page :class="isWHH ? 'bg-red-1' : 'bg-white'">
    <q-tabs
      v-model="tab"
      inline-label
      :class="isWHH ? 'bg-red-1' : 'bg-white'"
      active-color="primary"
      align="justify"
    >
      <q-tab name="未读" icon="mark_as_unread" label="未读" />
      <q-tab name="已读" icon="mark_email_read" label="已读" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated :class="isWHH ? 'bg-red-1' : ''">
      <q-tab-panel name="未读">
        <q-list separator>
        <q-list separator v-if="announcementList.length">
          <q-item
            clickable
            v-for="(announcement, index) in announcementList"
            :key="index"
            @click="handleOpenAnnouncement(announcement)"
          >
            <q-item-section avatar>
              <q-icon
                :color="announcement.urgencyType"
                :name="announcement.icon"
              />
            </q-item-section>
            <q-item-section>{{ announcement.title }}</q-item-section>
            <q-item-section side top>
              <q-item-label caption>{{ announcement.createdAt }}</q-item-label>
              <div>
                {{ announcement.creator.nickname }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item clickable v-ripple v-else>
          <div class="full-width row flex-center text-grey q-gutter-sm">
            <span class="text-h6"> 暂无未读通知，请后期注意查收 </span>
          </div>
        </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="已读">
        <q-list separator>
        <q-list separator v-if="announcementList.length">
          <q-item
            clickable
            v-for="(announcement, index) in announcementList"
            :key="index"
            @click="handleOpenAnnouncement(announcement)"
          >
            <q-item-section avatar>
              <q-icon
                :color="announcement.urgencyType"
                :name="announcement.icon"
              />
            </q-item-section>
            <q-item-section>{{ announcement.title }}</q-item-section>
            <q-item-section side top>
              <q-item-label caption>{{ announcement.createdAt }}</q-item-label>
              <div>
                {{ announcement.creator.nickname }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item clickable v-ripple v-else>
          <div class="full-width row flex-center text-grey q-gutter-sm">
            <span class="text-h6"> 暂无已读的通知 </span>
          </div>
        </q-item>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { apiGetAnnouncementList } from "src/api/student/announcement";
import { preProcessAnnouncementList } from "src/utils/announcement";
import { mapGetters } from "vuex";
export default {
  name: "Notice",
  data() {
    return {
      tab: "未读",
      announcementList: [],
    };
  },

  watch: {
    tab() {
      this.getAnnouncementList();
    },
  },

  computed: {
    ...mapGetters("settings", {
      announcementCategoryOptions: "announcementCategoryOptions",
    }),
    ...mapGetters("user", {
      isWHH: "isWHH",
    }),
  },

  methods: {
    async getAnnouncementList() {
      const payload = {
        readStatus: this.tab,
      };

      try {
        const { data } = await apiGetAnnouncementList(payload);

        preProcessAnnouncementList(data.data);

        // 根据公告类型，从 announcementCategoryOptions 中获取对应图标
        data.data.forEach((announcement) => {
          const category = this.announcementCategoryOptions.find(
            (item) => item.value === announcement.category
          );
          announcement.icon = category.icon;
        });

        this.announcementList = data.data;
      } catch (error) {
        console.log(error);
      }
    },

    handleOpenAnnouncement(announcement) {
      // 根据公告类型，决定打开的页面
      this.$router.push("/announcement/" + announcement._id);
    },
  },

  created() {
    this.getAnnouncementList();
  },
};
</script>

<style></style>
