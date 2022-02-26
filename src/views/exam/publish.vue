<template>
  <div class="app-container">
      <div class="paper-container">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="context">
          <h3>{{ item.title }}</h3>
          <i class="el-icon-user"> {{ item.classId }}</i>
          <i class="el-icon-time"> 考试时间： xxx - xxx</i>
        </div>
        <div class="handle">
          <el-button type="success" round>查看</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublishExam",
  data() {
    return {
      listQuery: {
        title: "",
      },
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {

    }
  },
}
</script>

<style lang="scss" scoped>
.paper-container {
  .item {
    display: flex;
    justify-content: normal;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid #dad6d6;
    .context {
      flex: 1;
      flex-flow: column;
    }
  }
  .handle {
  }
}
</style>