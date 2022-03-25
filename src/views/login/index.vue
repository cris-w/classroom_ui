<template>
  <div class="login-container">
    <!-- 登录 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
      v-if="isLogin"
    >
      <div class="title-container">
        <h3 class="title">翻转课堂</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="example" />
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          placeholder="验证码"
          name="code"
          type="text"
          style="width: 40%"
          tabindex="3"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <el-image :src="captchaImg" class="captchaImg" @click="getImg">
        </el-image>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >

      <div class="tips">
        <div>
          <span style="margin-right: 20px">username: any</span>
          <span> password: 123456</span>
        </div>
        <span>
          <el-button type="text" @click="register">点我注册</el-button>
        </span>
      </div>
    </el-form>

    <!-- 注册 -->
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="rules"
      class="login-form"
      label-position="left"
      v-if="!isLogin"
    >
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="registerForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          tabindex="2"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="example" />
        </span>
        <el-input
          v-model="registerForm.email"
          placeholder="邮箱"
          type="text"
          tabindex="3"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleRegister"
        >注册</el-button
      >
      <div class="tips">
        <span></span>
        <span>
          <el-button type="text" @click="login">返回登录</el-button>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCaptcha, register } from "@/api/user";
export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于六位哦！"));
      } else if (value.indexOf(" ") != -1) {
        callback(new Error("密码不能包含空格哦！"));
      } else {
        callback();
      }
    };
    return {
      isLogin: true,
      loginForm: {
        username: "",
        password: "",
        code: "",
        token: "", // redis 中验证码的 key
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      registerForm: {
        username: "",
        password: "",
        email: "",
      },
      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
      captchaImg: "",
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }, () => {});
              this.loading = false;
            })
            .catch(() => {
              console.log("false");
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getImg() {
      getCaptcha().then((response) => {
        this.captchaImg = response.data.base64Img;
        this.loginForm.token = response.data.key;
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          register(this.registerForm)
            .then((res) => {
              if (res) {
                this.isLogin = true;
                this.$message.success("注册成功");
              }
            })
            .finally(() => {
              this.loading = false;
              this.$refs.loginForm.resetFields();
            });
        }
      });
    },
    register() {
      this.isLogin = false;
      this.$refs.loginForm.resetFields();
    },
    login() {
      this.isLogin = true;
      this.$refs.registerForm.resetFields();
    },
  },
  created() {
    this.getImg();
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 0px 5px 0px 15px;
      color: $light_gray;
      height: 52px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captchaImg {
    float: right;
    border-radius: 10px;
    background: transparent;
    border: 0px;
    padding: 5px 0px 5px 0px;
    height: 52px;
    width: 35%;
  }
}
</style>
