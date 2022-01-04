<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="user.avatar"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        >
          <el-button
            type="primary"
            size="mini"
            style="margin: 18px -20px"
            @click="imagecropperShow = true"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ temp.username }}</div>
        <div class="user-role text-center text-muted">
          {{ temp.role }}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" /><span>Education</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="skill" /><span>Skills</span>
        </div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>

      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        :url="BASE_API + 'oos/fileOos/upload'"
        field="file"
        lang-type="en"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
    </div>
  </el-card>
</template>

<script>
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
import { editAvatar } from "@/api/system";

export default {
  components: { PanThumb, ImageCropper },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API,
      temp: this.user,
      bo: {
        username: "",
        avatar: "",
      },
    };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: "",
          email: "",
          avatar: "",
          role: "",
        };
      },
    },
  },
  methods: {
    cropSuccess(res) {
      this.imagecropperKey = this.imagecropperKey + 1;
      this.temp.avatar = res;
      this.bo.username = this.user.username;
      this.bo.avatar = res;
      editAvatar(this.bo).then((res) => {
        if (res.code === 200) {
          this.$store.commit("user/SET_AVATAR", this.temp.avatar);
          this.imagecropperShow = false;
          this.$notify({
            title: "Success",
            message: "上传成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    close() {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
