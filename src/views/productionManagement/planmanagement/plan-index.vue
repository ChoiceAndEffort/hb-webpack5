<!--计划管理-->
<template>
  <div class="main">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="单项目准备计划" name="first">
        <single-plan></single-plan>
      </el-tab-pane>
      <el-tab-pane label="单项目准备计划汇总审批" name="second"
        ><single-total></single-total
      ></el-tab-pane>
      <el-tab-pane label="月度计划分解执行人" name="third">
        <plan-executor></plan-executor>
      </el-tab-pane>
      <el-tab-pane label="待完成准备计划" name="three">
        <preparation-plan></preparation-plan>
      </el-tab-pane>
      <el-tab-pane label="月度计划完成情况" name="four"
        ><completion-month></completion-month
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
/* 单项目准备计划 */
import singlePlan from "./components/singlePlan.vue";
/* 单项目准备计划汇总审批 */
import singleTotal from "./components/singleTotal.vue";
/* 月度计划分解执行人 */
import planExecutor from "./components/planExecutor.vue";
/* 待完成准备计划 */
import preparationPlan from "./components/preparationPlan.vue";
/* 月度计划完成情况 */
import completionMonth from "./components/completionMonth.vue";
export default {
  components: {
    singlePlan,
    singleTotal,
    planExecutor,
    preparationPlan,
    completionMonth,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  mounted() {},
  methods: {
    /* 点击切换 */
    handleClick(tab, event) {
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  background-color: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  ::v-deep .el-tab-pane {
    .main {
      padding: 0;
      box-sizing: border-box;
    }
  }
}
</style>
