<!--数据管理-->
<template>
    <div class="sub-page">
        <div class="container">
            <el-row type="flex" align="middle" justify="center" class="header">
                <el-col :span="12">
                    <span>{{title}}</span>
                </el-col>
                <el-col :span="12">
                    <el-input size="mini" clearable v-model="nestingPageValue" placeholder="请输入图纸页码">
                        <template slot="append">
                            <el-button icon="el-icon-search" @click="handleSearch"></el-button>
                        </template>
                    </el-input>
                    <el-button type="primary" size="mini" @click="() => this.$router.back()">返回</el-button>
                </el-col>
            </el-row>
            <TableBody :colConfig="colConfig" :data="data.data" boder  concatKey="nestingPage" >
               <template slot="btn" slot-scope="{scope}">
           				<span class="edit" @click="editData(scope.row)">查看</span>
                </template>
            </TableBody>
            <Pagination :data="data" @changePage="changePage"/>
        </div>
    </div>
</template>

<script>
import { TableFilter,TableBody,Pagination,ImportExcel} from 'gggj_lib';
import { uploadSingleFile,deleteFile } from '@/api/productionManagement/cus.js';
import {checkNestingImport,getNestingPage} from "@/api/productionManagement/project.js"
export default {
    components:{TableFilter,TableBody,Pagination,ImportExcel},
    data() {
        return {
            title: '',
            drawer: false,
            searchobj: {
                keyWords: "",
            },
            headerKeys: {
                nestingName: '套料图名称*',
                nestingPage: '套料图页码*',
                rawMaterialTexture: '原材料材质*',
                rawMaterialHeight: '原材料高(厚)度*',
                rawMaterialWidth: '原材料宽(毫米)*',
                rawMaterialLength: '原材料长(毫米)*',
                rawMaterialWeight: '原材料单重*',
                rawMaterialSize: '原材料数量*',
                lineation: '划线工艺*',
                lineationLength: '划线线长(单块钢板划线/米)*',
                cuttingProcess: '切割工艺*',
                cuttingLength: '切割线长*',
                partNumber: '零件编号*',
                partCode: '零件编码*',
                partSize: '零件数量*',
                partWeight: '零件重量(单重/KG)*',
                partProcessFlow: '零件工艺流向*',
                grooveName: '坡口名称*',
                grooveType: '坡口类型*',
                grooveLength: '坡口长度(单个零件坡口长度/米)*',
                nestingAreaType1: '面积类型1*',
                area1: '面积(单个零件面/平方米)*',
                nestingAreaType2: '面积类型2*',
                area2: '面积(单个零件面/平方米)*',
                nestingAreaType3: '面积类型3*',
                area3: '面积(单个零件面/平方米)*',
                nestingAreaType4: '面积类型4*',
                area4: '面积(单个零件面/平方米)*',
            },

            headerData:[{
                code: "keyWords",
                title: "项目名称",
                type: "select",
                width:"220px",
                options: [{ label: "项目一", value: 1 },{ label: "项目二", value: 2 }]
                },{
                code: "keyWords2",
                title: "联段名称",
                type: "select",
                width:"220px",
                options: [{ label: "联段一", value: 1 },{ label: "联段二", value: 2 }]
                },
            ],
            buttonText:"确定",
            listData:[{
                workingProcedureCode:'1',
                name:"套料数据"
            },{
                workingProcedureCode:'2',
                name:"物料数据"
            },{
                workingProcedureCode:'3',
                name:"BOM数据"
            }],
            errList:[],
            radio:"1",
            input2:"",
            colConfig: [
                {
                    attrs: { label: '套料图名称', prop: 'nestingName', align: 'center',width:"200px" },
                },{
                    attrs: { label: '套料图页码', prop: 'nestingPage', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '原材料材质', prop: 'rawMaterialTexture', align: 'center',width:"200px" },
                },{
                    attrs: { label: '原材料高(毫米)', prop: 'rawMaterialHeight', align: 'center',width:"200px" },
                },{
                    attrs:  { label: '原材料宽(毫米)', prop: 'rawMaterialWidth', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '原材料长(毫米)', prop: 'rawMaterialLength', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '原材料重量(单重/千克)', prop: 'rawMaterialWeight', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '原材料数量(块)', prop: 'rawMaterialSize', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '划线工艺', prop: 'lineation', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '划线线长(单块钢板划线/米)', prop: 'lineationLength', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '切割工艺', prop: 'cuttingProcess', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '切割线长(米)', prop: 'cuttingLength', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '零件编号', prop: 'partNumber', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '零件编码', prop: 'partCode', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '零件数量(件)', prop: 'partSize', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '零件重量(单重/千克)', prop: 'partWeight', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '零件工艺流向', prop: 'partProcessFlow', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '坡口名称', prop: 'grooveName', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '坡口类型1', prop: 'grooveType', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '坡口长度(单个零件坡口长度/米)', prop: 'grooveLength', align: 'center' ,width:"220px" },
                },{
                    attrs: { label: '面积类型1', prop: 'nestingAreaType1', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '面积(单个零件面/平方米)', prop: 'area1', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '面积类型2', prop: 'nestingAreaType2', align: 'center',width:"200px"  },
                },{
                    attrs: { label: '面积(单个零件面/平方米)', prop: 'area2', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '面积类型3', prop: 'nestingAreaType3', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '面积(单个零件面/平方米)', prop: 'area3', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '面积类型4', prop: 'nestingAreaType4', align: 'center' ,width:"200px" },
                },{
                    attrs: { label: '面积(单个零件面/平方米)', prop: 'area4', align: 'center' ,width:"200px" },
                },{
                     slot: 'btn',
                    attrs: { label: '操作', align: 'center',  fixed: "right" ,width:"80px" },
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
                data: [],
            },
            fileArr:[],
            nestingPageValue: '', // 套料图页码搜索框值
        };
    },
    created() {
        if(this.$route.query.engineeringProjectId||this.$route.query.couplingId||this.$route.query.nestingPoolId){
             this.getNestingList();
             this.title = this.$route.query.title
        }

    },
    mounted() {

    },
    methods: {
        getFilterList(){
           this.getNestingList();
        },
        //初始化列表
         getNestingList() {
            getNestingPage({
                engineeringProjectId: this.$route.query.engineeringProjectId,
				couplingId: this.$route.query.couplingId,
                nestingPoolId:this.$route.query.nestingPoolId,
                page: this.data.page,
                size: this.data.size,
                nestingPage: this.nestingPageValue?this.nestingPageValue:''
            }).then((res) => {
                if (res.code === 0) {
                    this.data.data = res.data.data;
                    this.data.total = res.data.total;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //切换
        handleTabClick(index){

        },
        //翻页
        changePage(e){
            this.data.page = e;
            this.getNestingList();
        },
        //下载套料模板
        downloadM(){

        },
        //导入
        upload(){
           this.drawer=true;
        },
        //导出
        uploadOut(){
            alert("导出");
        },
        //修改
        editData(row){
            this.$router.push({
					name: 'edit-data',
                    query:{
                        ...row,
                        id:row.nestingId,
                        engineeringProjectId: row.engineeringProjectId,
				        couplingId: row.couplingId,
                    }

			})
        },
        //关闭
        colse(){
            this.drawer=false;
        },
        // 上传文件
			uploadImg(fileObj){
				let formData = new FormData();
				formData.set("file", fileObj.file);
				// this.isLoading.upload = true;
				uploadSingleFile(formData).then((res)=>{
					let url = res.data;
					let urlStrArr = url.split('.')
					let item = {
						fileName: fileObj.file.name,
						attachmentUrl: res.data,
						tag: this.tag,
						fileSuffix: urlStrArr[urlStrArr.length-1]
					};
                    this.fileArr.push(item);
				}).finally(()=>{

				})
			},
            handleImportExcel(convertedData){
                checkNestingImport({
					engineeringProjectId: this.$route.query.engineeringProjectId,
					couplingId: this.$route.query.couplingId,
					nestingListBoList: convertedData.body
				}).then((res)=>{
                    if(res.code===0){
                        this.$router.push({
							name: 'check-data',
							query: {
								engineeringProjectId: this.$route.query.engineeringProjectId,
					            couplingId: this.$route.query.couplingId,
								nestingListBoList: convertedData.body
							}
						})
                    }
				}).catch((err)=>{
                    if(err.code===1003){
                        this.errList=err.data;
                        this.$router.push({
							name: 'check-data',
							query: {
								engineeringProjectId: this.$route.query.engineeringProjectId,
					            couplingId: this.$route.query.couplingId,
								nestingListBoList: this.errList,
							}
						})
                    }

				})
            },
        //搜索事件
        handleSearch() {
            this.getNestingList();
        }
    }
};
</script>

<style scoped lang="scss">
    .sub-page {
        .searchBar {
           display: flex;
           flex-direction: row;
           justify-content:space-between;
           .bntList {
               margin-top: 11px;
           }
       }
       .container {
           .header {
               .el-col:nth-child(1) {
                   span {
                       font-weight: 600;
                   }
               }
               .el-col:nth-child(2) {
                   display: flex;
                   justify-content: flex-end;
                   .el-input {
                       width: 240px;
                       margin-right: 10px;
                   }
               }
           }
           .navBar {
              display: flex;
              flex-direction: row;
              justify-content:space-between;
              .el-input {
                width: 240px;
            }
           }
           ::v-deep .el-table {
               margin-top: 30px;
               .edit {
                    color: #1989FA;
                    cursor: pointer;
                }
           }


       }
    }
    ::v-deep .el-drawer__body {
        padding: 16px;
        position: relative;
        .add{
            height: 40px;
            margin-top: 30px;
            line-height: 40px;
            border: 1px dotted #E4E7ED;
            text-align: center;
            color: #606266;
        }
        .footer {
            position: absolute;
            bottom: 16px;
            right: 16px;
        }
    }
    ::v-deep .el-upload {
            width: 100%;
    }
     .fileArr {
            padding-top: 16px;
            li {
                padding: 16px;
            }
    }
    .vue-xlsx-container {
        margin-right: 20px;
    }

</style>
