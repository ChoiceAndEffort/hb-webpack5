<!--工序作业计划-->
<template>
    <div class="main">
        <div class="searchBar">
             <TableFilter :searchobj.sync="searchobj" :config="headerData" @search="getFilterList" :buttonText="buttonText"/>
        </div>
        <div>
            <el-radio-group v-model="radio" size="medium" @change="handleTabClick">
                <el-radio-button v-for="item in listData" :key="item.workingProcedureCode" :label="item.workingProcedureCode" >{{item.name}}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="nav">
            <p>武汉南湖路-联段1</p>
            <div>
                <el-button type="primary" @click="addPlan"><i class="el-icon-plus"></i>新增计划</el-button>
                <el-button type="primary" @click="editPlan"><i class="el-icon-plus"></i>修改计划</el-button>
            </div>
        </div>
        <TableBody :colConfig="colConfig" :data="data.data" boder :concatIndexArr="[0,1,2,3,4,5,7]" concatKey="name"></TableBody>
    </div>
</template>

<script>
import { TableFilter,TableBody,Pagination} from 'gggj_lib';
export default {
    components:{TableFilter,TableBody,Pagination},
    data() {
        return {
            headerData: [
                {
                code: "keyWords",
                title: "项目名称",
                type: "select",
                width:"220px",
                options: [{ label: "项目一", value: 1 },{ label: "项目二", value: 2 }]
                },
                {
                code: "projectName",
                title: "部门",
                type: "select",
                width:"220px",
                options: [{ label: "部门一", value: 1 },{ label: "部门二", value: 2 }]
                },
                {
                code: "shijian",
                title: "时间",
                type: "mergeDate",
                width: "180px",
                label: "时间：",
                },
            ],
            searchobj: {
                keyWords: "",
                projectName:"",
                shijian:"",
            },
            buttonText:'查询',
            listData:[{
                    workingProcedureCode:'1',
                    name:"下料"
                },{
                    workingProcedureCode:'2',
                    name:"机加"
                },{
                    workingProcedureCode:'3',
                    name:"单元件"
                },{
                    workingProcedureCode:'4',
                    name:"总装"
                },{
                    workingProcedureCode:'5',
                    name:"涂装"
                },{
                    workingProcedureCode:'6',
                    name:"安装"
                }],
            radio:'5',
            colConfig: [
                {
                    attrs: { label: '序号', type:'index', align: 'center' },
                },{
                    attrs: { label: '工序', prop: 'page', align: 'center' },
                },{
                    attrs: { label: '编号', prop: 'caizhi', align: 'center'},
                },{
                    attrs: { label: '数量', prop: 'gao', align: 'center'},
                },{
                    attrs:  { label: '重量(KG)', prop: 'kuang', align: 'center' },
                },{
                    attrs: { label: '节点计划时间', prop: 'chang', align: 'center' },
                },{
                    attrs: { label: '工艺', prop: 'shuliang', align: 'left'  },
                },{
                    attrs: { label: '责任单位', prop: 'gongyi', align: 'left' },
                },{
                    attrs: { label: '计划完成时间', prop: 'xianchang', align: 'left'},
                },{
                    attrs: { label: '工艺完成时间', prop: 'qiege', align: 'left'  },
                }
            ],
            data: {
                total: 0,
                pageSize: 1,
                currentPage: 0,
                lastPage: 0,
                totalPages: 0,
                first: true,
                last: true,
                data: [{
                    page: '涂装',
                    caizhi: 'L1-1AM',
                    gao: '8',
                    kuang: '4',
                    chang: '2021.10.31',
                    shuliang: '进砂房',
                    gongyi: '转运车间',
                    xianchang: '2021.10.31',
                    qiege: '2021.10.31'
                    },{
                        page: '涂装',
                        caizhi: 'L1-1AM',
                        gao: '8',
                        kuang: '4',
                        chang: '2021.10.31',
                        shuliang: '进砂房',
                        gongyi: '转运车间',
                        xianchang: '2021.10.31',
                        qiege: '2021.10.31'
                }]
            }
            };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //搜索
        getFilterList(){

        },
        handleTabClick(){

        },
        //新增计划
        addPlan(){
            this.$router.push({
					name: 'add-coatingPlan',
                    query:{
                        //  designQaId:row.designQaId,
                    }

			})
        },
        //修改计划
        editPlan(){
            this.$router.push({
					name: 'edit-coatingPlan',
                    query:{
                        //  designQaId:row.designQaId,
                    }

			})
        }
    }
};
</script>

<style scoped lang="scss">
.main {
    height: 100%;
    background-color: #ffffff;
    padding: 16px;
    ::v-deep .el-radio-group {
        // margin-bottom: 20px;
    }
    .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:21px 16px;
            p {
                font-size: 16px;
                font-weight: 700;
            }
            .el-button {
                padding: 8px 20px;
            }
    }
     .el-button {
         border-radius: 0;
     }
}
</style>
