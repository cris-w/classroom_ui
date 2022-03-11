<template>
  <div class="app-container">
    <!-- <el-tree
      :data="data"
      :props="props"
      default-expand-all
      @node-click="handleNodeClick"
    ></el-tree> -->
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in timeLine"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
      >
        <div @click="watchVideo(activity)" class="chapter">
          {{ activity.title }}
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getChapter, listStudentVideo } from "@/api/edu/chapter";
export default {
  name: "ChapterStudent",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      listQuery: {
        courseId: undefined,
        studentId: undefined,
      },
      data: [],
      watched: [],
      timeLine: [],
      props: {
        children: "children",
        label: "title",
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.listQuery.courseId = this.$route.params.id;
      this.getChapter();
    }
  },
  methods: {
    // 获取所有章节小节信息
    getChapter() {
      getChapter(this.listQuery.courseId).then((res) => {
        if (res) {
          this.data = res.data;
          this.hasWatched();
        }
      });
    },
    // 获取已经观看完成的视屏id
    hasWatched() {
      this.listQuery.studentId = this.id;
      listStudentVideo(this.listQuery).then((res) => {
        if (res) {
          this.watched = res.data;
          this.handleChapterData();
        }
      });
    },
    handleChapterData() {
      if (this.data) {
        this.data.forEach((el) => {
          let val = {};
          val.title = el.title;
          val.size = "large";
          val.type = "primary";
          val.icon = "el-icon-more";
          this.timeLine.push(val);
          // 如果该章节下有小节信息 则遍历小节信息
          if (el.children.length > 0) {
            el.children.forEach((e) => {
              let val = {};
              val.id = e.id;
              val.title = e.title;
              val.videoSource = e.videoSource;
              if (this.watched.indexOf(e.id) >= 0) {
                val.color = "#0bbd87";
              } else {
                val.color = "#ffb04e";
              }
              this.timeLine.push(val);
            });
          }
        });
      }
    },
    watchVideo(obj) {
      if (obj.id) {
        let source = {};
        source.videoSource = obj.videoSource;
        source.title = obj.title;
        source.studentId = this.id;
        source.courseId = this.listQuery.courseId;
        source.videoId = obj.id;
        this.$router.push({
          path: "/student/video",
          query: { source: `${JSON.stringify(source)}` },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter {
  cursor: pointer;
  padding: 2px;
  width: auto;
  color: #131b26;
  font-size: 15px;
  &:hover {
    color: #3a8bff;
  }
}
</style>