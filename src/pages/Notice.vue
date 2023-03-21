<template>
  <q-page class="bg-white">
    <q-tabs
      v-model="tab"
      inline-label
      class="bg-white"
      active-color="primary"
      align="justify"
    >
      <q-tab name="未读" icon="mark_as_unread" label="未读" />
      <q-tab name="已读" icon="mark_email_read" label="已读" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="未读">
        <q-list separator>
          <q-item
            clickable
            v-ripple
            v-for="(announcement, index) in announcementList"
            :key="index"
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
      </q-tab-panel>
      <q-tab-panel name="已读">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
  },

  created() {
    this.getAnnouncementList();
  },
};
</script>

<style></style>
