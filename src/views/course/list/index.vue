<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="封面" prop="cover" align="center" width="80px">
        <template slot-scope="{ row }">
          <el-avatar
            shape="square"
            :size="50"
            fit="cover"
            :src="row.cover"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="课程名称"
        prop="title"
        align="center"
        width="250px"
      >
      </el-table-column>
      <el-table-column
        label="课时数"
        prop="lessonNum"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="参加人数"
        prop="joinCount"
        width="100px"
        align="center"
      >
      </el-table-column>
      <el-table-column label="状态" prop="statu" width="120px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">已发布</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="danger"
            >未发布</el-tag
          >
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleCourse(row.id)">
            编辑课程信息
          </el-button>
          <el-button type="primary" size="mini" @click="handleChapter(row)">
            编辑大纲信息
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCourseList, deleteCourse } from "@/api/edu/course";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "CourseTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        title: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取课程列表
    getList() {
      this.loading = true;
      getCourseList(this.listQuery)
        .then((res) => {
          const { data } = res;
          this.list = data.records;
          this.total = data.total;
          this.listQuery.size = data.size;
          this.listQuery.current = data.current;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 搜索
    handleFilter() {
      this.getList();
    },
    handleCourse(data) {
      console.log(data);
    },
    handleChapter(data) {
      console.log(data);
    },
    handleDelete(courseId) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCourse(courseId).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.$notify({
                title: "Success",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
</style>