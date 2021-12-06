<template>
  <div>
    <el-row class="home" :getter="20">
      <el-col :span="8" style="margin-top: 20px">
        <el-card shadow="hover">
          <div class="user">
            <img :src="userImg" alt="" />
            <div class="userInfo">
              <p class="name">Admin</p>
              <p class="access">超级管理员</p>
            </div>
          </div>
          <div class="login-info">
            <p>上次登录时间：<span>2021-11-28</span></p>
            <p>上次登录地点：<span>绍兴</span></p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      userImg: require("../../assets/logo.png"),
    };
  },
  
};
</script>

<style scoped>
</style>