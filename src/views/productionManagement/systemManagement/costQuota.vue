<template>
	<div class="costQuota app-container">
		<el-form :inline="true" size="small">
			<el-form-item>
				<el-input placeholder="请输入模板名称" v-model="searchData.name" class="m-input">
					<el-button type="primary" class="form-btn" slot="append" @click="handleSearch">搜索</el-button>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd('add')">新增</el-button>
			</el-form-item>
		</el-form>
		<div class="container-padding container-style">
			<el-table :data="data.data" :row-class-name="tableRowClassName" style="width: 100%" v-loading="isLoading.list">
				<el-table-column label="模板名称" prop="name"></el-table-column>
				<el-table-column label="创建时间" prop="addTime">
					<template scope="scope">
						<span  >{{scope.row.addTime |shorttime}}</span>
					</template>
				</el-table-column>
				<el-table-column label="更新时间" prop="updTime"></el-table-column>
				<el-table-column label="是否开启" width="160">>
				    <template slot-scope="scope">
						<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleRoleTableSwitch(scope.row)"></el-switch>
				    </template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="120">
					<template slot-scope="scope">
						<el-button v-if="scope.row.status == 1" @click.stop="handleAdd('edit',scope.row)" type="text" size="small">编辑</el-button>
						<el-button v-if="scope.row.status == 1" @click.stop="handleOpenChild(scope.row)" type="text" size="small">配置</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-wrap">
				<el-pagination class="pagination" layout="prev, pager, next" @current-change="handlePagination" :page-count="data.totalPages"></el-pagination>
			</div>
		</div>
		<el-dialog ref="dialog" :title="dialogFormData.title+'工序定额模板'" :visible.sync="dialogIsShow">
			<el-form ref="form" :rules="rules" :model="dialogFormData" label-width="80px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="dialogFormData.name"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogIsShow = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogConfirm" @click="handleFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getProcessQuotaTemplatePage,operationProcessQuotaTemplate,operationProcessQuotaTemplateStatus } from '@/api/productionManagement/systemManagement.js'
	export default {
		data(){
			return {
				searchData: this.initSearchData(),
				data:{},
				dialogFormData: this.initDialogForm(),
				dialogIsShow: false,
				isLoading: {
					dialogConfirm: false,
					list: false
				},
				rules: {
					name: [
						{ required: true, message: '请输入模板名称', trigger: 'blur' },
						{ max: 32, message: '模板名称不能超过32个字符', trigger: 'blur' }
					],
				}
			}
		},
		mounted() {
			this.getProcessQuotaTemplatePageData();
		},
		methods:{
			tableRowClassName({row, rowIndex}){
				if(row.status == 0){
					return 'table-row--lock'
				}
			},
			initSearchData(){
				return{
					name: '',
					page: 0,
					size: 10
				}
			},
			initDialogForm(){
				return{
					name: '',
					processQuotaTemplateId: undefined,
					status: 1,
					title: '新增'
				}
			},
			// 刷新当前列表
			getProcessQuotaTemplatePageData(){
				this.isLoading.list = true;
				getProcessQuotaTemplatePage(this.searchData).then((res)=>{
					console.log(res)
					this.data = res.data;
				}).finally(() => {
					this.isLoading.list = false;
				})
			},
			// 点击搜索
			handleSearch(){
				console.log(this.searchData);
				this.searchData.page = 0;
				this.getProcessQuotaTemplatePageData();
			},
			// 点击新增/编辑
			handleAdd(type,data){
				if(type == 'add'){
					this.dialogFormData = this.initDialogForm();
				}else{
					this.dialogFormData = Object.assign({title:'编辑'},data);
				}
				this.dialogIsShow = true;
			},
			// 翻页
			handlePagination(pageNumber){
				this.searchData.page = pageNumber-1;
				this.getProcessQuotaTemplatePageData();
			},
			// 弹框 - 确定
			handleFormConfirm(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isLoading.dialogConfirm = true;
						operationProcessQuotaTemplate(this.dialogFormData).then((res)=>{
							this.$message({
								message: this.dialogFormData.title+'成功',
								type: 'success'
							});
							this.dialogIsShow = false;
							this.searchData = this.initSearchData();
							this.getProcessQuotaTemplatePageData();
						}).finally(() => {
							this.isLoading.dialogConfirm = false;
						})
					}
				});
			},
			// 开启关闭模板
			handleRoleTableSwitch(row){
				event.stopPropagation();
				let formData = new FormData();
				formData.set("id", row.processQuotaTemplateId);
				operationProcessQuotaTemplateStatus(formData).then((res)=>{

					if(res.data.status == 1){
						this.$message({
							message: '模板开启成功',
							type: 'success'
						});
					}else{
						this.$message({
							message: '模板禁用成功',
							type: 'success'
						});
					}
				})
			},
			handleOpenChild(itemData){
         /*       this.$router.push({
                    name: 'configurationProcess',
                    query: {
                        processQuotaTemplateId: itemData.processQuotaTemplateId,
                        name: itemData.name,
                    }
                })*/
				this.$router.push({
					name: 'unitPrice',
					query: {
						processQuotaTemplateId: itemData.processQuotaTemplateId,
						name: itemData.name,
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .form-btn{
		background-color:#409EFF !important;
		color: #FFFFFF !important;
	}
	.pagination-wrap{
		text-align: center;
		margin-top: 16px;
	}
	// table锁定行样式
	::v-deep .el-table .table-row--lock{
		.cell{
			color: #C0C4CC !important;
		}
	}
</style>
