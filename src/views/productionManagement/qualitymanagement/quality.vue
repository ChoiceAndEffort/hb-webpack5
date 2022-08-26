<!-- 质量检验 -->
<template>
  <div class="quality">
    <quality-check checkType="check"></quality-check>
  </div>
</template>

<script>
//引入组件
import qualityCheck from "./quality-check.vue"
export default {
  //注册组件
  components: {
    qualityCheck
  },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    handleClick() {
    },
  }
};
</script>

<style scoped lang="scss">
.quality {
  height: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  .tab {
    height: 100%;
    padding: 16px 16px;
    box-sizing: border-box;
  }
  ::v-deep .el-tabs__header {
      margin: 0;
    }
}
</style>
