<template>
  <div class="particulars-output-table"
    ref="particulars-output-table">
    <div>
      <h4>{{currentData.plantAreaName}}-{{currentData.workshopName}}{{currentData.workMonth}}月产值物料明细</h4>
      <el-button type="primary"
        @click="backTo">返回</el-button>
    </div>
    <TableBody max-height="700px"
      :summary-method="getSummaries"
      show-summary
      :data="tableData"
      :colConfig="colConfig">
    </TableBody>
  </div>
</template>

<script>
import { TableBody } from 'gggj_lib';
import { getListOfWorkOutputValueMxByMonth } from '@/api/productionManagement/project'
export default {
  components: {
    TableBody,
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
        { attrs: { label: "物料编号", 'min-width': '30%', prop: "matterNo" } },
        { attrs: { label: "数量", 'min-width': '25%', prop: "matterAccount" } },
        { attrs: { label: "重量（kg）", 'min-width': '25%', prop: "matterWeight" } }
      ],
      tableData: [],
      currentData: {}
    }
  },
  mounted() {
    if (this.$route.query.row) {
      this.currentData = JSON.parse(this.$route.query.row)
    }
    console.log(this.currentData, "currentData")
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        workMonth: this.currentData.workMonth,
        workYear: this.currentData.workYear,
        enterpriseId: '210806DYZ51XWYCH',
        workshopId: this.currentData.workshopId,
        processName: this.currentData.processName,
        projectId: this.currentData.projectId,
        superiorWorkingProcedureName: this.currentData.superiorWorkingProcedureName,
        superiorWorkingProcedureCode: this.currentData.superiorWorkingProcedureCode,
        workingProcedureName: this.currentData.workingProcedureName,
        workingProcedureName: this.currentData.workingProcedureName,
        couplingId: this.currentData.couplingId
      }
      if (this.currentData.workingProcedureCode) {
        params.workingProcedureCode = this.currentData.workingProcedureCode
      } else {
        params.workingProcedureCode = this.currentData.superiorWorkingProcedureCode
      }
      getListOfWorkOutputValueMxByMonth(params).then((res) => {
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
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        if (index === 0)
          return
        switch (column['property']) {
          case 'projectName':
          case 'fieldName':
          case 'process':
          case 'childProcess':
          case 'craft':
          case 'materielNo':
          case 'count': return
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
          sums[index] = (sum / 1000).toFixed(3)
        } else {
          sums[index] = '';
        }
      })
      return sums
    },
  },
}
</script>

<style lang="scss" scoped>
.particulars-output-table {
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
::v-deep .el-table__body .cell {
  line-height: 32px !important;
}
</style>