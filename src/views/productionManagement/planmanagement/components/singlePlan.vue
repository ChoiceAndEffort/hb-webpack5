<!--单项目准备计划-->
<template>
    <div class="main">
        <div class="searchBox">
            <TableFilter :searchobj.sync="searchobj" :config="headerData" @search="getFilterList" :buttonText="buttonText"/>
            <el-button type="primary" @click="addPlan"><i class="el-icon-plus"></i>新增计划</el-button>
        </div>
        <TableBody :colConfig="colConfig" :data="data.data"  concatKey="name">
            <template slot="state" slot-scope="{scope}">
           		<div class="status status-01" v-if="scope.row.state == 0">
					<span>未审批</span>
				</div>
                <div class="status status-02" v-if="scope.row.state == 1">
					<span>待审批</span>
				</div>
                <div class="status status-03" v-if="scope.row.state == 2">
					<span>已审批</span>
				</div>
            </template>
            <template slot="btn" slot-scope="{scope}">
                <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
               <el-button size="mini" type="text" :disabled="scope.row.status==0?false:true">编辑</el-button>
            </template>
        </TableBody>
    </div>
</template>

<script>
import { TableFilter,TableBody,Pagination} from 'gggj_lib';
export default {
    components:{TableFilter,TableBody,Pagination},
    data() {
        return {
            searchobj: {
                keyWords: "",
                projectName:"",
            },
            buttonText:'确定',
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
            ],
            colConfig: [
                {
                    attrs: { label: '序号', type:'index', align: 'center' },
                },{
                    attrs: { label: '项目名称', prop: 'name', align: 'center' },
                },{
                    attrs: { label: '部门', prop: 'bumen', align: 'center'},
                },{
                    slot: 'state',
                    attrs: { label: '计划审批状态', prop: 'state', align: 'center' },
                },{
                     slot: 'btn',
                    attrs: { label: '操作',  align: 'left' ,width:"200px", align: 'center' },
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
                        name:"武汉长江大桥套料图",
                        bumen: '物资供应部',
                        state: '1'
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
        //查看
        handleView(){
           this.$router.push({
                name: "plan-view",
                query: {
                //   designQaId:row.designQaId,
                },
            });
        },
        //新增计划
        addPlan(){
            this.$router.push({
                name: "plan-add",
                query: {
                //   designQaId:row.designQaId,
                },
            });
        }
    }
};
</script>

<style scoped lang="scss">
    .main {
        .cell span {
            padding: 0 8px;
        }
        .status span {
            width: 72px;
            height: 32px;
            line-height: 32px;
        }
        .status-01 {
            span {
                display: inline-block;
                background: #fff1f0;
                border: 1px solid #fbc4c4;
                color: #fa5555;
            }
        }
        .status-02 {
            span {
                display: inline-block;
                color: #FA8E55;
                background: #fdf5e6;
                border: 1px solid #f5dab1;
            }
        }
        .status-03 {
            span {
                display: inline-block;
                border: 1px solid #A3D0FD;
                color: #409EFF;
                background-color: #ECF5FF;
            }
        }
        .searchBox {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .el-button {
                height: 36px;
                line-height: 15px;
                border-radius: 0;
                margin-top: 10px;
            }
        }
    }
</style>
