<template>
  <div class="wage-table">
    <div>
      <h4>{{searchData.plantAreaName}}-{{searchData.workshopName}}{{searchData.workMonth}}月工费表</h4>
      <el-button type="primary"
        @click="backTo">返回</el-button>
    </div>

    <TableBody show-summary
      :summary-method="getSummaries"
      :data="tableData"
      :colConfig="colConfig">
      <template #btn="{scope}">
        <el-button type="text"
          @click="viewOutput(scope.row)">清单明细</el-button>
      </template>
    </TableBody>
    <Pagination :data="{total: 3}"></Pagination>
  </div>
</template>

<script>
import { TableBody, Pagination } from 'gggj_lib';
import { getReportOfOutputValueMxByMonth } from '@/api/productionManagement/project'
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
export default {
  components: {
    TableBody,
    Pagination
  },
  data() {
    return {
      colConfig: [
        { attrs: { label: "序号", 'min-width': '25%', type: "index", width: "50" } },
        { attrs: { label: "项目名称", 'min-width': '40%', prop: "projectName" } },
        { attrs: { label: "联段名称", 'min-width': '40%', prop: "couplingName" } },
        { attrs: { label: "工序", 'min-width': '25%', prop: "superiorWorkingProcedureName" } },
        { attrs: { label: "子工序", 'min-width': '25%', prop: "workingProcedureName" } },
        { attrs: { label: "工艺", 'min-width': '25%', prop: "processName" } },
        { attrs: { label: "总工费（元）", 'min-width': '25%', prop: "planedWorkLaborCost" } },
        { attrs: { label: "当月工费（元）", 'min-width': '25%', prop: "monthWorkLaborCost" } },
        { attrs: { label: "累计工费（元）", 'min-width': '25%', prop: "addUpWorkLaborCost" } },
        { slot: "btn", attrs: { label: "操作", align: "center", width: "100px", fixed: "right" }, },
      ],
      tableData: [],
      searchData: ""
    }
  },
  mounted() {
    if (this.$route.query.row) {
      this.searchData = JSON.parse(this.$route.query.row)
    }
    this.getList(this.searchData)
  },
  methods: {
    getList(val) {
      let params = {
        workMonth: val.workMonth,
        workYear: val.workYear,
        enterpriseId: enterpriseId,
        workshopId: val.workshopId
      }
      getReportOfOutputValueMxByMonth(params).then((res) => {
        if (res.code == 0) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        if (index === columns.length - 1 || index === 0)
          return
        switch (column['property']) {
          case 'projectName':
          case 'fieldName':
          case 'process':
          case 'childProcess':
          case 'craft':
          case 'totalCost':
          case 'monthCost': return
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0).toFixed(2);
        } else {
          sums[index] = '';
        }
      })
      return sums
    },
    viewOutput(row) {
      Object.assign(row, this.searchData)
      // row.workshopId = this.searchData.workshopId
      // row.plantAreaName = this.searchData.plantAreaName
      // row.workshopName = this.searchData.workshopName
      this.$router.push({
        name: 'detail-wage-table',
        query: {
          row: JSON.stringify(row)
        }
      })
    },
    backTo() {
      this.$router.go(-1)
      let obj = {
        isReport: true,
        date: `${this.searchData.workYear}-${this.searchData.workMonth < 10 ? '0' + this.searchData.workMonth : this.searchData.workMonth}`
      }
      console.log(obj, "存储")
      localStorage.setItem("backData", JSON.stringify(obj));
    }
  }
}
</script>

<style lang="scss" scoped>
.wage-table {
  height: 100%;
  padding: 20px 16px;
  background: #fff;
  > div {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > h4 {
      color: #303133;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>