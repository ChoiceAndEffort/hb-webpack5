<!--编辑新增计-->
<template>
  <div class="main">
    <ExcelEdit ref="checkExcel"
      title="编辑新增计划-----(时间格式为：2021-1-1)"
      importBtnName="保存"
      :headerKeys="headerKeys"
      :readOnlyColArr="readOnlyColArr"
      @handleImport="handleImport"
      @handleBack="() => this.$router.back()" />
  </div>
</template>
<script>
import { ExcelEdit } from 'gggj_lib';
import {
  saveWorkingProcedure,
  saveMaterialWorkingProcedure
} from '@/api/productionManagement/projectMasterPlan'
export default {
  name: 'working-procedure-add',
  components: { ExcelEdit },
  data() {
    return {
      headerKeys: {},
      readOnlyColArr: [],
    };

  },
  created() {
    let query
    const queryData = JSON.parse(sessionStorage.getItem('queryData'))
    query = this.$route.query
    console.log(this.$route.query)
    if (typeof this.$route.query.headerKeys == 'string')
      query = queryData
    if (this.$route.query.data) {
      this.data = query.data
      this.headerKeys = query.headerKeys;
    }
    this.headerKeys.nestingName ? this.readOnlyColArr = [0, 1, 2, 3, 4, 6, 8, 9, 10] : this.readOnlyColArr = [0, 1, 2, 3, 4, 6]
  },
  mounted() {
    this.$refs.checkExcel.start(this.data);
  },
  methods: {
    handleImport(tableData) {

      let flag = tableData.some(item => {
        if (item.lineationLength && item.lineationLength != '') {
          if (!item.lineationDate || item.lineationDate == '') {
            return true
          }
        }
        if (item.cuttingLength && item.cuttingLength != '') {
          if (!item.cuttingDate || item.cuttingDate == '') {
            return true
          }
        }
        if (item.partNumber && item.partNumber != '') {
          if (!item.grooveDate || item.grooveDate == '') {
            return true
          }
        }

      })
      if (flag) {
        this.$message.error("请检查相应的计划时间！");
        return
      }

      let res
      this.$confirm('是否保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async () => {
        if (this.headerKeys.nestingName) {
          res = await saveWorkingProcedure(tableData)
        } else {
          res = await saveMaterialWorkingProcedure(tableData)
        }
        this.$message.success('保存成功')
        res.code === 0 && this.$router.back()
      }).catch(error => {
        if (error === 'cancel')
          this.$message({ type: 'info', message: '已取消' })
      })
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  min-height: 100%;
  background-color: #fff;
  padding: 16px;
}
</style>
