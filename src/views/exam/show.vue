<template>
  <div class="app-container">
    <div class="app-container__title">试卷详情</div>
    <el-card class="app-container__main">
      <div class="main-title">{{ paper.title }}</div>
      <div class="main-answer">
        <el-checkbox v-model="checked">显示答案</el-checkbox>
      </div>
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
          <div class="main-single--answer" v-show="checked">
              答案：{{ single.answer }}
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
            <div class="main-single--answer" v-show="checked">
                答案：{{ mutli.answer }}
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
          <div class="main-single--answer" v-show="checked">
              答案：{{item.answer}}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getPaperQuestionById } from "@/api/edu/exam";
export default {
  name: "ShowPaper",
  data() {
    return {
      paperId: undefined,
      checked: false,
      quest: [
        {
          id: "1",
          content: "2",
        },
        {
          id: "2",
          content: "3",
        },
      ],
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
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.id) {
      this.paperId = this.$route.params.id;
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
              this.paper.completionScore =
                this.paper.completionScore + val.score;
            });
          }
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
  .main-answer {
    margin-top: 14px;
    font-size: 16px;
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
    .main-single--answer {
      font-size: 14px;
      color: #181e33;
      padding-bottom: 8px;
      line-height: 20px;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss">
.main-answer {
  .el-checkbox__label {
    font-size: 16px;
  }
}
.colorShallow {
  color: #8a8b99;
}
</style>