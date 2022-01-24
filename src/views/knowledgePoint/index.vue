<template>
  <div class="app-container">
    <!-- 筛选款 & 添加按钮 -->
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      style="width: 200px"
    />
    <el-button type="primary" round class="addBtn" @click="openDialog"
      >添加章节</el-button
    >

    <!-- 树形结构 -->
    <el-tree
      ref="keowledgeTree"
      node-key="id"
      :data="list"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span>{{ data.title }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => handleCreate(data)">
            添加子节点
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleUpdate(data.id)"
          >
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="() => remove(data)">
            删除节点
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="知识点名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 返回 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getKnowledgePointList,
  getById,
  addKnowledgePoint,
  updateKnowledgePoint,
  delByIds,
} from "@/api/edu/exam";
export default {
  name: "KnewledgePoint",
  watch: {
    filterText(val) {
      this.$refs.keowledgeTree.filter(val);
    },
  },
  data() {
    return {
      list: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      filterText: "",
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      temp: {
        title: "",
        parentId: undefined,
      },
      rules: {
        title: [{ required: true, message: "请输入知识点名", trigger: "blur" }],
      },
      dialogFormVisible: false,
      delIds: [],
    };
  },
  created() {
    this.getKnowledgePointList();
  },
  methods: {
    // 过滤树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    // 获取知识点列表
    getKnowledgePointList() {
      getKnowledgePointList().then((res) => {
        this.list = res.data;
      });
    },
    resetTemp() {
      this.temp = {
        title: "",
        parentId: 0,
      };
    },
    // 添加父节点
    openDialog() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 添加子节点
    handleCreate(data) {
      console.log(data);
      this.resetTemp();
      this.temp.parentId = data.id;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(id) {
      getById(id).then((res) => {
        this.temp = res.data;
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    remove(data) {
      this.getChildrenIds(data);
      console.log(this.delIds);
      this.$confirm(
        "若该知识点下存在子级知识点将一并删除，确认删除？, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delByIds(this.delIds).then((res) => {
            if (res) {
              this.getKnowledgePointList();
              this.$notify({
                title: "Success",
                message: "删除成功",
                type: "success",
                duration: 2000,
              });
            }
          });
          this.delIds = [];
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          this.delIds = [];
        });
    },
    createData() {
      addKnowledgePoint(this.temp).then((res) => {
        if (res) {
          this.dialogFormVisible = false;
          this.getKnowledgePointList();
          this.$notify({
            title: "Success",
            message: "添加成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    updateData() {
      updateKnowledgePoint(this.temp).then((res) => {
        if (res) {
          this.dialogFormVisible = false;
          this.getKnowledgePointList();
          this.$notify({
            title: "Success",
            message: "更新成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    getChildrenIds(data) {
      this.delIds.push(data.id);
      if (data.children) {
        data.children.forEach((element) => {
          this.getChildrenIds(element);
        });
      }
    },
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.addBtn {
  margin-left: 50px;
}
</style>