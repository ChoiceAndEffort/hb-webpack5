<template>
  <el-container class="login">
    <img class="login-bg" :src="bg" />
    <div class="login-main">
      <img class="logo" :src="logo" />
      <div class="text-wrap">
        <system-notice />
        <!-- <div class="text">Hi, 你好!</div>
        <div class="text">欢迎进入伟谋数智—智慧ERP管理系统</div>
        <div class="text-small">
          Hello, welcome to Weimou digital intelligence ERP management system
        </div> -->
      </div>
      <div class="form">
        <div class="form-title">您好! 请登录</div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="账户密码登录" name="mobile">
            <Form
              ref="accountForm"
              formName="accountForm"
              :renderData="accountFormData"
              @keyup.enter.native="handleLogin"
              @getFormData="getAccountForm"
              width="100%"
              @handleSubmit="handleSubmit"
            >
            </Form>
            <div class="password">
              <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
              <router-link class="retrieval-password" to="/retrieval-password"
                >忘记密码</router-link
              >
            </div>
            <el-button
              class="submit-btn"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
              >登录</el-button
            >
            <!--                        <router-link class="register" to="/register">注册账户</router-link>-->
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="code">
            <Form
              ref="codeForm"
              formName="codeForm"
              :renderData="codeFormData"
              @keyup.enter.native="handleLogin"
              @getFormData="getCodeForm"
              width="100%"
              @handleSubmit="handleSubmit"
            >
              <template slot="captcha-code" slot-scope="{ scope }">
                <CaptchaCode
                  v-model="scope['code']"
                  :mobile="scope.mobile"
                  :api="codeApi"
                />
              </template>
            </Form>
            <div class="password">
              <div></div>
              <!--                            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>-->
              <router-link class="retrieval-password" to="/retrieval-password"
                >忘记密码</router-link
              >
            </div>
            <el-button
              class="submit-btn"
              type="primary"
              @click="handleLogin"
              :loading="loginLoading"
              >登录</el-button
            >
            <!--                        <router-link class="register" to="/register">注册账户</router-link>-->
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-container>
</template>

<script>
import { sendSmsVerificationCode } from "@/api/gggjMain/cus.js";
import {
  accountLogin,
  codeLogin,
  retrievalPassword,
} from "@/api/gggjMain/login.js";
import { Form, CaptchaCode, SubmitBtn } from "gggj_lib";
import logo from "@/assets/images/userInfos/logo@2x.png";
import bg from "@/assets/images/userInfos/bg.jpg";
import SystemNotice from "./systemNotice.vue";
export default {
  data() {
    return {
      logo,
      bg,
      codeApi: sendSmsVerificationCode,
      accountLoginApi: accountLogin,
      codeLoginApi: codeLogin,
      rememberPassword: false, //记住密码
      accountForm: {},
      codeForm: {},
      token: "",
      loginLoading: false,
      activeName: "mobile",
      accountFormData: [
        {
          tag: "el-input",
          attrs: {
            key: "mobile",
            type: "text",
            "prefix-icon": "el-icon-user",
            value: "",
            placeholder: "请输入账号",
            rules: [
              {
                required: true,
                message: "账号不能为空",
                trigger: "blur",
              },
            ],
          },
        },
        {
          tag: "el-input",
          attrs: {
            key: "loginPwd",
            type: "text",
            "prefix-icon": "el-icon-lock",
            value: "",
            placeholder: "请输入密码",
            "show-password": true,
            rules: [
              {
                required: true,
                message: "密码不能为空",
                trigger: "blur",
              },
            ],
          },
        },
      ],
      codeFormData: [
        {
          tag: "el-input",
          attrs: {
            key: "mobile",
            type: "text",
            "prefix-icon": "el-icon-user",
            value: "",
            placeholder: "请输入账号",
            rules: [
              {
                required: true,
                message: "账号不能为空",
                trigger: "blur",
              },
            ],
          },
        },
        {
          slot: "captcha-code",
          attrs: {
            key: "code",
            type: "text",
            "prefix-icon": "el-icon-user",
            value: "",
            placeholder: "请输入验证码",
            rules: [
              {
                required: true,
                message: "验证码不能为空",
                trigger: "blur",
              },
            ],
          },
        },
      ],
    };
  },
  components: {
    Form,
    CaptchaCode,
    SubmitBtn,
    SystemNotice,
  },
  computed: {
    loginInfo() {
      return this.$store.state.user.loginInfo;
    },
  },
  mounted() {
    this.$set(this.accountFormData[0].attrs, "value", this.loginInfo.account);
    this.$set(this.accountFormData[1].attrs, "value", this.loginInfo.password);
    this.rememberPassword = this.loginInfo.account == "" ? false : true;
  },
  methods: {
    getAccountForm(formData) {
      this.accountForm = formData;
    },
    getCodeForm(formData) {
      this.codeForm = formData;
    },
    handleLogin() {
      this.activeName == "mobile"
        ? this.$refs["accountForm"].handleSubmit()
        : this.$refs["codeForm"].handleSubmit(); // 调form表单校验
    },
    /** form表单校验完回调*/
    handleSubmit() {
      this.disabled = true;
      this.loginLoading = true; // 登录加载loading
      this.activeName == "mobile"
        ? accountLogin({ ...this.accountForm, clientType: 0 })
            .then((res) => {
              this.handleIsOk(res.data);
            })
            .catch((err) => {})
            .finally(() => {
              this.disabled = false;
              this.loginLoading = false;
            })
        : codeLogin({ ...this.codeForm, clientType: 0 })
            .then((res) => {
              this.handleIsOk(res.data);
            })
            .catch((err) => {})
            .finally(() => {
              this.disabled = false;
              this.loginLoading = false;
            });
    },
    handleIsErr() {},
    handleIsOk(data) {
      this.$store.commit("user/SET_TOKEN", data.token); // 存储token
      this.$store.commit("user/SET_USERINFO", {
        // 存储用户信息
        name: data.name,
        mobile: data.mobile,
        headImgUrl: data.headImgUrl,
        staffId: data.staffId,
        loginId: data.loginId,
        enterpriseId: data.enterpriseId,
        enterpriseName: data.enterpriseName,
        erpriseList: data.staffHaveEnterpriseList,
      });
      this.$store.commit(
        "user/SET_LOGININFO",
        this.rememberPassword
          ? {
              // 是否存储用户登录账号密码信息
              account: this.accountForm.mobile,
              password: this.accountForm.loginPwd,
            }
          : {
              account: "",
              password: "",
            }
      );
      this.$store.commit("power/SET_MENU_LIST", data.powerList); // 存储powerList
      this.$router.push({
        path: data.powerList[0].action,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-variables.scss";
.login {
  position: relative;
  height: 100%;
}
.login-bg {
  // margin-top: -100px;
  // height: 160%;
  height: 100vh;
  width: 100%;
  position: relative;
  filter: blur(3px);
}

.login-main {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0px;
  right: 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(18, 124, 245, 0.3);
  .logo {
    position: absolute;
    height: 58px;
    //width: 58px;
    top: 40px;
    left: 40px;
  }
  .text-wrap {
    margin-left: 82px;
    color: #ffffff;
    .text {
      font-size: 40px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .text-small {
      font-size: 18px;
      font-weight: 400;
    }
  }
  .form {
    margin: auto 76px;
    width: 438px;
    background: #ffffff;
    padding: 35px;
    box-sizing: border-box;
    .form-title {
      font-size: 24px;
      color: #56585c;
      font-weight: 600;
      padding-bottom: 36px;
    }
    .password {
      display: flex;
      justify-content: space-between;
      .retrieval-password {
        color: $--color-primary;
        font-size: 14px;
      }
    }
    .register {
      color: $--color-primary;
      font-size: 14px;
      float: right;
    }
  }
}
::v-deep .el-tabs__nav-wrap::after {
  background: #ffffff !important;
}
::v-deep .submit-btn {
  margin: 24px 0;
  width: 100%;
}
</style>
