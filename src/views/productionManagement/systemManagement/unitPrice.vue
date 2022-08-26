<template>
	<div class="main_container">
		<WorkingProcedureList ref="workingProcedureList" :processQuotaTemplateId="processQuotaTemplateId" @handleTabItem="handleTabClick"/>
		<div class="container">
			<ProcessList class="process-list" @handleRow="handleProcessListRow" :processQuotaTemplateId="processQuotaTemplateId" :workingProcedureCode="workingProcedureCode"/>
			<QuotaList class="quota-list" ref="quotaList"/>
		</div>
	</div>
</template>

<script>
	import WorkingProcedureList from './components/workingProcedureList'
	import ProcessList from './components/processList.vue'
	import QuotaList from './components/quotaList.vue'
	export default {
		data() {
			return {
				searchVal: '', //搜索数据
				processQuotaTemplateId: '', //模板id
				workingProcedureCode: '', //工序code
			}
		},

		mounted() {
			if(this.$route.query.processQuotaTemplateId){
				this.processQuotaTemplateId = this.$route.query.processQuotaTemplateId;
			}
		},
		components:{
			WorkingProcedureList,
			ProcessList,
			QuotaList
		},
		methods: {
			handleTabClick(data){
				this.workingProcedureCode = data;
			},
			//点击工艺列表行
			handleProcessListRow(itemData) {
				this.$refs.quotaList.init(itemData.processId)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		margin-top: 5px;
		flex: 1;
		display: flex;
	}
	.process-list{
		background: #FFFFFF;
		width: 500px;
	}
	.quota-list{
		background: #FFFFFF;
		flex: 1;
	}
</style>
