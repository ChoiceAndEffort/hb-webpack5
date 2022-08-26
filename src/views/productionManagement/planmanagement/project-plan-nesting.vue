<template>
    <div class="sub-page">
        <div class="top-wrap">
            <div class="top-wrap__header">
                <h5 class="title">计划属性</h5>
              <!--  <el-button size="small" type="primary" @click="handleBack">返回</el-button> -->
            </div>
            <div class="form">
                <div class="form-item">
                    <div class="label">责任单位:</div>
                    <el-cascader ref="departmentName" :show-all-levels="false" v-model="form.departmentId" :options="departmentList" :props="{emitPath:false, expandTrigger: 'hover', label: 'name', value: 'departmentId',checkStrictly: true, }" @change="selectCascader('departmentName')"></el-cascader>
                </div>
                <!-- <div class="form-item">
                    <div class="label">是否需要转运单位协助:</div>
                    <div class="radio-wrap">
                        <el-radio v-model="form.radio" label="1">是</el-radio>
                        <el-radio v-model="form.radio" label="2">否</el-radio>
                    </div>
                </div>
                <div class="form-item" v-show="form.radio == 1">
                    <div class="label">选择转运单位:</div>
                    <el-cascader ref="transportationName" :show-all-levels="false" v-model="form.transportationId" :options="departmentList" :props="{emitPath:false, expandTrigger: 'hover', label: 'name', value: 'departmentId' }" @change="selectCascader('transportationName')"></el-cascader>
                </div> -->
            </div>
        </div>
        <div class="table-wrap">
            <div class="table-wrap__header">
                <h5 class="title">相关套料</h5>
                <div class="btns">
                    <el-button size="mini" type="primary" icon="el-icon-plus" @click="addNesting">新增</el-button>
                </div>
            </div>
            <div class="table-wrap__content">
                <TableBody :colConfig="colConfig" :data="tableData" concatKey="concatId" :concatIndexArr="[0,1,2,3,4,5,6,7,8,9]">
                    <template slot="btns" slot-scope="{scope}">
                        <el-button size="mini" type="primary" @click="handleDetail(scope.row,scope.$index)">详情</el-button>
                        <el-button size="mini" type="primary" @click="handleDelete(scope.row,scope.$index)">删除</el-button>
                    </template>
                </TableBody>
            </div>
        </div>
        <div class="btn-wrap">
            <el-button size="small" @click="handleBack">取消</el-button>
            <el-button size="small" type="primary" @click="handleSave">保存</el-button>
        </div>
        <NestingPopup ref="nestingPopup" :queryData="$route.query" @handleSubmit="setNestingPlanList"/>
        <NestingDetailPopup ref="nestingDetailPopup"/>
    </div>
</template>

<script>
    import { enterpriseId } from '@/assets/productionManagement/comjs/login'
    import { TableBody } from 'gggj_lib'
    import { nestingPlanGetPage, getNestingPlanList ,generateRoundsAndNestingPlan, deletedNestingPlan} from '@/api/productionManagement/projectMasterPlan.js'
    import NestingPopup from './components/nestingPopup.vue'
    import { getDepartmentList } from '@/api/productionManagement/departmentRole.js'
    import NestingDetailPopup from './components/nestingDetailPopup.vue'
    export default{
        data(){
            return{
                dialogFormVisible: false,
                searchData: {
                    roundsPlanId: this.$route.query.roundsPlanId
                },
                colConfig: [{
                       attrs: { label: '套料图名称', prop: 'nestingName', align: 'center',width:"200px" },
                   },{
                       attrs: { label: '套料图页码', prop: 'nestingPage', align: 'center',width:"200px"  },
                   },{
                       attrs: { label: '原材料材质', prop: 'rawMaterialTexture', align: 'center',width:"200px" },
                   },{
                       attrs: { label: '原材料数量(块)', prop: 'rawMaterialSize', align: 'center' ,width:"200px" },
                   },{
                       attrs: { label: '划线工艺', prop: 'lineation', align: 'center',width:"200px"  },
                   },{
                       attrs: { label: '划线线长(米)', prop: 'lineationLength', align: 'center' ,width:"200px" },
                   },{
                       attrs: { label: '切割工艺', prop: 'cuttingProcess', align: 'center',width:"200px"  },
                   },{
                       attrs: { label: '切割线长(米)', prop: 'cuttingLength', align: 'center',width:"200px"  },
                   },{
                        slot: 'btns',
                        attrs: { label: '操作', fixed: 'right', width: 200 },
                   }],
                tableData: [],
                baseTableData: [],
                form: {
                    departmentId: '',
                    departmentName: '',
                    // radio: '1',
                    transportationId: '',
                    transportationName: ''
                },
                departmentList: [], //部门列表数据
                submitData: {
                    workingProcedurePlanId: '',
                    nestingPoolId: '',
                    nestingPlanList: []
                },
                props: {
                    value: 'departmentId'
                }
            }
        },
        components:{
            TableBody,
            NestingPopup,
            NestingDetailPopup
        },
        mounted() {
            this.getNestingPlanGetPage();
            this.getDepartmentListData();
        },
        methods:{
            getDepartmentListData(){
                getDepartmentList({
                    enterpriseId,
                    status: 1,
                    type: 1
                }).then((res)=>{
                    this.departmentList = res.data;
                })
            },
            // 添加套料
            addNesting(){
                this.$refs.nestingPopup.handleDialogFormVisible(this.$route.query);
            },
            // 获取不分页套料
            getNestingPlanGetPage(){
                let query = this.$route.query;
                getNestingPlanList({
                    engineeringProjectId: query.engineeringProjectId,
                    couplingId: query.couplingId,
                    roundsPlanId: query.roundsPlanId
                }).then((res)=>{
                    res.data.forEach((item)=>{
                        item['concatId'] = `${item.nestingName}_${item.nestingPlanId}`
                    })
                    this.tableData = res.data;
                    this.baseTableData = res.data;
                })
            },
            handleDetail(rowData){
                this.$refs.nestingDetailPopup.handleDialogFormVisible(rowData.nestingId);
            },
            handleDelete(rowData,index){
                if(rowData.nestingPlanId){
                    deletedNestingPlan(rowData.nestingPlanId).then((res)=>{
                        for (var i = 0; i < this.tableData.length; i++) {
                        　　if(rowData.concatId == this.tableData[i].concatId){
                        　　　　this.tableData.splice(i, 1);
                        　　　　i--;
                        　　}
                        }
                        this.$message.success('删除成功');
                        this.getNestingPlanGetPage();
                    })
                }else{
                    for (var i = 0; i < this.tableData.length; i++) {
                    　　if(rowData.concatId == this.tableData[i].concatId){
                    　　　　this.tableData.splice(i, 1);
                    　　　　i--;
                    　　}
                    }
                }
            },
            handleBack(){
                this.$router.back();
            },
            setNestingPlanList(data){
                let tableData = this.baseTableData.concat(data.nestingPlanList);
                this.submitData.nestingPoolId = data.nestingPoolId;
                this.$set(this,'tableData',tableData);
            },
            handleSave(){
                if(!this.form.departmentId){
                    this.$message.error('请选择责任单位');
                    return
                }
                if(this.form.radio == 1){
                    if(!this.form.transportationId){
                        this.$message.error('请选择转运单位');
                        return
                    }
                }
                let query = this.$route.query;
                generateRoundsAndNestingPlan({
                    name: query.name,
                    departmentName: this.form.departmentName,
                    departmentId: this.form.departmentId,
                    roundsPlanId: query.roundsPlanId,
                    transportName: this.form.transportationName,
                    transportId: this.form.transportationId,
                    workingProcedurePlanId: query.workingProcedurePlanId,
                    nestingPoolId: this.submitData.nestingPoolId,
                    nestingPlanList: this.tableData
                }).then((res)=>{
                    this.$message.success('保存成功')
                    this.$router.back();
                })
            },
            selectCascader(name){
                setTimeout(()=>{
                   this.form[name] = this.$refs[name].inputValue;
                },300)
            },

        }
    }
</script>

<style scoped lang="scss">
    .sub-page{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background: transparent;
        box-sizing: border-box;
        padding: 0px;
    }
    .top-wrap{
        background: #FFFFFF;
        padding: 16px;
        box-sizing: border-box;
        .top-wrap__header{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #EBEEF5;
            padding-bottom: 10px;
            .title{
                padding-bottom: 0px;
                line-height: 32px;
            }
        }
        .form{
            display: flex;
            .form-item{
                margin-right: 50px;
                margin-top: 16px;
                .label{
                    font-size: 14px;
                    color: #606266;
                    padding-bottom: 8px;
                }
                .radio-wrap{
                    margin-top: 10px;
                }
            }
        }
    }
    .title{
        color: #303133;
        font-size: 14px;
        font-weight: 600;
        padding-bottom: 16px;
    }
    .table-wrap{
        flex: 1;
        overflow-y: scroll;
        margin-top: 8px;
        background: #FFFFFF;
        padding: 16px;
        box-sizing: border-box;
        .title{
            line-height: 30px;
            padding-bottom: 0px !important;
        }
        .table-wrap__header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #EBEEF5;
            padding-bottom: 10px;
        }
    }
    .btn-wrap{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 48px;
        margin-top: 2px;
        background: #FFFFFF;
    }
    ::v-deep .el-dialog{
        width: 90vw;
    }
</style>
