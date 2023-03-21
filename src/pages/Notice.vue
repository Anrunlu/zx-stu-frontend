<template>
  <q-page class="bg-white">
    <q-tabs
      v-model="tab"
      inline-label
      class="bg-white"
      active-color="primary"
      align="justify"
    >
      <q-tab name="unread" icon="mail" label="未读" />
      <q-tab name="read" icon="alarm" label="已读" />
      <q-tab name="all" icon="movie" label="全部" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="unread">
        <q-list bordered>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon color="primary" name="bluetooth" />
            </q-item-section>
            <q-item-section>Icon as avatar</q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="read">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="all">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
export default {
  name: "Notice",
  data() {
    return {
      tab: "unread",
    };
  },

  methods: {
    async getAnnouncementList() {},
  },

  created() {
    this.getAnnouncementList();
  },
};
</script>

<style></style>
