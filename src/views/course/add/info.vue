<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" icon="el-icon-edit" />
      <el-step title="创建课程大纲" icon="el-icon-upload" />
      <el-step title="最终发布" icon="el-icon-s-promotion" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例:机器学习项目课:从基础到搭建项目"
        />
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select v-model="courseInfo.classId" placeholder="请选择">
          <el-option
            v-for="c in classList"
            :key="c.id"
            :label="c.title"
            :value="c.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程教师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.username"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder=""
        />
      </el-form-item>
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
          :action="BASE_API + 'oos/fileOos/upload'"
          class="avatar-uploader"
        >
          <el-button type="primary" v-show="courseInfo.cover === ''"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>

          <el-image
            v-show="courseInfo.cover !== ''"
            style="width: 200px; height: 200px"
            :src="courseInfo.cover"
            fit="cover"
          />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="savaAndUpdate"
        >
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addCourseInfo,
  getTeacherList,
  getClassList,
  getCourseInfo,
  updateCourseInfo,
} from "@/api/edu/course";
import { getToken } from "@/utils/auth";
import Tinymce from "@/components/Tinymce";
export default {
  name: "CourseAddInfo",
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      teacherList: [],
      classList: [],
      BASE_API: process.env.VUE_APP_BASE_API,
      headers: {},
      courseInfo: {
        id: undefined,
        title: "",
        classId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "",
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseInfo.id = this.$route.params.id;
      this.getCourseInfo();
    }
    this.getTeacherList();
    this.getClassList();
    this.setHeaders();
  },
  methods: {
    getCourseInfo() {
      getCourseInfo(this.courseInfo.id).then((res) => {
        if (res.code === 200) {
          this.courseInfo = res.data;
        }
      });
    },
    getTeacherList() {
      getTeacherList().then((res) => {
        this.teacherList = res.data;
      });
    },
    getClassList() {
      getClassList().then((res) => {
        this.classList = res.data;
      });
    },
    setHeaders() {
      this.headers = {
        Authorization: getToken(),
      };
    },
    savaAndUpdate() {
      if (this.courseInfo.id) {
        updateCourseInfo(this.courseInfo).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "修改课程信息成功",
            });
            this.$router.push({
              path: `/course/chapter/${this.courseInfo.id}`,
            });
          }
        });
      } else {
        addCourseInfo(this.courseInfo).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "添加课程信息成功",
            });
            this.$router.push({ path: `/course/chapter/${res.data}` });
          }
        });
      }
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>

<style>
</style>