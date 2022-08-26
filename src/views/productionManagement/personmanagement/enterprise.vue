<template>
	<div class="app-container enterprise">
		<div class="container-style container-padding enterprise-wrap">
			<el-form :inline="true" size="small">
				<el-form-item>
					<el-row type="flex">
						<el-input class="input-with-select" v-model="searchData.name" placeholder="请输入企业名称">
							<EnterpriseSelect ref="enterpriseSelect" :currentSelectId="enterpriseType" slot="prepend" @handleChange="handleChange"/>
						</el-input>
						<el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleAddFormShow">新增</el-button>
				</el-form-item>
			</el-form>
			<div class="container-style container-padding enterprise-list">
				<el-table ref="multipleTable" v-loading="isLoading.enterpriselist" header-row-class-name="table-header-gray" :data="data.data" :highlight-current-row="true" tooltip-effect="dark" style="width: 100%" @row-click="handleCurrentPower" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
					<el-table-column label="企业名称">
						<template slot-scope="scope">
							<span>{{scope.row.name}}</span>
						</template>
					</el-table-column>
					<el-table-column label="是否开启">
						<template slot-scope="scope">
							<el-switch class="table-item-switch" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="changeItemSwitch(scope.row)" active-color="#409eff" ></el-switch>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="180">
						<template slot-scope="scope">
							<el-button type="text" size="small" :disabled="scope.row.status === 0" @click.stop="handleEditFormShow(scope.row)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination-wrap">
					<el-pagination layout="prev, pager, next" :page-count="data.totalPages" @current-change="handlePagination"></el-pagination>
				</div>
			</div>
			<el-dialog :title="formData.title+'企业'" :visible.sync="isDialogShow" width="580px">
				<el-form ref="form" :model="formData" :rules="rules" label-width="80px">
					<el-form-item label="企业名称" prop="name">
						<el-input v-model="formData.name"></el-input>
					</el-form-item>
					<el-form-item label="企业类型" prop="type">
						<EnterpriseSelect ref="enterpriseSelect" :currentSelectId="enterpriseType" @handleChange="handleChange"/>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="isDialogShow=false">取 消</el-button>
					<el-button type="primary" :loading="isLoading.submit" @click="handleFormConfirm">确 定</el-button>
				</div>
			</el-dialog>
		</div>
		<div class="container-style container-padding power-wrap">
			<div class="role-power-header">
				<h3 class="role-power-header__title">权限分配</h3>
				<el-button class="role-power-header__btn" type="primary" :loading="isLoading.powerSave" size="mini" @click="handleSaveTreeChecked">保存</el-button>
			</div>
			<el-tree v-if="enterpriseId" ref="powerTree" v-loading="isLoading.tree"  node-key="powerId" :props="defaultProps" show-checkbox :data="powerListData"></el-tree>
			<el-empty v-else description="请先选择企业"></el-empty>
		</div>
	</div>
</template>

<script>
	import EnterpriseSelect from '../components/enterpriseSelect.vue'
	import { getEnterprisePage,operationEnterprise, operationEnterpriseStatus,getEnterpriseAndPower,getPowerList,operationEnterprisePower } from '@/api/productionManagement/departmentRole.js';
	export default{
		data(){
			return{
				data:{},
				searchData: this.initSearchData(),
				formData: this.initFormData(),
				isLoading: {
					enterpriselist: false,
					submit: false,
					tree: false,
					powerSave: false
				},
				isDialogShow: false,
				searchVal: '',
				rules: {
					name: [
						{ required: true, message: '请输入企业名称', trigger: 'blur' },
						{ max: 32, message: '企业名称不能超过32个字符', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择企业类型',trigger: 'change' },
					]
				},
				enterpriseId: '',
				enterpriseType: 4,
				powerNormalListData: [], //权限列表未转换前的数据
				powerListData: [], //权限列表数据
				powerListChecked: [], //权限列表选中的powerId数组
				defaultProps: { //树组件渲染节点属性名
					children: 'children',
					label: 'name'
				},
			}
		},
		components:{
			EnterpriseSelect
		},
        created() {
            this.handleSearch()
        },
        methods:{
			// 初始化搜索表单
			initSearchData(){
				return{
					name: '',
					page: 0,
					size: 10,
					type: 4
				}
			},
			// 初始化表单数据
			initFormData(){
				return{
					enterpriseId: '',
					name: '',
					title: '',
					type: ''
				}
			},
			// 获取列表数据
			getEnterprisePageData(data ={}){
				this.isLoading.enterpriselist = true;
				// this.searchData.enterpriseType = this.enterpriseType;
				getEnterprisePage(this.searchData).then((res)=>{
					this.data = res.data;
				}).finally(()=>{
					this.isLoading.enterpriselist = false;
				})
			},
			// 点击新增
			handleAddFormShow(){
				this.formData = this.initFormData();
				this.formData.type = this.enterpriseType;
				this.formData.title = '新增';
				this.isDialogShow = true;
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate();
				})
			},
			// 点击编辑
			handleEditFormShow(itemData){
				this.formData = Object.assign({},itemData);
				this.formData.title = '编辑';
				this.isDialogShow = true;
				this.$nextTick(()=>{
					this.$refs['form'].clearValidate();
				})
			},
			// 提交弹框数据
			handleFormConfirm(){
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.isLoading.submit = true;
						this.formData.enterpriseType = this.enterpriseType;
						operationEnterprise(this.formData).then((res)=>{
							this.$message({
								message: this.formData.title+'成功',
								type: 'success'
							});
							this.getEnterprisePageData();
						}).finally(()=>{
							this.isLoading.submit = false;
							this.isDialogShow = false;
						})
					}
				});
			},
			// 切换页面
			handlePagination(pageNumber){
				this.searchData.page = pageNumber-1;
				this.getEnterprisePageData();
			},
			//搜索
			handleSearch(){
				let data = Object.assign({},this.searchData);
				data.name = this.searchVal;
				this.getEnterprisePageData(data);
			},
			// // 选择专业
			handleChange(type){
				this.enterpriseId = '';
				this.enterpriseType = type;
				this.formData.type = this.enterpriseType;
				this.searchData.type = this.enterpriseType;
				this.getEnterprisePageData();
			},
			// 开启关闭企业
			changeItemSwitch(itemData){
                event.stopPropagation()
				operationEnterpriseStatus(itemData.enterpriseId).then((res)=>{
					this.$message({
						message: itemData.status == 0?'禁用成功':'开启成功',
						type: 'success'
					});
				})
			},
			// 点击企业显示出对应权限
			handleCurrentPower(itemData,e,column){
                event.stopPropagation()
				if(itemData.status == 0){
					this.$message.error('企业已禁用');
					return;
				}
				this.isLoading.list = true;
				getPowerList({
					enterpriseType: itemData.type,
					status: 1
				}).then((res)=>{
					this.powerNormalListData = res.data;
					this.powerListData =res.data;
					this.enterpriseId = itemData.enterpriseId;
					this.getPowerListData();
				}).finally(() => {
					this.isLoading.list  = false;
				})
			},
            getChildrenid(data) {
                data.forEach(res => {
                    if(res.children!=null){
                        this.getChildrenid(res.children)
                    }else{
                        this.powerListChecked.push(res)
                    }
                })
            },
			// 获取权限列表
			getPowerListData(){
				this.isLoading.tree = true;
				this.powerListChecked = []; //清空当前角色的权限数组
				// 遍历获取到当前角色默认选中的数组
				getEnterpriseAndPower(this.enterpriseId).then((res)=>{
					let powers = res.data.powers==null? [] : res.data.powers;
                    this.getChildrenid(powers)
                    this.$refs.powerTree.setCheckedNodes(this.powerListChecked);
				}).finally(()=>{
					this.isLoading.tree = false;
				})
			},
			handleSaveTreeChecked(){
				if(!this.enterpriseId){
					this.$message.error('请先选择企业');
					return;
				}
				operationEnterprisePower({
					powerIds: this.$refs.powerTree.getCheckedKeys().concat(this.$refs.powerTree.getHalfCheckedKeys()),
					enterpriseId: this.enterpriseId
				}).then((res)=>{
					this.$message({
						message: '保存权限成功',
						type: 'success'
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.enterprise{
		display: flex;
		flex-direction: row;
	}
	.enterprise-wrap{
		flex: 1;
		margin-right: 8px;
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
		::v-deep .select.el-select .el-input {
		    width: 100px;
		}
		::v-deep .input-with-select .el-input-group__prepend {
		    background-color: #fff;
		}
	}
	.power-wrap{
		width: 600px;
		.role-power-header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.role-power-header__btn{
				height: 30px;
			}
		}
	}
</style>
