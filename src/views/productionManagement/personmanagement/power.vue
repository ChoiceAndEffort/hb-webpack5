<template>
	<div class="main_container power">
		<el-form :inline="true" size="small" :model="formData">
			<el-form-item>
				<el-row type="flex">
				  <el-input v-model="formData.name" placeholder="请输入权限名称">
					   <EnterpriseSelect class="select" slot="prepend" :currentSelectId="formData.enterpriseType" @handleChange="handleChange"/>
				  </el-input>
				  <el-button class="m-btn-small tool-bar-button--24" type="primary" style="margin-left: 20px;" @click="handleSearch">搜索</el-button>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-button class="add-btn" style="margin-left: 20px;" type="primary" icon="el-icon-plus" @click="handleAddPowerFormShow(undefined)">新增</el-button>
			</el-form-item>
		</el-form>
		<div class="container-style container-padding power-list">
			<el-table ref="multipleTable" :data="powerList" header-row-class-name="table-header-gray" :row-class-name="tableRowClassName" v-loading="isLoading.list"  tooltip-effect="dark" style="width: 100%" row-key="powerId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
			    <el-table-column label="权限名称" width="250">
					<template slot-scope="scope">{{scope.row.name}}</template>
			    </el-table-column>
<!--				<el-table-column label="图标" width="110">
					<template slot-scope="scope">
						<SvgIcon :icon-class="scope.row.icon" style="height: 30px;width: 16px;" />
					</template>
				</el-table-column>-->
				<el-table-column label="排序" width="110">
					<template slot-scope="scope">{{scope.row.sort}}</template>
				</el-table-column>
				<el-table-column label="权限路由">
					<template slot-scope="scope">{{scope.row.action}}</template>
				</el-table-column>
				<el-table-column label="添加时间" width="200">
					<template slot-scope="scope">{{scope.row.addTime | shorttime}}</template>
				</el-table-column>
				<el-table-column label="更新时间" width="200">
					<template slot-scope="scope">{{scope.row.updTime | shorttime}}</template>
				</el-table-column>
			    <el-table-column label="是否开启" width="180">
			        <template slot-scope="scope">
						<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="handleOperationPowerStatus(scope.row)"></el-switch>
			        </template>
			    </el-table-column>
				<el-table-column fixed="right" label="操作" width="180">
					<template slot-scope="scope">
						<el-button v-if="scope.row.status == 1" type="text" size="small" :disabled="scope.row.status === 0" @click="handleEditPowerFormShow(scope.row)">编辑</el-button>
						<el-button v-if="scope.row.status == 1" type="text" size="small" :disabled="scope.row.status === 0" @click="handleDeletePower(scope.row.powerId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog :title="powerFormData.title+'权限'" :visible.sync="dialogAddPowerShow" width="580px">
			<el-form ref="ruleForm" label-width="80px" :model="powerFormData" :rules="rules" :inline="true">
				<el-form-item label="菜单类型" prop="type">
					<el-radio-group v-model="powerFormData.type" size="mini" style="width: 178px">
                        <el-radio-button label="2">模块</el-radio-button>
						<el-radio-button label="0">导航</el-radio-button>
						<el-radio-button label="1">按钮</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-row>
					<el-form-item label="企业类型" prop="enterpriseType">
						<EnterpriseSelect class="select" :currentSelectId="powerFormData.enterpriseType" @handleChange="handleChange"/>
					</el-form-item>
				</el-row>
<!--				<el-form-item v-show="powerFormData.type.toString() !== '1'" label="菜单图标" prop="icon">
					<el-popover class="icon-popover" placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
						<IconSelect ref="iconSelect" @selected="selectedIcon" />
						<el-input slot="reference" v-model="powerFormData.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
						<SvgIcon v-if="powerFormData.icon" slot="prefix" :icon-class="powerFormData.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
						<i v-else slot="prefix" class="el-icon-search el-input__icon" />
				    </el-input>
				 </el-popover>
				</el-form-item>-->
				<el-form-item label="权限名称" prop="name">
					<el-input style="width: 180px;" v-model="powerFormData.name" placeholder="请输入权限名称" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限路由">
					<el-input style="width: 180px;" v-model="powerFormData.action" placeholder="请输入权限路由" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级类目" v-if="powerFormData.type!='2'">
					<el-cascader ref="cascader" v-model="powerFormData.pid" :options="powerListOptions" :props="props" style="width: 450px" @change="handleCascaderChange"></el-cascader>
				</el-form-item>
				<el-form-item label="排序">
					 <el-input-number v-model="powerFormData.sort" controls-position="right" :min="1" :max="999"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddPowerShow=false">取 消</el-button>
				<el-button type="primary" :loading="isLoading.formSubmit" @click="handlePowerFormConfirm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import EnterpriseSelect from '../components/enterpriseSelect.vue'
	import IconSelect from '../components/iconSelect'
	import SvgIcon from '../components/svgIcon'
	import { operationPower, getPowerList,getPowerDetail,deletePower,operationPowerStatus } from '@/api/productionManagement/departmentRole.js'
	export default{
		data(){
			return{
				dialogAddPowerShow: false, //是否显示新增权限弹框
				powerFormData: this.initPowerFormData(), //初始化弹框数据
				powerList: [], //权限列表
				powerListOptions: [],
				isLoading: {
					list: false,
					formSubmit: false
				},
				formData:{
					name: undefined,
					enterpriseType: 4,
				},
				rules: {
					name: [
						{ required: true, message: '请输入权限名称', trigger: 'blur' },
						{ max: 32, message: '权限名称不能超过32个字符', trigger: 'blur' }
					],
					enterpriseType:[
						  { required: true, message: "请选择企业类型", trigger: "change" },
					]
				},
				props: {
					value: 'powerId',
					label: 'name',
					expandTrigger: 'hover',
					checkStrictly: true
				}
			}
		},
		components:{
			IconSelect,
			SvgIcon,
			EnterpriseSelect
		},
        created() {
            this.getPowerListData();
        },
        methods:{
			handleCascaderChange(){
				this.$refs.cascader.dropDownVisible = false;
			},
			tableRowClassName({row, rowIndex}){
				if(row.status == 0){
					return 'table-row--lock'
				}
			},
			// 选择企业
			handleChange(type){
				this.formData.enterpriseType=type;
				this.powerFormData.enterpriseType = type;
				this.getPowerListData();
			},
			// 初始化新增权限表单
			initPowerFormData(){
				return {
					action: '', // 权限行为
					icon: '', //权限图标
					name: '', //权限名称
					pid: undefined, //上级权限
					powerId: '', //权限Id，无Id为新增，有Id为编辑
					sort: 999, // 排序, 默认999, 不能超过三位数字
					status: 1, //状态（默认 1 开启）（0 禁用，1 开启），只能是0或1
					type: 0, //权限类型(0 导航，1 按钮，2 页面），不能超过1位数字
					enterpriseType: 1,//企业类型
				}
			},
			// 权限列表渲染数据转换
			powerTableDataFor(list, pid = 0) {
				return list.filter(item => item.pid == pid).map(item => (item.children = this.powerTableDataFor(list, item.powerId), item));
			},
			getTreeData(data){
				for(var i=0; i<data.length; i++){
					if(data[i].children.length< 1){
						data[i].children = undefined;
					}else{
						this.getTreeData(data[i].children);
					}
				}
				return data;
			},
			// 根据权限类型转换为文字
			powerTypeFor(type){
				let result = ''
				switch (type){
					case 0:
						result = '导航'
						break;
					case 1:
						result = '按钮'
						break;
					default:
						break;
				}
			},
			// 权限维护
			setOperationPower(itemData,msg){
				if(typeof itemData.pid =='object'){
					let index = itemData.pid.length > 0?itemData.pid.length -1: 0;
					itemData.pid = itemData.pid[index]
				}
                if(this.powerFormData.type == '2'){
                    itemData.pid = 0
                }
				this.isLoading.formSubmit = true;
				operationPower(itemData).then((res)=>{
					this.$message({
						message: msg,
						type: 'success'
					});
					this.getPowerListData();
				}).finally(()=>{
					this.dialogAddPowerShow = false;
					this.isLoading.formSubmit = false;
				})
			},
			//获取权限列表数据
			getPowerListData(){
				this.isLoading.list = true;
				getPowerList(this.formData).then((res)=>{
					this.powerList = res.data;
					this.powerListOptions = [{
						pid: '0',
						powerId: '0',
						name: '顶级类目',
						children: [].concat(res.data)
					}]
				}).finally(() => {
					this.isLoading.list = false;
				})
			},
			//点击弹出新增权限弹框
			handleAddPowerFormShow(){
				this.dialogAddPowerShow = true;
				this.powerFormData = this.initPowerFormData();
				this.powerFormData.enterpriseType = this.formData.enterpriseType;
				this.powerFormData.title = '新增';
			},
			//点击弹出编辑权限弹框
			handleEditPowerFormShow(itemData){
				for(var i in itemData){
					this.$set(itemData, 'enterpriseType',itemData['enterpriseType']);//数据类型转换
				};
				this.dialogAddPowerShow = true;
				this.powerFormData = Object.assign({},itemData);
				this.powerFormData.title = '编辑';
			},
			// 选择图标
			selectedIcon(name){
				this.powerFormData.icon = name;
			},
			// 点击新增权限
			handlePowerFormConfirm(){
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						this.setOperationPower(this.powerFormData, this.powerFormData.title+'成功');
					}
				})
			},
			// 点击删除权限
			handleDeletePower(id){
				this.$confirm('确定删除吗, 如果存在下级节点则一并删除, 此操作不可撤销', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletePower(id).then((res)=>{
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getPowerListData();
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 切换禁用开启权限
			handleOperationPowerStatus(itemData){
				operationPowerStatus(itemData.powerId).then((res)=>{
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
					this.getPowerListData();
				})
			},
			handleSearch(){
				this.getPowerListData();
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
	// table锁定行样式
	::v-deep .el-table .table-row--lock{
		.cell{
			color: #C0C4CC !important;
		}
	}
</style>
