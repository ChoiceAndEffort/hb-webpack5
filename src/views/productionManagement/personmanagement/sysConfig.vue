<template>
	<div class="app-container enterprise">
		<el-form :inline="true" size="small">
			<el-form-item>
				<el-row type="flex">
				  <el-input v-model="searchData.configTitle" placeholder="请输入系统配置名称"></el-input>
				  <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleFormShow">新增</el-button>
			</el-form-item>
		</el-form>
		<div class="container-style container-padding enterprise-list">
			<el-table ref="multipleTable" v-loading="isLoading.list" :data="data.data" tooltip-effect="dark" style="width: 100%"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			    <el-table-column label="配置标题" prop="sysConfigTitle"></el-table-column>
				<el-table-column label="配置key" prop="sysConfigKey"></el-table-column>
				<el-table-column label="配置value" prop="sysConfigValue"></el-table-column>
				<el-table-column label="备注" prop="remark"></el-table-column>
				<el-table-column fixed="right" label="操作" width="180">
					<template slot-scope="scope">
						<el-button type="text" size="small" :disabled="scope.row.status === 0" @click="handleFormShow(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-wrap">
				<el-pagination layout="prev, pager, next" :page-count="data.totalPages" @current-change="handlePagination"></el-pagination>
			</div>
		</div>
		<el-dialog :title="formData.title+'系统配置'" :visible.sync="isDialogShow" width="580px">
			<el-form ref="form" :model="formData" label-width="80px">
				<el-form-item label="配置标题" prop="sysConfigTitle">
					<el-input v-model="formData.sysConfigTitle"></el-input>
				</el-form-item>
				<el-form-item label="配置key" prop="sysConfigKey">
					<el-input v-model="formData.sysConfigKey"></el-input>
				</el-form-item>
				<el-form-item label="配置value" prop="sysConfigKey">
					<el-input v-model="formData.sysConfigValue"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="sysConfigKey">
					<el-input v-model="formData.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow=false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.submit" @click="handleFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getSysConfigPage,operationSysConfig } from '@/api/productionManagement/departmentRole.js'
	export default{
		data(){
			return{
				data: {}, // 列表数据
				searchData: {
					configTitle: undefined,
					size: 10,
					page: 0
				},
				isLoading: {
					list: false,
					submit: false
				},
				isDialogShow: false,
				formData: {
					title: '新增',
					remark: "",
					sysConfigId: undefined,
					sysConfigKey: "",
					sysConfigTitle: "",
					sysConfigValue: ""
				}
			}
		},
		components:{

		},
		mounted() {
			this.getList();
		},
		methods:{
			getList(){
				this.isLoading.list = true;
				getSysConfigPage(this.searchData).then((res)=>{
					this.data = res.data;
				}).finally(()=>{
					this.isLoading.list = false;
				})
			},
			handleSearch(){
				this.searchData.page = 0;
				this.getList();
			},
			handlePagination(pageNumber){
				this.searchData.page = pageNumber-1;
				this.getList();
			},
			handleFormShow(itemData){
				if(itemData.sysConfigId){ // 编辑
					this.formData = Object.assign({},itemData);
					this.formData.title = '编辑';
				}else{ // 新增
					this.formData.title = '新增';
				}
				this.isDialogShow = true;
			},
			handleFormConfirm(){
				this.isLoading.submit = true;
				operationSysConfig(this.formData).then((res)=>{
					this.$message({
						message: this.formData.title+'成功',
						type: 'success'
					});
					this.getList();
				}).finally(()=>{
					this.isLoading.submit = false;
					this.isDialogShow = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

	.table-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	::v-deep .icon-popover .el-input__prefix .svg-icon{
		margin-top: 5px;
		margin-left: 3px;
	}
	::v-deep .icon-list{
		padding: 5px;
		span{
			margin-left: 10px;
		}
	}
	.pagination-wrap{
		text-align: center;
	}
</style>
