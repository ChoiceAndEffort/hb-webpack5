<template>
	<div class="quota-list container-padding container-style">
		<div class="btns-wrap">
			<el-button type="primary" size="small" @click="handleItem('add')" v-if="searchData.processId!=''">新增定额</el-button>
		</div>
		<el-table :data="tableData.data" :row-class-name="tableRowClassName" class="table btn-pointer" v-loading="isLoading.list" style="width: 100%">
			<el-table-column prop="name" label="定额名称"></el-table-column>
			<el-table-column prop="price" label="价格" min-width="120px" align="center">
				<template slot-scope="scope">
					<span>{{scope.row.price}}元/{{unitFor(scope.row.unit)}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="unit" label="单位" width="50px">
				<template slot-scope="scope">
					<span>{{unitFor(scope.row.unit)}}</span>
				</template>
			</el-table-column> -->
			<el-table-column label="进度奖(工单总额)" align="center" width="140px">
				<template slot-scope="scope">
					<span>{{awardFor(scope.row.progressAward)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="质量奖(工单总额)" align="center" width="140px">
				<template slot-scope="scope">
					<span>{{awardFor(scope.row.qualityAward)}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="sort" label="排序" ></el-table-column>
			<el-table-column prop="remark" label="备注" width="200px"></el-table-column>
			<el-table-column fixed="right" label="是否开启" width="150">
				<template slot-scope="scope">
					<el-switch class="table-item-switch" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeItemSwitch(scope.row)" active-color="#409eff" ></el-switch>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
			    <template slot-scope="scope">
			        <el-button v-if="scope.row.status==1" type="text" size="small" @click.stop="handleItem('edit',scope.row)">编辑</el-button>
			    </template>
			</el-table-column>
			<div slot="empty" v-if="!searchData.processId">请先选择工序</div>
		</el-table>
		<el-row type="flex" class="row-bg" justify="center" v-if="tableData.totalPages">
			<el-pagination class="pagination" layout="prev, pager, next" @current-change="handlePagination" :page-count="tableData.totalPages"></el-pagination>
		</el-row>
		<el-dialog ref="dialog" :title="dialogFormData.title+'定额'" :visible.sync="dialogIsShow">
			<el-form ref="form" :rules="rules" :model="dialogFormData" label-width="130px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="dialogFormData.name"></el-input>
				</el-form-item>
				<el-form-item label="价格(元)" prop="price" type="number">
					<el-input v-model="dialogFormData.price"></el-input>
				</el-form-item>
				<el-form-item label="单位" prop="unit">
					<el-select v-model="dialogFormData.unit">
						<el-option v-for="(item,index) in unitOptions" :label="item.name" :value="item.value" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="进度奖(工单总额)">
				    <el-col :span="10">
						<el-form-item>
							<el-input type="number" min="0" v-model="dialogFormData.progressAwardLeft" placeholder="请输入比例" >
								<span slot="suffix">%</span>
							</el-input>
						</el-form-item>
				    </el-col>
				    <el-col class="line" :span="2">×</el-col>
				    <el-col :span="10">
						<el-form-item>
							<el-input type="number" min="0" v-model="dialogFormData.progressAwardRight" placeholder="请输入比例" >
								<span slot="suffix">%</span>
							</el-input>
						</el-form-item>
				    </el-col>
				</el-form-item>
				<el-form-item label="质量奖(工单总额)">
				    <el-col :span="10">
						<el-form-item>
							<el-input type="number" min="0" v-model="dialogFormData.qualityAwardLeft" placeholder="请输入比例" >
								<span slot="suffix">%</span>
							</el-input>
						</el-form-item>
				    </el-col>
				    <el-col class="line" :span="2">×</el-col>
				    <el-col :span="10">
						<el-form-item>
							<el-input type="number" min="0" v-model="dialogFormData.qualityAwardRight" placeholder="请输入比例" >
								<span slot="suffix">%</span>
							</el-input>
						</el-form-item>
				    </el-col>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-col :span="6">
						<el-input-number v-model="dialogFormData.sort" controls-position="right" :min="1" :max="999"></el-input-number>
					</el-col>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
				    <el-input type="textarea" v-model="dialogFormData.remark" maxlength="5000"  show-word-limit></el-input>
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
	import { getQuotaPage,getQuotaList,operationQuota,operationQuotaStatus } from '@/api/productionManagement/systemManagement.js'
	export default{
		data(){
			return{
                unitOptions: [{
                    name: '米',
                    value: 'UNIT_MI'
                },{
                    name: '吨',
                    value: 'UNIT_DUN'
                }],
				searchData: this.initSearchData(), //搜索数据
				opstions: [], //select数据
				tableData: {}, // table数据
				dialogFormData: this.initDialogFormData(),
				dialogIsShow: false,
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' },
						{ max: 64, message: '名称不能超过64个字符', trigger: 'blur' }
					],
					price: [
						{ required: true, message: '请输入价格', trigger: 'blur' },
					],
					unit: [
						{ required: true, message: '请输入单位', trigger: 'blur' },
						{ max: 32, message: '单位不能超过32个字符', trigger: 'blur' }
					],
				},
				isLoading: {
					list: false, //工序列表
					dialogConfirm: false
				},
			}
		},
		mounted() {
			// this.getQuotaListData();
			this.getOptions();
		},
		methods:{
			unitFor(unit){
				var options = this.unitOptions;
				for(let i=0; i<this.unitOptions.length; i++){
					if(unit == options[i].value){
						return options[i].name;
					}
				}
			},
			getOptions(){
				this.unitOptions = unitOptions;
			},
			tableRowClassName({row, rowIndex}){
				if(row.status == 0){
					return 'table-row--lock'
				}
			},
			// 初始化搜索
			initSearchData(){
				return{
					name: "",
					page: 0,
					processId: "",
					size: 10,
					status: undefined
				}
			},
			// 弹框数据
			initDialogFormData(){
				return{
					name: '',
					processId: '',
					quotaId: undefined,
					progressAwardLeft: 0,
					progressAwardRight: 0,
					qualityAwardLeft: 0,
					qualityAwardRight: 0,
					remark:'',
					sort: 999,
					status: 1,
					unit: '',
					title: '新增'
				}
			},
			// 奖励换算
			awardFor(data){
				if(data){
					let arr = data.split('#');
					return `${arr[0]}% × ${arr[1]}%`;
				}else{
					return '无'
				}
			},
			// 初始化数据
			init(processId){
				this.searchData.processId = processId;
				this.getQuotaPageData();
			},
			// 获取options
			getQuotaListData(){
				getQuotaList(this.searchData).then((res)=>{
					console.log(res.data);
					this.opstions = res.data;
				})
			},
			//获取列表数据
			getQuotaPageData(){
				this.isLoading.list = true;
				getQuotaPage(this.searchData).then((res)=>{
					this.tableData = res.data;
				}).finally(()=>{
					this.isLoading.list = false;
				})
			},
			// 点击当前item切换是否开启
			changeItemSwitch(itemData){
				operationQuotaStatus(itemData.quotaId).then((res)=>{
					if(itemData.status == 0){
						this.$message({
							message: '关闭定额成功',
							type: 'success'
						});
					}else{
						this.$message({
							message: '开启定额成功',
							type: 'success'
						});
					}
				})
			},
			handleItem(type, data){
				if(!this.searchData.processId){
					this.$message.error('请先选择工序');
					return;
				}
				if(type == 'add'){
					this.dialogFormData = this.initDialogFormData();
				}else{
					let newData = Object.assign({title:'编辑'},data);
					newData.progressAwardLeft =  parseFloat(data.progressAward.split('#')[0])||0;
					newData.progressAwardRight =  parseFloat(data.progressAward.split('#')[1])||0;
					newData.qualityAwardLeft = parseFloat(data.qualityAward.split('#')[0])||0;
					newData.qualityAwardRight = parseFloat(data.qualityAward.split('#')[1])||0;
					this.dialogFormData = newData;
				}
				this.dialogFormData.unit = this.unitOptions[0].value;
				this.dialogIsShow = true;
			},
			// 点击弹框确认
			handleFormConfirm(){
				this.dialogFormData.processId = this.searchData.processId;
				this.dialogFormData.progressAward = `${this.dialogFormData.progressAwardLeft}#${this.dialogFormData.progressAwardRight}`;
				this.dialogFormData.qualityAward = `${this.dialogFormData.qualityAwardLeft}#${this.dialogFormData.qualityAwardRight}`;
				if(!this.dialogFormData.processId){
					this.$message.error('请选择工序');
					return;
				}

				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isLoading.dialogConfirm = true;
						operationQuota(this.dialogFormData).then((res)=>{
							this.$message({
								message: this.dialogFormData.title+'成功',
								type: 'success'
							});
							this.searchData.page = 0;
							this.getQuotaPageData();
						}).finally(() => {
							this.isLoading.dialogConfirm  = false;
							this.dialogIsShow = false;
						})
					}
				});
			},
			// 点击切换页面
			handlePagination(pageNumber){
				this.searchData.page = pageNumber-1;
				this.getQuotaPageData();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.quota-list{
		display: flex;
		flex-direction: column;
	}
	.table{
		flex: 1;
	}
	.line{
		text-align: center;
	}
	// table锁定行样式
	::v-deep .el-table .table-row--lock{
		.cell{
			color: #C0C4CC !important;
		}
	}
</style>
