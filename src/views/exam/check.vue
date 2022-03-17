<template>
  <div class="app-container">
      <div class="app-container__title">{{ studentName }}的试卷</div>
    <el-card class="app-container__main">
      <div class="main-title">{{ paper.title }}</div>

      <!-- 单选 -->
      <div class="main-question" v-if="paper.singleChoiceList.length > 0">
        <div class="main-single--title">一、单选题（共{{ paper.singleChoiceList.length }}题， {{ paper.singleScore }}分）</div>
        <div v-for="(single, index) in paper.singleChoiceList" :key="index">
          <!-- 选项内容 -->
          <div class="main-single--choose" >
            <!-- 题号 -->
            {{index + 1}}.
            <span class="colorShallow">(单选题，{{ single.score }}分)</span>
            <!-- 题目 -->
            <p>
              <br />
            
              {{ single.title }}
            </p>
            <!-- 选项 -->
            <p class="certain-choose">
                <ol type="A" >
                    <li v-for="(value) in single.options" :key="value.id">{{value.option}}</li>
                </ol>
            </p>
          </div>
          <!-- 答案 -->
          <div class="answer">
            <div class="main-single--answer" >
              <span>学生答案：{{ single.studentAnswer }}</span>
              <span class="true">
                  正确答案：{{ single.answer }}
              </span>
            </div>
            <div class="score">
                得分：{{ single.studentScore }}
                分
            </div>      
          </div>
          
        </div>
        <!-- 单选结束 -->
      </div>

      <!-- 多选 -->
      <div class="main-question" v-if="paper.mutliChoiceList.length > 0">
        <div class="main-single--title">二、多选题（共{{paper.mutliChoiceList.length}}题，{{paper.mutliScore}}分）</div>
        <div v-for="(mutli, index) in paper.mutliChoiceList" :key="index">
            <!-- 选项内容 -->
            <div class="main-single--choose">
              <!-- 题号 -->
              {{index + 1}}.
              <span class="colorShallow">(多选题，{{mutli.score}}分)</span>
              <!-- 题目 -->
              <p>
                <br />
              
                {{ mutli.title }}
              </p>
              <!-- 选项 -->
              <p class="certain-choose">
                  <ol type="A" >
                      <li v-for="value in mutli.options" :key="value.id">{{value.option}}</li>
                  </ol>
              </p>
            </div>
            <!-- 答案 -->
          <div class="answer">
            <div class="main-single--answer" >
              <span>学生答案：{{ mutli.studentAnswer }}</span>
              <span class="true">
                  正确答案：{{ mutli.answer }}
              </span>
            </div>
            <div class="score">
                得分：{{ mutli.studentScore }}
                分
            </div>
          </div>
        </div>
        <!-- 多选结束 -->
      </div>

      <!-- 简答 -->
      <div class="main-question" v-if="paper.completionList.length > 0">
        <div class="main-single--title">三、简答题（共{{paper.completionList.length}}题，{{paper.completionScore}}分）</div>
        <div v-for="(item, index) in paper.completionList" :key="index">
            <!-- 选项内容 -->
          <div class="main-single--choose">
            <!-- 题号 -->
            {{index + 1}}.
            <span class="colorShallow">(简答题，{{item.score}}分)</span>
            <!-- 题目 -->
            <p>
              <br />
            
              {{item.title}}
            </p>
          </div>
          <!-- 答案 -->
          <div class="answer">
            <div class="main-single--answer" >
              <span>学生答案：{{ item.studentAnswer }}</span>
              <div class="true-c">
                  正确答案：{{ item.answer }}
              </div>
            </div>
            <div class="score">
                得分：
                <el-input 
                    v-model="item.studentScore"  
                    style="width: 50px" 
                    :disabled="item.disabled" 
                    @input="change" 
                    @blur="update(item)">
                </el-input> 
                分
                <i class="el-icon-edit" @click="edit(item)"></i>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="fanyaMarkingBootm">
        <div class="total-score">总分：{{ total }} 分</div>
        <div class="op-btn">
            <el-button type="primary" round size="mini" @click="submit">提交</el-button>
            <el-button type="warning" round size="mini" @click="removeExamById">打回</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getPaperQuestionById,
  listQuestionById,
  updateStudentQuestion,
  updateStudentExam,
  removeExamById,
} from "@/api/edu/exam";
export default {
  name: "PaperCheck",
  computed: {
    ...mapGetters({ readId: "id" }),
  },
  data() {
    return {
      total: 0,
      id: undefined,
      paperId: undefined,
      studentId: undefined,
      classId: undefined,
      studentName: "",
      // 未修改之前的简答题成绩
      cur: undefined,
      paper: {
        title: "",
        description: "",
        // 单选题
        singleChoiceList: [],
        singleScore: 0,
        // 多选题
        mutliChoiceList: [],
        mutliScore: 0,
        // 简答题
        completionList: [],
        completionScore: 0,
      },
    };
  },
  created() {
    if (this.$route.params && this.$route.params.info) {
      let info = JSON.parse(this.$route.params.info);
      this.paperId = info.paperId;
      this.id = info.id;
      this.studentId = info.studentId;
      this.classId = info.classId;
      this.studentName = info.studentName;
      this.getList();
    }
  },
  methods: {
    getList() {
      getPaperQuestionById(this.paperId).then((res) => {
        if (res) {
          const { data } = res;
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
            }
          });
          this.paper.completionList = data.completions;
          if (this.paper.completionList) {
            this.paper.completionList.forEach((val) => {
              val.disabled = true;
              this.paper.completionScore =
                this.paper.completionScore + val.score;
            });
          }
          this.getQuestionInfo();
        }
      });
    },
    // 获取学生考试题目信息
    getQuestionInfo() {
      listQuestionById(this.studentId, this.paperId).then((res) => {
        if (res) {
          const { data } = res;
          this.paper.singleChoiceList.forEach((s) => {
            data.forEach((d) => {
              if (s.id == d.questionId) {
                s.studentAnswer = d.answer;
                s.studentScore = d.score;
                s.studentQuestionId = d.id;
              }
            });
          });
          this.paper.mutliChoiceList.forEach((s) => {
            data.forEach((d) => {
              if (s.id == d.questionId) {
                s.studentAnswer = d.answer;
                s.studentScore = d.score;
                s.studentQuestionId = d.id;
              }
            });
          });
          this.paper.completionList.forEach((s) => {
            data.forEach((d) => {
              if (s.id == d.questionId) {
                s.studentAnswer = d.answer;
                s.studentScore = d.score;
                s.studentQuestionId = d.id;
              }
            });
          });
          this.$forceUpdate(this.paper);
          this.getTotal();
        }
      });
    },
    edit(obj) {
      obj.disabled = !obj.disabled;
      this.cur = obj.studentScore;
      this.$forceUpdate(this.paper.completionList);
    },
    // 处理input框无法输入问题
    change() {
      this.$forceUpdate();
    },
    update(obj) {
      if (!/^\d+$/.test(obj.studentScore)) {
        this.$message.error("请输入正整数");
        obj.studentScore = this.cur;
        obj.disabled = true;
      } else if (obj.studentScore > obj.score) {
        this.$message.error("不能超过最大分数");
        obj.studentScore = this.cur;
        obj.disabled = true;
      } else {
        let paper = {};
        paper.id = obj.studentQuestionId;
        paper.score = obj.studentScore;
        this.handleUpdate(paper);
        obj.disabled = true;
      }
      this.$forceUpdate(this.paper.completionList);
    },
    handleUpdate(paper) {
      updateStudentQuestion(paper).then((res) => {
        if (res) {
          this.$message.success("修改成功！");
          this.getTotal();
        }
      });
    },
    // 获取总分
    getTotal() {
      this.total = 0;
      this.paper.singleChoiceList.forEach((v) => {
        if (v.studentScore) {
          this.total += parseInt(v.studentScore);
        }
      });
      this.paper.mutliChoiceList.forEach((v) => {
        if (v.studentScore) {
          this.total += parseInt(v.studentScore);
        }
      });
      this.paper.completionList.forEach((v) => {
        if (v.studentScore) {
          this.total += parseInt(v.studentScore);
        }
      });
    },
    submit() {
      let exam = {};
      exam.id = this.id;
      exam.readId = this.readId;
      exam.score = this.total;
      exam.state = 1;
      updateStudentExam(exam).then((res) => {
        if (res) {
          this.$message.success("批阅成功");
          setTimeout(() => {
            this.$router.push(`/exam/read/${this.paperId}/${this.classId}`);
          }, 1000);
        }
      });
    },
    removeExamById() {
      removeExamById(this.paperId, this.studentId).then((res) => {
        if (res) {
          this.$message.success("打回成功");
          setTimeout(() => {
            this.$router.push(`/exam/read/${this.paperId}/${this.classId}`);
          }, 1000);
        }
      });
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
        li {
          margin-bottom: 16px;
        }
      }
    }
    .answer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 20px;
      line-height: 20px;
      padding: 16px 20px;
      margin-top: 16px;
      background: #f8f9fa;
      border: solid #f0f3f7 1px;
      border-radius: 3px;
      .main-single--answer {
        font-size: 14px;
        color: #181e33;
        font-weight: bold;
        .true {
          margin-left: 50px;
          color: rgb(82, 180, 117);
        }
        .true-c {
          color: rgb(82, 180, 117);
        }
      }
      .score {
        font-size: 14px;
        color: #646873;
      }
    }
  }
}
.fanyaMarkingBootm {
  left: 0;
  width: 100%;
  height: 70px;
  background: #fff;
  position: fixed;
  bottom: 0;
  z-index: 999;
  box-shadow: 0px -1px 12px 0px rgb(1 39 78 / 6%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .total-score {
    margin-left: 250px;
    line-height: 36px;
    font-size: 14px;
    color: #646873;
  }
  .op-btn {
    margin-right: 40px;
  }
}
</style>
<style lang="scss">