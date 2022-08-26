<!--选择执行人-->
<template>
    <div>
        <el-dialog title="选择执行人" :visible.sync="executorShow" :close-on-click-modal="false" width="80%">
             <div class="all">
                 <div class="left">
                 <el-tree ref="SlotMenuList" class="expand-tree"
                node-key="id"
                highlight-current
                :data="data"
                :props="defaultProps"
                :default-expanded-keys="[1, 2]"
                :default-checked-keys="[1]"
                @node-click="handleTreeClick"
                :expand-on-click-node="false">
                </el-tree>
             </div>
             <div class="right">
                 <TableBody :colConfig="colConfig" :data="data2.data"  @selection-change="handleSelectionChange">
                    <template slot="btns" slot-scope="{scope}">
                        <el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
                    </template>
                    <template slot="state" slot-scope="{scope}">
                        <el-switch v-model="scope.row.state" ></el-switch>
                    </template>
                </TableBody>
                <Pagination :data="data2" @changePage="changePage"/>
             </div>
             </div>
             <div  class="footer">
                    <el-button @click="colse">取消</el-button>
                    <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                </div>
        </el-dialog>
    </div>
</template>

<script>
import {TableBody,Pagination} from 'gggj_lib';
export default {
    components:{TableBody,Pagination},
    data() {
        return {
            executorShow:false,
            data: [{
                label: '海波重科',
                children: [{
                    label: '汉阳子公司',
                    children:[{
                        label:'下料车间'
                        },{
                        label:'单元件配件车间'
                        }]
                },{
                    label: '江夏子公司',
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
                        name: '张三',
                        age: 11,
                        hobby: '唱歌',
                        education: '本科',
                        nativePlace: '湖北',
                        remark: '备注11',
                    },{
                        name: '李四',
                        age: 12,
                        hobby: '唱歌',
                        education: '本科',
                        nativePlace: '湖北',
                        remark: '备注11',
                    }]
            },
            colConfig: [
                {
                    attrs: {   align: 'center', type: 'selection' },
                },
                {
                    attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                },
                {
                    attrs: { label: '姓名', prop: 'name', align: 'center' },
                },{
                    attrs: { label: '工号', prop: 'age', align: 'center' },
                },{
                    attrs:  { label: '部门', prop: 'hobby', align: 'center' },
                },{
                    attrs: { label: '岗位', prop: 'education', align: 'center' },
                },{
                    attrs: { label: '手机号', prop: 'nativePlace', align: 'center' },
                },{
                    slot: 'btns',
                    attrs: { label: '操作', fixed: 'right', width:80, align: 'center' },
                },{
                    slot: 'state',
                    attrs: { label: '状态', fixed: 'right', width: 80, align: 'center' },
                }],
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
         initUser(){
            this.executorShow=true;
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
         //多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
         //分页
        changePage(page){
        },
        colse(){
           this.executorShow=false;
        }
    }
};
</script>

<style scoped lang="scss">
.all {
    display: flex;
    flex-direction: row;
    .left {
        width: 350px;
        margin-right: 16px;
    }
    .right {
        flex: 1;
    }
}
.footer {
    text-align: right;
    margin-top: 20px;
}
</style>
