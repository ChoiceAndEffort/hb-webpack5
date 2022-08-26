<template>
	<div class="flex_row dictionary-container">
		<div class="dict-table container-style container-padding">
			<el-form :inline="true" size="small">
				<el-form-item>
					<el-row type="flex">
					  <el-input v-model="searchVal" placeholder="请输入字典名称"></el-input>
					  <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleDictFormShow('add')">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData.data" :highlight-current-row="true" class="btn-pointer" v-loading="isLoading.dictList" style="width: 100%" @row-click="handleDict">
			    <el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="code" label="字典编码" min-width="160"></el-table-column>
				<el-table-column prop="addTime" label="创建时间">
					<template scope="scope">
						<span  >{{scope.row.addTime |shorttime}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="updTime" label="更新时间"></el-table-column>
				<el-table-column prop="remark" label="备注"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
				    <template slot-scope="scope">
				        <el-button type="text" size="small" @click.stop="handleDictFormShow('edit',scope.row)">编辑</el-button>
				    </template>
				</el-table-column>
			</el-table>
			<el-row type="flex" justify="center">
				<el-pagination layout="prev, pager, next" :page-count="tableData.totalPages" @current-change="handlePagination"></el-pagination>
			</el-row>
		</div>
		<div class="dict-item-table container-style">
			<div class="table-header">
				<div class="table-header-title">字典项列表 <span v-if="dictActive.name">- {{dictActive.name}}</span></div>
				<el-button type="primary" size="mini" @click="handleDictItemFormShow('add')">新增</el-button>
			</div>
			<el-divider></el-divider>
			<el-table :data="tableItemData" :row-class-name="tableRowClassName" class="btn-pointer" v-loading="isLoading.dictItemList" style="width: 100%">
			    <el-table-column prop="name" label="字典项名称"></el-table-column>
				<el-table-column prop="value" label="字典项值"></el-table-column>
				<el-table-column label="是否开启">
				    <template slot-scope="scope">
						<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleTableItemStatus(scope.row)"></el-switch>
				    </template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
				    <template slot-scope="scope">
				        <el-button v-if="scope.row.status == 1" type="text" size="small" @click.stop="handleDictItemFormShow('edit',scope.row)">编辑</el-button>
				    </template>
				</el-table-column>
				<div slot="empty" v-if="!dictActive.dictId">请先选择字典</div>
			</el-table>
		</div>
		<el-dialog :title="tableFormData.title+'字典'"  :visible.sync="isDialogShow.dict">
			<el-form ref="tableForm" :model="tableFormData" :rules="dictRules" label-width="80px">
				<el-form-item label="字典名称" prop="name">
					<el-input v-model="tableFormData.name" placeholder="请输入字典名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="字典编码" prop="code">
					<el-input v-model="tableFormData.code" placeholder="请输入字典编码" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="tableFormData.remark" maxlength="255" type="textarea" placeholder="请输入备注" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.dict = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogConfirm"  @click="handleDictFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="tableItemFormData.title+'字典项'" :visible.sync="isDialogShow.dictItem">
			<el-form ref="tableItemForm" :model="tableItemFormData" :rules="dictItemRules" label-width="110px">
				<el-form-item label="字典项名称" prop="name">
					<el-input v-model="tableItemFormData.name" placeholder="请输入字典项名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="字典项值" prop="value">
					<el-input v-model="tableItemFormData.value" placeholder="请输入字典项值" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					 <el-input-number v-model="tableItemFormData.sort" controls-position="right" :min="1" :max="999"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isDialogShow.dictItem = false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.dialogItemConfirm"  @click="handleTableItemFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getDictPage,operationDict,getDictItemList,operationDictItem } from '@/api/productionManagement/systemManagement.js'
	export default{
		data(){
			return{
				searchData: { //搜索数据
					code: "",
					name: "",
					page: 0,
					size: 10
				},
				tableData: {}, //字典列表数据
				tableItemData: [], //字典项数据
				isLoading: {
					dictList: false,
					dialogConfirm: false,
					dialogItemConfirm: false,
					dictItemList: false,
				},
				searchVal: '', //字典列表搜索
				tableFormData: this.initTableFormData(), //字典弹框数据
				tableItemFormData: this.initTableItemFormData(), //字典项弹框数据
				isDialogShow: {
					dict: false,
					dictItem: false,
				},
				dictRules: {
					name: [
						{ required: true, message: '请输入字典名称', trigger: 'blur' },
						{ max: 32, message: '字典名称不能超过32个字符', trigger: 'blur' }
					],
					code: [
						{ required: true, message: '请输入字典编码', trigger: 'blur' },
						{ max: 128, message: '字典编码不能超过128个字符', trigger: 'blur' }
					],
				},
				dictItemRules: {
					name: [
						{ required: true, message: '请输入字典项名称', trigger: 'blur' },
						{ max: 128, message: '字典名称不能超过128个字符', trigger: 'blur' }
					],
					value: [
						{ required: true, message: '请输入字典项值', trigger: 'blur' },
						{ max: 128, message: '字典项值不能超过128个字符', trigger: 'blur' }
					],
				},
				dictActive: {}, // 字典选中行的数据
			}
		},
		mounted() {
			this.getDictPageData();
		},
		methods:{
			tableRowClassName({row, rowIndex}){
				if(row.status == 0){
					return 'table-row--lock'
				}
			},
			initTableFormData(){
				return{
					code: '', //字典编码
					dictId: '', //字典Id
					name: '', //字典名称
					remark: '' ,//备注,
					title: '新增'
				}
			},
			initTableItemFormData(){
				return{
					dictId: "",
					dictItemId: "",
					name: "",
					sort: 999,
					status: 1,
					value: ""
				}
			},
			// 字典 - 获取列表数据
			getDictPageData(data){
				let searchData = data || this.searchData;
				this.isLoading.dictList = true;
				getDictPage(searchData).then((res)=>{
					this.tableData = res.data;
				}).finally(()=>{
					this.isLoading.dictList = false;
				})
			},
			// 字典项 - 获取列表数据
			getDictItemListData(data){
				this.isLoading.dictItemList = true;
				getDictItemList({
					dictId: data.dictId
				}).then((res)=>{
					this.tableItemData = res.data;
				}).finally(()=>{
					this.isLoading.dictItemList = false;
				})
			},
			// 点击字典列表
			handleDict(itemData){
				this.dictActive = itemData;
				this.getDictItemListData(this.dictActive);
			},
			// 字典 -  点击弹出框, 编辑/修改
			handleDictFormShow(type, data){
				if(type == 'add'){
					this.tableFormData = this.initTableFormData();
					this.tableFormData.title = '新增';
				}else{
					this.tableFormData = Object.assign({},data);
					console.log(this.tableFormData.name)
					this.tableFormData.title = '编辑';
				}
				this.isDialogShow.dict = true;
			},
			// 字典 - 搜索
			handleSearch(){
				this.searchData.page = 0;
				let searchData = Object.assign({},this.searchData);
				searchData.name = this.searchVal;
				this.getDictPageData(searchData);
			},
			//字典 - 切换页数
			handlePagination(pageNumber){
				this.searchData.page = pageNumber-1;
				this.getDictPageData();
			},
			// 字典 - 弹框 - 确认
			handleDictFormConfirm(){
				this.$refs.tableForm.validate((valid) => {
					if (valid) {
						this.isLoading.dialogConfirm = true;
						operationDict(this.tableFormData).then((res)=>{
							this.$message({
								message: this.tableFormData.title+'字典成功',
								type: 'success'
							});
							this.getDictPageData();
						}).finally(() => {
							this.isLoading.dialogConfirm = false;
							this.isDialogShow.dict = false;
						})
					}
				})
			},
			// 字典项 - 弹框
			handleDictItemFormShow(type, data){
				if(!this.dictActive.dictId){
					this.$message.error('请先选择字典');
					return
				}
				if(type == 'add'){
					this.tableItemFormData = this.initTableItemFormData();
					this.tableItemFormData.title = '新增';
				}else{
					this.tableItemFormData = Object.assign({},data);
					this.tableItemFormData.title = '编辑';
				}
				this.isDialogShow.dictItem = true;
			},
			// 字典项 - 弹框 - 确认
			handleTableItemFormConfirm(){
				this.$refs.tableItemForm.validate((valid) => {
					if (valid) {
						this.isLoading.dialogItemConfirm = true;
						this.tableItemFormData.dictId = this.dictActive.dictId;
						operationDictItem(this.tableItemFormData).then((res)=>{
							this.$message({
								message: this.tableItemFormData.title+'字典成功',
								type: 'success'
							});
							this.getDictItemListData(this.dictActive);
						}).finally(() => {
							this.isLoading.dialogItemConfirm = false;
							this.isDialogShow.dictItem = false;
						})
					}
				})
			},
			// 字典项 - 开启禁用权限
			handleTableItemStatus(itemData){
				operationDictItem(itemData).then((res)=>{
					if(itemData.status == 0){
						this.$message({
							type: 'success',
							message: '禁用成功!'
						});
					}else{
						this.$message({
							type: 'success',
							message: '开启成功!'
						});
					}
					this.getDictItemListData(this.dictActive);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dictionary-container{
		flex-direction: row;
	}
	.table-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	//工种
	.dict-table{
		flex: 1;
		margin-right: 16px;
		padding: 16px;
	}
	//工种等级
	.dict-item-table{
		width: 600px;
		padding: 16px;
	}
	// table锁定行样式
	::v-deep .el-table .table-row--lock{
		.cell{
			color: #C0C4CC !important;
		}
	}
</style>
