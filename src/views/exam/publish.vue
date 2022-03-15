<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="header">
        <el-select
          v-model="listQuery.classId"
          clearable
          placeholder="请选择班级"
          @change="handleFilter"
        >
          <el-option
            v-for="item in clazz"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="试卷名"
          suffix-icon="el-icon-search"
          style="width: 200px"
          @keyup.enter.native="handleFilter"
        />
      </div>
    </div>

    <el-empty :image-size="200" v-if="list.length == 0"></el-empty>
    <!-- table -->
    <div class="content" v-for="item in list" :key="item.id">
      <div class="left" @click="toDetail(item.paperId)">
        <div class="top">
          <h2 class="title">{{ item.paperTitle }}</h2>
        </div>
        <div class="clazz">
          <i class="el-icon-user"></i>
          {{ item.className }}
        </div>
        <div class="time">
          <i class="el-icon-alarm-clock"> </i>
          考试时间：{{ item.timeStart }} 至 {{ item.timeEnd }}
        </div>
      </div>
      <div class="del">
        <div class="bt">
          <el-button type="text" round @click="delPub(item.id)">删除</el-button>
        </div>
      </div>
      <div class="nums">
        <p class="piyue">
          <span> <em class="wait">0</em> / 1 </span>
          待批阅
        </p>
      </div>
      <div class="option">
        <el-button type="primary" round @click="read(item.id)">批阅</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassList } from "@/api/edu/course";
import {
  listPublishExam,
  deletePublishById,
  listStudentExam,
} from "@/api/edu/exam";
export default {
  name: "PublishExam",
  data() {
    return {
      clazz: [],
      listQuery: {
        title: "",
        classId: undefined,
      },
      list: [],
      studentExams: [],
    };
  },
  created() {
    this.getClassList();
    this.getList();
  },
  methods: {
    // 获取试卷信息
    getList() {
      listPublishExam(this.listQuery).then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    // 获取学生考试记录
    getStudentExam() {
      listStudentExam().then((res) => {
        if (res) {
          this.studentExams = res.data;
        }
      });
    },
    // 获取班级信息
    getClassList() {
      getClassList().then((res) => {
        this.clazz = res.data;
      });
    },
    handleFilter() {
      this.getList();
    },
    delPub(id) {
      this.$confirm("此操作将永久删除该试卷, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePublishById(id).then((res) => {
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
    // 查看试卷详情
    toDetail(id) {
      this.$router.push({ path: `/exam/show/${id}` });
    },
    // 批阅
    read(id) {
      console.log(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  padding: 20px 10px;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover .del > .bt {
    display: block;
  }
  .left {
    width: 50%;
    float: left;
    &:hover {
      color: red;
    }
    .top {
      max-width: 100%;
      position: relative;
      min-height: 22px;
      margin-bottom: 6px;
      .title {
        font-size: 16px;
        line-height: 22px;
        max-width: 81%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .clazz {
      max-width: 100%;
      line-height: 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 10px;
      font-size: 14px;
      color: #8a8b99;
    }
    .time {
      line-height: 17px;
      margin-top: 10px;
      font-size: 14px;
      color: #8a8b99;
    }
  }
  .del {
    width: 20%;
    text-align: right;
    .bt {
      display: none;
    }
  }
  .nums {
    width: 15%;
    height: 100%;
    position: relative;
    .piyue {
      text-align: right;
      font-size: 14px;
      color: #a8a8b3;
      margin-right: 10px;
      .wait {
        font-size: 28px;
        color: #4a4a4a;
        font-weight: bold;
        font-style: normal;
      }
    }
  }
}
</style>