<!--文档管理-->
<template>
    <div class="main">
        <div class="left">
             <div class="selectBox">
                 <el-input  v-model="input3" class="input-with-select" @change="hangleSelect">
                       <i slot="suffix" class="el-input__icon el-icon-search"></i>
                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                    <el-option label="项目" value="1"></el-option>
                    <el-option label="文件" value="2"></el-option>
                    </el-select>
                </el-input>
             </div>
             <el-tree :data="data" :props="defaultProps" @node-click="handleTreeClick" default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>
             <div class="footer">
                 <el-button type="text">新增部门</el-button>
                 <el-button type="text" class="edit">编辑部门</el-button>
             </div>
        </div>
        <div class="right">
            <div class="m-sselect">
                <TableFilter :searchobj.sync="searchobj" :config="headerData" @search="getFilterList" :buttonText="buttonText" :showclear="true"/>
            </div>
            <div class="select-List">
                <div class="nav">
                    <p>招标文件</p>
                    <div class="navallBnt">
                        <el-button type="primary" @click="add"><i class="el-icon-plus"></i>新增文件</el-button>
                        <el-button type="primary" @click="out"><i class="el-icon-upload2"></i>导出</el-button>
                    </div>
                </div>

                 <TableBody :colConfig="colConfig" :data="data2.data"  @selection-change="handleSelectionChange">
                    <template slot="btns" slot-scope="{scope}">
                        <el-button size="mini" type="text" @click="handleDele(scope.row)" class="dele">删除</el-button>
                    </template>
                </TableBody>
                <Pagination :data="data2" @changePage="changePage"/>
            </div>
        </div>
    </div>
</template>

<script>
import { TableFilter,TableBody,Pagination} from 'gggj_lib';
export default {
    components:{TableFilter,TableBody,Pagination},
    data() {
        return {

             colConfig: [
                {
                    attrs: {   align: 'center', type: 'selection' },
                },
                {
                    attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                },
                {
                    attrs: { label: '文件名称', prop: 'name', align: 'center' },
                },{
                    attrs: { label: '文件编号', prop: 'age', align: 'center' },
                },{
                    attrs:  { label: '项目名称', prop: 'hobby', align: 'center' },
                },{
                    attrs: { label: '项目编号', prop: 'education', align: 'center' },
                },{
                    attrs: { label: '归档人', prop: 'nativePlace', align: 'center' },
                },{
                    attrs: { label: '归档时间', prop: 'nativePlace', align: 'center' },
                },{
                    slot: 'btns',
                    attrs: { label: '操作', fixed: 'right', width:80, align: 'center' },
                }],
            headerData: [
                {
                code: "name",
                title: "文件名称",
                width:"180px",
                label:"文件名称："
                },
                {
                code: "gonghao",
                title: "项目名称",
                width:"180px",
                label:"项目名称："
                },
                {
                code: "auditDateList",
                titleStart: "归档时间",
                DateType: "daterange",
                type: "mergeDate",
                width: "230px",
                titleEnd: "归档时间",
                label:"归档时间："
                },
                {
                code: "bumen",
                title: "部门",
                width:"180px",
                label:"文件编号："
                },
                {
                code: "gangwei",
                title: "归档部门",
                width:"180px",
                label:"归档部门："
                },
                {
                code: "gongzhong",
                title: "归档人",
                width:"180px",
                label:"归档人："
                },

            ],
            searchobj: {
                name: "",
                gonghao:"",
                auditDateList:[],
                bumen:'',
                gangwei:'',
                gongzhong:''
            },
            buttonText:'查询',
            value:'',
            input3:'',
            select:'1',
            data: [{
                label: '徐州南三环项目',
                children: [{
                    label: '招标文件',
                    children:[{
                        label:'招标文件评审'
                        },{
                        label:'招标文件答疑'
                        }]
                },{
                    label: '徐州南三环剩余标段',
                }]
                }],
                defaultProps: {
                children: 'children',
                label: 'label'
                },
                data2: {
                    total: 0,
                    pageSize: 1,
                    currentPage: 0,
                    lastPage: 0,
                    totalPages: 2,
                    first: true,
                    last: true,
                    data: [{
                        name: 'NW联闸道腹板单元件制造图',
                        age: 'SGTZ-245',
                        hobby: '徐州东大桥剩余标段',
                        education: 'HB-BS20200413SZ',
                        nativePlace: '12345678901',
                    },{
                        name: 'NW联闸道腹板单元件制造图',
                        age: 'SGTZ-245',
                        hobby: '徐州东大桥剩余标段',
                        education: 'HB-BS20200413SZ',
                        nativePlace: '12345678901',
                    }]
                },
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        //搜索
        hangleSelect(){
        },
        //树 - 过滤
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			//树- 点击item
			handleTreeClick(data){
				this.$emit('handleTreeItem',data)
			},
            //搜索
            getFilterList(){
            },
            //新增
            add(){
                this.$router.push({
					name: 'document-add',
                    query:{
                        //   designQaId:row.designQaId,
                    }
                })
            },
            //导出
            out(){
            },
            //多选
             handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //分页
             changePage(page){
            },
            //删除
            handleDele(row){
            }
    }
};
</script>

<style scoped lang="scss">
    .main {
        display: flex;
        flex-direction: row;
        height: 100%;
        .left {
            flex: 0 0 322px;
            margin-right: 8px;
            padding: 16px;
            box-sizing: border-box;
            background-color: #fff;
            position:relative;
            .el-select {
                width: 100%;
            }
            .selectBox {
                margin: 16px 0;
                .el-select {
                    width: 85px;
                }
            }
        ::v-deep .el-tree-node__content {
            .el-tree-node__label {
                padding: 8px 0;
            }
        }
        .footer {
            position: absolute;
            left: 16px;
            bottom: 16px;
            .edit {
                color: #909399;
            }
        }
        }
        .right {
            flex: 1;
            // padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .m-sselect {
                height: 112px;
                background-color: #fff;
                padding: 0 16px;
            }
            .select-List {
                flex: 1;
                margin-top: 8px;
                background-color: #fff;
                padding: 16px;
                .nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // padding:21px 16px;
                    margin-bottom: 16px;
                    p {
                        font-size: 16px;
                        font-weight: 700;
                    }
                    .navallBnt {
                        .el-button{
                            padding: 8px 20px;
                            border-radius: 0;
                        }

                    }
                }
            }
            .dele {
                color: red;
            }
        }
    }
</style>
