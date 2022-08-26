<template>
    <div class="main_container configuration_process">
        <div class="h_btn">
            <el-button type="primary" @click="addworkingProcedure()" size="small">配置工序</el-button>
        </div>
        <el-table ref="positionTable" :data="workingProcedure" header-row-class-name="table-header-gray" class="btn-pointer" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-card shadow="always">
                        <div v-if="scope.row.children.length>0" class="flex_row_center">
                            <el-tag v-for="(item, index) in scope.row.children" :key="index">{{item.name}}</el-tag>
                        </div>
                        <p v-else class="flex_row_center">暂无子工序~</p>
                    </el-card>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="工序名称"></el-table-column>
            <el-table-column label="份额">
                <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.proportion"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="排序">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.sort" controls-position="right" :min="1" :max="999">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="addworkingProcedure(scope.$index)" size="small">配置子工序</el-button>
                    <el-button type="primary" @click="deleteworkingProcedure(scope.row,scope.$index)" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <bottomFooter :isReturn="true">
            <el-button type="primary" @click="keepworkingProcedure()">保存</el-button>
        </bottomFooter>
        <AddworkingProcedureDialog @handleFormConfirm="handleWorkingProcedureConfirm" ref="addworkingProcedureDialog"></AddworkingProcedureDialog>
    </div>
</template>

<script>
import AddworkingProcedureDialog from './components/addworkingProcedureDialog.vue'
import bottomFooter from '../components/bottomFooter.vue';
import { addWorkingProcedureBatch,getWorkingProcedureList } from '@/api/productionManagement/systemManagement.js'
export default {
    name: "configurationProcess",
    components:{
        AddworkingProcedureDialog,
        bottomFooter
    },
    data(){
        return{
            workingProcedure: [],
            workingProcedureIdlist: [],
            workingProcedureDictData: [], // 字典表获取的可选工序
            workingProcedureDictIdlist: [], // 字典表id方便查重
            newworkingProcedureDict: [], // 剔除已选的字典表获取新字典表
            workingProcedureCheckedData: [],
            childIndex: null, // 配置子工序时父级工序的index null表示配置的是父级工序
        }
    },
    mounted() {
        this.getWorkingProcedureListData()
        this.commonJs.getDictdata('SYS_PMS_WORKING_PROCEDURE').then(res => {
            this.workingProcedureDictIdlist = []
            this.workingProcedureDictData = [...res.data.dictItemList];
            res.data.dictItemList.forEach(res=>{
                this.workingProcedureDictIdlist.push(res.value)
            })
        })
    },
    methods: {
        /**获取工序列表数据*/
        getWorkingProcedureListData(){
            getWorkingProcedureList({
                id: this.$route.query.processQuotaTemplateId,
            }).then((res)=>{
                this.workingProcedure = res.data.workingProcedureAndChildList
            })
        },
        /**剔除已选的字典表获取新字典表*/
        getnewworkingProcedureDict(data) {
            data.forEach(res=>{
                if(res.children && res.children.length) this.getnewworkingProcedureDict(res.children)
                const index = this.workingProcedureDictIdlist.indexOf(res.workingProcedureCode)
                if(index != -1){
                    this.workingProcedureDictData.splice(index,1)
                    this.workingProcedureDictIdlist.splice(index,1)
                }
            })
        },
        /**配置父级工序*/
        addworkingProcedure(childIndex) {
            this.childIndex = childIndex!=undefined ? childIndex : null
            this.getnewworkingProcedureDict(this.workingProcedure)
            this.$refs.addworkingProcedureDialog.dialogShow(this.workingProcedureDictData);
        },
        /**删除工序*/
        deleteworkingProcedure(data,index) {
            this.$confirm('是否确认删除'+data.name+'及其子工序？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.workingProcedureDictData.push({
                    name: data.name,
                    value: data.workingProcedureCode
                })
                this.workingProcedureDictIdlist.push(data.workingProcedureCode)
                data.children.forEach(res => {
                    this.workingProcedureDictData.push({
                        name: res.name,
                        value: res.workingProcedureCode
                    })
                    this.workingProcedureDictIdlist.push(res.workingProcedureCode)
                })
                this.workingProcedure.splice(index,1)
            }).catch(() => {

            });
        },
        // 工序 - 弹框 - 点击保存
        handleWorkingProcedureConfirm(data){
            let resultData = []
            data.forEach(res=>{
                resultData.push({
                    workingProcedureCode: res.value,
                })
                this.childIndex==null ? this.workingProcedure.push({
                        proportion: 0,
                        name: res.name,
                        sort: 1,
                        workingProcedureCode: res.value,
                        children: []
                    }) : this.workingProcedure[this.childIndex].children.push({
                    name: res.name,
                    sort: 1,
                    workingProcedureCode: res.value,
                })
            })
            this.getnewworkingProcedureDict(resultData) // 模板去掉已加的
            this.$refs.addworkingProcedureDialog.dialogHide();
        },
        /**保存工序*/
        keepworkingProcedure() {
            let maxNum = 0
            this.workingProcedure.forEach(res => {
                maxNum += Number(res.proportion)
            })
            if(maxNum!=100) return  this.$message.warning('份额总数要为100');
            const sendData = {
                processQuotaTemplateId: this.$route.query.processQuotaTemplateId,
                workingProcedureParentList: this.workingProcedure
            }
            addWorkingProcedureBatch(sendData).then((res)=>{
                this.$message.success('保存成功');
            }).finally(() => {
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.configuration_process{
    .h_btn{
        width: 100%;
        display: flex;
        justify-content: end;
        margin-bottom: 16px;
    }
}
</style>
