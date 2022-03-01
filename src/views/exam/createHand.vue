<template>
  <div class="app-container">
    <el-card class="header">
      <el-input v-model="paper.title" placeholder="" style="width: 1000px" />
      <el-button type="primary" @click="createPaper">完成</el-button>
    </el-card>
    <div class="content">
      <!-- 题目-分数大纲 -->
      <el-card class="left">
        <!-- 标题 -->
        <div class="title-left">
          <p>
            题量:
            <i>{{ temp.total }}</i>
            ,总分
            <i>{{
              temp.singleScore + temp.mutliScore + temp.completionScore
            }}</i>
          </p>
        </div>
        <!-- 单选 -->
        <div class="question-title" v-if="temp.singleChoiceList.length > 0">
          <a class="main-title" href="javascript:;">
            一、单选题（共{{ temp.singleChoiceList.length }}题，
            {{ temp.singleScore }}分）
          </a>
          <ul class="question__title">
            <li v-for="(item, index) in temp.singleChoiceList" :key="item.id">
              {{ index + 1 }}.({{ item.score }}分)
              <span @click="getQuestionInfo(item.id, index + 1, item.score)">{{
                item.title
              }}</span>
            </li>
          </ul>
        </div>
        <!-- 多选 -->
        <div class="question-title" v-if="temp.mutliChoiceList.length > 0">
          <a class="main-title" href="javascript:;">
            二、多选题（共{{ temp.mutliChoiceList.length }}题，
            {{ temp.mutliScore }}分）
          </a>
          <ul class="question__title">
            <li v-for="(item, index) in temp.mutliChoiceList" :key="item.id">
              {{ index + 1 }}.({{ item.score }}分)
              <span @click="getQuestionInfo(item.id, index + 1, item.score)">{{
                item.title
              }}</span>
            </li>
          </ul>
        </div>
        <!-- 简答 -->
        <div class="question-title" v-if="temp.completionList.length > 0">
          <a class="main-title" href="javascript:;">
            三、简答题（共{{ temp.completionList.length }}题，
            {{ temp.completionScore }}分）
          </a>
          <ul class="question__title">
            <li v-for="(item, index) in temp.completionList" :key="item.id">
              {{ index + 1 }}.({{ item.score }}分)
              <span @click="getQuestionInfo(item.id, index + 1, item.score)">{{
                item.title
              }}</span>
            </li>
          </ul>
        </div>
      </el-card>
      <!-- 题目详情 -->
      <div class="right">
        <!-- 题目类型选项 -->
        <el-card class="operate">
          <div class="operate-container">
            <p class="operate__left">添加题目</p>
            <div class="question__type">
              <el-button round @click="model = 1">单选题</el-button>
              <el-button round @click="model = 2">多选题</el-button>
              <el-button round @click="model = 3">简答题</el-button>
            </div>
            <el-button type="text" @click="importQuestion"
              >从题库导入</el-button
            >
          </div>
        </el-card>
        <!-- 题目主体 -->
        <el-empty
          description="点击题型按钮从题库导入题目"
          :image-size="200"
          v-show="question.index === 0"
        >
        </el-empty>
        <el-card class="context" v-show="question.index !== 0">
          <!-- 标题&答案部分 -->
          <div class="context__title">
            <!-- 1 (单选题) -->
            <div v-if="question.type === 0">
              <b style="margin-right: 20px">{{ question.index }}</b>
              <!-- 题目title -->
              <div class="main__title">
                <span>(单选题，{{ question.score }}分)</span>
                <br />
                <p style="margin-left: 20px; font-size: 16px">
                  {{ question.title }}
                </p>
              </div>
              <!-- 题目选项 -->
              <div class="main__answer">
                <el-radio-group v-model="question.answer">
                  <div
                    v-for="(i, index) in question.options"
                    :key="i.id"
                    class="opertion-container"
                  >
                    <el-radio-button
                      :label="word[index]"
                      disabled
                    ></el-radio-button>
                    <div class="option">
                      {{ i.option }}
                    </div>
                  </div>
                </el-radio-group>
              </div>
            </div>
            <!-- 2 (多选题) -->
            <div v-if="question.type === 1">
              <b style="margin-right: 20px">{{ question.index }}</b>
              <!-- 题目title -->
              <div class="main__title">
                <span>(多选题，{{ question.score }}分)</span>
                <br />
                <p style="margin-left: 20px; font-size: 16px">
                  {{ question.title }}
                </p>
              </div>
              <!-- 题目选项 -->
              <div class="main__answer">
                <el-checkbox-group v-model="question.answer">
                  <div
                    v-for="(i, index) in question.options"
                    :key="i.id"
                    class="opertion-container"
                  >
                    <el-checkbox-button
                      :label="word[index]"
                    ></el-checkbox-button>
                    <div class="option">
                      {{ i.option }}
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 3 (简答题) -->
            <div v-if="question.type === 2">
              <b style="margin-right: 20px">{{ question.index }}</b>
              <!-- 题目title -->
              <div class="main__title">
                <span>(简答题，{{ question.score }}分)</span>
                <br />
                <p style="margin-left: 20px; font-size: 16px">
                  {{ question.title }}
                </p>
              </div>
              <!-- 题目选项 -->
              <div class="main__answer">答案：{{ question.answer }}</div>
            </div>
          </div>
          <!-- 难度&知识点部分 -->
          <div class="padBom">
            <div class="complete_bom">
              <span class="l">难度：</span>
              <span class="r" v-if="question.level == 0">简单</span>
              <span class="r" v-if="question.level == 1">中等</span>
              <span class="r" v-if="question.level == 2">困难</span>
            </div>
            <div class="complete_bom">
              <span class="l">知识点：</span>
              <span class="r" v-for="item in question.knowledge" :key="item.id"
                ><el-tag type="info">{{ item.title }}</el-tag></span
              >
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestionById, createPaper } from "@/api/edu/exam";
import { mapGetters } from "vuex";
export default {
  name: "createHand",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      // 提交给后端的Bo
      paper: {
        title: "新建试卷20220227145133",
        teacherName: "",
        courseId: undefined,
        description: "",
        totalScore: 0,
        questionList: [],
      },
      // 题目大纲内容
      temp: {
        // 单选题
        singleChoiceList: [],
        singleScore: 0,
        // 多选题
        mutliChoiceList: [],
        mutliScore: 0,
        // 简答题
        completionList: [],
        completionScore: 0,
        total: 0,
      },
      // 单题详情
      question: {
        index: 0,
        answer: undefined,
        score: 0,
        type: 2,
        title: "",
        options: [],
        level: 0,
        knowledge: [],
      },
      // 添加题目类型
      questionType: 0,
      model: 0,
      word: ["A", "B", "C", "D", "E", "F", "G"],
    };
  },
  created() {},
  activated() {
    if (this.$route.params && this.$route.params.select) {
      this.$route.params.select.forEach((val) => {
        // 如果为单选题
        if (val.type == 0) {
          if (this.temp.singleChoiceList) {
            // 判断该题目是否添加过
            let flag = this.isExist(this.temp.singleChoiceList, val.id);
            if (flag < 0) {
              val.score = 5;
              this.temp.singleChoiceList.push(val);
              this.temp.singleScore = this.temp.singleScore + val.score;
              this.temp.total++;
            }
          } else {
            val.score = 5;
            this.temp.singleChoiceList.push(val);
            this.temp.singleScore = this.temp.singleScore + val.score;
            this.temp.total++;
          }
        }
        // 如果为多选
        else if (val.type == 1) {
          if (this.temp.mutliChoiceList) {
            let flag = this.isExist(this.temp.mutliChoiceList, val.id);

            if (flag < 0) {
              val.score = 5;
              this.temp.mutliChoiceList.push(val);
              this.temp.mutliScore = this.temp.mutliScore + val.score;
              this.temp.total++;
            }
          } else {
            val.score = 5;
            this.temp.mutliChoiceList.push(val);
            this.temp.mutliScore = this.temp.mutliScore + val.score;
            this.temp.total++;
          }
        }
        // 如果为简答
        else if (val.type == 2) {
          if (this.temp.completionList) {
            let flag = this.isExist(this.temp.completionList, val.id);

            if (flag < 0) {
              val.score = 5;
              this.temp.completionList.push(val);
              this.temp.completionScore = this.temp.completionScore + val.score;
              this.temp.total++;
            }
          } else {
            val.score = 5;
            this.temp.completionList.push(val);
            this.temp.completionScore = this.temp.completionScore + val.score;
            this.temp.total++;
          }
        }
      });
    }
  },
  methods: {
    resetQuestion() {
      this.question = {
        index: -1,
        type: 0,
        score: 0,
        title: "",
        options: [],
        level: 0,
        knowledge: [],
      };
    },
    resetPaper() {
      this.paper.questionList = [];
    },
    importQuestion() {
      if (this.model) {
        this.$router.push({ path: `/exam/questionBank/${this.model}` });
      } else {
        this.$message.warning("请选择导入题目的类型");
      }
    },
    // 判断题目列表中是否存在 该题目
    isExist(arr, id) {
      let ids = [];
      arr.forEach((a) => {
        ids.push(a.id);
      });
      return ids.indexOf(id);
    },
    getQuestionInfo(id, index, score) {
      this.resetQuestion();
      this.question.index = index;
      this.question.score = score;
      getQuestionById(id).then((res) => {
        const { data } = res;
        this.question.type = data.type;
        // 如果为多选
        if (data.type == 1) {
          this.question.answer = data.answer.split("");
        } else {
          this.question.answer = data.answer;
        }
        this.question.title = data.title;
        this.question.level = data.level;
        this.question.knowledge = data.knowledgePoints;
        this.question.options = data.options;
      });
    },
    createPaper() {
      this.resetPaper();
      this.paper.teacherName = this.name;
      this.paper.totalScore =
        this.temp.singleScore +
        this.temp.mutliScore +
        this.temp.completionScore;
      // 获取问题列表
      if (this.temp.singleChoiceList) {
        this.temp.singleChoiceList.forEach((el) => {
          let paperQuestion = {};
          paperQuestion.questionId = el.id;
          paperQuestion.score = el.score;
          paperQuestion.type = el.type;
          this.paper.questionList.push(paperQuestion);
        });
      }
      if (this.temp.mutliChoiceList) {
        this.temp.mutliChoiceList.forEach((el) => {
          let paperQuestion = {};
          paperQuestion.questionId = el.id;
          paperQuestion.score = el.score;
          paperQuestion.type = el.type;
          this.paper.questionList.push(paperQuestion);
        });
      }
      if (this.temp.completionList) {
        this.temp.completionList.forEach((el) => {
          let paperQuestion = {};
          paperQuestion.questionId = el.id;
          paperQuestion.score = el.score;
          paperQuestion.type = el.type;
          this.paper.questionList.push(paperQuestion);
        });
      }
      // 如果题目为空
      if (this.paper.questionList.length === 0) {
        this.$message.warning("您还未添加题目");
        return;
      } else {
        createPaper(this.paper).then((res) => {
          if (res) {
            this.$message.success("创建成功，请去试卷库发布");
            setTimeout(() => {
              this.$router.push({ path: "/exam/bank" });
            }, 2000);
          }
        });
      }
    },
  },

  beforeDestroy() {
    console.log("destroy");
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "paperBank") {
      this.$destroy();
    }
    next();
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  width: 1200px;
  margin: 10px auto 20px;
}
.content {
  display: flex;
  justify-content: center;
  .left {
    min-width: 280px;
    height: 512px;
    margin-right: 20px;
    padding: 0;
    .title-left {
      font-size: 14px;
      color: #a8a8b3;
    }
    .question-title {
      .main-title {
        color: #181e33;
        font-size: 13px;
        font-weight: bold;
      }
      .question__title {
        cursor: pointer;
        color: #646873;
        font-size: 13px;
        margin: 10px 0;
        li {
          margin: 5px 0;
        }
      }
    }
  }
  .right {
    min-height: 500px;
    .operate {
      width: 900px;
      height: 70px;
      margin-bottom: 20px;
      .operate-container {
        display: flex;
        justify-content: space-between;
        .operate__left {
          font-size: 14px;
          color: #a8a8b3;
          margin-right: 20px;
        }
        .question__type {
          margin-right: auto;
        }
      }
    }
    .context {
      height: 80%;
      .context__title {
        font-size: 14px;
        .main__title {
          display: inline;
        }
      }
      .main__answer {
        .opertion-container {
          display: flex;
          align-items: center;
          margin: 10px auto;
          .option {
            font-size: 14px;
            margin-left: 20px;
          }
        }
      }
      .padBom {
        margin-top: 20px;
        .complete_bom {
          padding-bottom: 5px;
          padding-left: 10px;
          .l {
            display: inline-block;
            width: 70px;
            height: 26px;
            line-height: 26px;
            color: #a8a8b3;
            font-size: 14px;
          }
          .r {
            height: 26px;
            line-height: 26px;
            color: #a8a8b3;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.operate {
  .el-card__body {
    padding: 15px;
  }
}
.left {
  .el-card__body {
    padding: 12px 0 0 16px;
  }
}
.main__answer {
  .el-radio-button:first-child {
    .el-radio-button__inner {
      border-radius: 100%;
    }
  }
  .el-radio-button__orig-radio:disabled:checked + {
    .el-radio-button__inner {
      background-color: #eb1212;
    }
  }
  .el-checkbox-button:first-child {
    .el-checkbox-button__inner {
      border-radius: 100%;
    }
  }
}
</style>