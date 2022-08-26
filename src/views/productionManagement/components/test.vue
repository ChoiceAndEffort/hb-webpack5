<template>
    <div v-bind="$attrs" class="linkage_search_box">
        <!-- 项目下拉框 -->
            <el-select
                v-model="searchobj.engineeringProjectId"
                placeholder="请选择项目"
                clearable
                filterable
                @change="getLinkage('one')"
                :size="size"
                v-if="show == 'projectone'"
            >
                <el-option
                    v-for="item in projectList"
                    :key="item.engineeringProjectId"
                    :label="item.name"
                    :value="item.engineeringProjectId+'-'+item.name"
                ></el-option>
            </el-select>
        <!-- 联段下拉框 -->
            <el-select
                v-model="searchobj.couplingId"
                placeholder="请选择联段"
                clearable
                filterable
                @change="getLinkage('two')"
                :size="size"
                v-if="show == 'projecttwo'"
            >
                <el-option
                    v-for="item in couplingList"
                    :key="item.couplingId"
                    :label="item.name"
                    :value="item.couplingId+'-'+item.name"
                ></el-option>
            </el-select>

        <!-- 工序下拉框 -->
            <el-cascader v-if="show == 'projectthree'" ref="cascader"  clearable :key="isResouceShow" v-model="searchobj.workingProcedureCode" :show-all-levels="false" :options="procedureList" :props="props" style="width: 216px" @change="getLinkage('three')"></el-cascader>
        <el-select
            slot="slot-process"
            v-model="searchData.processName"
            filterable
            clearable
            @change="getLinkage('five')"
            default-first-option
            placeholder="请选择工艺"
            v-if="show == 'processName'">
            <el-option
                v-for="item in workprocessList"
                :key="item.projectProcessId"
                :label="item.name"
                :value="item.name">
            </el-option>
        </el-select>
        <el-select
            slot="slot-nesting"
            v-model="searchData.nestingPoolId"
            filterable
            clearable
            @change="getLinkage('four')"
            default-first-option
            placeholder="请选择图纸"
            v-if="show == 'nestingPoolId'">
            <el-option
                v-for="item in nestingPoolIdList"
                :key="item.nestingPoolId"
                :label="item.nestingName"
                :value="item.nestingPoolId">
            </el-option>
        </el-select>
        <el-select
            slot="slot-nestingpage"
            v-model="searchData.nestingId"
            filterable
            clearable
            @change="getLinkage('six')"
            default-first-option
            placeholder="请选择图纸页码"
            v-if="show == 'nestingId'">
            <el-option
                v-for="item in nestingIdList"
                :key="item.nestingId"
                :label="item.nestingPage"
                :value="item.nestingId">
            </el-option>
        </el-select>
        <el-cascader  @change="getLinkage('seven')" v-if="show == 'departmentId'" slot="slot-department" ref="cascader" v-model="searchData.departmentId" placeholder="请选择责任单位" :options="responsibleData" :props="departmentprops" style="width: 216px"></el-cascader>
    </div>
</template>

<script>
import { getCouplinglist, getProjectProcessList,getProcedureList, getEngineeringProjectList } from "@/api/productionManagement/project.js";
import {getNestingList, getNestingPoolList} from "@/api/productionManagement/projectMasterPlan";
import {getDepartmentList} from "@/api/productionManagement/departmentRole";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
export default {
    name: "linkageSearch",
    props:{
        size: { // 框和按钮大小
            type: String,
            default: 'small'
        },
        submit: { // 按钮
            type: Boolean,
            default: false
        },
        show: {
            type: String,
        }
    },
    data(){
        return{
            props: {
                value: 'workingProcedureCode',
                label: 'name',
                expandTrigger: 'hover',
                checkStrictly: false,
                emitPath:false,
            },
            departmentprops: {
                value: 'departmentId',
                label: 'name',
                expandTrigger: 'hover',
                checkStrictly: true
            },
            searchobj: {
                engineeringProjectId: "", // 项目id
                couplingId: "", // 联段id
                workingProcedureCode: "", // 工序id
            },
            projectList: [], // 项目
            couplingList: [], // 联段框
            procedureList: [], // 工序框
            isResouceShow: 0, // 工序级联选择框唯一标识
            resultName: '',

            /**工艺下拉列表*/
            workprocessList: [],
            /*责任单位*/
            responsibleData: [],
            /**图纸*/
            nestingPoolIdList: [],
            /**图纸页码*/
            nestingIdList: [],
            linkageSearchobj: {},
            searchData: {
                processName: '', // 工艺名称
                nestingPoolId: '', // 套料图
                nestingId: '', // 套料页码Id
                departmentId: '', // 责任单位
            },
            resultId: '',
        }
    },
    created() {
        if(this.show == 'projectone') this.getprojectList()
        if(this.show == 'departmentId') this.getDepartmentListData()
    },
    methods: {
        getprojectList() {
            getEngineeringProjectList({
                status: 1,
            }).then((res) => {
                if (res.code === 0) {
                    this.projectList = res.data;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        getLinkageData(sign,searchobj,listData) {
            switch (sign) {
                case 'two':
                    if(listData) this.couplingList = listData;
                    if(searchobj) this.searchobj.engineeringProjectId = searchobj.engineeringProjectId;
                    break;
                case 'three':
                    this.searchobj = searchobj
                    if(listData) this.procedureList = listData;
                    break;
                case 'four':
                    getNestingList({nestingPoolId: searchobj.nestingPoolId}).then(res => {
                        this.$set(this, 'nestingIdList', res.data)
                    })
                    break;
            }
        },
        resetData(sign) {
            switch (sign) {
                case 'one':
                    this.projectList = [];
                    this.searchobj.engineeringProjectId = ''
                    break;
                case 'two':
                    this.couplingList = [];
                    this.searchobj.couplingId = ''
                    break;
                case 'three':
                    this.procedureList = [];
                    this.searchobj.workingProcedureCode = ''
                    break;
                case 'four':
                    this.workprocessList = [];  // 工艺
                    this.searchData.processName = ''
                    this.nestingPoolIdList = [];  // 图纸
                    this.searchData.nestingPoolId = ''
                    break;
                case 'five':
                    this.nestingIdList = [];  // 图纸页码
                    this.searchData.nestingId = ''
                    break;
                case 'six':
                    this.searchData.departmentId = ''; // 责任单位
                    break;
            }
        },
        getLinkage(sign,searchobj,listData) {
            switch (sign) {
                case 'one':
                    // 清空选择联段框工序框
                    this.$emit('getResetData','one');
                    this.$emit('getResetData','two');
                    this.$emit('getResetData','three')
                    if(this.searchobj.engineeringProjectId==''){
                        break;
                    }
                    this.$emit('getProjectName',this.searchobj.engineeringProjectId.split('-')[1])
                    getCouplinglist({
                        engineeringProjectId: this.searchobj.engineeringProjectId.split('-')[0],
                    }).then((res) => {
                        if (res.code === 0) {
                            // this.couplingList = res.data;
                            this.$emit('getProjectsearch',sign,this.searchobj,res.data)
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                    break;
                case 'two':
                    // 清空选择工序框
                    this.$emit('getResetData','two')
                    this.$emit('getResetData','three')
                    if(this.searchobj.couplingId==''){
                        break;
                    }
                    this.$emit('getProjectName',this.searchobj.engineeringProjectId.split('-')[1]+'—'+this.searchobj.couplingId.split('-')[1])
                    getProcedureList({
                        id: this.searchobj.couplingId.split('-')[0],
                    }).then((res) => {
                        if (res.code === 0) {
                            this.procedureList = res.data;
                            this.procedureList.forEach(res => {
                                if(res.children.length<1) delete res.children
                            })
                            this.$emit('getProjectsearch',sign,this.searchobj,this.procedureList)
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                    break;
                case 'three':
                    // 清空选择工序框
                    this.$emit('getResetData','three')
                    this.$emit('getProjectsearch',sign,this.searchobj,this.procedureList)
                    this.$emit('getProjectName',this.searchobj.engineeringProjectId.split('-')[1]+'—'+this.searchobj.couplingId.split('-')[1]+'—'+this.getworkingProcedureName(this.procedureList))
                    this.$refs.cascader.dropDownVisible = false;
                    const sendData = this.getsendData()
                    if(!this.submit) this.$emit('confirmSearch',sendData)
                    break;
                case 'four':
                    this.$emit('getProjectsearch',sign,this.searchData)
                    this.$emit('getResetData','four')
                  /*  getNestingList({nestingPoolId: this.searchData.nestingPoolId}).then(res => {
                        this.$set(this, 'nestingIdList', res.data)
                    })*/
                    break;
                default:
                    this.$emit('getProjectsearch',sign,this.searchData)
                    break;
            }
        },
        getworkingProcedureName(data) {
            data.forEach(res => {
                if(res.workingProcedureCode == this.searchobj.workingProcedureCode) {
                    this.resultName = res.name
                }else{
                    if(res.children) {
                        this.getworkingProcedureName(res.children)
                    }
                }
            })
            return this.resultName
        },
        getsendData() {
            return {
                engineeringProjectId: this.searchobj.engineeringProjectId.split('-')[0] || '', // 项目id
                couplingId: this.searchobj.couplingId.split('-')[0] || '', // 联段id
                workingProcedureCode: this.searchobj.workingProcedureCode, // 工序id
            }
        },
        submitButton() {
            const sendData = this.getsendData()
            if(sendData.workingProcedureCode=='') return this.$message.warning('请选择工序！');
            this.$emit('confirmSearch', sendData)
        },
        /**级联框选择后关闭*/
        handleCascaderChange(){
            this.$refs.cascader.dropDownVisible = false;
        },
        /**重置*/
        reset() {
            this.$refs['accountForm'].handleReset()
        },
        /**获取工艺下拉*/
        getProcessName(searchobj,processList) {
            getProjectProcessList({projectWorkingProcedureId: this.getDataid(processList,searchobj.workingProcedureCode)}).then(data => {
                this.$set(this, 'workprocessList', data.data)
            })
        },
        /**获取图纸*/
        getNestingPoolList(data) {
            this.linkageSearchobj = {...data}
            getNestingPoolList({engineeringProjectId: this.linkageSearchobj.engineeringProjectId, couplingId: this.linkageSearchobj.couplingId}).then(res => {
                this.$set(this, 'nestingPoolIdList', res.data)
            })
        },
        getDataid(data,id) {
            data.forEach(res => {
                if(res.workingProcedureCode == id) {
                    this.resultId = res.projectWorkingProcedureId
                }else{
                    if(res.children) {
                        this.getDataid(res.children,id)
                    }
                }
            })
            return this.resultId
        },
        /**根据图纸获取图纸页码*/
        getnestingIdList(id) {
            getNestingList({nestingPoolId: id}).then(res => {
                this.$set(this, 'nestingIdList', res.data)
            })
        },
        /**责任单位下拉数据*/
        getDepartmentListData() {
            getDepartmentList({enterpriseId: enterpriseId,type: 1,status: 1}).then((res) => {
                this.responsibleData = [...res.data];
            }).finally(() => {
            })
        },
        /**重置插槽数据*/
        handleReset() {
            this.searchData = {
                processName: '', // 工艺名称
                nestingPoolId: '', // 套料图
                nestingId: '', // 套料页码Id
            }
        },
        /**点击确认搜索*/
        handleSubmit(data) {
            this.searchData.departmentId = this.searchData.departmentId?this.searchData.departmentId.pop():''
            this.searchData = {
                ...this.searchData,
                // departmentId: this.searchData.departmentId,
                ...data
            }
            this.$emit('dispatchSearch',this.searchData)
        },
    },
    watch: {
        procedureList: {
            handler(newValue) {
                if (newValue.length === 0) {
                    ++this.isResouceShow
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .el-select {
    margin-right: 16px;
}
.linkage_search_box{
    display: flex;
    padding-left: 28px;
    >div{
        display: flex;
        align-items: center;
    }
    >div+div{
        margin-left: 52px;
    }
    button{
        margin-left: 16px;
    }
}
</style>
