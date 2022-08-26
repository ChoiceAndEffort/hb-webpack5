<template>
  <div class="report-form">
    <div class="table-title">
      <h3>产值报表</h3>
      <el-button type="primary"
        class="derive"
        @click="exportExel">导出</el-button>
    </div>
    <TableBody :data="outputTData"
      :colConfig="colConfig">
      <template #btn="{scope}">
        <el-button type="text"
          @click="viewOutput(scope.row,true)">查看产值表</el-button>
        <el-button type="text"
          @click="viewOutput(scope.row,false)">查看工费表</el-button>
      </template>
    </TableBody>
    <Pagination :data="{total: 3}"></Pagination>
  </div>
</template>

<script>
import { TableBody, Pagination } from 'gggj_lib';
import { getReportOfOutputValueByMonth, getReportOfOutputValueMxByMonth, getReportOfOutputValueByMonthExel } from '@/api/productionManagement/project'
import { outputConfig } from "@/utils/productionManagement/reportTableConfig"
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";

export default {
  components: {
    TableBody,
    Pagination
  },
  data() {
    return {
      colConfig: outputConfig.mainConfig,
      outputTData: [],
      searchData: {}
    }
  },
  created() {
    console.log("重新加载")
  },
  methods: {
    getList(val) {
      this.searchData = val;
      let params = {
        workMonth: val.workMonth,
        workYear: val.workYear,
        enterpriseId: enterpriseId,
      }
      getReportOfOutputValueByMonth(params).then((res) => {
        if (res.code == 0) {
          this.outputTData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 导出
    exportExel() {
      let params = {
        workMonth: this.searchData.workMonth,
        workYear: this.searchData.workYear,
        enterpriseId: enterpriseId,
        fileName: '产值报表'
      }
      //params是post请求需要的参数，url是请求url地址
      var form = document.createElement("form");
      form.style.display = "none";
      form.action = 'http://192.168.20.112:9099/rms/c/v1/pms/excel/export/outputValue/getReportOfOutputValueByMonth';
      form.method = "get";

      document.body.appendChild(form);
      // 动态创建input并给value赋值
      for (var key in params) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
      }
      form.submit();
      form.remove();
    },

    viewOutput(row, isOutput) {
      Object.assign(row, this.searchData)
      // 查看产值表
      if (isOutput) {
        this.$router.push({
          name: 'detail-output-table',
          query: {
            row: JSON.stringify(row)
          }
        })
      } else {
        // 查看工费表
        this.$router.push({
          name: 'wage-table',
          query: {
            row: JSON.stringify(row)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-form {
  height: calc(100% - 34px);
  padding: 20px 16px;
  background: #fff;
  margin-top: 16px;
  .table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h3 {
      color: #303133;
      font-weight: 600;
      font-size: 16px;
    }
  }
  .derive {
    padding: 9px 18px !important;
    background-color: transparent !important;
    color: #1989fa;
  }
}
</style>