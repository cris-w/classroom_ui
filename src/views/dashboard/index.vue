<template>
  <div class="dashboard-container">
    <!-- 管理员及老师 -->
    <div class="dashboard-text" v-if="hasRole()">name: {{ name }}</div>

    <!-- 学生 -->
    <div v-if="!hasRole()">
      <!-- 暂无班级 -->
      <el-empty
        description="你还未加入班级 点击加入新的班级"
        v-if="classId === -1"
      >
        <el-button type="text" round @click="dialogFormVisible = true"
          >确认</el-button
        >
      </el-empty>
      <!-- 暂无课程 -->
      <el-empty
        description="暂无课程"
        v-if="classId != -1 && courseList.length === 0"
      >
      </el-empty>
      <!-- 课程列表 -->
      <div>
        <el-row>
          <el-col
            :span="7"
            v-for="(o, index) in courseList"
            :key="o.id"
            :offset="index % 3 > 0 ? 1 : 0"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              class="card"
              @click.native="toChapter(o.id)"
            >
              <div class="cover">
                <img :src="o.cover" class="image" />
              </div>
              <div class="info">
                <i>{{ o.title }}</i>
                <p>{{ o.teacherName }}</p>
                <p>{{ o.className }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 加入班级dialog -->
    <el-dialog title="加入班级" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="选择班级">
          <el-select v-model="form.classId" placeholder="请选择班级">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="join">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getClassIdByStudentId, joinClass } from "@/api/edu/class";
import { getCourseByClassId, getClassList } from "@/api/edu/course";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", "roles", "id"]),
  },
  data() {
    return {
      classId: undefined,
      courseList: [],
      dialogFormVisible: false,
      form: {
        classId: undefined,
      },
      classList: [],
    };
  },
  created() {
    if (!this.hasRole()) {
      this.getCourse();
    }
  },
  methods: {
    hasRole() {
      if (this.roles.indexOf("admin") != -1) {
        return true;
      }
      if (this.roles.indexOf("teacher") != -1) {
        return true;
      }
      return false;
    },
    getCourse() {
      getClassIdByStudentId(this.id).then((res) => {
        if (res) {
          this.classId = res.data;
          // 如果班级ID为 -1 则没有课程
          if (res.data != -1) {
            getCourseByClassId(res.data).then((res) => {
              console.log(res.data);
              this.courseList = res.data;
            });
          } else {
            this.getClass();
          }
        }
      });
    },
    getClass() {
      getClassList().then((res) => {
        if (res) {
          this.classList = res.data;
          console.log(this.classList);
        }
      });
    },
    join() {
      if (!this.form.classId) {
        this.$message.warning("请选择班级");
      } else {
        this.form.studentId = this.id;
        joinClass(this.form).then((res) => {
          if (res) {
            this.$message.success(res.msg);
            this.dialogFormVisible = false;
            setTimeout(() => {
              this.getCourse();
            }, 1500);
          }
        });
      }
    },
    toChapter(id) {
      this.$router.push({ path: `student/chapter/${id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.card {
  cursor: pointer;
  &:hover .info i {
    color: skyblue;
  }
  .cover {
    height: 200px;
    padding: 10px;
    background-size: contain;
    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
    .image {
      width: 100%;
      max-height: 100%;
      display: block;
      margin: auto;
    }
  }
  .info {
    padding: 14px;
    i {
      font-style: normal;
      color: #131b26;
      font-size: 16px;
      font-weight: bold;
    }
    p {
      margin-top: 8px;
      font-size: 12px;
      color: #8a8b99;
    }
  }
}
</style>
