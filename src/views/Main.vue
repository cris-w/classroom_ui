<template>
  <el-container style="height: 100%">
    <el-aside width="auto">
      <CommonAside />
    </el-aside>
    <el-container>
      <el-header>
        <CommonHeader />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
export default {
  components: { CommonAside, CommonHeader },
};
</script>

<style scoped>
.el-header {
  background-color: #333;
  line-height: 60px;
}
.el-main {
  padding-top: 0;
  background-color: skyblue;
}
.el-side {
  height: 1000px;
}
</style>
<style lang="scss">
@import url("../styles/index.scss");
</style>
