<template>
	<div class="flex_row_space hidden_y hidden_x work-type-container">
		<div class="work-type container-style">
			<el-form :inline="true" size="small">
				<el-form-item>
					<el-row type="flex">
						<el-input v-model="searchVal" placeholder="请输入工种名称">
						</el-input>
						<el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleAddWorkTypeFormShow">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table
				:data="workTypeTableData"
				:highlight-current-row="true"
                header-row-class-name="table-header-gray"
				class="btn-pointer"
				v-loading="isLoading.workTypeList"
				style="width: 100%"
				@row-click="handleWorkTypeItem"
			>
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column label="工种类型">
					<template slot-scope="scope">
						<div>{{ workTypeFor(scope.row.type) }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="addTime" label="添加时间">
                    <template slot-scope="scope">
                        <p>{{scope.row.addTime | shorttime}}</p>
                    </template>
                </el-table-column>
				<el-table-column prop="updTime" label="更新时间">
                    <template slot-scope="scope">
                        <p>{{scope.row.updTime | shorttime}}</p>
                    </template>
                </el-table-column>
				<el-table-column fixed="right" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click.stop="handleEditWorkTypeFormShow(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="work-type-level container-style">
			<div class="table-header">
				<div class="table-header-title">
					工种等级列表
					<span v-if="workTypeActiveItemData.name">- {{ workTypeActiveItemData.name }}</span>
				</div>
				<el-button type="primary" size="mini" @click="handleAddWorkTypeLevelFormShow">新增</el-button>
			</div>
			<el-divider></el-divider>
			<el-table :data="workTypeLevelTableData" class="btn-pointer" header-row-class-name="table-header-gray" v-loading="isLoading.workTypeLevelList" style="width: 100%">
				<el-table-column prop="name" label="等级名称" min-width="200"></el-table-column>
				<el-table-column prop="sort" label="排序" width="200"></el-table-column>
				<el-table-column prop="addTime" label="添加时间" width="200"></el-table-column>
				<el-table-column prop="updTime" label="更新时间" width="200"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click.stop="handleEditWorkTypeLevelFormShow(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
				<div slot="empty">{{ !workTypeActiveItemData.workTypeId ? '请先选择工种' : '暂无数据' }}</div>
			</el-table>
		</div>
		<el-dialog :title="workTypeForm.title + '工种'" :visible.sync="isDialogShow.workType">
			<el-form ref="workTypeForm" :model="workTypeForm" :rules="workTypeRules" label-width="80px">
				<el-form-item label="工种名称" prop="name"><el-input v-model="workTypeForm.name" placeholder="请输入工种名称" autocomplete="off"></el-input></el-form-item>
				<el-form-item label="工种类型" prop="type">
					<el-select v-model="workTypeForm.type" placeholder="请选择">
						<el-option v-for="item in workTypeOptions" :key="item.value" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.workType = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogConfirm" @click="handleWorkTypeFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="workTypeLevelForm.title + '工种等级'" :visible.sync="isDialogShow.workTypeLevel">
			<el-form ref="workTypeLevelForm" :model="workTypeLevelForm" :rules="workTypeLevelRules" label-width="110px">
				<el-form-item label="工种等级名称" prop="name">
					<el-input v-model="workTypeLevelForm.name" placeholder="请输入工种等级名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序"><el-input-number v-model="workTypeLevelForm.sort" controls-position="right" :min="1" :max="999"></el-input-number></el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.workTypeLevel = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogLevelConfirm" @click="handleWorkTypeLevelFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { operationWorkType, getWorkTypeList, operationWorkTypeLevel, getWorkTypeLevelList, getcorpPage } from '@/api/productionManagement/departmentRole.js';
import { workType } from '@/assets/productionManagement/comjs/dictionary.js';
import {
    enterpriseId
} from '@/assets/productionManagement/comjs/login.js'
export default {
	data() {
		return {
			workTypeForm: this.initWorkTypeForm(), //弹框 - 工种提交数据
			workTypeTableData: [], // 工种列表数据
			workTypeActiveItemData: {}, // 工种列表选中数据
			workTypeLevelForm: this.initWorkTypeLevelForm(), //弹框 - 工种等级提交数据
			workTypeLevelTableData: [], //工种等级列表
			isDialogShow: {
				workType: false,
				workTypeLevel: false
			},
			isLoading: {
				dialogConfirm: false, // 工种弹框确认按钮
				dialogLevelConfirm: false, //等级弹框确认按钮
				workTypeList: false, //工种列表加载
				workTypeLevelList: false //工种等级列表加载
			},
			corpList: [],
			enterpriseId: '',
			searchVal: '',
			workTypeRules: {
				name: [{ required: true, message: '请输入工种名称', trigger: 'blur' }, { max: 32, message: '工种名称不能超过32个字符', trigger: 'blur' }]
			},
			workTypeLevelRules: {
				name: [{ required: true, message: '请输入工种等级名称', trigger: 'blur' }, { max: 32, message: '工种等级名称不能超过32个字符', trigger: 'blur' }]
			},
			workTypeOptions: workType,
		};
	},
	created() {
		this.getcorpList();
	},
	mounted() {
			this.enterpriseId = enterpriseId
			this.getWorkTypeListData();
	},
	components:{
	},
	methods: {
		handleChange(id){
			this.enterpriseId = id;
			this.workTypeActiveItemData.workTypeId = '';
			this.workTypeLevelTableData = [];
			this.getWorkTypeListData();
		},
		// 初始化数据 -弹框 - 工种数据
		initWorkTypeForm() {
			return {
				title: '新增',
				name: '', //名称
				type: 0,
				workTypeId: undefined, //工种 , 无为新增, 有为编辑
				enterpriseId: undefined
			};
		},
		getcorpList() {
			this.isLoading.enterpriselist = true;
			getcorpPage({
				enterpriseId: this.enterpriseId
			}).then(res => {
					this.corpList = res.data;
				})
				.finally(() => {
					this.isLoading.enterpriselist = false;
				});
		},
		// 初始化数据 - 弹框- 工种等级
		initWorkTypeLevelForm() {
			return {
				name: '', //工种等级名称,
				sort: 999
			};
		},
		workTypeFor(workType) {
			let result = '';
			this.workTypeOptions.forEach(item => {
				if (item.value == workType) {
					result = item.name;
				}
			});
			return result;
		},
		// 获取数据 - 工种列表
		getWorkTypeListData(data = {}) {
			this.isLoading.workTypeList = true;
			getWorkTypeList({
				enterpriseId: this.enterpriseId,
                name: this.searchVal,
			})
				.then(res => {
					this.workTypeTableData = res.data;
				})
				.finally(() => {
					this.isLoading.workTypeList = false;
				});
		},
		// 获取数据 - 工种等级列表
		getWorkTypeLevelListData(id) {
			this.isLoading.workTypeLevelList = true;
			getWorkTypeLevelList({
				workTypeId: id
			})
				.then(res => {
					this.workTypeLevelTableData = res.data;
				})
				.finally(() => {
					this.isLoading.workTypeLevelList = false;
				});
		},
		// 工种列表 - 点击新增 - 弹出弹框
		handleAddWorkTypeFormShow() {
			this.workTypeForm = this.initWorkTypeForm();
			this.workTypeForm.title = '新增';
			this.isDialogShow.workType = true;
		},
		// 工种等级列表 - 点击新增 - 弹出弹框
		handleAddWorkTypeLevelFormShow() {
			if (!this.workTypeActiveItemData.workTypeId) {
				this.$message.error('请先选择工种');
			} else {
				this.workTypeLevelForm = this.initWorkTypeLevelForm();
				this.workTypeLevelForm.title = '新增';
				this.isDialogShow.workTypeLevel = true;
			}
		},
		// 工种弹框 - 点击确认 - 提交数据
		handleWorkTypeFormConfirm() {
			this.$refs.workTypeForm.validate(valid => {
				if (valid) {
					this.isLoading.dialogConfirm = true;
					this.workTypeForm.enterpriseId = this.enterpriseId;
					operationWorkType(this.workTypeForm)
						.then(res => {
							this.$message({
								message: this.workTypeForm.title + '工种成功',
								type: 'success'
							});
							this.getWorkTypeListData();
						})
						.finally(() => {
							this.isLoading.dialogConfirm = false;
							this.isDialogShow.workType = false;
						});
				}
			});
		},
		// 工种等级弹框 - 点击确认 - 提交数据
		handleWorkTypeLevelFormConfirm() {
			this.$refs.workTypeLevelForm.validate(valid => {
				if (valid) {
					this.isLoading.dialogLevelConfirm = true;
					this.workTypeLevelForm.workTypeId = this.workTypeActiveItemData.workTypeId;
					operationWorkTypeLevel(this.workTypeLevelForm)
						.then(res => {
							this.$message({
								message: this.workTypeLevelForm.title + '工种成功',
								type: 'success'
							});
							this.getWorkTypeLevelListData(this.workTypeActiveItemData.workTypeId);
						})
						.finally(() => {
							this.isLoading.dialogLevelConfirm = false;
							this.isDialogShow.workTypeLevel = false;
						});
				}
			});
		},
		// 工种列表 - 点击编辑 - 弹出弹框
		handleEditWorkTypeFormShow(itemData) {
			this.workTypeForm = Object.assign({}, itemData);
			this.workTypeForm.title = '编辑';
			this.isDialogShow.workType = true;
		},
		// 工种表单列表 - 点击编辑 - 弹出弹框
		handleEditWorkTypeLevelFormShow(itemData) {
			this.workTypeLevelForm = Object.assign({}, itemData);
			this.workTypeLevelForm.title = '编辑';
			this.isDialogShow.workTypeLevel = true;
		},
		// 工种列表 - 点击行 -  请求工种下的等级列表
		handleWorkTypeItem(itemData) {
			this.workTypeActiveItemData = itemData;
			this.getWorkTypeLevelListData(this.workTypeActiveItemData.workTypeId);
		},
		handleSearch() {
			this.getWorkTypeListData({
				name: this.searchVal,
				enterpriseId: this.enterpriseId
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.work-type-container {
	flex-direction: row;
}
.table-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
//工种
.work-type {
	flex: 1;
	margin-right: 16px;
	padding: 16px;
}
//工种等级
.work-type-level {
	width: 600px;
	padding: 16px;
}
::v-deep .el-select > .el-input {
	width: 110px;
}
.pagination {
	margin: 20px auto;
	text-align: center;
}
</style>
