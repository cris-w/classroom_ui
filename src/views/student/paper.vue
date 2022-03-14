<template>
  <div class="app-container">
    <div class="app-container__title">试卷详情</div>
    <el-card class="app-container__main">
      <div class="main-title">{{ paper.title }}</div>
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
              <el-checkbox-group v-model="paper.mutliAnswer[index]" size="mini">
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
        @click="submitPaper"
        class="subBtn"
        :loading="submit"
        >交卷</el-button
      >
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPaperQuestionById, saveStudentPaper } from "@/api/edu/exam";
export default {
  name: "StudentPaper",
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    return {
      paperId: undefined,
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
        score: 0,
        questionList: [],
      },
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.id) {
      this.paperId = this.$route.params.id;
      this.getList();
    }
  },
  methods: {
    // 获取试卷列表
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
    // 提交试卷
    submitPaper() {
      // this.submit = true;
      this.resetTemp();
      // 处理单选题
      for (let i = 0; i < this.paper.singleChoiceList.length; i++) {
        let question = {};
        // 如果答案正确
        if (
          this.paper.singleChoiceList[i].answer == this.paper.singleAnswer[i]
        ) {
          this.temp.score += this.paper.singleChoiceList[i].score;
        }
        question.studentId = this.id;
        question.questionId = this.paper.singleChoiceList[i].id;
        question.paperId = this.paperId;
        question.answer = this.paper.singleAnswer[i];
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
        }
        question.studentId = this.id;
        question.questionId = this.paper.mutliChoiceList[i].id;
        question.paperId = this.paperId;
        question.answer = multipleAnswer[i];
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
        }
        question.studentId = this.id;
        question.questionId = this.paper.completionList[i].id;
        question.paperId = this.paperId;
        question.answer = this.paper.completionAnswer[i];
        this.temp.questionList.push(question);
      }
      console.log(this.temp);
      saveStudentPaper(this.temp).then((res) => {
        if (res) {
          this.$message.success("交卷成功");
          setTimeout(() => {
            this.$router.push("/student/exam")
          }, 1500);
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
        score: 0,
        questionList: [],
      };
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