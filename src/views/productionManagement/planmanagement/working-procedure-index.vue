<template>
    <div class="main_container">
        <!-- 面包屑 -->
       <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/layout/production-management/planmanagement/working-procedure-index'}">工序作业计划</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div>
            <TableFilter :searchobj.sync="searchobj" :config="headerData" @search="getFilterList" :buttonText="buttonText"/>
        </div>
        <div class="table_box">
            <div class="button_box">
                <div></div>
                <div>
                    <el-button type="primary" icon="el-icon-plus" @click="handleEdit">新增计划</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="handleDetail">修改计划</el-button>
                </div>
            </div>
            <div>
                <el-table
                    :data="data.tableData"
                    style="width: 100%">
                    <el-table-column label="序号">
                        <template slot-scope="scope">{{ scope.$index+1 }}</template>
                    </el-table-column>
                    <el-table-column label="厂区" prop="date"></el-table-column>
                    <el-table-column label="数据类型" prop="date"></el-table-column>
                    <el-table-column
                        prop="nestingName"
                        label="ID"
                        width="180"
                        v-for="(item, index) in monthData"
                        :render-header="(h,obj)=>renderHeader(h,obj,item)"
                        :key="index"
                    >
                    </el-table-column>
                </el-table>
            </div>
           <!-- <TableBody :colConfig="colConfig" :data="data.tableData"></TableBody> -->
            <Pagination :data="data" @changePage="changePage"/>
        </div>
    </div>
</template>

<script>
//引入组件
import { TableBody,TableFilter,Pagination } from "gggj_lib";
import { getnestingPlan } from "@/api/productionManagement/project.js";
    export default{
         //注册组件
        components: {
           TableBody,
           TableFilter,
           Pagination
        },

        data() {
            return {
                monthData: [1,2,3,4,5,6,7,8],
                colConfig: [
                    {
                        attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                    },
                    {
                        attrs: { label: '图纸名称', prop: 'nestingName', align: 'center' },
                    },
                    {
                        attrs: { label: '图纸页码', prop: 'nestingPage', align: 'center' },
                    },{
                        attrs:  { label: '节点计划时间', prop: 'hobby', align: 'center' },
                    },{
                        attrs: { label: '责任单位', prop: 'departmentName', align: 'center' },
                    },{
                        attrs: { label: '数控划线长度（米）', prop: 'lineation_length', align: 'center' },
                    },{
                        attrs: { label: '数控划线计划时间', prop: 'nativePlace', align: 'center' },
                    },{
                        attrs: { label: '工艺完成时间', prop: 'nativePlace', align: 'center' },
                    },{
                        attrs: { label: '数控切割', prop: 'cutting_process', align: 'center' },
                    }],
                headerData: [
                    {
                        code: "date",
                        title: "时间",
                        // DateType: "daterange",
                        type: "mergeDate",
                        width: "180px",
                        // titleEnd: "时间范围",
                    }
                ],
                searchobj: {
                    keyWords: "",
                    auditStatus: 1,
                    auditDateList:[],
                    date:''
                },
                buttonText:'查询',
                data: {
                    total: 0,
                    size: 10,
                    page: 0,
                    lastPage: 0,
                    totalPages: 2,
                    first: true,
                    last: true,
                    tableData: [],
                    segmentList: [],
                },

            }
        },

        computed: {},
        created() {
            this.getList()
        },
        methods: {
            /**自定义表头*/
            renderHeader(h,obj,month) {
                return(
                    <div>{{month}}
                        <el-button class="el-icon-edit" size='mini' type='text' onClick={()=>this.handleAddItem()}></el-button>
                    </div>
                )
            },
            handleAddItem() {

            },
            changeActive() {

            },
            getFilterList() {

            },
            //分页
            changePage(e) {
                this.data.page= e;
            },
            getList() {
                const sendData = {
                    page: this.data.page,
                    size: this.data.size,
                    status: 0
                }
                getnestingPlan(sendData).then(res => {
                    this.$set(this.data, 'tableData',res.data.data);
                    this.data.total = res.data.total;
                })
            },
            handleEdit(){
                this.$router.push({
                    name: 'working-procedure-edit'
                })
            },
            handleDetail(){
                this.$router.push({
                    name: 'working-procedure-detail'
                })
            },
            handleClick(tab, event) {
            },


            // 表格合并
            retebnSpan({ row, column, rowIndex, columnIndex }) {
                  if (rowIndex % 2 === 0) {
                  if (columnIndex === 0) {
                   return [2,1];
                 } else if (columnIndex === 1){
                    return [2,1];
                }else if(columnIndex === 2){
                  return [2,1]
                }else if(columnIndex === 3){
                  return [2,1]
                }else if(columnIndex === 4){
                  return [2,1]
                }else if(columnIndex === 5){
                  return [2,1]
                }
            }
        }
        }


        }

</script>

<style scoped lang="scss">
.main_container{
    .table_box{
        .button_box{
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
        }
    }
}
</style>
