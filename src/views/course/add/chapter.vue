<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" icon="el-icon-edit" />
      <el-step title="创建课程大纲" icon="el-icon-upload" />
      <el-step title="最终发布" icon="el-icon-s-promotion" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CourseAddChapter",
  data() {
    return {
      saveBtnDisabled: false,
    };
  },
  created() {},
  methods: {
    previous() {
      this.$router.push({ path: "/course/info/1" });
    },
    next() {
      this.$router.push({ path: "/course/publish/1" });
    },
  },
};
</script>

<style>
</style>