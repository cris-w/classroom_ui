<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%"
    >
      <el-table-column label="名称" prop="name" align="left" width="150px">
      </el-table-column>
      <el-table-column
        label="权限编码"
        prop="perms"
        width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="图标"
        prop="icon"
        min-width="150px"
        align="center"
      >
      </el-table-column>
      <el-table-column label="类型" prop="type" min-width="80px" align="center">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 1" type="success"
            >菜单</el-tag
          >
          <el-tag size="small" v-else-if="scope.row.type === 2" type="info"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="菜单URL"
        prop="path"
        min-width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="菜单组件"
        prop="component"
        min-width="120px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="排序号"
        prop="orderNum"
        min-width="50px"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="statu"
        min-width="80px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            Edit
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-select
            v-model="temp.parentId"
            class="filter-item"
            placeholder="请选择上级菜单"
          >
            <template v-for="item in list">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
              <template v-for="child in item.children">
                <el-option
                  :key="child.id"
                  :label="child.name"
                  :value="child.id"
                >
                  <span>{{ "- " + child.name }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="权限编码" prop="perms">
          <el-input v-model="temp.perms" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单URL" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="菜单组件" prop="component">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="状态" prop="statu">
          <el-select
            v-model="temp.statu"
            class="filter-item"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item === '禁用' ? 0 : 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input-number v-model="temp.orderNum" :min="1" label="排序号" />
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
  getMenuList,
  createMenu,
  getMenuInfo,
  editMenu,
  deleteMenu,
} from "@/api/system";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "MenuTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      statusOptions: ["禁用", "正常"],
      temp: {
        id: undefined,
        parentId: undefined,
        name: "",
        perms: "",
        icon: "",
        type: 0,
        path: "",
        component: "",
        orderNum: "",
        statu: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      rules: {
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        perms: [{ required: true, message: "请输入权限编码", trigger: "blur" }],
        type: [{ required: true, message: "请选择状态", trigger: "blur" }],
        orderNum: [
          { required: true, message: "请填入排序号", trigger: "blur" },
        ],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getMenuList().then((response) => {
        this.list = response.data;
        this.listLoading = false;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        parentId: undefined,
        name: "",
        perms: "",
        icon: "",
        type: 0,
        path: "",
        component: "",
        orderNum: "",
        statu: undefined,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createMenu(this.temp).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "Success",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleUpdate(id) {
      this.resetTemp();
      getMenuInfo(id).then((response) => {
        const { data } = response;
        this.temp.id = id;
        this.temp.parentId = data.parentId;
        this.temp.name = data.name;
        this.temp.perms = data.perms;
        this.temp.icon = data.icon;
        this.temp.type = data.type;
        this.temp.path = data.path;
        this.temp.component = data.component;
        this.temp.orderNum = data.orderNum;
        this.temp.statu = data.statu;
      });
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          editMenu(this.temp).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: "Success",
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
            }
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMenu(row.id).then(() => {
            this.getList();
            this.$notify({
              title: "Success",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
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
