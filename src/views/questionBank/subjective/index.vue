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
          <el-tag v-else-if="row.level === 2" type="success">困难</el-tag>
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getQuestionList, getKnowledgePointList } from "@/api/edu/exam";
export default {
  name: "SubjectiveQuestion",
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
        type: 0,
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
      options: [],
      wordListUsed: ["A", "B", "C", "D"],
      woedList: ["E", "F", "G"],
      selectedIds: [],
      rules: {
        title: [{ required: true, message: "请输入题目", trigger: "blur" }],
        level: [{ required: true, message: "请选择难度", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleFilter() {},
    handleCreate() {},
  },
};
</script>

<style>
</style>