<template>
  <q-page>
    <div class="row justify-center q-gutter-lg q-mt-sm">
      <!-- 头像 -->
      <div class="col-10 col-sm-2">
        <q-card bordered>
          <q-img class="rounded-borders" :src="avatar" />

          <q-card-actions align="center" class="q-pa-none q-mt-lg">
            <q-btn flat color="primary" icon="add_a_photo" label="头像上传" />
          </q-card-actions>
        </q-card>
      </div>

      <!-- 基本信息 -->
      <q-card class="col-10 col-sm-7">
        <q-card-section>
          <q-form
            @submit="updateProfileSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
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
            <q-input
              dense
              outlined
              square
              type="email"
              label="邮箱"
              v-model="email"
              :rules="[(val) => !!val || '邮箱不能为空']"
              hide-bottom-space
            >
              <template v-slot:prepend>
                <q-icon name="email" />
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
              type="text"
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
                :rules="[(val) => !!val || '验证码不能为空']"
                hide-bottom-space
              />
              <q-btn
                class="col-3 q-ml-sm"
                color="primary"
                icon="send"
                label="发送验证码"
                @click="onClick"
              />
            </div>

            <div>
              <q-btn
                icon="cloud_upload"
                label="更新"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { apiGetProfile } from "src/api/auth";
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
      // QQ
      qq: "",
      // 邮箱
      email: "",
      // 原密码
      oldPwd: "",
      // 新密码
      newPwd: "",
    };
  },

  computed: {
    ...mapGetters("user", {
      username: "username",
      nickname: "nickname",
      avatar: "avatar",
      officeName: "officeName",
    }),
  },

  methods: {
    // 获取个人信息
    async getUserProfile() {
      const { data } = await apiGetProfile();
      this.qq = data.data.qq;
      this.email = data.data.email;
    },

    // 处理表单提交事件
    handleUpdateProfileSubmit() {
      let isModifyPwd = false;
      // 判断是否修改了密码
      if (this.oldPwd != "" && this.newPwd != "") {
        isModifyPwd = true;
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
      }

      // 提交表单

      // 校验验证码

      // 发送修改基本信息请求

      if (isModifyPwd) {
        // 发送修改密码请求
        console.log("发送修改密码请求");
      }
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
