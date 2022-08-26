<template>
    <div class="flex_row_space hidden_y hidden_x role">
        <div class="padding bf fx_4px ">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-tree class="expand-tree scroll_y" :data="departmentData" :props="defaultProps" :filter-node-method="filterNode" @node-click="handleDepartmentRow" default-expand-all ref="tree"></el-tree>
        </div>

        <div class="container-style container-padding role-list">
            <el-form :inline="true" class="flex_row_space" size="small">
                <el-form-item>
                    <!--					<el-row type="flex">
                                          <el-input v-model="searchVal" placeholder="请输入角色名称"></el-input>
                                          <el-button class="m-btn-small tool-bar-button&#45;&#45;24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
                                        </el-row>-->
                </el-form-item>
                <el-form-item v-if="positionId!=''">
                    <el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleAddRoleFormShow">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table class="btn-pointer" ref="multipleTable" :row-class-name="tableRowClassName" :highlight-current-row="true" v-loading="isLoading.list" :data="roleTableData" @row-click="handleCurrentPower" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="角色名称" width="300">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="添加时间" width="300">
                    <template slot-scope="scope">{{ scope.row.addTime }}</template>
                </el-table-column>
                <el-table-column label="更新时间" width="300">
                    <template slot-scope="scope">{{ scope.row.updTime}}</template>
                </el-table-column>
                <el-table-column label="是否开启" width="160">>
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleRoleTableSwitch(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button @click.stop="handleEditFormShow(1,scope.row)" type="text" size="small">分配权限</el-button>
                        <el-button v-if="scope.row.status == 1" @click.stop="handleEditFormShow(2,scope.row.roleId)" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="分配权限" class="jurisdiction_box" center :visible.sync="jurisdictionShow" width="510px">
            <div class=" role-power">
                <el-tree v-if="activeRoleId" ref="powerTree" v-loading="isLoading.tree" empty-text="" :props="defaultProps" node-key="powerId" show-checkbox :data="powerListData"></el-tree>
                <el-empty v-else description="请先选择角色"></el-empty>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="jurisdictionShow = false">取 消</el-button>
               <el-button class="role-power-header__btn" type="primary" size="small" @click="handleSaveTreeChecked">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="roleFormData.title+'角色'"  :visible.sync="dialogAddRoleShow">
            <el-form ref="roleForm" :model="roleFormData" label-width="80px" :rules="roleRules">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleFormData.name" placeholder="请输入角色名称" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色权限">
                    <el-switch v-model="roleFormData.status" :active-value="1" :inactive-value="0" ></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRoleShow = false">取 消</el-button>
                <el-button type="primary" @click="handleRoleFormConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    operationRole,
    getRolePage,
    operationAdminRoleStatus,
    getRoleAndPower,
    getPowerList,
    operationRolePower,
    getRoleDetail,
    getDepartmentList, getPositionList,
    getPositionRole,
    getEnterpriseAndPower
} from '@/api/productionManagement/departmentRole.js';
import {
    enterpriseId
} from '@/assets/productionManagement/comjs/login.js'
export default{
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    data(){
        return{
            filterText: '', // tree过滤字段
            positionId: '', // 岗位id
            departmentData: [], // 部门管理 - 列表渲染数据
            dialogAddRoleShow: false, //是否显示新增角色弹框
            roleFormData: this.initRoleFormData(), //新增角色表单数据
            roleTableData: [], // 角色table表单数据
            roleTableSelection: [], //角色table选择的人员数组
            defaultProps: { //树组件渲染节点属性名
                children: 'children',
                label: 'name',
                isLeaf: 'children'
            },
            powerNormalListData: [], //权限列表未转换前的数据
            powerListData: [], //权限列表数据
            powerListChecked: [], //权限列表选中的powerId数组
            activeRoleId: '', //当前选中的角色id
            isLoading:{ //loading
                list: false,
                tree: false
            },
            searchVal: '',
            roleRules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { max: 32, message: '角色名称不能超过32个字符', trigger: 'blur' }
                ],
            },
            jurisdictionShow: false // 分配权限弹框
        }
    },
    mounted() {
        this.getDepartmentListData(); // 获取部门
        this.getPowerListData();
    },
    methods:{
        /**搜索树*/
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        /**根据岗位获取角色*/
        getpositionRole(data={}) {
            this.isLoading.list = true;
            getPositionRole(data).then(res => {
                this.roleTableData = res.data;
                this.isLoading.list = false;
            })
        },
        // 部门管理 - 获取列表数据
        getDepartmentListData(data = {type: 0,enterpriseId:enterpriseId}) {
            getDepartmentList(data).then((res) => {
                this.departmentData = res.data;
            }).finally(() => {

            })
        },
        handleDepartmentRow(item,node) {
            if(item.positionId) {
                this.positionId = item.positionId
                this.getpositionRole(item.positionId)  // 有岗位id根据岗位获取角色
            }
            getPositionList({ // 点击部门获取岗位
                departmentId: item.departmentId
            }).then((res) => {
                node.data.children = res.data
            }).finally(() => {

            })
        },
        tableRowClassName({row, rowIndex}){
            if(row.status == 0){
                return 'table-row--lock'
            }
        },
        // 初始化新增角色表单
        initRoleFormData(){
            return {
                name: '',
                roleId: '',
                status: 1,
            }
        },
        // 获取权限列表
        getPowerListData() {
            getEnterpriseAndPower(enterpriseId)
                .then(res => {
                    this.powerNormalListData = this.powerTableDataFor(res.data.powers);
                    this.powerListData = this.powerTableDataFor(res.data.powers);
                })
        },
        // 权限列表渲染数据转换
        powerTableDataFor(list, pid = 0) {
            return list.filter(item => item.pid == pid).map(item => (item.children = this.powerTableDataFor(list, item.powerId), item));
        },
        // 点击弹出新增角色表单
        handleAddRoleFormShow(){
            this.roleFormData = this.initRoleFormData();
            this.roleFormData.title = '新增';
            this.dialogAddRoleShow = true;
        },
        // 点击弹出编辑角色表单
        handleEditFormShow(sign,data){
            switch (sign){
                case 1:
                    this.jurisdictionShow = true;
                    this.handleCurrentPower(data)
                    break;
                case 2:
                    getRoleDetail(data).then((res)=>{
                        this.roleFormData = res.data;
                        this.roleFormData.title = '编辑';
                        this.dialogAddRoleShow = true;
                    })
                    break;
            }
        },
        // 点击弹框确认
        handleRoleFormConfirm(){
            this.$refs.roleForm.validate((valid) => {
                if (valid) {
                    this.roleFormData.positionId = this.positionId
                    operationRole(this.roleFormData).then((res)=>{
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                    }).finally(() => {
                        this.dialogAddRoleShow = false;
                    })
                }
            });
        },
        // 切换角色列表
        handleSelectionChange(val) {
            this.roleTableSelection = val;
        },
        //切换禁用开启角色
        handleRoleTableSwitch(row){
            event.stopPropagation();
            operationAdminRoleStatus(row.roleId).then((res)=>{
                if(res.data.status == 1){
                    this.$message({
                        message: '角色开启成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '角色禁用成功',
                        type: 'success'
                    });
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
                    let powers = res.data.powers;
                    /*     for (let i = 0; i < this.powerNormalListData.length; i++) {
                             for (let j = 0; j < powers.length; j++) {
                                 if (this.powerNormalListData[i].powerId == powers[j].powerId) {
                                     this.powerListChecked.push(powers[j].powerId);
                                 }
                             }
                         }*/
                    this.powerListChecked = [...powers]
                    this.$refs.powerTree.setCheckedNodes(this.powerListChecked);
                })
                .finally(() => {
                    this.isLoading.tree = false;
                });
        },
        // 保存选择的权限
        handleSaveTreeChecked(){
            if(!this.activeRoleId){
                this.$message.error('请先选择角色');
                return;
            }
            operationRolePower({
                powerIds: this.$refs.powerTree.getCheckedKeys(),
                roleId: this.activeRoleId
            }).then((res)=>{
                this.jurisdictionShow = false
                this.$message({
                    message: '保存权限成功',
                    type: 'success'
                });
            })
        },
        handleSearch(){
            // this.getRolePageData();
        }
    }
}
</script>

<style lang="scss" scoped>
.role{
    width: 100%;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: row;
    .jurisdiction_box{
        .el-dialog{
            width: 500px!important;
        }
    }
    .expand-tree{
        margin-top: 10px;
        height: calc(100% - 50px);
    }
}
.table-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.role-list{
    flex: 1;
    margin: 20px 8px 20px 2px;
    border: 1px solid #E4E7ED;
}
.role-power{
    width: 100%;
    height: 400px;
    overflow-y: auto;
}
// table锁定行样式
::v-deep .el-table .table-row--lock{
    .cell{
        color: #C0C4CC !important;
    }
}
</style>
