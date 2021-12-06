<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <div class="title-name">
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <!-- <img :src="userImg" alt="" class="user" v-show="isCollapse" /> -->
    </div>
    <el-menu-item
      :index="item.path"
      v-for="item in noChild"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.lable }}</span>
    </el-menu-item>
    <el-submenu
      :index="item.lable"
      v-for="item in hasChildren"
      :key="item.lable"
    >
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{ item.lable }}</span>
      </template>
      <el-menu-item-group
        v-for="(subitem, index) in item.children"
        :key="index"
      >
        <el-menu-item :index="subitem.path" @click="clickMenu(item)">
          <i :class="'el-icon-' + subitem.icon"></i>
          <span slot="title">{{ subitem.lable }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        {
          path: "/",
          name: "home",
          lable: "首页",
          icon: "s-home",
          url: "Home/Home",
        },
        {
          path: "/mall",
          name: "mall",
          lable: "商品管理",
          icon: "video-play",
          url: "MailManage/MailManage",
        },
        {
          path: "/user",
          name: "user",
          lable: "用户管理",
          icon: "user",
          url: "UserManage/UserManage",
        },
        {
          lable: "其他",
          icon: "location",
          children: [
            {
              path: "/page1",
              name: "page1",
              lable: "page1",
              icon: "setting",
              url: "Other/PageOne",
            },
            {
              path: "/page2",
              name: "page2",
              lable: "page2",
              icon: "setting",
              url: "Other/PageTwo",
            },
          ],
        },
      ],
      userImg: require("../assets/logo.png"),
    };
  },
  computed: {
    noChild() {
      return this.menu.filter((item) => !item.children);
    },
    hasChildren() {
      return this.menu.filter((item) => item.children);
    },
    isCollapse() {
      return this.$store.state.table.isCollapse;
    },
  },
  methods: {
    /* handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }, */
    clickMenu(item) {
      this.$router.push({ name: item.name });
    },
  },
};
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 400px; */
}
.el-menu {
  height: 100%;
}
.title-name {
  text-align: center;
  margin: 0px auto;
  padding: 15px;
  height: 60px;
  overflow: hidden;
}
</style>