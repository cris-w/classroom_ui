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

    <el-button
      type="success"
      round
      @click="openChapterDialog"
      style="margin-left: 130px"
      >添加章节</el-button
    >
    <el-dialog :visible.sync="chapterDialogFormVisible" :title="dialogTitle">
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
        <el-button @click="chapterDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Video dialog -->
    <el-dialog :visible.sync="videoDialogFormVisible" title="课时">
      <el-form :model="video">
        <el-form-item label="课时名" label-width="120px">
          <el-input v-model="video.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="序号" label-width="120px">
          <el-input-number
            :min="0"
            v-model="video.sort"
            controls-position="right"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="上传视频" label-width="120px">
          <el-upload
            :headers="headers"
            :action="BASE_API + 'oos/fileOos/uploadVideo'"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传MP4文件，且不超过500MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="videoDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 显示章节信息 -->
    <div class="custom-tree-container">
      <div
        class="block"
        style="padding: 20px 170px 20px 110px; height: 300px; overflow-y: auto"
      >
        <el-tree
          v-show="chapterList.length > 0"
          :data="chapterList"
          :props="chapterProps"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-if="data.children"
                type="text"
                size="mini"
                @click="handleAdd(data.id)"
              >
                添加小节
              </el-button>
              <el-button type="text" size="mini" @click="handleUpdate(data)">
                编辑
              </el-button>
              <el-button type="text" size="mini" @click="handleDelete(data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>

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
import {
  getChapter,
  getChapterById,
  addChapter,
  updateChapter,
  delChapterById,
} from "@/api/edu/chapter";
import {
  addVideo,
  getVideoById,
  updateVideo,
  delVideoById,
  deleteVideo,
} from "@/api/edu/video";
import { getToken } from "@/utils/auth";
export default {
  name: "CourseAddChapter",
  data() {
    return {
      saveBtnDisabled: false,
      chapterList: [],
      courseId: undefined,
      chapterDialogFormVisible: false,
      videoDialogFormVisible: false,
      BASE_API: process.env.VUE_APP_BASE_API,
      fileList: [],
      headers: {},
      chapter: {
        courseId: undefined,
        title: "",
        sort: 0,
      },
      video: {
        courseId: undefined,
        chapterId: undefined,
        title: "",
        sort: 0,
        videoSource: "",
        videoOriginName: "",
      },
      chapterProps: {
        children: "children",
        label: "title",
      },
    };
  },
  computed: {
    dialogTitle() {
      return this.chapter.courseId ? "编辑小节" : "添加章节";
    },
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapter();
    }
    this.setHeaders();
  },
  methods: {
    // ==================== Video ==================
    resetVideo() {
      this.video = {
        courseId: undefined,
        chapterId: undefined,
        title: "",
        sort: 0,
        videoSource: "",
        videoOriginName: "",
      };
      this.fileList = [];
    },
    openVideo(chapterId) {
      this.resetVideo();

      // 设置章节ID和课程ID
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;

      this.videoDialogFormVisible = true;
    },
    saveOrUpdateVideo() {
      // 通过判断 video 对象中是否有 id 属性判断为插入 or 更新操作
      if (this.video.id) {
        // 更新
        this.updateVideo();
      } else {
        // 插入
        this.addVideo();
      }
    },
    addVideo() {
      addVideo(this.video).then((res) => {
        if (res.code === 200) {
          this.$notify({
            title: "Success",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
          this.getChapter();
          this.videoDialogFormVisible = false;
        }
      });
    },
    updateVideo() {
      updateVideo(this.video).then((res) => {
        if (res.code === 200) {
          this.$notify({
            title: "Success",
            message: "修改成功",
            type: "success",
            duration: 2000,
          });
          this.getChapter();
          this.videoDialogFormVisible = false;
        }
      });
    },
    setHeaders() {
      this.headers = {
        Authorization: getToken(),
      };
    },
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSource = response.data.videoSource;
      this.video.videoOriginName = response.data.videoOriginName;
      console.log(this.video);
    },
    beforeVodRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove() {
      deleteVideo(this.vidoe.videoOriginName).then((res) => {
        this.$message.success("删除视频成功^-^");
        // 清空视屏地址 以及 名称
        this.video.videoSource = "";
        this.video.videoOriginName = "";
        // 清空视屏列表
        this.fileList = [];
      });
    },
    handleUploadExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // ==================== Chapter ==================
    resetChapter() {
      this.chapter = {
        courseId: undefined,
        title: "",
        sort: 0,
      };
    },
    getChapter() {
      getChapter(this.courseId).then((res) => {
        this.chapterList = res.data;
      });
    },
    openChapterDialog() {
      this.resetChapter();
      this.chapterDialogFormVisible = true;
    },
    addChapter() {
      this.chapter.courseId = this.courseId;
      addChapter(this.chapter).then((res) => {
        if (res.code === 200) {
          this.$notify({
            title: "Success",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
          this.getChapter();
          this.chapterDialogFormVisible = false;
        }
      });
    },
    saveOrUpdate() {
      if (this.chapter.courseId === undefined) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
    handleNodeClick() {
      console.log();
    },
    updateChapter() {
      updateChapter(this.chapter).then((res) => {
        if (res.code === 200) {
          this.$notify({
            title: "Success",
            message: "修改成功",
            type: "success",
            duration: 2000,
          });
          this.getChapter();
          this.chapterDialogFormVisible = false;
        }
      });
    },
    handleAdd(chapterId) {
      this.openVideo(chapterId);
    },
    // ==================== Chapter & Video ==================
    handleUpdate(data) {
      // 通过data中是否有 children 判断该节点为章节 or 小节
      if (data.children) {
        // 章节
        getChapterById(data.id).then((res) => {
          if (res.code === 200) {
            this.chapter = res.data;
            this.chapterDialogFormVisible = true;
          }
        });
      } else {
        // 小节
        this.fileList = [];
        getVideoById(data.id).then((res) => {
          if (res.code === 200) {
            this.video = res.data;
            this.videoDialogFormVisible = true;
          }
        });
      }
    },
    handleDelete(data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (data.children) {
            // 章节
            delChapterById(data.id).then((res) => {
              if (res.code === 200) {
                this.getChapter();
                this.$notify({
                  title: "Success",
                  message: "删除成功",
                  type: "success",
                  duration: 2000,
                });
              }
            });
          } else {
            // 小节
            delVideoById(data.id).then((res) => {
              if (res.code === 200) {
                this.getChapter();
                this.$notify({
                  title: "Success",
                  message: "删除成功",
                  type: "success",
                  duration: 2000,
                });
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // ==================== router ==================
    previous() {
      this.$router.push({ path: `/course/info/${this.courseId}` });
    },
    next() {
      this.$router.push({ path: `/course/publish/${this.courseId}` });
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>