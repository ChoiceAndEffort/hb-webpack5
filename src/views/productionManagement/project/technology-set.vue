<!--配置工艺定额-->
<template>
    <div class="main gggj_style">
       <div class="searchBar" v-if="listData.length<1">
             <el-button type="primary" icon="el-icon-plus" @click="addProcess" size="small">配置工序</el-button>
        </div>
        <el-menu :default-active="activeVal" active-text-color="#1989FA" class="el-menu-demo" mode="horizontal" @select="changeActive">
            <template v-for="item in listData">
                <el-submenu v-if="item.children.length>0" :index="item.workingProcedureId+'-'+item.workingProcedureCode+'-'+item.name">
                    <template slot="title">{{ item.name }}</template>
                    <el-menu-item v-for="child in item.children" v-if="child.isSelect==1" :index="child.workingProcedureId+'-'+item.workingProcedureCode+'-'+item.name">{{ child.name }}</el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.workingProcedureId+'-'+item.workingProcedureCode+'-'+item.name">{{item.name}}</el-menu-item>
            </template>
        </el-menu>

        <div class="container">
            <div class="process-list">
                <div class="nav">
                    <p>工艺列表</p>
                    <div>
                        <el-button v-if="projectWorkingProced!=''" plain icon="el-icon-plus" @click="AddTechnique()">新增工艺</el-button>
                        <el-button v-if="projectWorkingProced!=''" plain icon="el-icon-plus" @click="newSupplier()">新增供应商</el-button>
                    </div>
                </div>

                    <TableBody :colConfig="colConfig" :data="data.tableData" @expand-change="expandChange" v-loading="loading">
                        <template slot="name" slot-scope="{scope}">
                            <span class="name">{{scope.row.name}}</span>
                        </template>
                        <template slot="inspect" slot-scope="{scope}">
                            <el-tag v-if="scope.row.isSelfInspection==1">自检</el-tag>
                            <el-tag v-if="scope.row.isMutualInspection==1">互检</el-tag>
                            <el-tag v-if="scope.row.isSpecialInspection==1">专检</el-tag>
                            <el-tag v-if="scope.row.isSecurityCheck==1">安全检查</el-tag>
                        </template>
                        <template slot="progressAward" slot-scope="{scope}">
                            <span >{{scope.row.progressAward}}</span>
                        </template>
                        <template slot="qualityAward" slot-scope="{scope}">
                            <span >{{scope.row.qualityAward}}</span>
                        </template>
                        <template slot="operation" slot-scope="{scope}">
                            <el-button type="text" @click="AddTechnique(true,scope.row)">编辑</el-button>
                            <el-button type="text" @click="allocateInspectors(scope.row)">配置检验人员</el-button>
                        </template>

                        <template slot="expand" slot-scope="{ scope }">
                            <el-table :data="data.tableData[scope.$index].segmentList" class="two-list">
                                <el-table-column prop="name" label="互检人员" align="center">
                                    <template slot-scope="scopes">
                                        <el-tag v-for="item in scopes.row.mutualInspectorConfigureList">{{item.staffName}}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="number" label="专检人员" align="center">
                                    <template slot-scope="scopes">
                                        <el-tag v-for="item in scopes.row.specialInspectorConfigureList">{{item.staffName}}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalWeight" label="外部检验人员" align="center">
                                    <template slot-scope="scopes">
                                        <el-tag v-for="item in scopes.row.externalInspectorConfigureList">{{item.staffName}}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="education" label="安全检查人员" align="center">
                                    <template slot-scope="scopes">
                                        <el-tag v-for="item in scopes.row.securityInspectorConfigureList">{{item.staffName}}</el-tag>
                                    </template>
                                </el-table-column>
<!--                                <el-table-column prop="education" label="操作" align="center">
                                    <template slot-scope="scopes">
                                        <div class="status-01" @click="allocateInspectors(scope.row)">
                                            <el-button type="text">配置检验人员</el-button>
                                        </div>
                                    </template>
                                </el-table-column>-->
                            </el-table>
                        </template>

                    </TableBody>
                      <Pagination :data="data" @changePage="changePage" />
            </div>
<!--            <div class="quota-list">
                <div class="nav">
                    <p>零件划线定额</p>
                </div>
                 <TableBody :colConfig="colConfig2" :data="tabledata2"></TableBody>
            </div>-->

        </div>
        <bottomFooter :isReturn="true"></bottomFooter>
        <!--新增工序-->
        <process-add ref="processadd" :couplingId = couplingId></process-add>
       <!--新增工艺-->
       <technique-add ref="techniqueadd" :projectWorkingProced="projectWorkingProced?projectWorkingProced.split('-')[0]:''" @getTechniqueData="getTechniqueData"></technique-add>
    </div>
</template>

<script>
import { TableBody,Pagination } from 'gggj_lib';
import processAdd from './components/processAdd.vue';
import techniqueAdd from './components/techniqueAdd.vue';
import bottomFooter from '../components/bottomFooter.vue';
import { getprojecworkingList,saveprojectprocess,getprojectprocessPage,getMultipleListByProjectProcessId,getWorkingProcedureList} from "@/api/productionManagement/project.js";

export default {
    components:{processAdd,TableBody,Pagination,techniqueAdd,bottomFooter},
    data() {
        return {
            searchobj: {
                keyWords: "",
            },
            headerData:[{
                code: "keyWords",
                title: "联段",
                type: "select",
                width:"180px",
                options: [{ label: "联段一", value: 1 },{ label: "联段二", value: 2 }]
                },
            ],
            activeVal:"",
            workingProcedureCheckedData: [], //选中的数据
            buttonText:'确定',
            listData:[],
            colConfig: [
                // {
                //     attrs: {  align: 'center', type: 'selection' },
                // },
                {
                    slot: "expand",
                    attrs: {
                        prop: "children",
                        align: "center",
                        type: "expand",
                    },
                },
                {
                    attrs: { label: '序号', type:'index'},
                },{
                    slot: 'name',
                    attrs: { label: '工艺', prop: 'name', align: "center",},
                },{
                    slot: 'inspect',
                    attrs: { label: '检查', prop: 'is_self_inspection', align: "center", },
                },{
                    slot: 'progressAward',
                    attrs: { label: '进度奖比例(%)', prop: 'progressAward', align: "center",},
                },{
                    slot: 'qualityAward',
                    attrs: { label: '质量奖比例(%)', prop: 'qualityAward', align: "center", },
                },{
                    slot: 'operation',
                    attrs: { label: '操作', prop: 'operation', align: "center", },
                }
            ],
            colConfig2: [
                {
                    attrs: { label: '定额名称', prop: 'name',align: 'center' },
                },{
                    attrs: { label: '单价(元)', prop: 'danjia',align: 'center' },
                },{
                    attrs: { label: '单位', prop: 'danwei',align: 'center' },
                }
            ],
             data: {
                total: 0,
                size: 10,
                page: 0,
                lastPage: 0,
                totalPages: 2,
                first: true,
                last: true,
                tabledata: [],
                tableDataId: []
            },
            loading: false,
            tabledata2:[],
            tableindex:0,
            engineeringProjectId:'',//项目id
            couplingId:'',//联段id,
            type:'',//工序类型
            projectWorkingProced: '', // 工序tab详情
            secondaryName: '', // 工序二级name
        };
    },
    created() {
        console.log(this.$route.query.type,'type')
         if (this.$route.query.engineeringProjectId||this.$route.query.couplingId) {
            this.engineeringProjectId = this.$route.query.engineeringProjectId;
            this.type = this.$route.query.type;
            this.$set(this,'couplingId',this.$route.query.couplingId)
             this.getprojecworking();
            //  this.getprocessPage();
        }
    },
    mounted() {

    },
    methods: {
        /**配置检验人员*/
        allocateInspectors(row) {
            this.$router.push({
                name: 'modify-inspector',
                query:{
                    id: row.projectProcessId,
                }
            })
        },
        getFilterList(){
        },
        //分页
        changePage(e) {
            this.data.page= e;
            this.getprocessPage(this.projectWorkingProced);
        },
        //新增工序
        addProcess(){
            this.$refs.processadd.initUser(this.engineeringProjectId,this.couplingId,this.listData.length,this.type);
        },
        //新增工艺
        AddTechnique(sign,row){
             this.$refs.techniqueadd.initUser(sign,row);
        },
        /**新增供应商*/
        newSupplier() {
            this.$router.push({
                name: 'configure-outsourcing',
                query:{
                    workingProced: this.projectWorkingProced, // 传递工序数据
                    engineeringProjectId: this.engineeringProjectId,
                    couplingId: this.couplingId,
                }
            })
        },
        changeActive(sendData){
            this.data.page = 0;
            this.getprocessPage(sendData)
            this.projectWorkingProced = sendData
            // this.secondaryName = sendData.indexOf('_')!=-1?sendData.split('_')[1]:''
        },
        //获取工艺
        getprocessPage(sendData){
            let _this = this;
            this.loading = true
            getprojectprocessPage({
                page: this.data.page,
                size: this.data.size,
                projectWorkingProcedureId: sendData.split('-')[0]
            }).then((res) => {
                setTimeout(function (){
                    _this.loading = false
                },500)
                if (res.code === 0) {
                    this.data.tableDataId = []
                    this.$set(this.data, 'tableData',res.data.data);
                    res.data.data.map((res,index) => {
                        this.data.tableDataId.push(res.projectProcessId)
                        this.data.tableData[index].segmentList = []
                    })
                    this.data.total = res.data.total;
                }
            }).finally(() => {
                this.loading = false
            });
        },
        //展开(第一个参数表示当前点击行的数据，第二个参数表示已展开的行的数据)
        expandChange(expandedRows, expanded) {
            let _this = this;
            this.loading = true
            const idIndex = this.data.tableDataId.indexOf(expandedRows.projectProcessId)
            getMultipleListByProjectProcessId({
                id: expandedRows.projectProcessId,
                // id: '211222A8F7208DP0'
            }).then((res) => {
                if (res.code === 0) {
                    this.data.tableData[idIndex].segmentList.splice(0, 1)
                    setTimeout(function (){
                        _this.loading = false
                    },1000)
                    /**展开的检验人员*/
                    this.data.tableData[idIndex].segmentList.push( res.data)
                }
            }).finally(() => {
                this.loading = false
            });
        },
        //提交
        handleEditSave(){
            saveprojectprocess({
                ...this.data.tabledata,
           }).then((res) => {
              if(res===0){
                  this.$message({
                    message: "保存成功",
                    type: "success",
                });
              }
                this.getprocessPage();
            }).finally(() => {
            //   this.isLoading = false;
            });
        },
        // 取消
        resetForm(){
            this.$router.push({
				name: 'project-info',
                query:{
                }

			})
        },
        //新增工艺后获取输入的内容
        getTechniqueData(data){
        },
        //获取工序
        getprojecworking(){
            getWorkingProcedureList({couplingId: this.couplingId,type:this.type}).then((res) => {
                if (res.code === 0) {
                    let dataList = []
                    res.data.forEach(data=>{
                        if(data.isSelect==1 || data.isSelect==2){
                            dataList.push(data)
                        }
                    })
                    this.listData = dataList;
                    if(dataList.length > 0){
                        let processData = dataList[0].children.length>0 ? dataList[0].children : dataList
                        this.projectWorkingProced = processData[0].workingProcedureId+'-'+processData[0].workingProcedureCode+'-'+processData[0].name
                        this.activeVal = this.projectWorkingProced
                        this.getprocessPage(this.projectWorkingProced);
                    }
                }
            });
        }

    },

};
</script>

<style scoped lang="scss">
    .main {
        height: 100%;
        padding-top: 7px;
        background: #ffffff;
       .searchBar {
           display: flex;
           flex-direction: row;
           margin: 9px 0 7px 16px;
        .add {
               height: 36px;
               border-radius: 0;
        }
       }
       .container {
           display: flex;
           flex-direction: row;
           flex:1;
           .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                p {
                    font-size: 16px;
                    font-weight: 700;
                }
                .el-button {
                     padding: 8px 20px;
                    // height: 32px;
                     // line-height: 32px;
                }

            }
           .process-list {
                width: 100%;
               flex: 1;
               background-color: #FFF;
               height: 100%;
               padding: 16px 16px 0 16px;
                .name {
                    color: #1989FA;
                }
           }
           .quota-list {
               width: 500px;
               margin: 16px 0 16px 16px;
           }
       }
        .current {
            display: block;
        }
    }
</style>
