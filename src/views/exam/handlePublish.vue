<template>
  <div class="app-container handlePublish">
    <el-card class="handlePublish__card">
      <h3 style="text-align: center">{{ temp.paperTitle }}</h3>
      <el-form
        ref="form"
        :model="temp"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="发放对象">
          <div style="display: flex; flex-wrap: wrap; max-width: 300px">
            <el-tag
              v-for="(item, value) in chooseClass"
              :key="value"
              :closable="true"
              @close="closeTag(item)"
              style="margin-right: 5px; margin-bottom: 5px"
              >{{ item }}</el-tag
            >
          </div>

          <el-button type="primary" round @click="dialogFormVisible = true"
            >+添加
          </el-button>
        </el-form-item>
        <el-form-item label="发放时间" prop="timeStart">
          <el-date-picker
            v-model="temp.timeStart"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="截止时间" prop="timeEnd">
          <el-date-picker
            v-model="temp.timeEnd"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="考试限时">
          <el-input-number
            v-model="temp.timeLimit"
            controls-position="right"
            :min="1"
            :max="120"
          >
          </el-input-number>
          分钟
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')"
            >立即发布</el-button
          >
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="选择发放班级"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-tree
        ref="class"
        :data="data"
        :props="props"
        show-checkbox
        @check-change="getClassChecked"
        node-key="id"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getClassList } from "@/api/edu/course";
import { publishPaper, listClassIdsByPaperId } from "@/api/edu/exam";
export default {
  name: "handlePublish",
  data() {
    return {
      temp: {
        paperId: undefined,
        paperTitle: "",
        timeStart: "",
        timeEnd: "",
        timeLimit: "",
        classIds: [],
      },
      dialogFormVisible: false,
      rules: {
        timeStart: [
          {
            type: "string",
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        timeEnd: [
          {
            type: "string",
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
      },
      props: {
        label: "title",
      },
      // 班级
      data: [],
      // 已选班级名称
      chooseClass: [],
    };
  },
  created() {
    // 获取路由中的ID
    if (this.$route.params && this.$route.params.row) {
      let clazz = JSON.parse(this.$route.params.row);
      this.temp.paperId = clazz.id;
      this.temp.paperTitle = clazz.title;
    }
    this.getClassList();
  },
  methods: {
    getClassList() {
      getClassList().then((res) => {
        this.data = res.data;
        this.disablePublishedClassIds();
      });
    },
    // 禁用已发布的班级ID
    disablePublishedClassIds() {
      listClassIdsByPaperId(this.temp.paperId).then((res) => {
        let { data } = res;
        if (data) {
          this.data.forEach((d) => {
            if (data.indexOf(d.id) != -1) {
              d.disabled = true;
            }
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.temp.classIds.length == 0) {
            this.$message.warning("请至少选择一个班级发布");
          } else {
            publishPaper(this.temp).then((res) => {
              if (res) {
                this.$message.success("发布成功");
                setTimeout(() => {
                  this.$router.push({ path: "/exam/publish" });
                }, 1500);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getClassChecked() {
      this.temp.classIds = this.$refs.class.getCheckedKeys();
      this.chooseClass = [];
      this.data.forEach((item) => {
        if (this.temp.classIds.includes(item.id)) {
          this.chooseClass.push(item.title);
        }
      });
    },
    // TODO
    closeTag(tag) {
      this.chooseClass.splice(this.chooseClass.indexOf(tag), 1);
    },
  },
};
</script>

<style lang="scss">
.handlePublish {
  height: 620px;
  .el-card {
    height: 100%;
  }
}
</style>
<style scoped lang="scss">
.handlePublish {
  h3 {
    font-size: 30px;
  }
  .handlePublish__card {
    display: flex;
    justify-content: center;
    .el-input {
      width: 220px;
      margin-right: 10px;
    }
    .el-table {
      margin-top: 20px;
    }
  }
}
</style>