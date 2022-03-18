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
        style="margin-left: 10px"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加班级
      </el-button>
    </div>

    <!-- 班级列表 -->
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="班级名称" prop="title" align="center">
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
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
import { getClassList, deleteClass } from "@/api/edu/class";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "ClassTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: false,
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
    getList(flag = false) {
      this.listLoading = true;
      getClassList(this.listQuery).then((res) => {
        const { data } = res;
        this.list = data.records;
        this.total = data.total;
        this.listQuery.size = data.size;
        this.listQuery.current = data.current;
        this.listLoading = false;
        if (flag) {
          this.$message.success("搜索成功！");
        }
      });
    },
    handleFilter() {
      this.getList(true);
    },
    handleCreate() {
      this.$router.push({ path: "/class/sava" });
    },
    handleUpdate(id) {
      this.$router.push({ path: `/class/update/${id}` });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteClass(id).then((res) => {
            if (res) {
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