<template>
  <div class="app-container random">
    <el-card style="min-width: 1150px">
      <h3>设置试卷结构</h3>
      <el-divider></el-divider>
      <el-form :model="temp" :rules="rules" ref="form" label-width="100px">
        <div class="footer" style="z-index: 10">
          <p class="score">
            满分{{ temp.totalScore || 0 }}分，当前总分{{
              temp.single.score * temp.single.nums +
              temp.multi.score * temp.multi.nums +
              temp.com.score * temp.com.nums
            }}分
          </p>
          <div class="operate">
            <el-button type="primary" @click="submitForm('form')"
              >立即创建</el-button
            >
            <el-button @click="resetForm('form')">重置</el-button>
          </div>
        </div>
        <el-form-item label="试卷名称" prop="title">
          <el-input v-model="temp.title" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="满分" prop="totalScore">
          <el-input-number
            class="chooseInp"
            controls-position="right"
            v-model="temp.totalScore"
            :min="0"
          ></el-input-number>
          分
        </el-form-item>
        <el-form-item label="描述" prop="descriptioin">
          <el-input
            v-model="temp.descriptioin"
            type="textarea"
            :rows="4"
            style="width: 50%"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 单选 -->
        <div class="single">
          <div class="single-title">
            <b>单选题</b>
          </div>
          <el-form-item label="分数(分/题)">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.single.score"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="从题库选题">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.single.nums"
              :min="0"
              :max="temp.single.total"
            ></el-input-number>
            /
            {{ temp.single.total }}
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="singleChecked">按知识点选题</el-checkbox>
          </el-form-item>
          <el-form-item>
            <!-- TODO 按照知识点从题库选题 -->
            <div class="show" v-show="singleChecked">
              <ul>
                <li class="typeNumber">设置分数</li>
                <li class="knowledge">
                  <p class="titleDesc">加法</p>
                  <div class="typeNumber2">
                    抽题数量
                    <el-input style="width: 50px"></el-input> / 4
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
        <!-- 多选 -->
        <div class="single">
          <div class="single-title">
            <b>多选题</b>
          </div>
          <el-form-item label="分数(分/题)">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.multi.score"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="从题库选题">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.multi.nums"
              :min="0"
              :max="temp.multi.total"
            ></el-input-number>
            /
            {{ temp.multi.total }}
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="multiChecked">按知识点选题</el-checkbox>
          </el-form-item>
          <el-form-item>
            <div class="show" v-show="multiChecked">
              <ul>
                <li class="typeNumber">设置分数</li>
                <li class="knowledge">
                  <p class="titleDesc">加法</p>
                  <div class="typeNumber2">
                    抽题数量
                    <el-input style="width: 50px"></el-input> / 2
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
        <!-- 简答 -->
        <div class="single">
          <div class="single-title">
            <b>简答题</b>
          </div>
          <el-form-item label="分数(分/题)">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.com.score"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="从题库选题">
            <el-input-number
              class="chooseInp"
              controls-position="right"
              v-model="temp.com.nums"
              :min="0"
              :max="temp.com.total"
            ></el-input-number>
            /
            {{ temp.com.total }}
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="comChecked">按知识点选题</el-checkbox>
          </el-form-item>
          <el-form-item>
            <div class="show" v-show="comChecked">
              <ul>
                <li class="typeNumber">设置分数</li>
                <li class="knowledge">
                  <p class="titleDesc">加法</p>
                  <div class="typeNumber2">
                    抽题数量
                    <el-input style="width: 50px"></el-input> / 2
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAllQuestionBriefList, createPaper } from "@/api/edu/exam";
import { mapGetters } from "vuex";
export default {
  name: "createRandom",
  data() {
    var checkScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("试卷总分不能为0"));
      }
      if (value > 150) {
        return callback(new Error("总分不能超过150"));
      }
      callback();
    };
    return {
      paper: {
        teacherName: "",
        title: "",
        description: "",
        totalScore: 0,
        questionList: [],
      },
      temp: {
        title: "新建试卷20220306",
        totalScore: 0,
        descriptioin: "",
        single: {
          total: 0,
          nums: 0,
          score: 0,
        },
        multi: {
          total: 0,
          nums: 0,
          score: 0,
        },
        com: {
          total: 0,
          nums: 0,
          score: 0,
        },
      },
      singleChecked: false,
      multiChecked: false,
      comChecked: false,
      rules: {
        title: [{ required: true, message: "请填写试卷标题", trigger: "blur" }],
        totalScore: [{ validator: checkScore, trigger: "change" }],
      },
      questionList: [],
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.getNum();
  },
  methods: {
    getNum() {
      getAllQuestionBriefList().then((res) => {
        if (res) {
          this.questionList = res.data;
          if (this.questionList) {
            this.questionList.forEach((el) => {
              if (el.type === 0) {
                this.temp.single.total = this.temp.single.total + 1;
              } else if (el.type === 1) {
                this.temp.multi.total = this.temp.multi.total + 1;
              } else {
                this.temp.com.total = this.temp.com.total + 1;
              }
            });
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let curScore =
            this.temp.single.score * this.temp.single.nums +
            this.temp.multi.score * this.temp.multi.nums +
            this.temp.com.score * this.temp.com.nums;
          if (this.temp.totalScore != curScore) {
            this.$message.warning("当前试卷满分与题目总分不等");
          } else {
            this.paper.teacherName = this.name;
            this.paper.title = this.temp.title;
            this.paper.description = this.temp.descriptioin;
            this.paper.totalScore = this.temp.totalScore;
            this.getQuestionList();
            console.log(this.paper);
            createPaper(this.paper).then((res) => {
              if (res) {
                this.$message.success("创建成功，请去试卷库发布");
                setTimeout(() => {
                  this.$router.push({ path: "/exam/bank" });
                }, 1500);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getQuestionList() {
      this.paper.questionList = [];
      let singleList = [];
      let multiList = [];
      let comList = [];
      // 将问题分类
      this.questionList.forEach((q) => {
        if (q.type === 0) {
          singleList.push(q);
        } else if (q.type === 1) {
          multiList.push(q);
        } else if (q.type === 2) {
          comList.push(q);
        }
      });

      // 随机选题 单选题
      if (this.temp.single.nums) {
        // 如果选择题目的数量和总数相等
        if (this.temp.single.total === this.temp.single.nums) {
          singleList.forEach((s) => {
            let question = {};
            question.questionId = s.id;
            question.score = this.temp.single.score;
            question.type = s.type;
            this.paper.questionList.push(question);
          });
        }
        // 如果选择的题目数量与总数不相等 则 随机抽取
        else {
          let curList = new Set();
          while (curList.size != this.temp.single.nums) {
            curList.add(Math.floor(Math.random() * this.temp.single.total));
          }
          curList.forEach((val) => {
            let question = {};
            question.questionId = singleList[val].id;
            question.score = this.temp.single.score;
            question.type = singleList[val].type;
            this.paper.questionList.push(question);
          });
        }
      }

      // 随机选题 多选题
      if (this.temp.multi.nums) {
        // 如果选择题目的数量和总数相等
        if (this.temp.multi.total === this.temp.multi.nums) {
          multiList.forEach((s) => {
            let question = {};
            question.questionId = s.id;
            question.score = this.temp.multi.score;
            question.type = s.type;
            this.paper.questionList.push(question);
          });
        }
        // 如果选择的题目数量与总数不相等 则 随机抽取
        else {
          let curList = new Set();
          while (curList.size != this.temp.multi.nums) {
            curList.add(Math.floor(Math.random() * this.temp.multi.total));
          }
          curList.forEach((val) => {
            let question = {};
            question.questionId = multiList[val].id;
            question.score = this.temp.multi.score;
            question.type = multiList[val].type;
            this.paper.questionList.push(question);
          });
        }
      }

      // 随机选题 填空题
      if (this.temp.com.nums) {
        // 如果选择题目的数量和总数相等
        if (this.temp.com.total === this.temp.com.nums) {
          multiList.forEach((s) => {
            let question = {};
            question.questionId = s.id;
            question.score = this.temp.com.score;
            question.type = s.type;
            this.paper.questionList.push(question);
          });
        }
        // 如果选择的题目数量与总数不相等 则 随机抽取
        else {
          let curList = new Set();
          while (curList.size != this.temp.com.nums) {
            curList.add(Math.floor(Math.random() * this.temp.com.total));
          }
          curList.forEach((val) => {
            let question = {};
            question.questionId = comList[val].id;
            question.score = this.temp.com.score;
            question.type = comList[val].type;
            this.paper.questionList.push(question);
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.random {
  .single {
    display: inline-block;
    width: 100%;
    border: 1px solid #f2f2f2;
    border-radius: 8px;
    margin: 10px 0;
    .single-title {
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #f2f2f2;
      padding: 0 20px;
      margin-bottom: 20px;
      em {
        font-size: 14px;
        color: #181e33;
        font-weight: bold;
      }
    }
    .chooseInp {
      width: 90px;
    }
    .show {
      padding: 20px 20px 6px 20px;
      background: #f7f8fa;
      .typeNumber {
        padding-bottom: 12px;
        color: #181e33;
        font-size: 14px;
        line-height: 30px;
      }
      .knowledge {
        display: flex;
        justify-content: space-between;
        .titleDesc {
          width: 400px;
          font-size: 14px;
          color: #181e33;
          line-height: 28px;
          padding-right: 30px;
        }
        .typeNumber2 {
          display: flex;
          margin-left: 40px;
          color: #181e33;
          font-size: 14px;
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 70px;
    background: #fff;
    position: fixed;
    right: 0;
    bottom: 0;
    box-shadow: 0px -1px 12px 0px rgb(1 39 78 / 6%);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .score {
      color: #646873;
      font-size: 14px;
      margin-right: 850px;
    }
    .operate {
      margin-right: 20px;
    }
  }
}
</style>