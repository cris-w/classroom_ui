<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
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
        style="margin-left: 10px"
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
        新增角色
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="danger"
        icon="el-icon-delete"
        :disabled="delbtnStatus"
        @click="handleDelete(null)"
      >
        统一删除
      </el-button>
    </div>

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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" prop="name" align="center" width="150px">
      </el-table-column>
      <el-table-column
        label="唯一编码"
        prop="code"
        align="center"
        width="150px"
      >
      </el-table-column>
      <el-table-column label="描述" prop="remark" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="statu" width="80px" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.statu === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="success" size="mini" @click="handlePerm(row.id)">
            分配权限
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
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

    <!-- 添加角色表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="唯一编码" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="temp.remark" />
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

    <!-- 权限表单 -->
    <el-dialog title="分配权限" :visible.sync="permDialogFormVisible">
      <el-form :model="permForm" style="height: 350px; overflow-y: scroll">
        <el-tree
          :data="permTreeData"
          ref="permTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :check-strictly="true"
          :props="defaultTreeProps"
        >
        </el-tree>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permDialogFormVisible = false"> 返回 </el-button>
        <el-button type="primary" @click="perm"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getMenuList,
  createRole,
  getRoleInfo,
  editRole,
  deleteRole,
  permRole,
} from "@/api/system";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "RoleTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      delbtnStatus: true,
      listQuery: {
        current: 1,
        size: 10,
        name: "",
      },
      statusOptions: ["禁用", "正常"],
      temp: {
        id: undefined,
        name: "",
        code: "",
        remark: "",
        statu: undefined,
      },
      dialogFormVisible: false,
      permDialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建权限",
      },
      // 存放多选数据的id
      multipleSelection: [],
      // 权限表单
      permForm: {},
      // 权限树
      permTreeData: [],
      roleId: 0,
      defaultTreeProps: {
        children: "children",
        label: "name",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入唯一编码", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getMenuList();
  },
  methods: {
    getList(flag = false) {
      this.listLoading = true;
      getRoleList(this.listQuery).then((response) => {
        const { data } = response;
        this.list = data.records;
        this.total = data.total;
        this.listQuery.size = data.size;
        this.listQuery.current = data.current;
        this.listLoading = false;
        if (flag) {
          this.$message.success("查找成功！");
        }
      });
    },
    getMenuList() {
      getMenuList().then((res) => {
        const { data } = res;
        this.permTreeData = data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delbtnStatus = val.length === 0;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        code: "",
        remark: "",
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
          createRole(this.temp).then((res) => {
            if (res.code === 200) {
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
    handleFilter() {
      this.getList(true);
    },
    handleUpdate(id) {
      this.resetTemp();
      getRoleInfo(id).then((response) => {
        const { data } = response;
        this.temp.id = id;
        this.temp.remark = data.remark;
        this.temp.name = data.name;
        this.temp.code = data.code;
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
          editRole(this.temp).then((res) => {
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
      let ids = [];
      // 判断传入的row是否为null，如果为null则代表批量删除
      if (row) {
        ids.push(row.id);
      } else {
        this.multipleSelection.forEach((row) => {
          ids.push(row.id);
        });
      }
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRole(ids).then(() => {
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
    handlePerm(id) {
      getRoleInfo(id).then((response) => {
        this.roleId = id;
        const { data } = response;
        this.$refs.permTree.setCheckedKeys(data.menuIds);
        this.permForm = data;
      });
      this.permDialogFormVisible = true;
    },
    perm() {
      let menuIds = this.$refs.permTree.getCheckedKeys();
      permRole(this.roleId, menuIds).then((res) => {
        if (res.code == 200) {
          this.permDialogFormVisible = false;
          this.$notify({
            title: "Success",
            message: "更新成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>
