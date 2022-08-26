<template>
  <div class="detail-wage-table">
    <div>
      <h4>{{currentData.plantAreaName}}-{{currentData.workshopName}}4月工费明细</h4>
      <el-button type="primary"
        @click="backTo">返回</el-button>
    </div>
    <TableBody show-summary
      :data="tableData"
      :colConfig="colConfig">
    </TableBody>
    <Pagination :data="{total: 3}"></Pagination>
  </div>
</template>

<script>
import { TableBody, Pagination } from 'gggj_lib';
import { getListOfWorkLaborCostMxVoByMonth } from '@/api/productionManagement/project'
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
        { attrs: { label: "报工人", 'min-width': '25%', prop: "reportWorkerName" } },
        { attrs: { label: "报工金额（元）", 'min-width': '25%', prop: "reportWorkAmount" } },
        { attrs: { label: "报工完成时间", 'min-width': '25%', prop: "completedDate" } }
      ],
      tableData: [],
      currentData: {}
    }
  },
  mounted() {
    if (this.$route.query.row) {
      this.currentData = JSON.parse(this.$route.query.row)
    }
    this.getList()

  },
  methods: {
    getList() {
      let params = {
        workMonth: this.currentData.workMonth,
        workYear: this.currentData.workYear,
        enterpriseId: enterpriseId,
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
      getListOfWorkLaborCostMxVoByMonth(params).then((res) => {
        if (res.code == 0) {
          this.tableData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });

    },
    backTo() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-wage-table {
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