<template>
<div class="selsect_people">
    <div class="newproduction_box flex_row">
        <div class="fx_3px tree_select">
            <el-select style="margin-bottom: 10px" v-if="showselect" v-model="framework" placeholder="请选择" @change="getDepartment">
                <el-option v-for="item in treeSelectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-tree class="expand-tree newproduction_tree" :data="administrationArr" :props="defaultProps" default-expand-all ref="tree" @node-click="handleTreeClick"></el-tree>
        </div>
        <div class="table_box">
            <TableBody class="newproduction_table" ref="productionTable" tableName="sonTable" :max-height="350" :colConfig="colConfig" :data="organizationData.data" :row-key="getRowKeys"  @selection-change="handleSelectionChange">
            </TableBody>
            <Pagination :data="organizationData" @changePage="changePage"/>
        </div>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button @click="closedialogTablsdx">取 消</el-button>
        <el-button type="primary" @click="newproduction">确定</el-button>
    </div>
</div>
</template>

<script>
import {enterpriseId} from "@/assets/productionManagement/comjs/login";
import {TableBody, Pagination, TableFilter} from 'gggj_lib';
import {getDepartmentList, getStaffPage} from "@/api/productionManagement/departmentRole";
export default {
    components:{ TableBody, Pagination },
    name: "selectPeople",
    props: {
        addObj:{ // 默认带的参数
            type: Object,
            default: function () { return {} }
        },
        framework: { // 生产 or 行政
            type: Number,
            default: 1
        },
        colConfig: { // 列表配置
            type: Array,
            default: function () { return [] }
        },
        showselect: {
            type: Boolean,
            default: true
        },
        selectidEd: { //  查重id专用
            type: Array,
            default: function () { return [] }
        },
    },
    data(){
        return{
            treeSelectData: [{ //树组件 - 选择架构
                value: 0,
                label: '行政架构'
            }, {
                value: 1,
                label: '生产架构'
            }],
            administrationArr: [], // 行政树
            defaultProps: {
                children: 'children', //treeData中子节点名称
                label: 'name' //treeData中label的名称
            },
            organizationData: {
                total: 0,
                size: 10,
                page: 0,
                currentPage: 0,
                lastPage: 0,
                totalPages: 1,
                first: true,
                last: true,
                data: []
            },
            newProductionData: [],
            departmentId: '',
        }
    },
    created() {
        this.getDepartment(this.framework)
    },
    methods: {
        /** 获取部门树*/
        getDepartment(sign) {
            this.administrationArr = []
            const sendData = sign==1 ? {
                enterpriseId: enterpriseId,
                type: 1,
                status: 1,
            } : {
                enterpriseId: enterpriseId,
                type: 0,
                status: 1,
            }
            getDepartmentList(sendData).then(res => {
                this.administrationArr = res.data
            })
        },
        /**新增生产人员*/
        getRowKeys(row) {
            return row.staff.staffId
        },
        /** 点击树获取人员*/
        handleTreeClick(data){
            this.departmentId =data.departmentId
            this.getStaffData(data.departmentId)
        },
        /** 根据部门获取右边员工*/
        getStaffData(prodepartmentId) {
            let _this = this
            this.listLoading = true
            const sendData = {
                enterpriseId: enterpriseId,
                page: this.organizationData.page,
                size: this.organizationData.size,
            }
            this.framework == 0 ? sendData.departmentId = prodepartmentId : sendData.productionDepartmentId = prodepartmentId,
            getStaffPage(sendData).then(res => {
                _this.listLoading = false
                res.data.data.forEach(item => item.staff.isLock = item.staff.isLock?true:false)
                    this.organizationData.data = res.data.data
                    this.organizationData.total = res.data.total
            })
        },
        handleSelectionChange(val) {
            this.newProductionData = val
        },
        newproduction() {
            this.$emit('setPersonnelData', this.newProductionData)
        },
        //分页
        changePage(e){
            this.organizationData.page=e
            this.getStaffData(this.departmentId)
        },
        /**关闭新增弹框*/
        closedialogTablsdx() {
            this.$emit('closedialogTablsdx')
        },
        /**清空选择的值*/
        clearSelect () {
            this.newProductionData = [];
            this.organizationData.data = [];
            this.organizationData.total = 0;
            this.organizationData.page = 0;
            this.$nextTick(()=>{
                this.$refs['productionTable'].$refs['sonTable'].clearSelection()
            })
        }
    }
}
</script>

<style scoped lang="scss">
.selsect_people{
    .newproduction_box{
        width: 100%;
        display: flex;

        .newproduction_tree{
            height: 300px;
            overflow-y: auto;
        }
        .table_box{
            margin-left: 20px;
            flex: 1;
        }
    }
    .dialog-footer{
        margin-top: 30px;
        display: flex;
        justify-content: end;
    }
}
</style>
