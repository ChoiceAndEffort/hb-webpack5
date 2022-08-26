<template>
    <div class="gggj_style">
        <div>
            <el-button type="primary" @click="addTab" size="small">配置工序</el-button>
        </div>
        <div class="tabs-wrap">
            <el-menu :default-active="activeVal" active-text-color="#1989FA" class="el-menu-demo" mode="horizontal" @select="handleTabClick">
                <template v-for="item in workingProcedure">
                    <el-submenu v-if="item.children.length>0" :index="item.workingProcedureCode">
                        <template slot="title">{{ item.name }}</template>
                        <el-menu-item v-for="child in item.children" :index="child.workingProcedureCode">{{ child.name }}</el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :index="item.workingProcedureCode">{{item.name}}</el-menu-item>
                </template>
            </el-menu>
<!--            <el-tabs class="tabs" v-model="activeVal" type="card" @tab-click="handleTabClick">
                <el-tab-pane v-for="item in workingProcedure" :key="item.workingProcedureCode" :label="item.name" :name="item.workingProcedureCode" ></el-tab-pane>
            </el-tabs>-->
<!--            <AddworkingProcedureDialog @handleFormConfirm="handleWorkingProcedureConfirm" ref="addworkingProcedureDialog"/>-->
        </div>
    </div>
</template>

<script>
	import AddworkingProcedureDialog from './addworkingProcedureDialog.vue'
	import { getDictData,addWorkingProcedureBatch,getWorkingProcedureList } from '@/api/productionManagement/systemManagement.js'
    import {getDictdata} from "@/assets/productionManagement/comjs/common";
	export default {
		props: {
			processQuotaTemplateId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				workingProcedureDictData: [], //工序字典数据
				workingProcedureCheckedData: [], //选中的数据
				workingProcedure: [], //tab渲染数据
				activeVal: '', //tab选中的数据
			}
		},
		components:{
			AddworkingProcedureDialog
		},
		methods: {
			randerList(data){
				this.workingProcedure = data;
				let arr = [];
				data.forEach((item,index)=>{
					if(index == 0){
						this.activeVal = item.workingProcedureCode;
						this.handleTabClick(item);
					}
					arr.push(item.workingProcedureCode);
				})
				this.workingProcedureCheckedData = arr;
				this.workingProcedureDictData.forEach((codeItem)=>{
					data.forEach((item)=>{
						if(codeItem.value == item.workingProcedureCode){
							codeItem['proportion'] = item.proportion
						}
					})
				})
			},
			// 获取工序字典项
			getWorkingProcedureData(){
				let data = [];
                this.commonJs.getDictdata('SYS_PMS_WORKING_PROCEDURE').then(res => {
                    res.data.dictItemList.forEach((item)=>{
                        data.push(item);
                    })
                    this.workingProcedureDictData = data;
                    this.getWorkingProcedureListData();
                })
			},
			addTab(targetName) {
                this.$router.push({
                   name: 'configurationProcess',
                   query: {
                       processQuotaTemplateId: this.processQuotaTemplateId,
                   }
               })
				// this.$refs.addworkingProcedureDialog.dialogShow(this.workingProcedureCheckedData,this.workingProcedureDictData);
			},
			// 工序 - 弹框 - 点击保存
			handleWorkingProcedureConfirm(data){
				console.log(data);
				let arr = [];
				data.forEach((item)=>{
					arr.push({
						processQuotaTemplateId: this.processQuotaTemplateId,
						workingProcedureCode: item.value,
						name: item.name,
						proportion:item.proportion
					})
				})
				addWorkingProcedureBatch({
					workingProcedureList: arr
				}).then((res)=>{
					this.$refs.addworkingProcedureDialog.isOk('添加工序成功');
					this.getWorkingProcedureListData();
				}).finally(() => {
					this.$refs.addworkingProcedureDialog.dialogHide();
				})
			},
            /**获取工序列表数据*/
            getWorkingProcedureListData(){
                getWorkingProcedureList({
                    id: this.$route.query.processQuotaTemplateId,
                }).then((res)=>{
                    this.workingProcedure = res.data.workingProcedureAndChildList
                    if(this.workingProcedure.length){
                        this.activeVal = this.workingProcedure[0].workingProcedureCode
                        this.$emit('handleTabItem',this.activeVal);
                    }else{
                        this.activeVal = ''
                    }
                })
            },
			handleTabClick(itemData){
					this.$emit('handleTabItem',itemData);
			}
		},
		watch:{
			processQuotaTemplateId(newVal){
				this.getWorkingProcedureData();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs-wrap{
		display: flex;
	}
	::v-deep .el-tabs__nav{
		background: #FFFFFF;
	}
	::v-deep .el-button{
		margin-left: 20px;
	}

</style>
