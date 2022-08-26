<template>
    <el-dialog title="套料详情" :visible.sync="dialogFormVisible">
       <div class="dialog-con" v-loading="loading">
           <el-form ref="form"  :inline="true">
               <el-form-item label="套料图名称:">
                   <div>{{tableData.nestingName}}</div>
               </el-form-item>
               <el-form-item label="套料图页码:">
                   <div>{{tableData.nestingPage}}</div>
               </el-form-item>
               <el-form-item label="原材料材质:">
                   <div>{{tableData.rawMaterialTexture}}</div>
               </el-form-item>
               <el-form-item label="原材料高(毫米):">
                   <div>{{tableData.rawMaterialHeight}}</div>
               </el-form-item>
               <el-form-item label="原材料宽(毫米):">
                   <div>{{tableData.rawMaterialWidth}}</div>
               </el-form-item>
               <el-form-item label="原材料长(毫米):">
                   <div>{{tableData.rawMaterialLength}}</div>
               </el-form-item>
               <el-form-item label="原材料重量(单重/千克):">
                   <div>{{tableData.rawMaterialWeight}}</div>
               </el-form-item>
               <el-form-item label="原材料数量(块):">
                   <div>{{tableData.rawMaterialSize}}</div>
               </el-form-item>
               <el-form-item label="划线工艺:">
                   <div>{{tableData.lineation}}</div>
               </el-form-item>
               <el-form-item label="划线线长(单块钢板划线/米):">
                   <div>{{tableData.lineationLength}}</div>
               </el-form-item>
               <el-form-item label="切割工艺:">
                   <div>{{tableData.cuttingProcess}}</div>
               </el-form-item>
               <el-form-item label="切割线长(米):">
                   <div>{{tableData.cuttingLength}}</div>
               </el-form-item>
           </el-form>
           <TableBody :colConfig="colConfig" :data="tableData.nestingPartVoList">
               <template slot="props" slot-scope="{scope}">
                   <TableBody :colConfig="nestingAreaVoListConfig" style="width: 100%;" :data="scope.row.nestingAreaVoList"></TableBody>
                   <TableBody :colConfig="nestingPartGrooveVoListConfig" style="width: 100%;" :data="scope.row.nestingPartGrooveVoList"></TableBody>
               </template>
           </TableBody>
       </div>
    </el-dialog>
</template>

<script>
    import { TableBody } from 'gggj_lib'
    import { getNestingDetail } from '@/api/productionManagement/project.js'
    export default{
        data(){
            return{
                loading: false,
                dialogFormVisible: false,
                tableData: [],
                colConfig: [{
                    slot: 'props',
                    attrs: { type: 'expand' },
               },{
                   attrs: { label: '零件编号', prop: 'partNumber', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '零件编码', prop: 'partCode', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '零件数量(件)', prop: 'partSize', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '零件重量(单重/千克)', prop: 'partWeight', align: 'center',width:"200px"  },
               },{
                   attrs: { label: '零件工艺流向', prop: 'partProcessFlow', align: 'center',width:"200px"  },
               }],
               nestingAreaVoListConfig: [{
                   attrs: { label: '面积类型', prop: 'nestingAreaType', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '面积(平方米)', prop: 'area', align: 'center' ,width:"200px" },
               }],
               nestingPartGrooveVoListConfig: [{
                   attrs: { label: '坡口名称', prop: 'grooveName', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '坡口类型', prop: 'grooveType', align: 'center' ,width:"200px" },
               },{
                   attrs: { label: '坡口长度(米)', prop: 'grooveLength', align: 'center' ,width:"200px" },
               }]
            }
        },
        components:{
            TableBody
        },
        methods: {
            handleDialogFormVisible(nestingId){
                this.dialogFormVisible = true;
                this.loading = true;
                getNestingDetail(nestingId).then((res)=>{
                    this.tableData = res.data;
                }).finally(()=>{
                    this.loading = false;
                })
            },
        }
        
    }
</script>

<style scoped lang="scss">
    ::v-deep .el-form-item{
        width: 25%;
        box-sizing: border-box;
        margin-right: 0;
    }
    ::v-deep .el-table__header{
        width: 100% !important;
    }
    ::v-deep colgroup{
        width: 100% !important;
    }
    ::v-deep .el-table{
        width: 100% !important;
    }
    ::v-deep .el-table__body{
        width: 100% !important;
    }
    ::v-deep .el-table__empty-block{
        width: 100% !important;
    }
</style>
