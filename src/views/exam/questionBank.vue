<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入题目"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        type="primary"
        class="filter-item"
        icon="el-icon-edit"
        @click="createQuestion"
        :disabled="selectQuestions.length == 0"
        >完成选题</el-button
      >
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="题目" prop="title"></el-table-column>
      <el-table-column label="难度" prop="level" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.level === 0" type="info">简单</el-tag>
          <el-tag v-else-if="row.level === 1" type="success">中等</el-tag>
          <el-tag v-else-if="row.level === 2" type="warning">困难</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getQuestionBriefList } from "@/api/edu/exam";
export default {
  name: "QuestionBank",
  data() {
    return {
      listQuery: {
        title: "",
        type: 0,
      },
      list: [],
      listLoading: false,
      selectQuestions: [],
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.model) {
      this.listQuery.type = this.$route.params.model - 1;
      this.getList();
    }
  },
  methods: {
    getList() {
      getQuestionBriefList(this.listQuery).then((res) => {
        if (res) {
          const { data } = res;
          this.list = data;
        }
      });
    },
    handleFilter() {
      this.getList();
    },
    handleSelectionChange(val) {
      this.selectQuestions = val;
    },
    createQuestion() {
      this.$router.push({
        name: "createHand",
        params: { select: this.selectQuestions },
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    // 设置下一个路由的 meta
    to.meta.keepAlive = true; // 让 A 缓存，即不刷新
    next();
  },
};
</script>

<style>
</style>