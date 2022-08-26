<template>
	<div class="flex_row department main_container">
        <el-tabs v-model="framework" class="fa_box" type="card" @tab-click="handleClick">
            <el-tab-pane label="行政架构" name=0>
                <div class="department-list container-style container-padding">
                    <el-form :inline="true" size="small" class="flex_row_space">
                        <el-form-item class="flex_row">
                            级别：<el-select v-model="admlevel" clearable placeholder="请选择" class="margin_r_10px">
                            <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                            部门名称：<el-input v-model="admsearchVal" placeholder="请输入部门名称" class="fx_2px"></el-input>
                            <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;"
                                       @click="handleSearch">搜索</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus"
                                       @click="handleAddFormShow">新增</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table ref="multipleTable" :row-class-name="tableRowClassName" :highlight-current-row="true"
                              class="btn-pointer" header-row-class-name="table-header-gray" :props="defaultProps" @row-click="handleDepartmentRow" v-loading="isLoading.list"
                              :data="admData" tooltip-effect="dark" row-key="departmentId"
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column label="部门名称" prop="name" min-width="150"></el-table-column>
                        <el-table-column label="部门所属路径" prop="pathName" min-width="150"></el-table-column>
                        <el-table-column label="部门类型" width="100">
                            <template slot-scope="scope">{{listTypeFor(scope.row.type)}}</template>
                        </el-table-column>
                        <el-table-column label="排序" prop="sort" width="100"></el-table-column>
                        <el-table-column label="添加时间" prop="addTime" width="160">
                            <template slot-scope="scope">
                               <p>{{scope.row.addTime | shorttime}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="更新时间" prop="updTime" width="160">
                            <template slot-scope="scope">
                                <p>{{scope.row.updTime | shorttime}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否开启" align="center">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                           @change="handleOperationDepartmentStatus(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status == 1" @click.stop="handleEditFormShow(scope.row)" type="text"
                                           size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="生产架构" name=1>
                <div class="department-list container-style container-padding">
                    <el-form :inline="true" size="small" class="flex_row_space">
                        <el-form-item class="flex_row">
                            级别：<el-select v-model="prolevel" clearable placeholder="请选择" class="margin_r_10px">
                            <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                            部门名称：<el-input v-model="prosearchVal" placeholder="请输入部门名称" class="fx_2px"></el-input>
                            <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;"
                                       @click="handleSearch">搜索</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus"
                                       @click="handleAddFormShow">新增</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table ref="multipleTable" header-row-class-name="table-header-gray" :row-class-name="tableRowClassName" :highlight-current-row="true"
                              class="btn-pointer" :props="defaultProps" @row-click="handleDepartmentRow" v-loading="isLoading.list" :data="proData" tooltip-effect="dark" row-key="departmentId"
                              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column label="部门名称" prop="name" min-width="150"></el-table-column>
                        <el-table-column label="部门所属路径" prop="pathName" min-width="150"></el-table-column>
                        <el-table-column label="部门类型" width="100">
                            <template slot-scope="scope">{{listTypeFor(scope.row.type)}}</template>
                        </el-table-column>
                        <el-table-column label="排序" prop="sort" width="100"></el-table-column>
                        <el-table-column label="添加时间" prop="addTime" width="160">
                            <template slot-scope="scope">
                                <p>{{scope.row.addTime | shorttime}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="更新时间" prop="updTime" width="160">
                            <template slot-scope="scope">
                                <p>{{scope.row.updTime | shorttime}}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否开启" align="center">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                                           @change="handleOperationDepartmentStatus(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status == 1" @click.stop="handleEditFormShow(scope.row)" type="text"
                                           size="small">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
        </el-tabs>
		<el-dialog :title="formData.title+'部门'" :visible.sync="isDialogShow.department">
			<el-form ref="departmentForm" :model="formData" :rules="departmentRules" label-width="80px">
				<el-form-item label="部门名称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入部门名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门级别">
					<el-select v-model="formData.level" placeholder="请选择">
						<el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上级部门">
                    <el-cascader ref="cascader" v-model="formData.pid" :show-all-levels="false" :options="framework == '0' ? addadmData : addproData" :props="props" style="width: 216px" @change="handleCascaderChange"></el-cascader>
<!--					<el-select v-model="formData.pid">
						<el-option label="顶级" :value="undefined"></el-option>
						<el-option-group v-for="group in framework == 0 ? admData : proData" :label="group.name">
							<el-option :label="group.name" :value="group.departmentId"></el-option>
							<el-option v-for="item in group.children" :key="item.departmentId" :label="item.name"
								:value="item.departmentId"></el-option>
						</el-option-group>
					</el-select>-->
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
	</div>
</template>

<script>
	import {
		operationDepartment,
		getDepartmentList,
		operationDepartmentStatus,
		getPositionList,
		getPositionRole,
		getRoleList,
		positionSetRole,
		positionRemoveRole
	} from '@/api/productionManagement/departmentRole.js'
    import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
	export default {
		data() {
			return {
                framework: '0', // 默认显示生产类型部门
				selectData: [{ //部门管理 - 选择组织架构select数据
					value: 0,
					label: '行政'
				}, {
					value: 1,
					label: '生产'
				}],
                levelList: [
                    { //部门管理 - 级别
                        value: 0,
                        label: '公司'
                    }, {
                        value: 1,
                        label: '部门'
                    }
                ],
                admlevel: '',
                admsearchVal: '', // 查询条件类型
                prolevel: '',
                prosearchVal: '', // 查询条件类型
				proData: [{children: []}], // 生产组织 - 列表渲染数据
                admData: [{children: []}], // 行政组织
                addproData: [{children: []}], // 新增弹框生产组织 - 列表渲染数据
                addadmData: [{children: []}], // 新增弹框行政组织
				positionData: [], // 岗位管理 - 列表渲染数据
				departmentActiveItemData: {}, // 部门管理选中的item数据
				defaultProps: { // 部门管理 - 列表渲染节点属性名
					children: 'children',
					label: 'name'
				},
                props: {
                    emitPath:false,
                    value: 'departmentId',
                    label: 'name',
                    expandTrigger: 'hover',
                    checkStrictly: true
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
				roleSelectId: '', //选择的角色数据
				currentPositionId: '', //当前选中的岗位id
				currentDepartmentId: '', //当前选中的部门
			}
		},
		mounted() {
			this.getDepartmentListData(0);
            this.getDepartmentListData(1);
			this.getRoleListData();
            this.getAddDepartmentList()
		},
		methods: {
            handleClick(tab, event){
                this.getAddDepartmentList()
            },
            handleCascaderChange(){
                this.$refs.cascader.dropDownVisible = false;
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
			getRoleListData() {
				getRoleList({}).then((res) => {
					this.roleListData = res.data;
					this.roleSelectId = this.roleListData[0].roleId;
				})
			},
            /**新增弹框部门级别树*/
            getAddDepartmentList() {
                const sendData = this.framework == '0' ? { // 0:行政  1：生产
                    enterpriseId: enterpriseId,
                    type: Number(this.framework),
                } : {
                    enterpriseId: enterpriseId,
                    type: Number(this.framework),
                }
                getDepartmentList(sendData).then((res) => {
                    const data = [{name: '顶级', departmentId: '0', children: res.data}]
                    this.framework == '0' ? this.addadmData = data : this.addproData = data;
                }).finally(() => {
                    this.isLoading.list = false;
                })
            },
			// 部门管理 - 获取列表数据
			getDepartmentListData(sign) {
				this.isLoading.list = true;
                const sendData = sign == 0 ? { // 0:行政  1：生产
                    enterpriseId: enterpriseId,
                    name: this.admsearchVal,
                    type: 0,
                    level: this.admlevel
                } : {
                    enterpriseId: enterpriseId,
                    name: this.prosearchVal,
                    type: 1,
                    level: this.prolevel
                }
				getDepartmentList(sendData).then((res) => {
                    sign == 0 ? this.admData = res.data : this.proData = res.data;
				}).finally(() => {
					this.isLoading.list = false;
				})
			},
			// 岗位管理 - 获取列表数据
			getPositionListData(departmentId) {
				this.isLoading.positionList = true;
				getPositionList({
					departmentId: departmentId
				}).then((res) => {
					let arr = [];
					res.data.forEach((item) => {
						item.hasChildren = true;
						item.children =[];
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
                    level: 1, // 部门 or 公司
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
				this.formData = {...itemData};
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
                        const sendData = {
                            ...this.formData,
                            type: Number(this.framework), // 架构类型
                            // enterpriseId: enterpriseId
                        }
						operationDepartment(sendData).then((res) => {
							this.$message({
								message: this.formData.title + '成功',
								type: 'success'
							});
							this.isDialogShow.department = false;
							this.getDepartmentListData(this.framework); // 刷新列表
                            this.getAddDepartmentList()
						}).finally(() => {
							this.isLoading.dialogConfirm = false;
						})
					}
				});
			},
			// 部门管理 - 点击当前行切换岗位管理
			handleDepartmentRow(itemData) {
			/*	if (itemData.status == 0) {
					this.$message.error('部门已禁用');
					return;
				}
				this.departmentActiveItemData = itemData;
				this.getPositionListData(itemData.departmentId);*/
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
			// 点击搜索
			handleSearch() {
				this.getDepartmentListData(this.framework);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.department {
		flex-direction: row;
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
		width: 600px;
		padding: 16px;
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
