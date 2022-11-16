<template>
  <q-page class="q-ma-sm">
    <div class="row justify-center q-gutter-sm">
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-card bordered class="q-pa-md">
          <q-img class="rounded-borders" :src="user.avatar" />
          <q-btn
            class="fit q-mt-sm"
            color="primary"
            icon="add_a_photo"
            label="头像上传"
            @click="avatarDig = true"
          />
          <q-separator />
        </q-card>
      </div>
      <div class="col col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="user.qq" label="qq" />
              <q-input filled v-model="user.email" label="邮箱" />
              <q-input
                v-model="user.code"
                bottom-slots
                label="验证码"
                stack-label
                counter
                maxlength="6"
              >
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ text }}
                  </div>
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="user.code == ''"
                    name="close"
                    class="cursor-pointer"
                  />
                </template>

                <template v-slot:after>
                  <q-btn
                    color="primary"
                    v-if="sendAuthCode"
                    @click="sendBindEmail()"
                    >获取验证码</q-btn
                  >
                  <q-btn color="primary" v-else>{{ time }}</q-btn>
                </template>
              </q-input>
              <div>
                <q-btn label="更新" color="primary" @click="updeProfile" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
        <q-card>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                filled
                v-model="user.old_pwd"
                label="原密码"
                type="password"
              />
              <form action="" autocomplete="off" class="password">
                <q-input
                  filled
                  v-model="user.new_pwd"
                  label="新密码"
                  type="password"
                />
                <p style="color: red">密码必须由数字、字母、符号组成</p>
                <span id="ruo" style="display: inline-block">弱</span
                ><span id="zo" style="display: inline-block">中</span
                ><span id="qiang" style="display: inline-block">强</span><br />
              </form>
              <q-input
                filled
                v-model="user.confirmPassword"
                label="确认密码"
                type="password"
              />
              <div>
                <q-btn label="更新" color="primary" @click="updatePwd" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- 上传文件对话框 -->
    <q-dialog v-model="avatarDig">
      <q-card style="width: 380px; max-width: 100vw">
        <q-card-section>
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
          <div class="text-h5">上传头像</div>
          <q-separator class="q-mt-md" />
          <q-file
            class="q-mt-md"
            color="teal"
            filled
            v-model="user.file"
            label="请选择图片"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
        </q-card-section>
        <q-btn
          color="positive"
          icon="add"
          label="上传"
          class="q-ma-sm float-right"
          @click.stop="handlePutUserAvatar"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { qiniuFileUpLoad } from "../../utils/qiniu";
import { QSpinnerGears } from "quasar";
import {
  getProfile,
  putProfile,
  putPWD,
  sendEmail,
  authEmail,
} from "../../api/common/index";
export default {
  data() {
    return {
      avatarDig: false,
      user: {
        avatar: "",
        file: "",
        old_pwd: "",
        confirmPassword: "",
        new_pwd: "",
        email: "",
        qq: "",
        code: "",
      },
      state: "弱",
      sendAuthCode: true,
      time: 60,
    };
  },
  methods: {
    async sendBindEmail() {
      var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
      if (this.user.email == "") {
        this.$q.notify({
          message: `邮箱不能为空`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
      } else if (reg.test(this.user.email) == false) {
        this.$q.notify({
          message: `邮箱格式不正确`,
          timeout: 300,
          color: "negative",
          icon: "error",
          position: "bottom",
        });
      } else {
        const res = await sendEmail({
          username: this.$store.getters["user/username"],
          email: this.user.email,
        });
        this.sendAuthCode = false;
        var auth_timetimer = setInterval(() => {
          this.time--;
          if (this.time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000);
        this.time = 60;
      }
    },
    // 获取个人信息
    async getInfo() {
      let res = await getProfile();
      if (res.data.code === 2000) {
        this.user.email = res.data.data.email;
        this.user.qq = res.data.data.qq;
        this.user = Object.assign({}, this.user, res.data.data);
      }
      // //console.log(this.user);
    },
    // 更新个人信息
    async updeProfile() {
      if (this.user.code == "") {
        this.$q.notify({
          message: `请先获取验证码`,
          color: "negative",
          icon: "warning",
          position: "bottom",
          timeout: 300,
        });
        return;
      }
      const ret = await authEmail({
        username: this.$store.getters["user/username"],
        code: this.user.code,
      });
      if (ret.data.data.code) {
        let res = await putProfile({
          email: this.user.email,
          qq: this.user.qq,
          avatar: this.user.avatar,
          // userType: this.$store.state.user.type,
        });
        if (res.data.code === 2000) {
          this.$q.notify({
            message: "更新个人信息成功",
            type: "positive",
            timeout: 300,
          });
          this.getInfo();
        }
      } else {
        this.$q.notify({
          message: `验证码错误`,
          color: "negative",
          icon: "error",
          position: "bottom",
          timeout: 300,
        });
      }
    },
    // 更新密码
    async updatePwd() {
      if (this.state != "强") {
        this.$q.notify({
          message: "密码强度太低",
          type: "warning",
          timeout: 300,
        });
        return;
      }
      if (this.user.new_pwd != this.user.confirmPassword) {
        this.$q.notify({
          message: "确认密码与新密码不一致",
          color: "red",
          timeout: 300,
        });
        return;
      }
      let res = await putPWD({
        oldPassword: this.user.old_pwd,
        newPassword: this.user.new_pwd,
      });
      if (res.data.code === 2000) {
        this.$q.notify({
          message: "更新密码成功",
          type: "positive",
          timeout: 300,
        });
      }
    },
    // 头像上传
    async handlePutUserAvatar() {
      // //console.log(this.user.file.type);
      if (
        this.user.file.type != "image/png" &&
        this.user.file.type != "image/jpeg"
      ) {
        this.$q.notify({
          message: `请上传png格式或jpg格式文件`,
          color: "negative",
          icon: "error",
          position: "bottom",
          timeout: 300,
        });
        return;
      }
      this.$q.loading.show({
        spinner: QSpinnerGears,
        message: `上传中...`,
      });
      let res = await qiniuFileUpLoad(
        this.$store.state.user.username,
        this.user.file,
        this
      );
      this.user.avatar = `https://cyberdownload.anrunlu.net/${res.key}`;
      this.updeProfile();
      this.avatarDig = false;
      this.$q.loading.hide();
    },
  },
  watch: {
    "user.new_pwd"() {
      var pawd = document.querySelector("#pawd");
      var state = "弱"; //模拟密码强度判断
      var regStr = /[a-zA-Z]/; //所有字母
      var regNum = /[0-9]/; //所有数字
      var sup = /\W/; //所有非字母数字
      if (this.user.new_pwd.length >= 6) {
        ruo.style.display = "inline-block";
        ruo.className = "ruo";
        ruo.innerHTML = "弱";
        zo.style.display = "inline-block";
        zo.className = "";
        qiang.style.display = "inline-block";
        qiang.className = "";
        state = "弱";
      }
      var sn =
        this.user.new_pwd.length >= 6 &&
        regStr.test(this.user.new_pwd) &&
        regNum.test(this.user.new_pwd);
      var sp =
        this.user.new_pwd.length >= 6 &&
        regStr.test(this.user.new_pwd) &&
        sup.test(this.user.new_pwd);
      var np =
        this.user.new_pwd.length >= 6 &&
        regNum.test(this.user.new_pwd) &&
        sup.test(this.user.new_pwd);
      if (sn || sp || np) {
        ruo.className = "zo";
        ruo.innerHTML = " ";
        zo.className = "zo";
        zo.innerHTML = "中";
        state = "中";
      }
      if (
        this.user.new_pwd.length >= 6 &&
        regStr.test(this.user.new_pwd) &&
        regNum.test(this.user.new_pwd) &&
        sup.test(this.user.new_pwd)
      ) {
        ruo.className = "qiang";
        ruo.innerHTML = " ";
        zo.className = "qiang";
        zo.innerHTML = " ";
        qiang.className = "qiang";
        qiang.innerHTML = "强";
        state = "强";
        this.state = state;
      }
      if (this.user.new_pwd.length < 6) {
        ruo.style.display = "inline-block";
        ruo.className = "";
        ruo.innerHTML = "弱";
        zo.style.display = "inline-block";
        zo.className = "";
        qiang.style.display = "inline-block";
        qiang.className = "";
      }
    },
  },
  created() {
    this.getInfo();
  },
};
</script>

<style scoped lang="scss">
.password {
  transition: all 1s ease-out 0s;
  input {
    font-size: 16px;
    height: 25px;
    width: 450px;
    margin-top: 20px;
    color: #333;
    outline: none;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  input:focus {
    border: 1px solid #09f;
  }
  p {
    display: inline-block;
    font-size: 12px;
    color: #ccc;
    margin: 0;
    margin-right: 6px;
  }
  span {
    display: none;
    width: 42px;
    font-size: 12px;
    margin-left: 2px;
    color: #ccc;
    background: #ccc;
    text-align: center;
  }
  span.ruo {
    background: #f00;
    color: #fff;
    opacity: 0.5;
  }
  span.zo {
    background: rgb(255, 224, 0);
    opacity: 1;
    color: #fff;
  }
  span.qiang {
    background: rgb(3, 146, 3);
    color: #fff;
  }
}
</style>
