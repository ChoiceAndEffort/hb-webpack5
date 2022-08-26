<template>
	<el-select class="select" v-model="selectId" filterable placeholder="请选择" @change="handleChange">
		<el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
	</el-select>
</template>

<script>
	// import { getEngineeringProjectList } from '@/api/productionManagement/project.js'
	export default{
		props:{
			currentSelectId: {
				type: Number,
				default: 1
			}
		},
		data(){
			return{
				options:[{
					name: '管理员',
					id: 0
				},{
					name: '建设单位',
					id: 1
				},{
					name: '监理单位',
					id: 2
				},{
					name: '总承包',
					id: 3
				},{
					name: '专业分包',
					id: 4
				},{
					name: '设计单位',
					id: 5
				},{
					name: '监控单位',
					id: 6
				},{
					name: '检验单位',
					id: 7
				}],
				selectId: ''
			}
		},
		mounted() {
			// this.$emit('handleChange',1);
		},
		methods:{
			handleChange(id){
				this.$emit('handleChange',id);
			}
		},
		watch: {
			currentSelectId:{
				immediate: true,
				handler: function(newId,oldId){
					this.$nextTick(()=>{
						this.selectId = newId;
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.select ::v-deep .el-input {
	    width: 170px;
	}
</style>
