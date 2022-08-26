<template>
    <div class="main">
        <div class="add-new-wrap">
            <Form ref="testName" formName="testName" size="small" primary="primary" :submit="true" submitContext="生成项目总计划" :renderData="renderData" @handleSubmit="handleGeneratePlan" @getFormData="getFormData" />
        </div>
        <el-table :data="tableData.data" header-row-class-name="table-header-gray" row-key="id" lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column type="index" width="150" label="序号" align="center"></el-table-column>
            <el-table-column prop="name" label="项目名称" width="300" align="left"></el-table-column>
            <el-table-column prop="workload" label="项目重量(千克)" align="center"></el-table-column>
            <el-table-column prop="start" label="项目计划开始时间" align="center"></el-table-column>
            <el-table-column prop="end" label="项目计划完成时间" align="center"></el-table-column>
            <!-- <el-table-column label="计划状态" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.level === 0" class="status" :class="scope.row.status == (0 || 1 || 2) ? 'status--blue' : 'status--red'">
                        {{ statusZh(scope.row.status) }}
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.level === 0" type="text" @click="handleEdit(scope.row)">计划编辑</el-button>
                    <!-- <el-button v-if="scope.row.level === 2" type="text" @click="handleRoundsPlan(scope.row)">添加轮次</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <Pagination :data="tableData" @changePage="changePage"/>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="roundsData" ref="form">
                <el-form-item label="轮次名称:">
                    <el-input v-model="roundsData.name" placeholder="请输入轮次名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleRoundsSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { Form, TableBody, Pagination } from 'gggj_lib';
import { getEngineeringProjectList } from '@/api/productionManagement/project.js';
import {
    generateProjectAndCouplingPlan,
    projectMasterPlan,
    achieveProjectAndCouplingPlan,  
    getProjectWorkingProcedurePlanList,
    generateProcedurePlan,
    getProjectWorkingProcedureRoundsPlanList,
    getProjectCouplingPlanList,   
    generateRoundsAndNestingPlan,
    projectMasterPlanSave,
    projectWorkingProcedureRoundsPlanSave
} from '@/api/productionManagement/projectMasterPlan.js';
export default {
    data() {
        return {
            engineeringProjectId: '', //项目id
            renderData: [
                {
                    tag: 'el-select',
                    attrs: {
                        key: 'engineeringProjectId',
                        value: '',
                        options: []
                    }
            ,   }
            ],
            tableData: {},
            postData: {
                page: 0
            },
            dialogFormVisible: false,
            roundsData: {
                currentData: {},
                name: ''
            },
            roundsPlanList:[]
        };
    },
    components: {
        Form,
        TableBody,
        Pagination
    },
    mounted() {
        this.getProjectList();
        this.getProjectMasterPlan(this.postData);
    },
    methods: {
        statusZh(status) {
            let result = '';
            switch (status) {
                case null:
                case 0:
                    result = '待审核';
                    break;
                case 1:
                    result = '审核中';
                    break;
                case 2:
                    result = '通过';
                    break;
                case 3:
                    result = '驳回';
                    break;
                default:
                    break;
            }
            return result;
        },
        // 新增项目
        handleGeneratePlan() {
            if (!this.engineeringProjectId) {
                this.$message.error('请选择项目');
                return;
            }
            let formData = new FormData();
            formData.append('engineeringProjectId', this.engineeringProjectId);
            generateProjectAndCouplingPlan(formData).then(res => {
                this.$message.success('新增项目成功！');
                this.postData.page = 0;
                this.getProjectMasterPlan(this.postData);
            });
        },
        // 跳转到新增项目
        handleEdit(rowData) {
            this.$router.push({
                name: 'project-plan-edit',
                query: {
                    masterPlanId: rowData.masterPlanId,
                    engineeringProjectId: rowData.engineeringProjectId
                }
            });
        },
        //获取项目不分页
        getProjectList() {
            getEngineeringProjectList({
                status: 1
            }).then(res => {
                let options = [];
                res.data.forEach(item => {
                    options.push({
                        label: item.name,
                        value: item.engineeringProjectId
                    });
                });
                this.$set(this.renderData[0].attrs, 'options', options);
            });
        },
        // 获取项目下拉框的值
        getFormData(formData) {
            this.engineeringProjectId = formData.engineeringProjectId;
        },
        // 获取项目总计划分页数据
        getProjectMasterPlan(data) {
            projectMasterPlan(data).then(res => {
                let data = res.data;
                let arr = [];
                res.data.data.forEach(item => {
                    arr.push(this.setItem(item, item.masterPlanId, 0));
                });
                data.data = arr;
                this.tableData = data;
            });
        },
        // 翻页
        changePage(page) {
            this.postData.page = page;
            this.getProjectMasterPlan(this.postData);
        },
        load(tree, treeNode, resolve) {
            this.resolve = resolve;
            let formData = new FormData();
            switch (tree.level) {
                case 0: //请求联段
                    getProjectCouplingPlanList({
                        masterPlanId: tree.masterPlanId
                    }).then(res => {
                        let arr = [];
                        res.data.forEach(item => {
                            arr.push(this.setItem(item, item.couplingPlanId, 1));
                        });
                        resolve(arr);
                    }).catch(()=>{
                        resolve([]);
                    });
                    break;
                case 1: // 请求工序
                    formData.append('projectCouplingPlanId', tree.couplingPlanId);
                    generateProcedurePlan(formData).then(res => {
                        let arr = [];
                        res.data.forEach(item => {
                            arr.push(this.setItem(item, item.workingProcedurePlanId, 2));
                        });
                        resolve(arr);
                    }).catch(()=>{
                        resolve([]);
                    });
                    break;
                case 2: //请求轮次
                    getProjectWorkingProcedureRoundsPlanList({
                        workingProcedurePlanId: tree.workingProcedurePlanId
                    }).then(res => {
                        this.roundsPlanList = [];
                        res.data.forEach(item => {
                            this.roundsPlanList.push(this.setItem(item, item.roundsPlanId, 3, false));
                        });
                        resolve(this.roundsPlanList);
                    }).catch(()=>{
                        resolve([]);
                    });
                    break;
                default:
                    break;
            }
        },
        setItem(item, id, level, hasChildren = true) {
            return {
                ...item,
                children: [],
                hasChildren: hasChildren,
                id: id,
                level: level,
                start: item.startTime?item.startTime.split(' ')[0]:'--',
                end: item.endTime?item.endTime.split(' ')[0]:'--'
            };
        },
        // 添加轮次
        handleRoundsPlan(rowData){
            this.dialogFormVisible = true;
            this.roundsData.currentData = Object.assign({},rowData);
        },
        // 提交轮次
        handleRoundsSubmit(){
            let currentRound = this.roundsData.currentData;
            projectWorkingProcedureRoundsPlanSave({
                name: this.roundsData.name,
                engineeringProjectId: currentRound.engineeringProjectId,
                couplingPlanId: currentRound.couplingPlanId,
                workingProcedurePlanId: currentRound.workingProcedurePlanId,
                masterPlanId: currentRound.masterPlanId
            }).then((res)=>{
                this.$message.success('添加轮次成功!');
                this.dialogFormVisible = false;
                this.$refs.form.resetFields();
                this.roundsPlanList.unshift({
                    name: this.roundsData.name,
                    id: this.roundsPlanList.length
                })
                this.resolve(this.roundsPlanList)
            })
        }
    }
};
</script>

<style scoped lang="scss">
.main {
    height: 100%;
    background-color: #ffffff;
    padding: 16px;
    box-sizing: border-box;
    ::v-deep .el-tab-pane {
        .main {
            padding: 0;
            box-sizing: border-box;
        }
    }
}
.add-new-wrap {
    // display: flex;
}
.status--blue {
    display: inline-block;
    background: #ecf5ff;
    border-radius: 2px;
    border: 1px solid #a3d0fd;
    color: #409eff;
    padding: 6px 15px;
    font-size: 14px;
}

.status--red {
    display: inline-block;
    background: #fff1f0;
    border-radius: 2px;
    border: 1px solid #fa5555;
    color: #fa5555;
    padding: 6px 15px;
    font-size: 14px;
}
.el-form {
    display: flex;
    ::v-deep .el-form-item {
        width: auto !important;
        margin-right: 10px;
    }
}
::v-deep .el-dialog__body{
    display: flex;
    .el-form{
        width: 100% !important;
    }
    .el-form-item{
        width: 100% !important;
        display: flex;
        .el-form-item__content{
            flex: 1;
        }
    }
}
::v-deep .table-header-gray{
    background-color: #f5f7fa !important;
}

</style>
