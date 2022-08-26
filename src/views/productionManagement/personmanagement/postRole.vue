<template>
	<div class="flex_row_space post_management hidden_y">
        <div class=" bf left">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>
            <el-tree class="expand-tree post_tree scroll_y" :data="positionData" :props="defaultProps" :filter-node-method="filterNode" default-expand-all ref="tree" @node-click="handleDepartmentRow"></el-tree>
        </div>
		<div class="position-list container-padding right">
			<div class="table-header">
				<div class="table-header-title">岗位角色管理</div>
			</div>
			<el-divider></el-divider>
<!--            <el-table :data="positionData" class="btn-pointer"  v-loading="isLoading.positionList" style="width: 100%">-->
			<el-table ref="positionTable" :data="tablePositionData" header-row-class-name="table-header-gray" class="btn-pointer"  v-loading="isLoading.positionList" style="width: 100%" row-key="positionId" @expand-change="expandChange">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-card shadow="always">
                            <div v-if="positionData[scope.$index].segmentList.length>0" class="flex_row_center">
                                <el-tag v-for="item in positionData[scope.$index].segmentList">{{item.name}}</el-tag>
                            </div>
                            <p v-else class="flex_row_center">暂无角色~</p>
                        </el-card>
                    </template>
                </el-table-column>
				<el-table-column prop="name" label="岗位名称"></el-table-column>
				<el-table-column prop="sort" label="排序"></el-table-column>
				<el-table-column prop="rank" label="职级" width="140"></el-table-column>
				<el-table-column fixed="right" label="操作" width="140">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click.stop="handleAddPosition(scope.row)">配置角色</el-button>
					</template>
				</el-table-column>
				<div slot="empty">{{!departmentActiveItemData.departmentId?'请先选择部门':'暂无数据'}}</div>
			</el-table>
		</div>
		<el-dialog :title="formData.title+'部门'" :visible.sync="isDialogShow.department">
			<el-form ref="departmentForm" :model="formData" :rules="departmentRules" label-width="80px">
				<el-form-item label="部门名称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入部门名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门类型">
					<el-select v-model="formData.type" placeholder="请选择">
						<el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上级部门">
					<el-select v-model="formData.pid">
						<el-option label="顶级" :value="undefined"></el-option>
						<el-option-group v-for="group in data" :label="group.name">
							<el-option :label="group.name" :value="group.departmentId"></el-option>
							<el-option v-for="item in group.children" :key="item.departmentId" :label="item.name"
								:value="item.departmentId"></el-option>
						</el-option-group>
					</el-select>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="formData.sort" controls-position="right" :min="1" :max="999">
					</el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.department = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogConfirm" @click="handleFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="positionFormData.title+'岗位'" :visible.sync="isDialogShow.position">
			<el-form ref="positionForm" :model="positionFormData" :rules="positionRules" label-width="80px">
				<el-form-item label="岗位名称" prop="name">
					<el-input v-model="positionFormData.name" placeholder="请输入岗位名称" autocomplete="off" maxlength="32"></el-input>
				</el-form-item>
				<el-form-item label="岗位职级" prop="rank">
					<el-input-number v-model="positionFormData.rank" controls-position="right" :min="0" :max="999"></el-input-number>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="positionFormData.sort" controls-position="right" :min="1" :max="999">
					</el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.position = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.positionConfirm" @click="handlePostionFormConfirm">确 定
				</el-button>
			</div>
		</el-dialog>
		<el-dialog title="配置角色" :visible.sync="isDialogShow.role">
			<el-form ref="positionForm" label-width="80px">
				<el-form-item class="form-item-select" label="" prop="name">
                    <el-checkbox-group v-model="roleSelectId">
                        <el-checkbox v-for="item in roleListData" :label="item.roleId" :key="item.roleId">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
<!--					<el-select v-model="roleSelectId">
						<el-option v-for="item in roleListData" :key="item.roleId" :label="item.name" :value="item.roleId"></el-option>
					</el-select>-->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.role = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.positionConfirm" @click="handleRoleFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		operationDepartment,
		getDepartmentList,
		getDepartmentDetail,
		operationDepartmentStatus,
		operationPosition,
		getPositionList,
		getPositionRole,
		getRoleList,
		positionSetRole,
		positionRemoveRole
	} from '@/api/productionManagement/departmentRole.js'
    import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
	export default {
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
		data() {
			return {
                filterText: '', // tree过滤字段
				selectData: [{ //部门管理 - 选择组织架构select数据
					value: 0,
					label: '行政'
				}, {
					value: 1,
					label: '生产'
				}],
				data: [], // 部门管理 - 列表渲染数据
				positionData: [], // 岗位管理 - 列表渲染数据
                tablePositionData: [],
                positionDataIds: [],
				departmentActiveItemData: {
                    departmentId: '',
                }, // 部门管理选中的item数据
				defaultProps: { // 部门管理 - 列表渲染节点属性名
					children: 'children',
					label: 'name'
				},
				formData: this.initFormData(), // 部门管理 - 弹框 - 新增编辑表单数据
				positionFormData: this.initPositionFormData(), //岗位管理 - 弹框 - 新增编辑
				isLoading: {
					list: false, //部门管理
					dialogConfirm: false, //部门管理 - 弹框
					positionList: false, //岗位管理 - 列表
					positionConfirm: false, //岗位管理 - 弹框
				},
				isDialogShow: {
					department: false, // 部门管理
					position: false, //岗位管理
					role: false //角色
				},
				searchVal: '',
				departmentRules: {
					name: [{
							required: true,
							message: '请输入部门名称',
							trigger: 'blur'
						},
						{
							max: 32,
							message: '部门名称不能超过32个字符',
							trigger: 'blur'
						}
					],
				},
				positionRules: {
					name: [{
							required: true,
							message: '请输入岗位名称',
							trigger: 'blur'
						},
						{
							max: 32,
							message: '岗位名称不能超过32个字符',
							trigger: 'blur'
						}
					],
				},
				roleListData: [], //角色列表数据
				roleSelectId: [], //选择的角色数据
				currentPositionId: '', //当前选中的岗位id
				currentDepartmentId: '', //当前选中的部门
                /**配置角色储存主行数据*/
                rowData: {},
			}
		},
		mounted() {
			this.getPositionListData();
		},
		methods: {
            /**搜索树*/
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (row.status == 0) {
					return 'table-row--lock'
				}
			},
            // 获取角色列表数据
            getRoleListData(rowData) {
                getRoleList({
                    enterpriseId: enterpriseId,
                    status: 1
                }).then(res => {
                    this.roleListData = res.data;
                    this.roleSelectId = []
                    getPositionRole(rowData.positionId).then((res) => {
                        res.data.forEach(list => {
                            this.roleSelectId.push(list.roleId)
                        })
                    })
                });
            },
			// 岗位管理 - 获取列表数据
			getPositionListData() {
                this.positionDataIds = [];
				this.isLoading.positionList = true;
				getPositionList({
                    enterpriseId: enterpriseId
				}).then((res) => {
					let arr = [];
					res.data.forEach((item) => {
						item.segmentList =[];
                        this.positionDataIds.push(item.positionId)
						arr.push(item);
					})
					this.$set(this, 'positionData', arr);
				}).finally(() => {
					this.isLoading.positionList = false;
				})
			},
			// 部门管理 - 根据类型转换为文字
			listTypeFor(type) {
				let result = '';
				switch (type) {
					case 0:
						result = '行政'
						break;
					case 1:
						result = '生产'
						break;
					default:
						break;
				}
				return result;
			},
			// 部门管理 - 弹框-  初始化提交数据
			initFormData() {
				return {
					departmentId: undefined,
					name: '',
					pid: undefined,
					sort: 999,
					status: 1,
					type: 0
				}
			},
			// 岗位管理 - 弹框- 初始化提交数据
			initPositionFormData() {
				return {
					departmentId: '',
					name: '',
					pid: undefined,
					positionId: undefined,
					sort: 999,
					rank: 1,
				}
			},
			// 部门管理 -弹框 - 点击添加部门
			handleAddFormShow() {
				this.formData = this.initFormData();
				this.formData.title = '新增';
				this.isDialogShow.department = true;
			},
			// 部门管理- 弹框- 点击编辑部门
			handleEditFormShow(itemData) {
				this.formData = itemData;
				// getDepartmentDetail(departmentId).then((res)=>{
				// 	this.formData = res.data;
				this.formData.title = '编辑';
				this.isDialogShow.department = true;
				// })
			},
			// 部门管理 - 提交部门表单
			handleFormConfirm() {
				this.$refs.departmentForm.validate((valid) => {
					if (valid) {
						this.isLoading.dialogConfirm = true;
						operationDepartment(this.formData).then((res) => {
							this.$message({
								message: this.formData.title + '成功',
								type: 'success'
							});
							this.isDialogShow.department = false;
							this.getDepartmentListData();
						}).finally(() => {
							this.isLoading.dialogConfirm = false;
						})
					}
				});
			},
			// 部门管理 - 点击当前行切换岗位管理
			handleDepartmentRow(itemData) {
				if (itemData.status == 0) {
					this.$message.error('部门已禁用');
					return;
				}
				this.tablePositionData = [itemData];
			},
			// 部门管理- 列表 - 禁用开启部门
			handleOperationDepartmentStatus(itemData) {
				event.stopPropagation();
				operationDepartmentStatus(itemData.departmentId).then((res) => {
					this.$message({
						message: itemData.status == 1 ? '开启成功' : '关闭成功',
						type: 'success'
					});
				})
			},
			// 岗位管理 - 弹框显示 -新增
			handleAddPostionFormShow() {
				if (!this.departmentActiveItemData.departmentId) {
					this.$message.error('请先选择部门');
				} else {
					this.positionFormData = this.initPositionFormData();
					this.positionFormData.departmentId = this.departmentActiveItemData.departmentId;
					this.positionFormData.title = '新增';
					this.isDialogShow.position = true;
				}
			},
			// 岗位管理 - 弹框显示 - 编辑
			handleEditPositionFormShow(itemData) {
				this.positionFormData = Object.assign({},itemData);
				this.positionFormData.title = '编辑';
				this.isDialogShow.position = true;
			},
			// 岗位管理 - 弹框- 提交
			handlePostionFormConfirm() {
				this.$refs.positionForm.validate((valid) => {
					if (valid) {
						this.isLoading.positionConfirm = true;
						operationPosition(this.positionFormData).then((res) => {
							this.$message({
								message: this.positionFormData.title + '岗位成功',
								type: 'success'
							});
							this.getPositionListData(this.departmentActiveItemData.departmentId);
						}).finally(() => {
							this.isLoading.positionConfirm = false;
							this.isDialogShow.position = false;
						})
					}
				});
			},
			// 点击搜索
			handleSearch() {
				this.getDepartmentListData({
					name: this.searchVal
				});
			},
			// 配置角色
			handleAddPosition(rowData) {
				this.isDialogShow.role = true;
				this.currentPositionId = rowData.positionId;
                this.rowData = rowData
                this.getRoleListData(rowData);
			},
			// 懒加载 - 岗位下角色列表
            expandChange(expandedRows, expanded) {
                const idIndex = this.positionDataIds.indexOf(expandedRows.positionId)
				getPositionRole(expandedRows.positionId).then((res) => {
                        this.positionData[idIndex].segmentList.splice(0, this.positionData[idIndex].segmentList.length)
                        res.data.forEach(list => {
                            this.positionData[idIndex].segmentList.push(list)
                        })
				})
			},
			// 配置角色
			handleRoleFormConfirm() {
				positionSetRole({
					positionId: this.currentPositionId,
                    roleIds: this.roleSelectId
				}).then((res)=>{
					this.$message({
						message: '配置角色成功',
						type: 'success'
					});
                    this.expandChange(this.rowData)
                    this.isDialogShow.role = false;
				})
			},
			// 删除角色
			handleRemove(parent, rowData){
				this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					positionRemoveRole({
						positionId: parent.positionId,
						roleId: rowData.roleId
					}).then((res)=>{
						this.$message({
							message: '删除角色成功',
							type: 'success'
						});
						this.positionData = [];
						this.getPositionListData(this.departmentActiveItemData.departmentId);
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.post_management {
        display: flex;
        flex-direction: row;
        height: 100%;
        .post_tree{
            width: 100%;
            height: 100%;
            margin-top: 16px;
        }
        .left{
            padding: 32px 16px 16px;
            flex: 0 0 322px;
            border-radius: 2px;
        }
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.department-list {
		flex: 1;
		margin-right: 16px;
		padding: 16px;
	}

	.position-list {
        margin-left: 8px;
        border-radius: 2px;
        flex: 1;
		padding: 16px;
        background: #fff;
	}

	.department-select {
		width: 200px;
		margin-bottom: 20px;
	}

	// table锁定行样式
	::v-deep .el-table .table-row--lock {
		.cell {
			color: #C0C4CC !important;
		}
	}
</style>
