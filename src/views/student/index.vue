<template>
  <div class="app-container">
    <!-- 暂无班级 -->
    <el-empty
      description="你还未加入班级 点击加入新的班级"
      v-if="classId === -1"
    >
      <el-button type="text" round @click="dialogFormVisible = true"
        >确认</el-button
      >
    </el-empty>

    <!-- 加入班级dialog -->
    <el-dialog title="加入班级" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="选择班级">
          <el-select v-model="form.classId" placeholder="请选择班级">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="join">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 已有班级 -->
    <div v-if="classId > -1">
      <!-- 筛选条件 -->
      <div class="filter-container">
        <span class="title">筛选：</span>
        <el-radio-group v-model="filter" @change="handleChange()">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">已完成</el-radio>
          <el-radio :label="2">未完成</el-radio>
        </el-radio-group>
      </div>

      <!-- 试卷详情 -->
      <div class="paper-list">
        <div
          class="paper"
          v-for="item in showList"
          :key="item.id"
          @click="handle(item)"
        >
          <div
            :class="
              item.type !== '已过期' && item.type !== '已完成'
                ? 'pic'
                : ['pic', 'grey']
            "
          >
            <i class="el-icon-document-checked"></i>
          </div>
          <div class="tit">
            <p class="name">{{ item.paperTitle }}</p>
            <p class="do">{{ item.type }}</p>
          </div>
          <div class="time">
            <div v-if="item.hour > 0 || item.min > 0">
              <i class="el-icon-time"></i> 剩余{{ item.hour }}小时{{
                item.min
              }}分钟
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getClassIdByStudentId, joinClass } from "@/api/edu/class";
import { getClassList } from "@/api/edu/course";
import { listPublishExam, listByStudentId } from "@/api/edu/exam";

export default {
  name: "StudentExam",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      filter: 0,
      classId: undefined,
      form: {
        classId: undefined,
      },
      dialogFormVisible: false,
      // 班级列表
      classList: [],
      listQuery: {
        classId: undefined,
      },
      // 试卷列表
      paperList: [],
      // 展示列表
      showList: [],
      // 学生考试记录
      studentExamList: [],
    };
  },
  created() {
    this.getClassID();
  },
  methods: {
    getClassID() {
      getClassIdByStudentId(this.id).then((res) => {
        if (res) {
          this.classId = res.data;
          if (this.classId == -1) {
            this.getClassList();
          } else {
            this.listQuery.classId = this.classId;
            this.getPaperList();
          }
        }
      });
    },
    join() {
      if (!this.form.classId) {
        this.$message.warning("请选择班级");
      } else {
        this.form.studentId = this.id;
        joinClass(this.form).then((res) => {
          if (res) {
            this.$message.success(res.msg);
            this.dialogFormVisible = false;
            setTimeout(() => {
              this.getClassID();
            }, 1500);
          }
        });
      }
    },
    // 获取班级列表
    getClassList() {
      getClassList().then((res) => {
        if (res) {
          this.classList = res.data;
          console.log(this.classList);
        }
      });
    },
    getPaperList() {
      listPublishExam(this.listQuery).then((res) => {
        if (res) {
          this.paperList = res.data;
          this.classify();
        }
      });
    },
    // 获取学生考试记录
    listByStudentId() {
      listByStudentId(this.id).then((res) => {
        if (res) {
          this.studentExamList = res.data;
          let paperIds = [];
          if (this.studentExamList.length > 0) {
            // 获取所有考过的试卷id
            paperIds = this.studentExamList.map((l) => {
              return l.paperId;
            });
          }
          let myData = new Date();
          this.paperList.forEach((paper) => {
            if (paperIds.indexOf(paper.paperId) >= 0) {
              paper.type = "已完成";
            } else {
              // 大于截止日期
              if (
                myData.getTime() >
                new Date(paper.timeEnd.replaceAll("-", "/")).getTime()
              ) {
                paper.type = "已过期";
                // 小于开始日期
              } else if (
                myData.getTime() <
                new Date(paper.timeStart.replaceAll("-", "/")).getTime()
              ) {
                paper.type = "未开始";
              } else {
                paper.type = "待完成";
                let start = new Date(paper.timeStart.replaceAll("-", "/"));
                let end = new Date(paper.timeEnd.replaceAll("-", "/"));
                paper.hour =
                  (end.getDate() - myData.getDate()) * 24 +
                  myData.getHours() -
                  start.getHours();
                paper.min = myData.getMinutes() - start.getMinutes();
                if (paper.min < 0) {
                  paper.min = paper.min + 60;
                  paper.hour = paper.hour - 1;
                }
              }
            }
          });
          // 强制刷新
          // this.$forceUpdate(this.paperList);
          this.showList = this.paperList;
        }
      });
    },
    // 将试卷列表分类
    classify() {
      if (this.paperList) {
        this.listByStudentId();
      }
    },
    // 试卷点击事件
    handle(obj) {
      if (obj.type == "待完成") {
        this.$confirm(
          "考试即将开始，且开始后不允许中途退出，是否确认考试？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$router.push(`/student/paper/${obj.paperId}`);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消考试",
            });
          });
      } else if (obj.type == "未开始") {
        this.$message.warning("考试暂未开始");
      } else {
        this.$message.warning("该试卷考完后不允许查看");
      }
    },
    // 分类显示
    handleChange() {
      this.showList = [];
      if (this.filter === 0) {
        this.showList = this.paperList;
      } else if (this.filter === 1) {
        this.paperList.forEach((paper) => {
          if (paper.type == "已完成") {
            this.showList.push(paper);
          }
        });
      } else {
        this.paperList.forEach((paper) => {
          if (paper.type !== "已完成") {
            this.showList.push(paper);
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: inline-block;
  font-size: 14px;
  color: #a8a8b3;
  margin-right: 10px;
}
.paper-list {
  .paper {
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #d1d4dd;
    .pic {
      font-size: 50px;
      background-color: rgb(87, 172, 248);
      margin-right: 20px;
      border-radius: 10px;
      color: #fff;
    }
    .tit {
      width: 500px;
      margin-right: 50%;
      .name {
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #181e33;
        max-width: 92%;
        display: inline-block;
      }
      .do {
        font-size: 12px;
        font-weight: 400;
        color: #a8a8b3;
        line-height: 17px;
        margin-top: 4px;
      }
    }
    .time {
      width: 20%;
      font-size: 14px;
      color: #f7704e;
      line-height: 22px;
      font-family: "din";
      text-align: right;
    }
  }
}
.grey {
  background-color: rgb(197, 201, 204) !important;
}
</style>