<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
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
        @click="handleFilter()"
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
        新增用户
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
      <el-table-column label="头像" prop="avatar" align="center" width="50px">
        <template slot-scope="{ row }">
          <el-avatar size="small" :src="row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        prop="username"
        align="center"
        width="100px"
      >
      </el-table-column>
      <el-table-column label="角色名称" prop="name" align="center">
        <template slot-scope="{ row }">
          <el-tag
            size="small"
            type="warn"
            v-for="item in row.roleList"
            :key="item.id"
          >
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
      </el-table-column>
      <el-table-column label="城市" prop="city" align="center" width="100px">
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
        width="350"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="success" size="mini" @click="handlePerm(row.id)">
            分配角色
          </el-button>
          <el-button type="warning" size="mini" @click="repass(row)">
            重置密码
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

    <!-- 添加用户表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="temp.city" />
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

    <!-- 角色表单 -->
    <el-dialog title="分配权限" :visible.sync="permDialogFormVisible">
      <el-form :model="permForm">
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
  getUserList,
  getRoleList,
  createUser,
  getUserInfo,
  editUser,
  deleteUser,
  rolePerm,
  repass,
} from "@/api/system";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "UserTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      delbtnStatus: true,
      listQuery: {
        current: 1,
        size: 10,
        username: "",
      },
      statusOptions: ["禁用", "正常"],
      temp: {
        id: undefined,
        username: "",
        email: "",
        city: "",
        statu: undefined,
      },
      dialogFormVisible: false,
      permDialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建用户",
      },
      // 存放多选数据的id
      multipleSelection: [],
      // 权限表单
      permForm: {},
      // 权限树
      permTreeData: [],
      userId: 0,
      defaultTreeProps: {
        children: "children",
        label: "name",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        statu: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getRoleList();
  },
  methods: {
    getList(flag = false) {
      this.listLoading = true;
      getUserList(this.listQuery).then((response) => {
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
    getRoleList() {
      getRoleList().then((res) => {
        const { data } = res;
        this.permTreeData = data.records;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delbtnStatus = val.length === 0;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: "",
        email: "",
        city: "",
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
          createUser(this.temp).then((res) => {
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
      getUserInfo(id).then((response) => {
        const { data } = response;
        this.temp.id = id;
        this.temp.username = data.username;
        this.temp.email = data.email;
        this.temp.city = data.city;
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
          editUser(this.temp).then((res) => {
            if (res) {
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
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(ids).then((res) => {
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
    handlePerm(id) {
      getUserInfo(id).then((response) => {
        this.userId = id;
        const { data } = response;
        let roleIds = [];
        data.roleList.forEach((role) => {
          roleIds.push(role.id);
        });
        this.$refs.permTree.setCheckedKeys(roleIds);
        this.permForm = data;
      });
      this.permDialogFormVisible = true;
    },
    perm() {
      let roleIds = this.$refs.permTree.getCheckedKeys();
      rolePerm(this.userId, roleIds).then((res) => {
        if (res.code == 200) {
          this.getList();
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
    repass(row) {
      this.$confirm(`确认要重置【${row.username}】的密码吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          repass(row.id).then(() => {
            this.getList();
            this.$notify({
              title: "Success",
              message: "重置成功",
              type: "success",
              duration: 2000,
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置密码",
          });
        });
    },
  },
};
</script>
