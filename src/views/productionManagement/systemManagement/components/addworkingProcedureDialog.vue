<template>
	<el-dialog :visible.sync="isDialogShow" width="">
		<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
		<el-checkbox-group v-if="list.length" v-model="checkedList" @change="handleCheckedCitiesChange">
		    <el-checkbox v-for="item in list" :label="item.value" :key="item.value">{{item.name}}
<!--				<div class="input-wrap">
					<span>份额:</span>
					<el-input size="mini" v-model="item.proportion"></el-input>
				</div>-->
			</el-checkbox>
		 </el-checkbox-group>
		 <div slot="footer" class="dialog-footer">
		 	<el-button @click="isDialogShow = false">取 消</el-button>
		 	<el-button type="primary" :loading="isLoading.confirm"  @click="handleFormConfirm">确 定</el-button>
		 </div>
	</el-dialog>
</template>

<script>

	export default{
		props: {
			// listData: {
			// 	type: Array,
			// 	default: []
			// },
		},
		data(){
			return{
				isDialogShow: false,
				checkAll: false,
				checkedList: [], //选中的值
				list: [], //渲染的数据
				isIndeterminate: true,
				isLoading: {
					confirm: false
				}
			}
		},
		methods: {
			// 切换显示
			dialogShow(renderList){
				this.list = [].concat(renderList);
				this.isDialogShow = true;
				this.isLoading.confirm = false;
			},
			// 提交成功
			isOk(msg){
				this.isLoading.confirm = false;
				this.$message({
					message: msg,
					type: 'success'
				});
			},
			// 切换隐藏
			dialogHide(){
				this.isLoading.confirm = false;
				this.isDialogShow = false;
			},
			// 全选
			handleCheckAllChange(val) {
				this.checkedList = [];
				if(val){
					let arr = [];
					this.list.forEach((item)=>{
						this.checkedList.push(item.value);
					})
				}
				this.isIndeterminate = false;
			},
			// 单选
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.list.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length;
			},
			// 提交
			handleFormConfirm(){
				if(!this.list.length){
					this.$message.error('请选择工序');
					return;
				}
				this.isLoading.confirm = true;
				let arr = [];
				for(let i =0; i<this.list.length;i++){
					for(let k =0; k <this.checkedList.length; k++){
						if(this.list[i].value == this.checkedList[k]){
							arr.push(this.list[i]);
						}
					}
				}
				this.$emit('handleFormConfirm',arr);
			}
		},
	}
</script>

<style lang="scss" scoped>
	::v-deep .el-checkbox-group{
		display: flex;
		flex-wrap: wrap;
	}
	::v-deep .el-checkbox{
		flex: 0 0 45%;
		margin-bottom: 15px;
	}
	.input-wrap{
		span{
			color: #333;
			margin-right: 10px;
		}
	}
</style>
