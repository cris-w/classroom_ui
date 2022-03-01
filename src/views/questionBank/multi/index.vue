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

    <!-- 题目列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="">
              <li
                v-for="item in row.options"
                :key="item.id"
                style="list-style: upper-alpha"
              >
                {{ item.option }}
              </li>
            </el-form-item>
            <el-form-item label="答案">
              <div>{{ row.answer }}</div>
            </el-form-item>
            <el-form-item label="知识点：">
              <el-tag
                type="success"
                v-for="item in row.knowledgePoints"
                :key="item.id"
              >
                {{ item.title }}
              </el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="45" />
      <el-table-column label="题目" prop="title" align="center" />

      <el-table-column label="难度" prop="level" align="center">
        <template slot-scope="{ row }">
          <el-tag v-if="row.level === 0" type="info">简单</el-tag>
          <el-tag v-else-if="row.level === 1" type="success">中等</el-tag>
          <el-tag v-else-if="row.level === 2" type="warning">困难</el-tag>
        </template>
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

    <!-- 题目详情展示 -->
    <el-dialog
      :title="textMap[this.dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="80px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="题目" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-checkbox-group v-model="answer">
          <el-form-item v-for="(domain, index) in wordListUsed" :key="index">
            <div style="display: flex; justify-content: flex-left">
              <el-checkbox-button :label="domain"></el-checkbox-button>
              <el-input v-model="temp.optionValue[domain]" @input="onInput()" />
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </div>
          </el-form-item>
        </el-checkbox-group>
        <el-form-item>
          <el-button type="info" circle @click="addOption"> + </el-button>
        </el-form-item>
        <el-form-item label="难度" prop="level">
          <el-radio-group v-model="temp.level">
            <el-radio :label="0">简单</el-radio>
            <el-radio :label="1">中等</el-radio>
            <el-radio :label="2">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="知识点">
          <el-cascader
            placeholder="试试搜索：Java"
            :options="options"
            :props="{
              multiple: true,
              value: 'id',
              label: 'title',
              checkStrictly: true,
            }"
            filterable
            v-model="selectedIds"
            @change="getKnowledgeList"
          ></el-cascader>
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
import waves from "@/directive/waves"; // waves directive
import {
  getQuestionList,
  deleteById,
  getKnowledgePointList,
  saveQuestion,
  getQuestionById,
  updateQuestion,
} from "@/api/edu/exam";
import { stringify } from "qs";
export default {
  name: "MultiChoice",
  directives: { waves },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: {
        title: "",
        type: 1,
      },
      temp: {
        title: "",
        answer: "",
        type: 1,
        level: undefined,
        options: [],
        knowledgePoints: [],
        // 选项对应的值
        optionValue: {
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
        },
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
      },
      // el-cascader 绑定的知识点
      options: [],
      wordListUsed: ["A", "B", "C", "D"],
      woedList: ["E", "F", "G"],
      selectedIds: [],
      // 多选绑定的答案
      answer: [],
      rules: {
        title: [{ required: true, message: "请输入题目", trigger: "blur" }],
        level: [{ required: true, message: "请选择难度", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getKnowledgePointList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getQuestionList(this.listQuery).then((res) => {
        const { data } = res;
        this.list = data;
        this.listLoading = false;
      });
    },
    getKnowledgePointList() {
      getKnowledgePointList().then((res) => {
        let arr = this.deleteChildren(res.data);
        this.options = arr;
      });
    },
    // 解决bug：删除知识点列表中空的children[]字段
    deleteChildren(array) {
      array.forEach((arr) => {
        if (arr.children.length > 0) {
          this.deleteChildren(arr.children);
        } else {
          delete arr.children;
        }
      });
      return array;
    },
    getKnowledgeList(value) {
      let points = [];
      value.forEach((val) => {
        points.push(val[val.length - 1]);
      });
      this.temp.knowledgePoints = points;
    },
    handleFilter() {
      this.getList();
    },
    // 重置dialog
    resetTemp() {
      this.temp = {
        title: "",
        answer: "",
        type: 1,
        level: undefined,
        options: [],
        knowledgePoints: [],
        optionValue: {
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
        },
      };
      this.selectedIds = [];
      this.answer = [];
      this.wordListUsed = ["A", "B", "C", "D"];
      this.woedList = ["E", "F", "G"];
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
          if (this.answer === []) {
            this.$message.error("请选择正确答案");
          } else {
            this.temp.options = this.filterOptionValue(this.temp.optionValue);
            this.temp.answer = this.answerArrToStr(this.answer);
            saveQuestion(this.temp).then((res) => {
              if (res) {
                this.dialogFormVisible = false;
                this.$notify({
                  title: "Success",
                  message: "创建成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
              }
            });
          }
        }
      });
    },
    handleUpdate(id) {
      this.resetTemp();
      getQuestionById(id).then((res) => {
        if (res) {
          const { data } = res;
          this.temp.id = id;
          this.temp.title = data.title;
          this.answer = this.answerStrToArr(data.answer);
          this.temp.type = data.type;
          this.temp.level = data.level;
          this.setOptionValue(data.options);
          if (data.knowledgePoints != null) {
            // FIXME 此处有bug 无法回显超过两层的知识点，因为el-cascader绑定的值要显示完整的id路径。
            this.selectedIds = data.knowledgePoints.map((point) => {
              if (point.parentId != 0) {
                return new Array(point.parentId, point.id);
              }
              return new Array([point.id]);
            });
            this.temp.knowledgePoints = data.knowledgePoints.map(
              (point) => point.id
            );
          }
          this.dialogStatus = "update";
          this.dialogFormVisible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.answer === []) {
            this.$message.error("请选择正确答案");
          } else {
            this.temp.options = this.filterOptionValue(this.temp.optionValue);
            this.temp.answer = this.answerArrToStr(this.answer);
            updateQuestion(this.temp).then((res) => {
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
        }
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteById(id).then((res) => {
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
    // 将答案数组转为字符串,并排序
    answerArrToStr(arr) {
      let answer = "";
      arr.sort();
      arr.forEach((a) => {
        answer = answer + a;
      });
      return answer;
    },
    // 将答案字符串转为数组
    answerStrToArr(str) {
      return str.split("");
    },
    // 过滤选项结果对象中不为空的值，并转为String数组
    filterOptionValue(obj) {
      let values = [];
      Object.values(obj).forEach((val) => {
        if (val != "") {
          values.push(val);
        }
      });
      return values;
    },
    // 添加选项
    addOption() {
      if (this.woedList.length <= 0) {
        this.$message.warning("最多添加7个选项");
        return;
      }
      this.wordListUsed.push(this.woedList.shift());
    },
    // 删除选项
    removeDomain(domain) {
      // 清除答案
      this.temp.answer = undefined;
      if (this.wordListUsed.length <= 2) {
        this.$message.warning("至少保留两个选项");
        return;
      }
      // 将option 置空
      this.temp.optionValue[domain] = "";
      this.woedList.unshift(this.wordListUsed.pop());

      // 取出所有的选项，置空选项值，再重新按顺序放入
      let values = [];
      Object.values(this.temp.optionValue).forEach((val) => {
        if (val != "") {
          values.push(val);
        }
      });
      this.temp.optionValue = {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        G: "",
      };
      let flag = 0;
      values.forEach((val) => {
        this.temp.optionValue[this.wordListUsed[flag]] = val;
        flag++;
      });
    },
    // 将通过id获取的options转化为optionValue对象。
    setOptionValue(arr) {
      let len = arr.length;
      if (len < 4) {
        for (let i = 0; i < 4 - len; i++) {
          this.woedList.unshift(this.wordListUsed.pop());
        }
      }
      if (len > 4) {
        for (let i = 0; i < len - 4; i++) {
          this.wordListUsed.push(this.woedList.shift());
        }
      }
      let flag = 0;
      arr.forEach((val) => {
        this.temp.optionValue[this.wordListUsed[flag]] = val.option;
        flag++;
      });
    },
    // 解决input框无法输入的问题
    onInput() {
      this.$forceUpdate();
    },
  },
};
</script>

<style>
</style>