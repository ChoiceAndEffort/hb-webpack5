<!--工序配置-->
<template>
    <div>
        <el-dialog title="配置工序" :visible.sync="processshow" :close-on-click-modal="false" width="680px">
            <selectTable ref='selectTable' :tableData="list" parentIds='pid' compareId="workingProcedureId" selectName="name">
                <el-table-column prop="name" label="工序名称"></el-table-column>
                <el-table-column prop="sort" label="产量占比">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.proportion" type="number" v-only-number="{max:100,min:0,precision:2}" class="input-with-select">
                            <el-button slot="append" >%</el-button>
                        </el-input>
                    </template>
                </el-table-column>
            </selectTable>
            <div  class="footer">
                <el-button @click="colse">取消</el-button>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getWorkingProcedureList,addProjectWorkingProcedureBatch} from "@/api/productionManagement/project.js"
import selectTable from '@/views/productionManagement/components/selectTbale.vue'
export default {
    components: {selectTable},
    props: ['couplingId'],
    data() {
        return {
            workingProcedureCode: '',
            checkedCities: [],
            processshow:false,
            checkedList:[],
            allcheckedList:[],
            list:[],
            listCode: [], // 对比已选的index
            input2:'',
            engineeringProjectId:'',//项目id
            procedureLength: '', // 工序数量判断是否已经配置过
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        initUser(data,data2,procedureLength,type){
            this.engineeringProjectId=data,
            this.couplingId=data2;
            this.procedureLength = procedureLength;
            this.processshow=true;
            this.getWorkingProList(type);
        },
        //保存
        onSubmit(){
           let  message=[], maxNum = 0;
            this.$refs.selectTable.renderDynamic.forEach(res=>{
                // console.log(res.isSelect)
                if(res.isSelect==1 || res.isSelect==2){
                    if(Number(res.proportion)==0){
                        message.push(res.name);
                    }else{
                        maxNum += Number(res.proportion);
                        // 配置工艺产量累加的结果
                        console.log(maxNum)
                    }
                }
            })
            // if(message.length>0) return this.$message.warning(message.join('、')+'工序的配置不能为0')
            if(maxNum != 100)  return this.$message.error('工序占比总数要为100%');
            const sendData = {
                couplingId:this.couplingId,
                engineeringProjectId: this.engineeringProjectId,
                list: this.$refs.selectTable.renderDynamic
            }
            addProjectWorkingProcedureBatch(sendData).then((res)=>{
					if(res.code === 0){
                         this.$message.success("工序配置成功！");
                         this.$parent.getprojecworking();
                    }
				}).finally(() => {

				})
            this.processshow=false;
        },
        //取消
        colse(){
            this.processshow=false;
        },
        //获取模板工序列表
        getWorkingProList(type){
            this.checkedList = []
            getWorkingProcedureList({couplingId: this.couplingId,type:type}).then((res) => {
                if (res.code === 0) {
                    this.listCode = []
                    this.list = res.data;
                    this.$refs.selectTable.initData(res.data) // 给复选表格控件传值
                    res.data.forEach(data => {
                        this.listCode.push(data.workingProcedureCode)
                        if(data.proportion> 0) this.checkedList.push(data.workingProcedureCode)
                    })
                }
		    });
        },
    }
};
</script>

<style scoped lang="scss">
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
::v-deep .el-input-group{
    width: auto;
}
::v-deep .el-tree-node{
    margin: 10px 0;
}
.title {
    padding: 5px 0;
}
.footer {
    margin-top: 10px;
        text-align: right;
        .el-form .el-form-item {
             width: 100% !important;
     }
}
</style>
