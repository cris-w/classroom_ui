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

    <el-button type="info" round @click="dialogFormVisible = true"
      >添加章节</el-button
    >
    <el-dialog :visible.sync="dialogFormVisible" title="Shipping address">
      <el-form :model="chapter">
        <el-form-item label="章节名" label-width="120px">
          <el-input v-model="chapter.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" label-width="120px">
          <el-input-number
            :min="0"
            v-model="chapter.sort"
            controls-position="right"
            placeholder=""
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 显示章节信息 -->
    <el-tree
      v-show="chapterList.length > 0"
      :data="chapterList"
      :props="chapterProps"
      accordion
      default-expand-all
      highlight-current
      @node-click="handleNodeClick"
    />

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
import { getChapter } from "@/api/edu/chapter";
export default {
  name: "CourseAddChapter",
  data() {
    return {
      saveBtnDisabled: false,
      chapterList: [],
      courseId: undefined,
      dialogFormVisible: false,
      chapter: {
        title: "",
        sort: "",
      },
      chapterProps: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapter();
    }
  },
  methods: {
    getChapter() {
      getChapter(this.courseId).then((res) => {
        this.chapterList = res.data;
      });
    },
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
    handleNodeClick() {
      console.log();
    },
  },
};
</script>

<style>
</style>