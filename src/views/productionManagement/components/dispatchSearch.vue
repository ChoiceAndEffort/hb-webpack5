<template>
    <Form ref="accountForm" formName="accountForm" width="auto" :inline="true" primary="primary" size="small" submitContext="确定" :renderData="prefabricationData" @handle-reset="handleReset" @handleSubmit="handleSubmit">
        <el-select
            slot="slot-process"
            v-model="searchData.processName"
            filterable
            clearable
            default-first-option
            placeholder="请选择工艺">
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
            @change="getnestingIdList"
            default-first-option
            placeholder="请选择图纸">
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
            default-first-option
            placeholder="请选择图纸页码">
            <el-option
                v-for="item in nestingIdList"
                :key="item.nestingId"
                :label="item.nestingPage"
                :value="item.nestingId">
            </el-option>
        </el-select>
        <el-cascader  slot="slot-department" ref="cascader" v-model="searchData.departmentId" placeholder="请选择责任单位" :options="responsibleData" :props="props" style="width: 216px" @change="handleCascaderChange"></el-cascader>
        <div slot="slot-search" slot-scope="{scope}">
            <slot></slot>
        </div>
    </Form>
</template>

<script>
//引入组件
import { Form } from "gggj_lib";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import { getNestingPoolList, getNestingList } from "@/api/productionManagement/projectMasterPlan";
import { getProjectProcessList,getProcedureList } from "@/api/productionManagement/project.js";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import linkageSearch from "./linkageSearch";
export default {
    props: ['prefabricationData'],
    components: { Form },
    name: "dispatchSearch",
    data() {
        return{
            props: {
                value: 'departmentId',
                label: 'name',
                expandTrigger: 'hover',
                checkStrictly: true
            },
/*            prefabricationData: [{
                tag: 'el-select',
                attrs: {
                    key: 'processName',
                    type: 'text',
                    options: [{
                        value: '划线',
                        label: '划线'
                    },{
                        value: '切割',
                        label: '切割'
                    },{
                        value: '坡口',
                        label: '坡口'
                    }],
                    filterable: true,
                    clearable: true,
                    value: '',
                    placeholder: '请选择工艺',
                    'show-password': true,
                }
            },{
                slot: 'slot-nesting',
                tag: 'el-select',
                attrs: {
                    type: 'text',
                }
            },{
                slot: 'slot-nestingpage',
                tag: 'el-select',
                attrs: {
                    type: 'text',
                }
            },{
                slot: 'slot-department',
                attrs: {
                    type: 'text',
                }
            },{
                tag: 'el-date-picker',
                attrs: {
                    key: 'plannedTime',
                    type: 'date',
                    value: '',
                    'value-format': "yyyy-MM-dd",
                    placeholder: '选择完成时间',
                }
            },{
                tag: 'reset', // 重置按钮
            },{
                tag: 'submit', // 提交按钮
            },{
                slot: 'slot-search',
                attrs: {
                    type: 'text',
                }
            }
            ],*/
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
        this.getDepartmentListData()
    },
    methods: {
        /**级联框选择后关闭*/
        handleCascaderChange(){
            this.$refs.cascader.dropDownVisible = false;
        },
        /**重置*/
        reset() {
            this.$refs['accountForm'].handleReset()
        },
        /**获取图纸*/
        getNestingPoolList(data) {
            this.linkageSearchobj = {...data}
            getNestingPoolList({engineeringProjectId: this.linkageSearchobj.engineeringProjectId, couplingId: this.linkageSearchobj.couplingId}).then(res => {
                this.$set(this, 'nestingPoolIdList', res.data)
            })
            getProcedureList({
                id: this.linkageSearchobj.couplingId,
            }).then((res) => {
                getProjectProcessList({projectWorkingProcedureId: this.getDataid(res.data,this.linkageSearchobj.workingProcedureCode)}).then(data => {
                    this.$set(this, 'workprocessList', data.data)
                })
            });
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
    }
}
</script>

<style scoped>

</style>
