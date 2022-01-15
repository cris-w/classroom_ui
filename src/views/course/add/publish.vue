<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" icon="el-icon-edit" />
      <el-step title="创建课程大纲" icon="el-icon-upload" />
      <el-step title="最终发布" icon="el-icon-s-promotion" />
    </el-steps>

    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <el-image :src="coursePublish.cover" fit="cover" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <h2>{{ coursePublish.title }}</h2>
            <p v-html="coursePublish.description"></p>
            <p class="gray">
              <span>共{{ coursePublish.lessonNum }}课时</span>
            </p>
            <p>
              <span>所属班级:{{ coursePublish.classTitle }}</span>
            </p>
            <p>课程讲师:{{ coursePublish.username }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">
          发布课程
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCoursePublishInfo, publishCourse } from "@/api/edu/course";
export default {
  name: "CourseAddPublish",
  data() {
    return {
      saveBtnDisabled: false,
      courseId: undefined,
      coursePublish: {},
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCoursePublishInfo();
    }
  },
  methods: {
    getCoursePublishInfo() {
      getCoursePublishInfo(this.courseId)
        .then((res) => {
          this.coursePublish = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    previous() {
      this.$router.push({ path: `/course/chapter/${this.courseId}` });
    },
    publishCourse() {
      publishCourse(this.courseId)
        .then((res) => {
          this.$notify({
            title: "Success",
            message: "课程发布成功",
            type: "success",
            duration: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    next() {
      this.$confirm("确定要发布课程吗?", "提示", {
        confirmButtonText: "发布",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publishCourse();
          this.$router.push({ path: "/course/list" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>