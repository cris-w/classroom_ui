<template>
  <div class="app-container">
    <el-empty
      :image-size="200"
      description="已完成考试"
      v-if="isExam"
    ></el-empty>
    <div v-if="!isExam">
      <div class="app-container__title">试卷详情</div>
      <el-card class="app-container__main">
        <div class="main-title">{{ paper.title }}</div>
        <div class="count-down">
          <i class="el-icon-alarm-clock"></i>
          <Countdown :time="time" format="hh:mm:ss" @on-end="onCountdownEnd">
            <template slot-scope="{ time }">{{ time }}</template>
          </Countdown>
        </div>
        <!-- 单选 -->
        <div class="main-question" v-if="paper.singleChoiceList.length > 0">
          <div class="main-single--title">
            一、单选题（共{{ paper.singleChoiceList.length }}题，
            {{ paper.singleScore }}分）
          </div>
          <div v-for="(single, index) in paper.singleChoiceList" :key="index">
            <!-- 选项内容 -->
            <div class="main-single--choose">
              <!-- 题号 -->
              {{ index + 1 }}.
              <span class="colorShallow">(单选题，{{ single.score }}分)</span>
              <!-- 题目 -->
              <p>
                <br />

                {{ single.title }}
              </p>
              <!-- 选项 -->
              <div class="certain-choose">
                <el-radio-group v-model="paper.singleAnswer[index]" size="mini">
                  <div
                    class="option"
                    v-for="(value, i) in single.options"
                    :key="value.id"
                  >
                    <el-radio-button
                      :label="words[i]"
                      style="cursor: pointer"
                    ></el-radio-button>
                    <!-- <el-input size="small"></el-input> -->
                    <div style="margin-left: 20px">{{ value.option }}</div>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </div>
          <!-- 单选结束 -->
        </div>

        <!-- 多选 -->
        <div class="main-question" v-if="paper.mutliChoiceList.length > 0">
          <div class="main-single--title">
            二、多选题（共{{ paper.mutliChoiceList.length }}题，{{
              paper.mutliScore
            }}分）
          </div>
          <div v-for="(mutli, index) in paper.mutliChoiceList" :key="index">
            <!-- 选项内容 -->
            <div class="main-single--choose">
              <!-- 题号 -->
              {{ index + 1 }}.
              <span class="colorShallow">(多选题，{{ mutli.score }}分)</span>
              <!-- 题目 -->
              <p>
                <br />

                {{ mutli.title }}
              </p>
              <!-- 选项 -->
              <div class="certain-choose">
                <el-checkbox-group
                  v-model="paper.mutliAnswer[index]"
                  size="mini"
                >
                  <div
                    class="option"
                    v-for="(value, i) in mutli.options"
                    :key="value.id"
                  >
                    <el-checkbox-button
                      :label="words[i]"
                      style="cursor: pointer"
                    ></el-checkbox-button>
                    <div style="margin-left: 20px">{{ value.option }}</div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <!-- 多选结束 -->
        </div>

        <!-- 简答 -->
        <div class="main-question" v-if="paper.completionList.length > 0">
          <div class="main-single--title">
            三、简答题（共{{ paper.completionList.length }}题，{{
              paper.completionScore
            }}分）
          </div>
          <div v-for="(item, index) in paper.completionList" :key="index">
            <!-- 选项内容 -->
            <div class="main-single--choose">
              <!-- 题号 -->
              {{ index + 1 }}.
              <span class="colorShallow">(简答题，{{ item.score }}分)</span>
              <!-- 题目 -->
              <p>
                <br />

                {{ item.title }}
              </p>
            </div>
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="paper.completionAnswer[index]"
              style="width: 30%"
            >
            </el-input>
          </div>
        </div>
        <el-button
          type="text"
          @click="submitPaper(false, false)"
          class="subBtn"
          :loading="submit"
          >交卷</el-button
        >
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Countdown from "@choujiaojiao/vue2-countdown";
import {
  getPaperQuestionById,
  saveStudentPaper,
  listByStudentId,
  getTimeLimit,
} from "@/api/edu/exam";
export default {
  name: "StudentPaper",
  computed: {
    ...mapGetters(["id"]),
  },
  components: { Countdown },
  data() {
    return {
      paperId: undefined,
      classId: undefined,
      submit: false,
      // 选项
      words: ["A", "B", "C", "D", "E", "F", "G"],
      paper: {
        title: "",
        description: "",
        // 单选题
        singleChoiceList: [],
        singleAnswer: [],
        singleScore: 0,
        // 多选题
        mutliChoiceList: [],
        mutliAnswer: [],
        mutliScore: 0,
        // 简答题
        completionList: [],
        completionAnswer: [],
        completionScore: 0,
      },
      // 提交到后端数据
      temp: {
        paperId: undefined,
        studentId: undefined,
        classId: undefined,
        score: 0,
        questionList: [],
      },
      // 该学生是否考过该试卷
      isExam: true,
      // 是否离开本页面
      leave: false,
      // 是否为系统跳转路由
      isSys: false,
      // 考试限制时间 秒
      time: 0,
    };
  },
  mounted() {
    window.addEventListener("blur", this.cheat);
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.paperId) {
      this.paperId = this.$route.params.paperId;
      this.classId = this.$route.params.classId;
      this.listByStudentId();
      this.getTimeLimit();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isExam) {
      if (this.isSys) {
        next();
      } else {
        // 如果路由跳转
        this.$confirm("此操作将视为放弃考试, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.handleSub();
            setTimeout(() => {
              next();
            }, 2000);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      }
    } else {
      next();
    }
  },

  beforeDestroy() {
    window.removeEventListener("blur", this.cheat);
  },
  methods: {
    // 获取试卷列表
    getList() {
      getPaperQuestionById(this.paperId).then((res) => {
        if (res) {
          const { data } = res;
          // console.log(data);
          this.paper.title = data.title;
          this.paper.description = data.description;
          let single = data.choices;
          single.forEach((el) => {
            if (el.type === 0) {
              this.paper.singleChoiceList.push(el);
              this.paper.singleScore = this.paper.singleScore + el.score;
            } else {
              this.paper.mutliChoiceList.push(el);
              this.paper.mutliScore = this.paper.mutliScore + el.score;
              this.paper.mutliAnswer.push([]);
            }
          });
          this.paper.completionList = data.completions;
          if (this.paper.completionList) {
            this.paper.completionList.forEach((val) => {
              this.paper.completionScore =
                this.paper.completionScore + val.score;
            });
          }
        }
      });
    },
    // 获取考试限制时间
    getTimeLimit() {
      getTimeLimit(this.paperId, this.classId).then((res) => {
        if (res) {
          this.time = parseInt(res.data) * 60;
        }
      });
    },
    // 通过学生ID获取考试记录
    listByStudentId() {
      listByStudentId(this.id).then((res) => {
        if (res) {
          let paperIds = [];
          if (res.data.length > 0) {
            // 获取所有考过的试卷id
            paperIds = res.data.map((l) => {
              return l.paperId;
            });
            if (paperIds.indexOf(parseInt(this.paperId)) < 0) {
              this.isExam = false;
              this.getList();
            }
          } else {
            this.isExam = false;
            this.getList();
          }
        }
      });
    },
    // 提交试卷
    submitPaper(loading, over) {
      this.submit = true;
      this.resetTemp();
      // 处理单选题
      for (let i = 0; i < this.paper.singleChoiceList.length; i++) {
        let question = {};
        // 如果答案正确
        if (
          this.paper.singleChoiceList[i].answer == this.paper.singleAnswer[i]
        ) {
          this.temp.score += this.paper.singleChoiceList[i].score;
          question.score = this.paper.singleChoiceList[i].score;
        }
        question.studentId = this.id;
        question.questionId = this.paper.singleChoiceList[i].id;
        question.paperId = this.paperId;
        question.answer = this.paper.singleAnswer[i];
        question.totalScore = this.paper.singleChoiceList[i].score;
        this.temp.questionList.push(question);
      }

      // 处理多选题
      // 1. 先处理多选题答案, 将数组转化为字符串。
      let multipleAnswer = [];
      this.paper.mutliAnswer.forEach((a) => {
        multipleAnswer.push(this.answerArrToStr(a));
      });
      // 2. 判断答案
      for (let i = 0; i < this.paper.mutliChoiceList.length; i++) {
        let question = {};
        // 如果答案正确
        if (this.paper.mutliChoiceList[i].answer === multipleAnswer[i]) {
          this.temp.score += this.paper.mutliChoiceList[i].score;
          question.score = this.paper.mutliChoiceList[i].score;
        }
        question.studentId = this.id;
        question.questionId = this.paper.mutliChoiceList[i].id;
        question.paperId = this.paperId;
        question.answer = multipleAnswer[i];
        question.totalScore = this.paper.mutliChoiceList[i].score;
        this.temp.questionList.push(question);
      }

      // 处理简答题
      for (let i = 0; i < this.paper.completionList.length; i++) {
        let question = {};
        // 如果答案正确
        if (
          this.paper.completionList[i].answer == this.paper.completionAnswer[i]
        ) {
          this.temp.score += this.paper.completionList[i].score;
          question.score = this.paper.completionList[i].score;
        }
        question.studentId = this.id;
        question.questionId = this.paper.completionList[i].id;
        question.paperId = this.paperId;
        question.answer = this.paper.completionAnswer[i];
        question.totalScore = this.paper.completionList[i].score;
        this.temp.questionList.push(question);
      }
      // 是否为作弊强制交卷
      if (loading) {
        saveStudentPaper(this.temp).then((res) => {
          if (res) {
            this.isSys = true;
            setTimeout(() => {
              this.$message.success("交卷成功");
              loading.close();
              this.$router.push("/student/exam");
            }, 1500);
          }
        });
      } else {
        // 是否为超时交卷
        if (over) {
          this.savePaper();
        } else {
          this.$confirm("确认提交试卷?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.savePaper();
            })
            .catch(() => {
              this.submit = false;
              this.$message({
                type: "info",
                message: "已取消交卷",
              });
            });
        }
      }
    },
    // 将试卷保存数据库
    savePaper() {
      saveStudentPaper(this.temp).then((res) => {
        if (res) {
          this.$message.success("交卷成功");
          this.isSys = true;
          setTimeout(() => {
            this.$router.push("/student/exam");
          }, 1000);
        }
      });
    },
    // 将答案数组转为字符串,并排序
    answerArrToStr(arr) {
      let answer = "";
      arr.sort();
      arr.forEach((a) => {
        answer = answer + a;
      });
      return answer;
    },
    resetTemp() {
      this.temp = {
        paperId: this.paperId,
        studentId: this.id,
        classId: this.classId,
        score: 0,
        questionList: [],
      };
    },
    cheat() {
      if (!this.isExam) {
        if (!this.leave) {
          this.$alert("离开当前页面将会被判定为作弊，并立刻被收卷", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: () => {
              this.leave = true;
              // console.log(this.leave);
              this.$message({
                type: "info",
                message: "再次离开将被直接判定为作弊",
              });
            },
          });
        } else {
          this.handleSub();
        }
      }
    },
    // 强制交卷
    handleSub() {
      const loading = this.$loading({
        lock: true,
        text: "系统判定为作弊，强制交卷中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.submitPaper(loading);
    },
    // 倒计时结束
    onCountdownEnd() {
      this.submitPaper(false, true);
    },
  },
};
</script>

<style scoped lang="scss">
.el-container {
  margin-bottom: 40px;
}
.app-container__title {
  background-color: #384b66;
  color: #fff;
  text-align: center;
  line-height: 40px;
  height: 40px;
  width: 100%;
}
.app-container__main {
  margin: 30px auto;
  padding: 30px 40px;
  .count-down {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 24px;
    color: #646873;
  }
  .main-title {
    width: 800px;
    font-size: 18px;
    color: #181e33;
    line-height: 25px;
    font-weight: bold;
  }
  .main-question {
    margin-top: 30px;
    .main-single--title {
      color: #181e33;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }
    .main-single--choose {
      padding-top: 16px;
      font-size: 14px;
      p {
        margin: 0;
      }
      .certain-choose {
        margin-top: 16px;
        .option {
          display: flex;
          align-items: center;
          padding: 10px;
        }
      }
    }
    .main-single--answer {
      font-size: 14px;
      color: #181e33;
      padding-bottom: 8px;
      line-height: 20px;
      font-weight: bold;
    }
  }
}
.subBtn {
  margin-top: 20px;
  font-size: 18px;
  width: 100%;
  text-align: right;
}
</style>
<style lang="scss">
.colorShallow {
  color: #8a8b99;
}
.el-radio-group {
  font-size: 14px;
}
.el-checkbox-group {
  font-size: 14px;
}
</style>