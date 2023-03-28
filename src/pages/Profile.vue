<template>
  <q-page>
    <div class="row justify-center q-gutter-lg q-mt-sm">
      <!-- 头像 -->
      <div class="col-10 col-sm-2">
        <q-card bordered>
          <q-img class="rounded-borders" :src="avatar" />

          <q-card-actions align="center" class="q-pa-none q-mt-lg">
            <q-btn
              class="q-mb-sm"
              flat
              :color="isWHH ? 'red-4' : 'primary'"
              icon="add_a_photo"
              label="头像上传"
              @click="avatarUploadDig = true"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- 基本信息 -->
      <div class="col-10 col-sm-7">
        <q-card>
          <q-card-section>
            <div>
              <q-btn
                class="q-mb-md fit"
                :color="isWHH ? 'red-4' : 'primary'"
                icon="event_repeat"
                label="切换学期"
                @click="changeTermDig = true"
              />
            </div>

            <q-form @submit="handleUpdateProfileSubmit" class="q-gutter-md">
              <!-- 基本信息 -->
              <div class="row">
                <q-input
                  class="col"
                  dense
                  outlined
                  square
                  disable
                  type="text"
                  label="用户名"
                  v-model="username"
                  hide-bottom-space
                >
                  <template v-slot:prepend>
                    <q-icon name="fingerprint" />
                  </template>
                </q-input>
                <q-input
                  class="col q-pl-sm"
                  dense
                  outlined
                  square
                  disable
                  type="text"
                  label="昵称"
                  v-model="nickname"
                  hide-bottom-space
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>

              <q-input
                dense
                outlined
                square
                type="email"
                label="邮箱"
                disable
                v-model="email"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                dense
                outlined
                square
                type="text"
                label="QQ号"
                v-model="qq"
                :rules="[(val) => !!val || 'QQ号不能为空']"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="chat" />
                </template>
              </q-input>

              <q-separator inset />

              <!-- 密码修改 -->
              <q-input
                dense
                outlined
                square
                type="text"
                label="原密码"
                v-model="oldPwd"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
              </q-input>
              <q-input
                dense
                outlined
                square
                :type="isShowPwd ? 'password' : 'text'"
                label="新密码"
                v-model="newPwd"
                hint="密码必须同时包含数字字母和特殊字符且长度大于6位"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="vpn_key" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isShowPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isShowPwd = !isShowPwd"
                  />
                </template>
              </q-input>

              <div class="row">
                <q-input
                  dense
                  outlined
                  square
                  class="col-8"
                  type="text"
                  label="输入验证码"
                  v-model="code"
                />
                <q-btn
                  class="col-3 q-ml-sm"
                  :color="isWHH ? 'red-4' : 'primary'"
                  icon="send"
                  :label="
                    canSendCode ? '发送验证码' : `重新发送(${countDown}s)`
                  "
                  :disable="!canSendCode"
                  @click="handleSendCodeBtnClick"
                />
              </div>

              <div>
                <q-btn
                  icon="cloud_upload"
                  label="更新"
                  type="submit"
                  :color="isWHH ? 'red-4' : 'primary'"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 切换学期对话框 -->
    <q-dialog v-model="changeTermDig" persistent>
      <ChangeTermCard />
    </q-dialog>

    <!-- 头像上传对话框 -->
    <q-dialog v-model="avatarUploadDig" persistent>
      <AvatarUploadCard @avatarUploaded="modifyUserAvatar" />
    </q-dialog>
  </q-page>
</template>

<script>
import {
  apiGetProfile,
  apiModifyProfile,
  apiModifyPwd,
  apiSendCodeByEmail,
  apiVerifyCode,
} from "src/api/auth";
import { getPwdLevel } from "src/utils/auth";
import { mapGetters } from "vuex";
export default {
  name: "Profile",
  data() {
    return {
      // 密码是否可见
      isShowPwd: true,
      // 验证码
      code: "",
      // 验证码倒计时
      countDown: 60,
      // 是否可以发送验证码
      canSendCode: true,
      // QQ
      qq: "",
      // 邮箱
      email: "",
      // 原密码
      oldPwd: "",
      // 新密码
      newPwd: "",
      // 头像上传对话框
      avatarUploadDig: false,
      changeTermDig: false,
    };
  },

  computed: {
    ...mapGetters("user", {
      username: "username",
      nickname: "nickname",
      avatar: "avatar",
      officeName: "officeName",
      isWHH: "isWHH",
    }),
  },

  components: {
    AvatarUploadCard: () =>
      import("src/components/common/AvatarUploadCard.vue"),
    ChangeTermCard: () => import("src/components/common/ChangeTermCard.vue"),
  },

  methods: {
    // 获取个人信息
    async getUserProfile() {
      const { data } = await apiGetProfile();
      this.qq = data.data.qq;
      this.email = data.data.email;
    },

    // 修改个人信息
    async modifyUserProfile() {
      const payload = {
        qq: this.qq,
      };

      try {
        await apiModifyProfile(payload);
        this.$q.notify({
          message: "个人信息修改成功",
          type: "positive",
        });
      } catch (error) {
        this.$q.notify({
          message: "个人信息修改失败",
          type: "negative",
        });
      }
    },

    // 修改头像，接受子组件传递的头像地址
    async modifyUserAvatar(avatar) {
      const payload = {
        avatar,
      };

      try {
        await apiModifyProfile(payload);
        // 设置 user.avatar
        this.$store.commit("user/setAvatar", avatar);
        this.$q.notify({
          message: "头像修改成功",
          type: "positive",
        });
      } catch (error) {
        this.$q.notify({
          message: "头像修改失败",
          type: "negative",
        });
      }
    },

    // 发送验证码
    async sendCodeByEmail() {
      // 构造参数
      const payload = {
        email: this.email,
        username: this.username,
      };

      await apiSendCodeByEmail(payload);
      // 提示发送成功
      this.$q.notify({
        message: "验证码发送成功",
        type: "positive",
      });
    },

    // 校验验证码
    async verifyCode() {
      // 构造参数
      const payload = {
        username: this.username,
        code: this.code,
      };

      const { data } = await apiVerifyCode(payload);

      if (!data.data.code) {
        return false;
      }
      return true;
    },

    // 修改密码请求
    async modifyPwd() {
      // 构造参数
      const payload = {
        oldPassword: this.oldPwd,
        newPassword: this.newPwd,
      };

      await apiModifyPwd(payload);
    },

    // 处理点击发送验证码按钮事件
    handleSendCodeBtnClick() {
      // 发送验证码
      if (this.canSendCode) {
        this.code = "";
        this.sendCodeByEmail();
      }

      // 倒计时
      this.canSendCode = false;
      this.countDown = 60;
      const timer = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(timer);
          this.canSendCode = true;
        } else {
          this.countDown--;
        }
      }, 1000);
    },

    // 处理表单提交事件
    async handleUpdateProfileSubmit() {
      let isModifyPwd = false;
      // 判断是否修改了密码
      if (this.oldPwd != "") {
        if (this.newPwd == "") {
          this.$q.notify({
            message: "新密码不能为空",
            type: "negative",
          });
          return;
        }

        // 判断原密码和新密码是否相同
        if (this.oldPwd == this.newPwd) {
          this.$q.notify({
            message: "新密码不能与原密码相同",
            color: "negative",
            icon: "warning",
          });
          return;
        }

        // 判断密码强度
        if (getPwdLevel(this.newPwd) < 3) {
          this.$q.notify({
            message: "密码必须同时包含数字字母和特殊字符且长度大于6位",
            type: "negative",
          });
          return;
        }

        isModifyPwd = true;
      }

      // 提交表单
      // 校验验证码
      if (this.code == "") {
        this.$q.notify({
          message: "请输入验证码",
          type: "negative",
        });
        return;
      }

      const res = await this.verifyCode();

      if (!res) {
        // 提示验证码错误
        this.$q.notify({
          message: "验证码错误",
          type: "negative",
        });
        return;
      }

      // 发送修改基本信息请求
      await this.modifyUserProfile();

      if (isModifyPwd) {
        // 发送修改密码请求
        await this.modifyPwd();
      }

      // 提示修改成功
      this.$q.notify({
        message: "修改成功",
        type: "positive",
      });

      // 重置部分变量
      this.oldPwd = "";
      this.newPwd = "";
      this.code = "";

      // 重新获取个人信息
      this.getUserProfile();
    },
  },

  created() {
    this.getUserProfile();
  },
};
</script>
<style>
.bg-normal-gradient {
  background-image: linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%);
}
.bg-dark-gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
.login-form-card a {
  cursor: pointer;
}
</style>
