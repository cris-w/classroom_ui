<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group />

    <el-row
      style="background: #fff; padding: 16px 16px 0; margin-bottom: 100px"
    >
      近7天学生学习情况情况
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import { getVideoView } from "@/api/count";

export default {
  name: "DashboardAdmin",
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      lineChartData: {},
    };
  },
  created() {
    this.getVideoView();
  },

  methods: {
    getVideoView() {
      getVideoView().then((res) => {
        if (res) {
          this.lineChartData = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
