<template>
  <q-page>
    <div class="row q-gutter-md q-my-sm justify-center">
      <div
        class="col-11 col-md-3"
        v-for="(c, i) in courseList"
        :key="i"
        @click="toHomework(c)"
      >
        <q-card :class="isWHH ? 'course-card-whh' : 'course-card'">
          <q-card-section class="text-h3"> {{ c.name }} </q-card-section>
          <q-card-section>
            <q-avatar
              size="40px"
              :color="isWHH ? 'red-2' : 'primary'"
              text-color="white"
            >
              <img v-if="c.teacherAvatar" :src="c.teacherAvatar" />
              <span v-else>{{ c.teacherName.slice(0, 1) }}</span>
            </q-avatar>
            <q-badge color="white" class="q-ml-sm text-black">{{
              c.teacherName
            }}</q-badge>
            <span class="float-right q-mt-sm"
              >剩余作业
              <q-icon v-if="!c.unfinishedHomework" name="more_horiz"></q-icon>
              <q-badge
                v-else
                :color="c.unfinishedHomeworkNum == 0 ? 'green' : 'red'"
                class="q-ml-sm"
                >{{ c.unfinishedHomeworkNum }}</q-badge
              >
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-if="courseList.length == 0 && dataLodingFinished">
      <div class="row q-mt-lg text-grey justify-center">
        <span class="text-h3 text-center">本学期暂无课程</span>
      </div>
      <div class="row justify-center q-ma-md">
        <q-btn
          class="q-mb-md"
          color="primary"
          icon="event_repeat"
          label="切换学期"
          @click="changeTermDig = true"
        />
      </div>
    </div>
    <!-- 切换学期对话框 -->
    <q-dialog v-model="changeTermDig" persistent>
      <ChangeTermCard />
    </q-dialog>

    <q-dialog v-model="isBindEmail" persistent>
      <q-card style="width: 500px; max-width: 80vw">
        <CardBar
          title="检测到您未绑定邮箱，请绑定"
          icon="transfer_within_a_station"
        />
        <q-card-section>
          <q-form class="q-gutter-sm">
            <q-input v-model="username" type="text" label="账号" outlined>
              <template v-slot:prepend>
                <q-icon name="fingerprint" />
              </template>
            </q-input>
            <q-input v-model="email" type="text" label="邮箱" outlined>
              <template v-slot:prepend> <q-icon name="email" /> </template
            ></q-input>
          </q-form>

          <q-card-actions vertical align="right">
            <q-btn
              color="primary"
              icon="check"
              label="绑定"
              @click="handleBindEmailClick"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { apiGetProfile, apiModifyUserLocation } from "src/api/auth";
import { mapGetters } from "vuex";
import { apiBindEmail } from "src/api/common";
import { wgs_gcj_encrypts } from "src/utils/location";
export default {
  name: "Index",
  data() {
    return {
      changeTermDig: false,
      dataLodingFinished: false,
      isBindEmail: false,
      email: "",
      //用户地理信息
      userLocation: {
        accuracy: 0,
        adcode: "",
        addr: "",
        city: "",
        district: "",
        location: {
          type: "",
          coordinates: [],
        },
        nation: "",
        province: "",
        confirm: false,
      },
    };
  },

  components: {
    ChangeTermCard: () => import("src/components/common/ChangeTermCard.vue"),
    CardBar: () => import("src/components/common/CardBar.vue"),
  },

  computed: {
    ...mapGetters("student", {
      courseList: "courseList",
      currSelectedCourse: "currSelectedCourse",
    }),
    ...mapGetters("user", {
      isWHH: "isWHH",
      nickname: "nickname",
      username: "username",
    }),
  },

  methods: {
    //跳转作业
    toHomework(c) {
      this.$router.push({ path: "/homework" });
      //设置当先选择课程
      this.$store.commit("student/setCurrSelectedCourse", c);
    },

    // 获取课程
    async handleGetCourse() {
      await this.$store.dispatch("student/getCourseList");
      setTimeout(() => {
        this.dataLodingFinished = true;
      }, 1000);
    },

    // 获取个人信息
    async getUserProfile() {
      const { data } = await apiGetProfile();
      if (!data.data.email) {
        this.isBindEmail = true;
      }
    },

    //绑定邮箱
    async BindEmail() {
      const payload = {
        username: this.username,
        email: this.email,
      };
      const { data } = await apiBindEmail(payload);
      if (data.code == 2000) {
        this.$q.notify({
          message: `邮箱绑定成功`,
          color: "positive",
          icon: "sentiment_satisfied_alt",
          position: "bottom",
          timeout: 500,
        });
        this.isBindEmail = false;
      }
    },

    //获取地理位置
    async handleGetLocation() {
      if (navigator.geolocation) {
        let options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000,
        };
        await navigator.geolocation.watchPosition(
          //获取位置成功回调
          (position) => {
            //经纬度标准转换
            let point = wgs_gcj_encrypts(
              position.coords.latitude,
              position.coords.longitude
            );
            this.userLocation.location.coordinates[1] = point.lat;
            this.userLocation.location.coordinates[0] = point.lon;
            this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/", {
              location: `${this.userLocation.location.coordinates[1]},${this.userLocation.location.coordinates[0]}`,
              key: "XHSBZ-NHJLG-Y6FQT-QQ3AK-N7YB5-GDBK5",
              output: "jsonp",
            }).then((res) => {
              this.userLocation.location.type = "Point";
              this.userLocation.addr = `${res.result.formatted_addresses.recommend},(${res.result.formatted_addresses.standard_address})`;
              this.userLocation.adcode = res.result.ad_info.adcode;
              this.userLocation.district = res.result.ad_info.district;
              this.userLocation.province = res.result.ad_info.province;
              this.userLocation.city = res.result.ad_info.city;
              this.userLocation.nation = res.result.ad_info.nation;
              console.log(this.userLocation);
              this.modifyUserAddress(); // 在获取位置信息成功后调用modifyUserAddress函数
            });
          },

          //获取位置失败回调
          (err) => {
            this.$q.notify({
              message: `无法获取定位`,
              type: "negative",
              timeout: 3000,
            });
          },
          //参数
          options
        );
      } else {
        this.$q.notify({
          message: `无法获取定位`,
          type: "negative",
          timeout: 3000,
        });
      }
    },

    //更新位置信息
    async modifyUserAddress() {
      if (this.userLocation.addr === "") {
        this.$q.notify({
          message: "更新定位失败，请稍后重试",
          type: "negative",
          timeout: 3000,
        });
        return;
      }
      const payload = this.userLocation;

      try {
        await apiModifyUserLocation(payload);
      } catch (error) {
        this.$q.notify({
          message: "个人位置信息修改失败",
          type: "negative",
        });
      }
    },

    //点击绑定邮箱
    handleBindEmailClick() {
      if (this.username === "" || this.email === "") {
        this.$q.notify({
          message: "账号或邮箱不可为空",
          type: "warning",
        });
        return;
      }
      this.BindEmail();
    },
  },
  created() {
    this.handleGetCourse();
    this.getUserProfile();
    this.handleGetLocation();
    if (this.username === "2021412984" && this.nickname === "王寒寒") {
      this.$store.commit("user/setIsWHH", true);
    }
  },
  // mounted() {
  //   GetUserIP((ip) => {
  //     if (ip == "10.22.1.105") {
  //       this.$store.commit("user/setIsWHH", true);
  //     }
  //   });
  // },
};
</script>
<style scoped>
.course-card {
  min-height: 150px;
  color: #fff;
  border: none;
  /* background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important; */
  background-image: linear-gradient(
    to bottom right,
    #4facfe 0%,
    #00f2fe 100%
  ) !important;
}

.course-card-whh {
  /* whh定制 */
  min-height: 150px;
  color: #fff;
  border: none;
  /* background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important; */
  background-image: url(https://cyberdownload.anrunlu.net/FmMvPHDqJ6iqPpRCJWjZHTHGZbNT);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 20% 40%;
}
.course-card:hover {
  background-image: linear-gradient(
    to bottom right,
    #43e97b 0%,
    #38f9d7 100%
  ) !important;
  cursor: pointer;
}
.course-card-whh:hover {
  cursor: pointer;
}
</style>
