<!--定额编辑-->
<template>
    <div class="main">
      <ExcelEdit ref="checkExcel" title="定额数据编辑" importBtnName="提交" :headerKeys="headerKeys" :readOnlyColArr="readOnlyColArr" @handleImport="handleImport" @handleBack="() => this.$router.back()"/>
    </div>
</template>

<script>
import {ExcelEdit} from 'gggj_lib';
import {
  batchOperationNesting,
  batchOperationMaterial
} from '@/api/productionManagement/project'
export default {
    components:{ExcelEdit},
    data() {
        return {
            headerKeys: {},
            readOnlyColArr: [], // 只读列
        };
        
    },
    created() {
        let query
        const queryData = JSON.parse(sessionStorage.getItem('queryData'))
        query = this.$route.query
        if (typeof this.$route.query.headerKeys == 'string')
            query = queryData
        if (this.$route.query.data) {
          this.data = query.data
          this.headerKeys=query.headerKeys;
          this.headerKeys['nestingName'] ? this.readOnlyColArr = [0,1,2,4,5,7,8,9,10,11] : this.readOnlyColArr = [0,1,2,4,5,6]
        }
    },
    mounted() {
        this.$refs.checkExcel.start(JSON.parse(JSON.stringify(this.data)));
    },
    methods: {
        async handleImport(tableData){
          let res
          this.$confirm('是否提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(async () => {
            if(this.headerKeys['nestingName']) {
              res = await batchOperationNesting({
                nestingBoList: tableData
              })
            } else {
              res = await batchOperationMaterial({
                materialAttachmentBatchBoList: tableData
              })
            }
            res.code === 0 && this.$router.back()
          }).catch(error => {
            this.$message({type: 'info', message: '已取消'})
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
