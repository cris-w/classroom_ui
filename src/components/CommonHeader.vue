<template>
  <header>
    <div class="l-content">
      <el-button
        plain
        icon="el-icon-menu"
        size="mini"
        @click="handleMenu"
      ></el-button>
      <h3 style="color: #fff">首页</h3>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" szie="mini">
        <span class="el-dropwown-link">
          <img :src="userImg" alt="" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
export default {
  name: "CommonHander",
  data() {
    return {
      userImg: require("../assets/logo.png"),
    };
  },
  methods: {
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
  },
};
</script>

<style scoped>
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.l-content {
  display: flex;
  align-items: center;
}
.r-content {
  padding-top: 15px;
}
.el-button {
  margin-right: 20px;
}
.user {
  widows: 40px;
  width: 40px;
  border-radius: 50%;
}
</style>