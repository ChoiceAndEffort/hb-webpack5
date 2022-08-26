<template>
	<div class="process-list container-padding container-style">
		<el-table class="table btn-pointer" :data="data" v-loading="isLoading" :highlight-current-row="true" highlight-current-row style="width: 100%"  @row-click="handleRow">
		    <el-table-column type="index" label="序号" width="50"></el-table-column>
		    <el-table-column prop="name" label="工艺" ></el-table-column>
			<el-table-column prop="typeCode" label="工艺类型">
				<template slot-scope="scope">
					<span>{{typeCodeFor(scope.row.typeCode)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="顺序执行" min-width="90" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.isSequence == 1?'是':'否'}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="90" align="center">
				<template slot-scope="scope">
                    <el-button class="remove-btn" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button class="remove-btn" type="text" @click="handleRemove(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="btns-wrap">
			<el-button type="text" @click="handleAdd">新增工艺</el-button>
<!--			<el-button class="remove-btn" type="text" @click="handleRemove">删除工艺</el-button>-->
		</div>
		<AddProcessDialog ref="addProcessDialog" @addOk="addProcessDialogOk" :processQuotaTemplateId="processQuotaTemplateId" :workingProcedureCode="workingProcedureCode" :typeOptions="typeOptions"/>
	</div>
</template>

<script>
	import { getProcessList, deleteProcess,getDictData } from '@/api/productionManagement/systemManagement.js'
	import AddProcessDialog from './addProcessDialog.vue'
	export default{
		props:{
			processQuotaTemplateId: {
				type: String,
				default: ''
			},
			workingProcedureCode: {
				type: String,
				default: ''
			},
		},
		data(){
			return{
				data: [], //列表数据
				isLoading: false,
				currentRowData: {}, // 当前选中行的数据
				typeOptions: [], //工艺类型
			}
		},
		components:{
			AddProcessDialog
		},
		methods:{
			typeCodeFor(typeCode){
				let options = this.typeOptions;
				for(let i = 0; i<options.length; i++){
					if(typeCode == options[i].value){
						return options[i].name;
					}
				}
			},
			// 获取工艺列表
			getProcessListData(){
				this.isLoading = true;
				getProcessList({
					workingProcedureCode: this.workingProcedureCode,
					processQuotaTemplateId: this.processQuotaTemplateId
				}).then((res)=>{
					this.data = res.data;
				}).finally(() => {
					this.isLoading = false;
				})
			},
			// 点击行
			handleRow(itemData){
				this.currentRowData = itemData;
				this.$emit("handleRow",itemData);
			},
			// 点击新增工艺
			handleAdd(){
				this.$refs.addProcessDialog.dialogShow();
			},
			// 点击编辑工艺
			handleEdit(itemData){
				this.$refs.addProcessDialog.dialogShow(itemData);
			},
			// 点击删除
			handleRemove(data){
				this.$confirm(`此操作将删除${this.currentRowData.name}, 是否继续?`, '提示', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(() => {
					deleteProcess(data.processId).then((res)=>{
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getProcessListData();
					})
				})
			},
			// 新增工艺成功
			addProcessDialogOk(){
				this.getProcessListData();
			}
		},
		watch:{
			workingProcedureCode(newCode){
				this.getProcessListData();
				getDictData(newCode+'_TYPE').then((res)=>{
					this.typeOptions = res.data.dictItemList;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.process-list{
		display: flex;
		flex-direction: column;
	}
	.table{
		flex: 1;
	}
	.remove-btn{
		color: #f56c6c;
	}
</style>
