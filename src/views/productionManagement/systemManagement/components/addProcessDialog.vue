<template>
	<el-dialog :visible.sync="isDialogShow">
		<el-form ref="processForm" :inline="true" label-position="top" size="mini" class="demo-form-inline">
			<div class="row" v-for="(item,index) in formData" :key="index">
				<el-form-item class="item" label="工艺" required>
					<el-input v-model="item.name" placeholder="请输入工艺名称"></el-input>
				</el-form-item>
				<el-form-item class="item" label="工艺类型" required>
					<el-select v-model="item.typeCode">
						<el-option v-for="(item,index) in typeOptions" :label="item.name" :value="item.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="item-status" label="顺序执行" align="center">
					 <el-radio v-model="item.isSequence" :label="1">是</el-radio>
					  <el-radio v-model="item.isSequence" :label="0">否</el-radio>
				</el-form-item>
				<el-form-item v-if="!edit" class="item-btn-wrap">
					<div v-if="index == formData.length-1" class="btn-pointer item-btn btn-add" @click="handleAddItem"><i class="el-icon-plus"></i></div>
					<div v-else class="btn-pointer item-btn btn-remove" @click="handleRemoveItem(index)"><i class="el-icon-minus"></i></div>
				</el-form-item>
			</div>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="isDialogShow = false">取 消</el-button>
			<el-button size="mini" type="primary" :loading="isLoading"  @click="handleFormConfirm">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { addProcessBatch,operationProcess } from '@/api/productionManagement/systemManagement.js'
	export default{
		props:{
			processQuotaTemplateId: { //模板id
				type: String,
				default: ''
			},
			workingProcedureCode: { //工序code
				type: String,
				default: ''
			},
			typeOptions: { // 工艺类型选项数据
 				type: Array,
				default: []
			}
		},
		data(){
			return{
				isDialogShow: false, //弹框显示隐藏
				formData: [], //表单数据
				isLoading: false,
				edit: false
			}
		},
		methods:{
			// 显示弹框
			dialogShow(editData){
				this.formData = [];
				if(editData){
					this.edit = true;
					this.formData.push(this.itemDataFor(editData));
				}else{
					this.edit = false
					this.formData.push(this.itemDataFor());
				}
				this.isDialogShow = true;
			},
			// 点击添加
			handleAddItem(){
				this.formData.push(this.itemDataFor());;
			},
			// 点击删除
			handleRemoveItem(index){
				this.formData.splice(index, 1);
			},
			// 转换数据
			itemDataFor(data){
				if(this.edit){
					return {
						isSequence: data.isSequence, //是否顺序执行 0为否, 1为是
					    name: data.name, //工序名称
					    processId: data.processId, //id, 无为新增,有为编辑
					    processQuotaTemplateId: data.processQuotaTemplateId, //工序定额模板关联ID
					    status: data.status, // 开启关闭
					    typeCode: data.typeCode, // 工艺类型
					    workingProcedureCode: data.workingProcedureCode, //工序编码
					}
				}else{
					return {
						isSequence: 1, //是否顺序执行 0为否, 1为是
					    name: "", //工序名称
					    processId: "", //id, 无为新增,有为编辑
					    processQuotaTemplateId: this.processQuotaTemplateId, //工序定额模板关联ID
					    status: 1, // 开启关闭
					    typeCode: this.typeOptions[0].value, // 工艺类型
					    workingProcedureCode: this.workingProcedureCode, //工序编码
					}
				}
			},
			// 点击确认
			handleFormConfirm(){
				this.isLoading = true;
				if(this.edit){
					operationProcess(this.formData[0]).then((res)=>{
						this.$message({
							message: '修改工艺成功',
							type: 'success'
						});
						this.$emit('addOk');
						this.isDialogShow = false;
					}).finally(() => {
						this.isLoading = false;
					})
				}else{
					addProcessBatch({
						processList: this.formData
					}).then((res)=>{
						this.$message({
							message: '添加工艺成功',
							type: 'success'
						});
						this.$emit('addOk');
						this.isDialogShow = false;
					}).finally(() => {
						this.isLoading = false;
					})
				}
			},
		},
		watch:{
			typeOptions(newCode){
				if(newCode){
					this.formData.push(this.itemDataFor());
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.row{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.item-btn-wrap{
		height: 100%;
	}
	.item-btn{
		height: 15px;
		width: 15px;
		line-height: 16px;
		font-size: 12px;
		text-align: center;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 32px;
		margin-left: 20px;
		margin-right: 20px;
	}
	.btn-add{
		background: #409EFF;
	}
	.btn-remove{
		background: #FA5555;
	}
</style>
