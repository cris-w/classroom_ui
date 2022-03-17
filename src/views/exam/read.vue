<template>
  <div class="app-container">
    <!-- filter -->
    <div class="filter-container">
      <el-input
        v-model="filters"
        prefix-icon="el-icon-search"
        placeholder="学生名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        style="margin-left: 20px"
        type="primary"
        icon="el-icon-search"
        size="small"
        round
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="filterList"
      element-loading-text="Loading"
      key="id"
      fit
      style="width: 100%"
      highlight-current-row
    >
      <el-table-column align="center" label="姓名" prop="studentName" />
      <el-table-column align="center" label="分数" prop="score" />
      <el-table-column align="center" label="批阅时间">
        <template slot-scope="{ row }"> {{ row.readTime || "---" }} </template>
      </el-table-column>
      <el-table-column align="center" label="批阅人">
        <template slot-scope="{ row }"> {{ row.readName || "---" }} </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="{ row }">
          <el-tag type="success" v-if="row.state == 1">已批阅</el-tag>
          <el-tag type="danger" v-else>未批阅</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="read(row)"> 批阅 </el-button>
          <el-button type="text" @click="back(row.paperId, row.studentId)">
            打回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listStudentExamById, removeExamById } from "@/api/edu/exam";
export default {
  name: "ReadPaper",
  data() {
    return {
      paperId: undefined,
      classId: undefined,
      listLoading: true,
      // 筛选条件
      filters: "",
      list: [],
      // 筛选后的数据
      filterList: [],
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.paperId) {
      this.paperId = this.$route.params.paperId;
      this.classId = this.$route.params.classId;
      this.getList();
    }
  },
  methods: {
    getList() {
      listStudentExamById(this.paperId, this.classId).then((res) => {
        this.list = res.data;
        this.filterList = this.list;
        this.listLoading = false;
      });
    },
    // 搜索
    handleFilter() {
      this.filterList = [];
      this.list.forEach((c) => {
        if (c.studentName.indexOf(this.filters) != -1) {
          this.filterList.push(c);
        }
      });
    },
    // 批阅
    read(row) {
      let info = {};
      info.id = row.id;
      info.paperId = row.paperId;
      info.studentId = row.studentId;
      info.studentName = row.studentName;
      info.classId = this.classId;
      this.$router.push({
        path: `/exam/check/${JSON.stringify(info)}`,
      });
    },
    // 打回
    back(paperId, studentId) {
      removeExamById(paperId, studentId).then((res) => {
        if (res) {
          this.$message.success("打回成功");
          this.getList();
        }
      });
    },
  },
};
</script>

<style>
</style>