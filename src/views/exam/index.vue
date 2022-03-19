<template>
  <div class="app-container">
    <!-- 头部 -->
    <div class="head-container">
      <el-button type="primary" icon="el-icon-edit" round @click="handleCreate">
        新建试卷
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        round
        :disabled="delbtnStatus"
        style="margin-right: auto"
        @click="handleDelete"
        >删除</el-button
      >
      <el-input
        v-model="listQuery.title"
        placeholder="试卷名"
        style="width: 250px"
        @keyup.enter.native="handleFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleFilter"
        ></el-button>
      </el-input>
    </div>

    <!-- 试卷表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
      @row-dblclick="shwoPaper"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column label="试卷" prop="title"></el-table-column>
      <el-table-column label="创建者" prop="teacherName"></el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="success" size="mini" @click="handlePublish(row)">
            发布
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row.id)"
            @dblclick.native.stop=""
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建方式 -->
    <el-dialog
      title="选择创建方式"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <div>
        <el-radio v-model="model" :label="1">手动创建试卷</el-radio>
        <el-radio v-model="model" :label="2">自动随机组卷</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPaper">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPaperList, deleteByIds } from "@/api/edu/exam";
export default {
  name: "Exam",
  data() {
    return {
      listLoading: false,
      listQuery: {
        title: "",
      },
      list: [],
      // 删除试卷列表
      delList: [],
      // 删除按钮是否禁用
      delbtnStatus: true,
      dialogFormVisible: false,
      model: 1,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(flag = false) {
      getPaperList(this.listQuery).then((res) => {
        if (res) {
          this.list = res.data;
          if (flag) {
            this.$message.success("查找成功！");
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.delList = val;
      this.delbtnStatus = val.length === 0;
    },
    handleDelete() {
      this.$confirm("此操作将永久删除试卷, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = [];
          this.delList.forEach((val) => {
            ids.push(val.id);
          });
          deleteByIds(ids).then((res) => {
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
    handlePublish(row) {
      let clazz = {};
      clazz.id = row.id;
      clazz.title = row.title;
      this.$router.push({
        path: `/exam/handlePublish/${JSON.stringify(clazz)}`,
      });
    },
    handleUpdate() {
      console.log("update");
    },
    handleFilter() {
      this.getList(true);
    },
    handleCreate() {
      this.dialogFormVisible = true;
    },
    createPaper() {
      if (this.model === 1) {
        this.$router.push({ path: "/exam/createHand" });
      } else if (this.model === 2) {
        this.$router.push({ path: "/exam/createRandom" });
      }
    },
    shwoPaper(row) {
      this.$router.push({ path: `/exam/show/${row.id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.head-container {
  display: flex;
  justify-content: space-between;
}
</style>