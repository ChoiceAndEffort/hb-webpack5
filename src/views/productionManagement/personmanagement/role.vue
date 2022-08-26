<template>
    <div class="app-container role">
        <div class="container-style container-padding role-list">
            <el-form :inline="true" size="small">
                <el-form-item>
                    <el-row type="flex">
                        <el-input placeholder="请输入角色名称" v-model="searchVal" class="input-with-select">
                        </el-input>
                        <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px" @click="handleSearch">搜索</el-button>
                    </el-row>
                </el-form-item>
                <el-form-item><el-button class="add-btn" style="margin-left: 20px" type="primary" icon="el-icon-plus" @click="handleAddRoleFormShow">新增</el-button></el-form-item>
            </el-form>
            <el-table
                class="btn-pointer"
                ref="multipleTable"
                header-row-class-name="table-header-gray"
                :row-class-name="tableRowClassName"
                :highlight-current-row="true"
                v-loading="isLoading.list"
                :data="roleTableData.data"
                @row-click="handleCurrentPower"
                tooltip-effect="dark"
                style="width: 100%"
                max-height="740"
            >
                <el-table-column label="角色名称" width="200">
                    <template slot-scope="scope">
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" width="300">
                    <template slot-scope="scope">
                        <p>{{scope.row.addTime | shorttime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" width="300">
                    <template slot-scope="scope">
                        <p>{{scope.row.updTime | shorttime}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="是否开启" width="160">
                    >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleRoleTableSwitch(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1" @click.stop="handleEditFormShow(scope.row.roleId)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            <el-row type="flex" justify="center">
                <el-pagination class="pagination" layout="prev, pager, next" @current-change="changePage" :page-count="totalPages"></el-pagination>
            </el-row>-->
        </div>
        <div class="container-style container-padding role-power">
            <div class="role-power-header">
                <h3 class="role-power-header__title">权限分配</h3>
                <el-button class="role-power-header__btn" type="primary" size="mini" @click="handleSaveTreeChecked" v-if="activeRoleId!=''">保存</el-button>
            </div>
            <el-tree
                v-if="activeRoleId"
                ref="powerTree"
                v-loading="isLoading.tree"
                :props="defaultProps"
                node-key="powerId"
                show-checkbox
                :data="powerListData"
            ></el-tree>
            <el-empty v-else description="请先选择角色"></el-empty>
        </div>
        <!-- 新增 -->
        <el-dialog :title="roleFormData.title + '角色'" :visible.sync="dialogAddRoleShow">
            <el-form ref="roleForm" :model="roleFormData" label-width="80px" :rules="roleRules">
                <el-form-item label="角色名称" prop="name"><el-input v-model="roleFormData.name" placeholder="请输入角色名称" autocomplete="off"></el-input></el-form-item>
                <el-form-item label="所属企业" prop="enterpriseId" v-if="this.$store.getters.isAdmin">
                    <el-select v-model="roleFormData.enterpriseId" placeholder="请选择">
                        <el-option v-for="item in corpList" :key="item.enterpriseId" :label="item.name" :value="item.enterpriseId"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="角色权限"><el-switch v-model="roleFormData.status" :active-value="1" :inactive-value="0"></el-switch></el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRoleShow = false">取 消</el-button>
                <el-button type="primary" @click="handleRoleFormConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { operationRole, getRolePage, operationAdminRoleStatus, getEnterpriseAndPower, operationRolePower, getRoleDetail, getcorpPage,getRoleAndPower } from '@/api/productionManagement/departmentRole.js';
import {
    enterpriseId
} from '@/assets/productionManagement/comjs/login.js'
export default {
    data() {
        return {
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            dialogAddRoleShow: false, //是否显示新增角色弹框
            roleFormData: this.initRoleFormData(), //新增角色表单数据
            roleTableData: {}, // 角色table表单数据
            roleTableSelection: [], //角色table选择的人员数组
            defaultProps: {
                //树组件渲染节点属性名
                children: 'children',
                label: 'name'
            },
            powerNormalListData: [], //权限列表未转换前的数据
            powerListData: [], //权限列表数据
            powerListChecked: [], //权限列表选中的powerId数组
            activeRoleId: [], //当前选中的角色id
            isLoading: {
                //loading
                list: false,
                tree: false
            },
            searchVal: '',
            corpList: [],
            roleRules: {
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { max: 32, message: '角色名称不能超过32个字符', trigger: 'blur' }],
                enterpriseId: [{ required: true, message: '请选择企业', trigger: 'change' }]
            }
        };
    },
    components:{
    },
    mounted() {
        this.getRolePageData()
        this.getPowerListData();
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (row.status == 0) {
                return 'table-row--lock';
            }
        },
        getcorpList() {
            getcorpPage({}).then(res => {
                this.corpList = res.data;
            })
        },
        // 获取角色列表分页数据
        getRolePageData() {
            this.isLoading.list = true;
            getRolePage({
                enterpriseId: enterpriseId,
                name: this.searchVal,
                size: 1000,
                page: this.page,
            }).then(res => {
                this.roleTableData = res.data;
                this.totalPages = res.data.totalPages;
            }).finally(() => {
                this.isLoading.list = false;
            });
        },
        // 初始化新增角色表单
        initRoleFormData() {
            return {
                enterpriseId: enterpriseId,
                name: '',
                roleId: '',
                status: 1,
            };
        },
        // 获取权限列表
        getPowerListData() {
            getEnterpriseAndPower(enterpriseId)
                .then(res => {
                    this.powerNormalListData = res.data.powers;
                    res.data.powers.forEach(res => {
                        this.powerListData.push(res)
                    })
                })
        },
        //翻页
        changePage(e) {
            this.page = e - 1;
            this.getRolePageData();
        },
        // 点击弹出新增角色表单
        handleAddRoleFormShow() {
            this.roleFormData = this.initRoleFormData();
            this.roleFormData.title = '新增';
            this.dialogAddRoleShow = true;
        },
        // 点击弹出编辑角色表单
        handleEditFormShow(roleId) {
            getRoleDetail(roleId).then(res => {
                this.roleFormData = res.data;
                this.roleFormData.title = '编辑';
                this.dialogAddRoleShow = true;
            });
        },
        // 点击弹框确认
        handleRoleFormConfirm() {
            this.roleFormData.enterpriseName = undefined
            this.$refs.roleForm.validate(valid => {
                if (valid) {
                    operationRole(this.roleFormData)
                        .then(res => {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.getRolePageData();
                        })
                        .finally(() => {
                            this.dialogAddRoleShow = false;
                        });
                }
            });
        },
        //切换禁用开启角色
        handleRoleTableSwitch(row) {
            event.stopPropagation();
            operationAdminRoleStatus(row.roleId).then(res => {
                if (res.data.status == 1) {
                    this.$message({
                        message: '角色开启成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '角色禁用成功',
                        type: 'success'
                    });
                }
            });
        },
        getChildrenid(data) {
            data.forEach(res => {
                if(res.children!=null){
                    this.getChildrenid(res.children)
                }else{
                    this.powerListChecked.push(res)
                }
            })
        },
        // 获取当前角色权限
        handleCurrentPower(itemData) {
            if (itemData.status == 0) {
                this.$message.error('角色已禁用');
                return;
            }
            this.activeRoleId = itemData.roleId; //得到当前角色id
            this.isLoading.tree = true;
            this.powerListChecked = []; //清空当前角色的权限数组
            // 遍历获取到当前角色默认选中的数组
            getRoleAndPower(itemData.roleId)
                .then(res => {
                    let powers = res.data.powers==null? [] : res.data.powers;
                    this.getChildrenid(powers)
                    this.$refs.powerTree.setCheckedNodes(this.powerListChecked);
                })
                .finally(() => {
                    this.isLoading.tree = false;
                });
        },

        // 保存选择的权限
        handleSaveTreeChecked() {
            if (!this.activeRoleId) {
                this.$message.error('请先选择角色');
                return;
            }
            operationRolePower({
                powerIds: this.$refs.powerTree.getCheckedKeys().concat(this.$refs.powerTree.getHalfCheckedKeys()),
                roleId: this.activeRoleId
            }).then(res => {
                this.$message({
                    message: '保存权限成功',
                    type: 'success'
                });
            });
        },
        handleSearch() {
            this.getRolePageData();
        }
    }
};
</script>

<style lang="scss" scoped>
.role {
    display: flex;
    flex-direction: row;
    height: 100%;
}
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.role-list {
    flex: 1;
    margin-right: 8px;
}
.role-power {
    width: 600px;
    .role-power-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .role-power-header__title{
            margin-bottom: 20px;
        }
        .role-power-header__btn {
            height: 30px;
        }
    }
}
// table锁定行样式
::v-deep .el-table .table-row--lock {
    .cell {
        color: #c0c4cc !important;
    }
}
::v-deep .el-select > .el-input {
    width: 110px;
}
.pagination {
    margin: 20px auto;
    text-align: center;
}
</style>
