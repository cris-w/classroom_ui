<template>
  <div class="app-container">
    <div class="title">
      <div class="content">{{ source.title }}</div>
    </div>
    <el-card class="video">
      <el-empty description="暂无视频" v-if="!source.videoSource"></el-empty>
      <video
        width="676"
        height="540"
        controls
        v-if="source.videoSource"
        @ended="end()"
      >
        <source :src="source.videoSource" type="video/mp4" />
      </video>
    </el-card>
  </div>
</template>

<script>
import { saveStudentVideo } from "@/api/edu/chapter";
export default {
  name: "StudentVideo",
  data() {
    return {
      source: {},
    };
  },
  created() {
    if (this.$route.query && this.$route.query.source) {
      this.source = JSON.parse(this.$route.query.source);
      // 如果不存在视频 则直接插入记录
      if (!this.source.videoSource) {
        this.hasWatched();
      }
    }
  },
  methods: {
    hasWatched() {
      let studentVideo = {};
      studentVideo.studentId = this.source.studentId;
      studentVideo.courseId = this.source.courseId;
      studentVideo.videoId = this.source.videoId;
      saveStudentVideo(studentVideo).then((res) => {
        if (res) {
          console.log(res.msg);
        }
      });
    },
    // 视屏播放完触发
    end() {
      this.hasWatched();
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  width: 80%;
  margin: 0 auto;
  background: #f5f8fb;
  .content {
    padding: 12px 80px 8px;
    height: 56px;
    line-height: 36px;
    font-size: 18px;
    color: #333333;
    font-weight: 600;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.video {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
</style>