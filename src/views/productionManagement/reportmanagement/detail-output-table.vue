<template>
  <div class="detail-output-table">
    <div>
      <h4>{{searchData.plantAreaName}}-{{searchData.workshopName}}{{searchData.workMonth}}月产值表</h4>
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
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
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
        { attrs: { label: "总量（t）", 'min-width': '30%', prop: "planedWorkOutput" } },
        { attrs: { label: "完成量（t）", 'min-width': '30%', prop: "workOutput" } },
        { attrs: { label: "累计完成量（t）", 'min-width': '25%', prop: "addUpWorkOutput" } },
        { attrs: { label: "单价（元/t）", 'min-width': '25%', prop: "unitPrice" } },
        { attrs: { label: "产值（元）", 'min-width': '25%', prop: "workOutputValue" } },
        { slot: "btn", attrs: { label: "操作", align: "center", width: "100px", fixed: "right" }, },
      ],
      tableData: [],
      searchData: {}
    }
  },
  mounted() {
    if (JSON.parse(this.$route.query.row)) {
      this.searchData = JSON.parse(this.$route.query.row)
    }
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        workMonth: this.searchData.workMonth,
        workYear: this.searchData.workYear,
        enterpriseId: enterpriseId,
        workshopId: this.searchData.workshopId
      }
      getReportOfOutputValueMxByMonth(params).then((res) => {
        if (res.code == 0) {
          this.tableData = res.data;
          console.log(this.tableData, "tableData")
        } else {
          this.$message.error(res.message);
        }
      });
    },
    backTo() {
      this.$router.go(-1);
      let obj = {
        isReport: true,
        date: `${this.searchData.workYear}-${this.searchData.workMonth < 10 ? '0' + this.searchData.workMonth : this.searchData.workMonth}`
      }
      console.log(obj, "存储")
      localStorage.setItem("backData", JSON.stringify(obj));
    },
    viewOutput(row) {
      row.workshopId = this.searchData.workshopId;
      row.plantAreaName = this.searchData.plantAreaName
      row.workshopName = this.searchData.workshopName
      row.workMonth = this.searchData.workMonth
      row.workYear = this.searchData.workYear
      this.$router.push({
        name: 'particulars-output-table',
        query: {
          row: JSON.stringify(row)
        }
      })
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
          case 'totalNum':
          case 'finishedNum':
          case 'completedNum':
          case 'outputValue': return
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          let sum = values.reduce((prev, curr) => {
            const value = Number(curr * 1000);
            if (!isNaN(value)) {
              return prev + value;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = (sum / 1000).toFixed(3);
        } else {
          sums[index] = '';
        }
      })
      return sums
    },
  }
}
</script>

<style lang="scss" scoped>
.detail-output-table {
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