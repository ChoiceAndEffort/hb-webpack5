<!--人事管理-->
<template>
    <div class="main person-index">
        <div class="left">
            <div class="selectBox">
                <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="input-with-select" @change="hangleSelect">
                    <!--                       <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    <el-select v-model="level" slot="prepend" placeholder="请选择" @change="hangleSelect">
                        <el-option label="部门" :value=1></el-option>
                        <el-option label="公司" :value=0></el-option>
                    </el-select>-->
                </el-input>
            </div>
            <el-tree class="expand-tree" :data="administrationArr" :props="defaultProps" :filter-node-method="filterNode" default-expand-all ref="tree" @node-click="(data) => handleTreeClick(data,1)"></el-tree>
        </div>
        <div class="right">
            <div class="m-sselect">
                <Form ref="accountForm" formName="accountForm" width="auto" :inline="true" primary="primary" size="small" submitContext="查询" :renderData="prefabricationData" @handleSubmit="handleSubmit">
                </Form>
            </div>
            <div class="select-List">
                <div class="nav">
                    <p>{{ departmentName }}</p>
                    <div v-if="isSelect">
                        <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增</el-button>
                    </div>
                </div>

                <TableBody :rowClassNames="tableRowClassName" :colConfig="colConfig.concat(colConfigspare)" :data="workshopData.data" @selection-change="handleSelectionChange" v-loading="listLoading" @row-click="handleRowClick">
                    <template slot="departmentName" slot-scope="{scope}">
                        <template v-for="(item,index) in scope.row.positionList">
                            <p :key="index" v-if="item.departmentId == departmentId">{{item.departmentName}}</p>
                        </template>

                    </template>
                    <template slot="positionName" slot-scope="{scope}">
                        <template v-for="(item,index) in scope.row.positionList">
                            <p :key="index" v-if="item.departmentId == departmentId">{{item.name}}</p>
                        </template>
                    </template>
                    <template slot="btns" slot-scope="{scope}">
                        <el-button size="mini" type="text" @click="handleEditAllInfo(scope.row)">修改</el-button>
                    </template>
                    <template slot="staff.isLock" slot-scope="{scope}">
                        <el-switch v-model="scope.row.staff.isLock" @change="changeItemSwitch(scope.row.staff)" active-color="#409eff"></el-switch>
                    </template>
                </TableBody>
                <Pagination :data="workshopData" @changePage="(e) => changePage(e,1)" />
            </div>
        </div>
        <el-dialog title="新增生产架构" :visible.sync="newproductionVisible">
            <div class="newproduction_box">
                <el-tree class="expand-tree newproduction_tree" :data="administrationArr" :props="defaultProps" default-expand-all ref="tree" @node-click="(data) => handleTreeClick(data,2)"></el-tree>
                <div>
                    <TableBody class="newproduction_table" :colConfig="colConfig" :data="newproductionData.data" @selection-change="handleSelectionChange">
                        <template slot="btns" slot-scope="{scope}">
                            <el-button size="mini" type="text" @click="handleEditAllInfo(scope.row)">修改</el-button>
                        </template>
                        <template slot="staff.isLock" slot-scope="{scope}">
                            <el-switch v-model="scope.row.staff.isLock" @change="changeItemSwitch(scope.row.staff)" active-color="#409eff"></el-switch>
                        </template>
                    </TableBody>
                    <Pagination :data="newproductionData" @changePage="(e) => changePage(e,2)" />
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newproductionVisible = false">取 消</el-button>
                <el-button type="primary" @click="newproduction">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getDepartmentList,
    getStaffPage,
    operationStaffIsLock,
} from "@/api/productionManagement/departmentRole.js";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import { Form, TableBody, Pagination } from "gggj_lib";
export default {
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    components: { Form, TableBody, Pagination },
    props: {
        // 表格是否为多选类型
        isSelect: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            filterText: "", // tree过滤字段
            colConfig: [
                {
                    attrs: { align: "center", type: "selection" },
                },
                {
                    attrs: {
                        label: "序号",
                        prop: "index",
                        align: "center",
                        type: "index",
                    },
                },
                {
                    attrs: {
                        label: "姓名",
                        prop: "staff.name",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "工号",
                        prop: "staff.number",
                        align: "center",
                    },
                },
                {
                    slot: "departmentName",
                    attrs: {
                        label: "部门",
                        prop: "positionList[0].departmentName",
                        align: "center",
                    },
                },
                {
                    slot: "positionName",
                    attrs: {
                        label: "岗位",
                        prop: "positionList[0].name",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "手机号",
                        prop: "staff.mobile",
                        align: "center",
                    },
                },
            ],
            colConfigspare: [
                {
                    slot: "btns",
                    attrs: {
                        label: "操作",
                        fixed: "right",
                        width: 80,
                        align: "center",
                    },
                },
                {
                    slot: "staff.isLock",
                    attrs: {
                        label: "状态",
                        fixed: "right",
                        width: 80,
                        align: "center",
                    },
                },
            ],
            prefabricationData: [
                {
                    tag: "el-input",
                    attrs: {
                        label: "姓名：",
                        key: "name",
                        type: "text",
                        clearable: true,
                        value: "",
                        placeholder: "请输入姓名",
                    },
                },
                {
                    tag: "el-input",
                    attrs: {
                        label: "工号：",
                        key: "number",
                        type: "text",
                        clearable: true,
                        value: "",
                        placeholder: "请输入工号",
                    },
                },
                {
                    tag: "el-input",
                    attrs: {
                        label: "手机号：",
                        key: "mobile",
                        type: "text",
                        clearable: true,
                        value: "",
                        placeholder: "请输入手机号",
                    },
                },
                {
                    tag: "reset", // 重置按钮
                },
                {
                    tag: "submit", // 提交按钮
                },
            ],
            searchobj: {
                name: "",
                mobile: "",
                number: "",
            },
            buttonText: "查询",
            searchVal: "",
            level: "",
            defaultProps: {
                children: "children", //treeData中子节点名称
                label: "name", //treeData中label的名称
            },
            administrationArr: [], // 行政树
            productionArr: [], //生产
            treeSelectData: [
                {
                    //树组件 - 选择架构
                    value: 0,
                    label: "行政架构",
                },
                {
                    value: 1,
                    label: "生产架构",
                },
            ],
            workshopData: {
                total: 0,
                size: 10,
                page: 0,
                currentPage: 0,
                lastPage: 0,
                totalPages: 2,
                first: true,
                last: true,
                data: [],
            },
            departmentId: "", // 部门
            enterpriseId: "", // 企业
            departmentName: "",
            newproductionVisible: false,
            newproductionData: {
                total: 0,
                size: 10,
                page: 0,
                currentPage: 0,
                lastPage: 0,
                totalPages: 2,
                first: true,
                last: true,
                data: [],
            },
            listLoading: false,
        };
    },
    created() {
        // 项目列表 项目人员显示
        if (!this.isSelect) {
            this.colConfig.splice(0, 1);
            this.colConfig.splice(-2, 2);
            this.colConfigspare = [];
        }
    },
    mounted() {
        this.getDepartment();
    },
    methods: {
        // 改变表格行样式
        tableRowClassName({ row, rowIndex }) {
            if (row.staff.isLock == false) {
                return "table-row--lock";
            }
        },
        /**搜索树*/
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        /** 获取部门树*/
        getDepartment(data = {}) {
            this.administrationArr = [];
            this.productionArr = [];
            const sendData = {
                enterpriseId: enterpriseId,
                type: 0,
                status: 1,
                level: this.level,
                name: this.searchVal,
            };
            getDepartmentList(sendData).then((res) => {
                this.administrationArr = res.data;
            });
        },
        // 树 - 转换获取的数据
        treeDataFor(list, pid = "0") {
            let parentObj = {};
            list.forEach((item) => {
                parentObj[item.departmentId] = item;
            });
            return list
                .filter((item) => item.pid == pid)
                .map(
                    (item) => (
                        (item.children = this.treeDataFor(
                            list,
                            item.departmentId
                        )),
                        item
                    )
                );
        },
        /** 根据部门获取右边员工*/
        getStaffData(sign) {
            let _this = this;
            this.listLoading = true;
            const sendData = {
                departmentId: this.departmentId,
                enterpriseId: enterpriseId,
                ...this.searchobj,
                page:
                    sign == 1
                        ? this.workshopData.page
                        : this.newproductionData.page,
                size:
                    sign == 1
                        ? this.workshopData.size
                        : this.newproductionData.size,
            };
            getStaffPage(sendData).then((res) => {
                let filterData = {};
                if (!this.isSelect) {
                    filterData.data = res.data.data.filter(
                        (item) => !item.staff.isLock
                    );
                    filterData.total = filterData.data.length;
                }
                _this.listLoading = false;
                res.data.data.forEach(
                    (item) =>
                        (item.staff.isLock = item.staff.isLock ? false : true)
                );
                if (sign == 1) {
                    this.workshopData.data = res.data.data;
                    this.workshopData.total = res.data.total;
                    !this.isSelect &&
                        (this.workshopData.data = filterData.data);
                    !this.isSelect &&
                        (this.workshopData.total = filterData.total);
                } else {
                    this.newproductionData.data = res.data.data;
                    this.newproductionData.total = res.data.total;
                    !this.isSelect &&
                        (this.newproductionData.data = filterData.data);
                    !this.isSelect &&
                        (this.newproductionData.total = filterData.total);
                }
            });
        },
        /** 点击树获取人员*/
        handleTreeClick(data, sign) {
            sign == 1
                ? (this.workshopData.page = 0)
                : (this.newproductionData.page = 0);
            this.departmentId = data.departmentId;
            this.departmentName = data.name;
            this.getStaffData(sign);
        },
        /**新增生产架构点击树*/
        /*    newproductionTreeClick(data){
            this.departmentId = data.departmentId;
            this.enterpriseId = data.enterpriseId;
            this.getStaffData(sign)
        },*/
        //搜索
        hangleSelect() {
            this.getDepartment();
        },
        /** 状态改变*/
        changeItemSwitch(val) {
            operationStaffIsLock(val.staffId).then((res) => {
                this.$message({
                    message: val.isLock == 1 ? "解锁成功" : "锁定成功",
                    type: "success",
                });
            });
        },
        /**修改人员信息*/
        handleEditAllInfo(row) {
            this.$router.push({
                name: "person-add",
                query: {
                    staffId: row.staff.staffId,
                },
            });
        },
        /**新增生产架构*/
        newproduction() {},
        //分页
        changePage(e, sign) {
            sign == 1
                ? (this.workshopData.page = e)
                : (this.newproductionData.page = e);
            this.getStaffData(sign);
        },
        //新增部门
        handleAddTop() {
            //添加顶级节点
            this.data.push({
                label: "新增顶级节点",
                pid: "",
                children: [],
            });
        },
        NodeBlur(n, d) {
            //输入框失焦
            if (n.isEdit) {
                this.$set(n, "isEdit", false);
            }
        },
        //搜索
        handleSubmit(model) {
            this.searchobj = {
                ...model,
            };
            this.getStaffData(1);
        },
        //新增
        add() {
            this.$router.push({
                name: "person-add",
                query: {},
            });
        },
        //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 行点击事件
        handleRowClick(row, column, event) {
            if (!this.isSelect) {
                this.$confirm("是否选择该人员?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
                    .then(() => {
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                        });
                        this.$emit("rowClick", row);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消操作",
                        });
                    });
            }
        },
    },
};
</script>

<style scoped lang="scss">
.person-index {
    // table锁定行样式
    ::v-deep .el-table .table-row--lock {
        .cell {
            color: #c0c4cc !important;
        }
    }
    ::v-deep .el-form-item--small.el-form-item:first-child {
        .el-form-item__label-wrap {
            margin-left: 0 !important;
        }
    }
    ::v-deep .el-form-item__label-wrap {
        margin-left: 24px !important;
    }
    .newproduction_box {
        display: flex;
        justify-content: space-around;
        .newproduction_tree {
            height: 300px;
            overflow-y: auto;
            width: 200px;
        }
        .newproduction_table {
            height: 300px;
        }
    }
}
.main {
    display: flex;
    flex-direction: row;
    height: 100%;
    .left {
        flex: 0 0 322px;
        border-radius: 2px;
        padding: 16px;
        box-sizing: border-box;
        background-color: #fff;
        position: relative;
        overflow: auto;
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
        flex: 1;
        margin-left: 8px;
        border-radius: 2px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .m-sselect {
            height: 69px;
            background-color: #fff;
            padding: 18px 16px 0 16px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .search_btn {
                height: max-content;
            }
        }
        .select-List {
            flex: 1;
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
                    .el-button {
                        padding: 8px 20px;
                        border-radius: 0;
                    }
                }
            }
        }
    }
    .slot-tree {
        width: 80%;
        height: 80%;
        margin: 0 auto;
        padding: 1em;
        max-width: 600px;
        overflow-y: auto;
    }
    /*顶部按钮*/
    .slot-tree .slot-t-top {
        margin-bottom: 15px;
    }
    .slot-tree .slot-t-node span {
        display: inline-block;
    }
    /*节点*/
    .slot-tree .slot-t-node--label {
        font-weight: 600;
    }
    /*输入框*/
    .slot-tree .slot-t-input .el-input__inner {
        height: 26px;
        line-height: 26px;
    }
    /*按钮列表*/
    .slot-tree .slot-t-node .slot-t-icons {
        display: none;
        margin-left: 10px;
    }
    .slot-tree .slot-t-icons .el-button + .el-button {
        margin-left: 6px;
    }
    .slot-tree .el-tree-node__content:hover .slot-t-icons {
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
