<template>
  <div class="wrap">
    <!-- 日期查询搜索框区域 -->
    <data-search :currentDate="currentDate"
      :radioCheck="radioCheck"
      @changeTab="changeTab"
      @searchClick="searchClick"></data-search>
    <!-- 图形表区域 -->
    <output-graphic v-show="radioCheck == '图形表'"
      ref="graphic"
      :searchData="searchData"></output-graphic>
    <!-- 报表区域 -->
    <output-form v-show="radioCheck == '报表'"
      ref="reportForms"
      :date="currentDate"></output-form>
  </div>
</template>
<script>
import dataSearch from './date-search.vue'
import outputGraphic from './output-graphic.vue'
import outputForm from './output-form.vue'
import { timeFormat, monthTime, shortTime, monthDayTime, yearTime, getMonth } from "@/utils/productionManagement/tool"
export default {
  components: {
    dataSearch,
    outputGraphic,
    outputForm
  },
  data() {
    return {
      radioCheck: "图形表",
      currentDate: shortTime(monthTime(new Date())),
      searchData: {}
    }
  },
  mounted() {
    let obj = JSON.parse(localStorage.getItem("backData"))
    console.log(obj, "obj")
    if (obj) {
      if (obj.isReport) {
        this.radioCheck = "报表";
        this.currentDate = obj.date;
        localStorage.removeItem("backData")
      }
    }
    this.searchData = {
      workYear: Number(yearTime(this.currentDate)),
      workMonth: Number(getMonth(this.currentDate))
    }
    if (this.radioCheck == '图形表') {
      this.$refs.graphic.getList(this.searchData)
    } else {
      this.$refs.reportForms.getList(this.searchData);
    }
  },
  methods: {
    // 图形图标切换
    changeTab(v) {
      this.radioCheck = v
      if (v == '图形表') {
        this.$refs.graphic.getList(this.searchData)
      } else {
        this.$refs.reportForms.getList(this.searchData)
      }
    },
    // 确定click
    searchClick(val) {
      this.searchData = {
        workYear: Number(yearTime(val)),
        workMonth: Number(getMonth(val))
      }
      if (this.radioCheck == "报表") {
        this.$refs.reportForms.getList(this.searchData)
      } else {
        // this.getEnterpriseOutput()
        this.$refs.graphic.getList(this.searchData)
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 16px 16px 16px 6px;
}

::v-deep .el-table th.el-table__cell > .cell {
  color: #303133 !important;
  font-weight: 700 !important;
}
::v-deep .table-header-gray {
  background-color: #f5f7fa !important;
}
</style>
