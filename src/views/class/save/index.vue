<template>
  <div class="app-container">
    <h2 style="text-align: center">创建班级</h2>

    <el-form
      label-width="120px"
      ref="dataForm"
      :rules="rules"
      :model="classInfo"
    >
      <el-form-item label="班级名称" prop="title">
        <el-input v-model="classInfo.title" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          :min="0"
          v-model="classInfo.sort"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savaAndUpdate"> 确定 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addClass, updateClass, getClassInfo } from "@/api/edu/class";
export default {
  name: "EditClass",
  data() {
    return {
      classId: undefined,
      classInfo: {
        title: "",
        sort: 0,
      },
      rules: {
        title: [{ required: true, message: "请输入班级名", trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.classId = this.$route.params.id;
      this.getClassInfo();
    }
  },
  methods: {
    getClassInfo() {
      getClassInfo(this.classId).then((res) => {
        this.classInfo = res.data;
      });
    },
    savaAndUpdate() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // 通过 classId是否存在 判断为 新增 还是 更新
          if (this.classId) {
            // 更新
            updateClass(this.classInfo).then((res) => {
              if (res) {
                this.$notify({
                  title: "Success",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                this.$router.push({ path: "/class/list" });
              }
            });
          } else {
            // 新增
            addClass(this.classInfo).then((res) => {
              if (res) {
                this.$notify({
                  title: "Success",
                  message: "添加成功",
                  type: "success",
                  duration: 2000,
                });
                this.$router.push({ path: "/class/list" });
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style>
</style>