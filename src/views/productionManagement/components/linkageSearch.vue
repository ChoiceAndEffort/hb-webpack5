<template>
    <div v-bind="$attrs">
        <!-- 项目下拉框 -->
        <el-select
            v-model="searchobj.engineeringProjectId"
            placeholder="请选择项目"
            clearable
            filterable
            @change="getLinkage('one')"
            :size="size"
        >
            <el-option
                v-for="item in projectList"
                :key="item.engineeringProjectId"
                :label="item.name"
                :value="item.engineeringProjectId+'-'+item.name"
            ></el-option>
        </el-select>
        <!-- 联段下拉框 -->
        <el-select
            v-model="searchobj.couplingId"
            placeholder="请选择联段"
            clearable
            filterable
            @change="getLinkage('two')"
            :size="size"
        >
            <el-option
                v-for="item in couplingList"
                :key="item.couplingId"
                :label="item.name"
                :value="item.couplingId+'-'+item.name"
            ></el-option>
        </el-select>
        <!-- 工序下拉框 -->
        <el-select
            v-model="searchobj.procedureId"
            placeholder="请选择工序"
            clearable
            filterable
            @change="getLinkage('three')"
            :size="size"
        >
            <el-option
                v-for="item in procedureList"
                :key="item.projectWorkingProcedureId"
                :label="item.name"
                :value="item.projectWorkingProcedureId+'-'+item.name"
            ></el-option>
        </el-select>
        <el-button v-if="submit" type="primary" size="small" @click="submitButton">{{ $attrs.submitContext || '确定' }}</el-button>
    </div>
</template>

<script>
import { getCouplinglist, getProcedureList, getEngineeringProjectList } from "@/api/productionManagement/project.js";
export default {
    name: "linkageSearch",
    props:{
        size: { // 框和按钮大小
            type: String,
            default: 'small'
        },
        submit: { // 按钮
            type: Boolean,
            default: false
        },
    },
    data(){
        return{
            searchobj: {
                engineeringProjectId: "", // 项目id
                couplingId: "", // 联段id
                procedureId: "", // 工序id
            },
            projectList: [], // 项目
            couplingList: [], // 联段框
            procedureList: [], // 工序框
        }
    },
    created() {
        this.getprojectList()
    },
    methods: {
        resetData(data) {
            this.$set(this, 'searchobj',data ? data : {
                engineeringProjectId: "", // 项目id
                couplingId: "", // 联段id
                procedureId: "", // 工序id
            })
        },
        getprojectList() {
            getEngineeringProjectList({
                status: 1,
            }).then((res) => {
                if (res.code === 0) {
                    this.projectList = res.data;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        getLinkage(sign) {
            switch (sign) {
                case 'one':
                    // 清空选择联段框
                    this.couplingList = [];
                    // 清空选择工序框
                    this.procedureList = [];
                    this.searchobj.couplingId = ''
                    this.searchobj.procedureId = ''
                    if(this.searchobj.engineeringProjectId==''){
                        break;
                    }
                    this.$emit('getProjectName',this.searchobj.engineeringProjectId.split('-')[1])
                    getCouplinglist({
                        engineeringProjectId: this.searchobj.engineeringProjectId.split('-')[0],
                    }).then((res) => {
                        if (res.code === 0) {
                            this.couplingList = res.data;
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                    break;
                case 'two':
                    // 清空选择工序框
                    this.procedureList = [];
                    this.searchobj.procedureId = ''
                    if(this.searchobj.couplingId==''){
                        break;
                    }
                    this.$emit('getProjectName',this.searchobj.engineeringProjectId.split('-')[1]+'—'+this.searchobj.couplingId.split('-')[1])
                    getProcedureList({
                        couplingId: this.searchobj.couplingId.split('-')[0],
                    }).then((res) => {
                        if (res.code === 0) {
                            this.procedureList = res.data;
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                    break;
                case 'three':
                    const sendData = this.getsendData()
                    if(!this.submit) this.$emit('confirmSearch',sendData)
                    break;
            }
        },
        getsendData() {
            return {
                engineeringProjectId: this.searchobj.engineeringProjectId.split('-')[0] || '', // 项目id
                couplingId: this.searchobj.couplingId.split('-')[0] || '', // 联段id
                procedureId: this.searchobj.procedureId.split('-')[0]|| '', // 工序id
            }
        },
        submitButton() {
            const sendData = this.getsendData()
            if(sendData.procedureId=='') return this.$message.warning('请选择工序！');
            this.$emit('confirmSearch', sendData)
        },
        getProjectWorkingProcedureCode(){
            let code = undefined;
            this.procedureList.forEach((item)=>{
                if(item.projectWorkingProcedureId == this.searchobj.procedureId.split('-')[0]){
                    code = item.workingProcedureCode
                }
            })
            return code
        }
    },
}
</script>

<style scoped lang="scss">
::v-deep .el-select {
    margin-right: 16px;
}
</style>
