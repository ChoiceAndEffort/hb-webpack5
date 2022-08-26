<!--人事管理-->
<template>
    <div class="main person-index">
        <div class="left">
            <el-select v-model="framework" placeholder="请选择" size="small">
                <el-option v-for="item in treeSelectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
             <div class="selectBox">
                 <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText" class="input-with-select">
                     <i slot="suffix" class="el-input__icon el-icon-search"></i>
                 </el-input>
             </div>
            <el-tree class="expand-tree" :filter-node-method="filterNode"  :data="framework == 0 ? administrationArr : productionArr" :props="defaultProps" default-expand-all ref="tree" @node-click="(data) => handleTreeClick(data,1)"></el-tree>
        </div>
        <div class="right">
            <div class="m-sselect">
                <Form ref="accountForm" formName="accountForm" width="auto" :inline="true" primary="primary" size="small" submitContext="查询" :renderData="prefabricationData" @handleSubmit="handleSubmit">
                </Form>
            </div>
            <div class="select-List">
                <div class="nav">
                    <p>{{title}}</p>
                    <div class="navallBnt" v-if="isSelect">
                        <el-button type="primary" @click="add"><i class="el-icon-plus"></i>新增{{framework == 0?'行政架构':'生产架构'}}</el-button>
                        <el-button type="primary" @click="down"><i class="el-icon-upload"></i>下载模板</el-button>
                        <el-button type="primary" @click="out"><i class="el-icon-upload2"></i>导出</el-button>
                    </div>
                </div>

                <TableBody style="width: 100%" :colConfig="colConfig.concat(colConfigspare)" :data="workshopData.data"  @selection-change="handleSelectionChange" v-loading="listLoading" @row-click="handleRowClick">
                    <template slot="btns" slot-scope="{scope}">
                        <el-button size="mini" type="text" @click="handleEditAllInfo(scope.row)">修改</el-button>
                    </template>
                    <template slot="staff.isLock" slot-scope="{scope}">
                        <el-switch v-model="scope.row.staff.isLock"  @change="changeItemSwitch(scope.row.staff)" active-color="#409eff" ></el-switch>
                    </template>
                </TableBody>
                <Pagination :data="workshopData" @changePage="(e) => changePage(e,1)"/>
            </div>
        </div>
    </div>
</template>

<script>
import {
    getDepartmentList, getStaffPage,operationStaffIsLock
} from '@/api/productionManagement/departmentRole.js'
import {
    enterpriseId
} from '@/assets/productionManagement/comjs/login.js'
import { Form,TableBody,Pagination} from 'gggj_lib';
export default {
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    components:{Form,TableBody,Pagination},
    props: {
        // 表格是否为多选类型
        isSelect: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            title: '',
            filterText: '', // tree过滤字段
            colConfig: [
                {
                    attrs: {   align: 'center', type: 'selection' },
                },
                {
                    attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                },
                {
                    attrs: { label: '姓名', prop: 'staff.name', align: 'center' },
                },{
                    attrs: { label: '工号', prop: 'staff.number', align: 'center' },
                },{
                    attrs:  { label: '部门', prop: 'positionList[0].departmentName', align: 'center' },
                },{
                    attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
                },{
                    attrs: { label: '手机号', prop: 'staff.mobile', align: 'center' },
                }],
            colConfigspare: [
                {
                    slot: 'btns',
                    attrs: { label: '操作', fixed: 'right', width:80, align: 'center' },
                },{
                    slot: 'staff.isLock',
                    attrs: { label: '状态', fixed: 'right', width: 80, align: 'center' },
                }
            ],
            prefabricationData: [{
                tag: 'el-input',
                attrs: {
                    label: '姓名：',
                    key: 'name',
                    type: 'text',
                    clearable: true,
                    value: '',
                    placeholder: '请输入姓名',
                    size: 'mini'
                }
            },{
                tag: 'el-input',
                attrs: {
                    label: '工号：',
                    key: 'number',
                    type: 'text',
                    clearable: true,
                    value: '',
                    placeholder: '请输入工号',
                    size: 'mini'
                }
            }
            // ,{
            //     tag: 'el-input',
            //     attrs: {
            //         label: '手机号：',
            //         key: 'mobile',
            //         type: 'text',
            //         clearable: true,
            //         value: '',
            //         placeholder: '请输入手机号',
            //         size: 'mini'
            //     }
            // }
            ,{
                tag: 'reset', // 重置按钮
                size: 'mini'
            },{
                tag: 'submit', // 提交按钮
                size: 'mini'
            }
            ],
            searchobj: {
                name: "",
                mobile:"",
                number: ''
            },
            framework: 0,  // 架构
            select:'1',
            departmentData: [{
                label: '海波重科',
                children: [{
                    label: '汉阳子公司',
                    children:[{
                        label:'下料车间'
                        },{
                        label:'单元件配件车间'
                        }]
                },{
                    label: '江夏子公司',
                }]
                }],
            defaultProps: {
                children: 'children', //treeData中子节点名称
                label: 'name' //treeData中label的名称
            },
            administrationArr: [], // 行政树
            productionArr: [], //生产
            treeSelectData: [{ //树组件 - 选择架构
                value: 0,
                label: '行政架构'
            }, {
                value: 1,
                label: '生产架构'
            }],
            workshopData: {
                total: 0,
                size: 5,
                page: 0
            },
            departmentId: '', // 部门
            enterpriseId: '', // 企业
            listLoading: false,
        };
    },
    created() {
        // 项目列表 项目人员显示
        if (!this.isSelect) {
            this.colConfig.splice(0,1)
            this.colConfig.splice(-2,2)
            this.colConfigspare = []
        }
    },
    mounted() {
        this.getDepartment({enterpriseId: enterpriseId,status: 1,})
    },
    methods: {
        /**搜索树*/
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        /** 获取部门树*/
        getDepartment(data = {}) {
            this.administrationArr = []
            this.productionArr = []
            getDepartmentList(data).then(res => {
                res.data.forEach((item)=>{
                    if(item.type === 0){ //行政树
                        this.administrationArr.push(item);
                    }else{ //生产树
                        this.productionArr.push(item);
                    }
                })
                this.departmentData = this.administrationArr
            })
        },
        // 树 - 转换获取的数据
        treeDataFor(list, pid = '0') {
            let parentObj = {};
            list.forEach(item => {
                parentObj[item.departmentId] = item;
            })
            return list.filter(item => item.pid == pid).map(item => (item.children = this.treeDataFor(list, item.departmentId), item));
        },
        /** 根据部门获取右边员工*/
        getStaffData(sign) {
            let _this = this
            this.listLoading = true
            const sendData = this.framework == 1?{
                productionDepartmentId: this.departmentId,
                enterpriseId: enterpriseId,
                ...this.searchobj,
                page: this.workshopData.page,
                size: this.workshopData.size,
            }:{
                departmentId: this.departmentId,
                ...this.searchobj,
                enterpriseId: enterpriseId,
                page: this.workshopData.page,
                size: this.workshopData.size,
            }
            getStaffPage(sendData).then(res => {
                let filterData = {}
                if (!this.isSelect) {
                    filterData.data = res.data.data.filter(item => !item.staff.isLock)
                    filterData.total = filterData.data.length
                }
                _this.listLoading = false
                res.data.data.forEach(item => item.staff.isLock = item.staff.isLock?true:false)
                    this.workshopData.data = res.data.data
                    this.workshopData.total = res.data.total
                    this.workshopData.pageSize = res.data.pageSize
            })
        },
        /** 点击树获取人员*/
        handleTreeClick(data,sign){
            console.log(data)
            this.title = data.name
            this.departmentId = data.departmentId;
            this.enterpriseId = data.enterpriseId;
            this.getStaffData(sign)
        },
        /** 状态改变*/
        changeItemSwitch(val){
            operationStaffIsLock(val.staffId).then((res)=>{
                this.$message({
                    message: val.isLock == 1?'锁定成功':'解锁成功',
                    type: 'success'
                });
            })
        },
        /**修改人员信息*/
        handleEditAllInfo(row){
            this.$router.push({
                name: 'person-add',
                query:{
                    staffId: row.staff.staffId,
                }
            })
        },
        //分页
        changePage(e,sign){
            sign == 1? this.workshopData.page=e : this.newproductionData.page=e
            this.getStaffData()
        },
        //搜索
        handleSubmit(model) {
            this.searchobj = {
                ...model
            }
            this.getStaffData(1)
        },
        //新增
        add(){
            this.framework == 0? this.$router.push({
                    name: 'person-add',
                    query:{
                        //   designQaId:row.designQaId,
                    }
                }) : this.newproductionVisible = true
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 行点击事件
        handleRowClick(row, column, event) {
            if (!this.isSelect) {
                this.$confirm('是否选择该人员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                }).then(() => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
                this.$emit('rowClick', row)
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
                });
            }
        }
    }
};
</script>

<style scoped lang="scss">
.person-index{
    .newproduction_box{
        display: flex;
        justify-content: space-around;
        .newproduction_tree{
            height: 300px;
            overflow-y: auto;
            width: 200px;
        }
        .newproduction_table{
            height: 300px;
        }
    }
}
    .main {
        width: 100%;
        display: flex;
        flex-direction: row;
        height: 100%;
        .left {
            margin-right: 8px;
            padding: 16px;
            box-sizing: border-box;
            background-color: #fff;
            position:relative;
            .el-select {
                width: 100%;
            }
            .selectBox {
                margin: 16px 0;
                .el-select {
                    width: 85px;
                }
            }
        ::v-deep .el-tree-node__content {
            .el-tree-node__label {
                padding: 8px 0;
            }
        }
        .footer {
            position: absolute;
            left: 16px;
            bottom: 16px;
            .edit {
                color: #909399;
            }
        }
        }
        .right {
            width: 85%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .m-sselect {
                background-color: #fff;
                padding: 16px 16px 0 16px;
            }
            .select-List {
                margin-top: 8px;
                background-color: #fff;
                padding: 16px;
                .nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // padding:21px 16px;
                    margin-bottom: 16px;
                    p {
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .navallBnt {
                        .el-button{
                            padding: 8px 20px;
                            border-radius: 0;
                        }

                    }
                }
            }
        }
    .slot-tree{
		height: 80%;
		margin: 0 auto;
		padding: 1em;
		overflow-y: auto;
	}
	/*顶部按钮*/
	.slot-tree .slot-t-top{
		margin-bottom: 15px;
	}
	.slot-tree .slot-t-node span{
		display: inline-block;
	}
	/*节点*/
	.slot-tree .slot-t-node--label{
		font-weight: 600;
	}
	/*输入框*/
	.slot-tree .slot-t-input .el-input__inner{
		height: 26px;
		line-height: 26px;
	}
	/*按钮列表*/
	.slot-tree .slot-t-node .slot-t-icons{
		display: none;
		margin-left: 10px;
	}
	.slot-tree .slot-t-icons .el-button+.el-button{
		margin-left: 6px;
	}
	.slot-tree .el-tree-node__content:hover .slot-t-icons{
		display: inline-block;
	}
    .slot-t-icons {
        margin-left: 30px;
        i {
            padding: 0 10px;
        }
    }
    }
</style>
