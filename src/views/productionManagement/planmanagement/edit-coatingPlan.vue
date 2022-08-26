<!--修改计划-->
<template>
    <div class="mian">
        <div class="top">
            <div class="nav">
            <p>武汉南湖路-联段1</p>
        </div>
        <div class="tabData">
            <TableBody :colConfig="colConfig" :data="data.data" boder concatKey="name">
                <template slot="xianchang" slot-scope="{scope}">
                    <el-date-picker v-model="scope.row.xianchang" type="date" placeholder="选择日期"></el-date-picker>
                </template>
                <template slot="qiege" slot-scope="{scope}">
                    <el-input v-model="scope.row.qiege" placeholder="请输入内容"></el-input>
                </template>
            </TableBody>
            <Pagination :data="data" @changePage="changePage"/>
        </div>
        </div>
        <div class="botton">
             <p>修改记录</p>
             <el-divider></el-divider>
             <TableBody :colConfig="colConfig2" :data="data.data2"  default-expand-all  row-key="name" >
            </TableBody>
        </div>
        <bottom-footer @handleEditSave="handleEditSave" @resetForm="resetForm"></bottom-footer>
    </div>
</template>

<script>
import { TableFilter,TableBody,Pagination} from 'gggj_lib';
import bottomFooter from '../components/bottomFooter.vue'
export default {
    components:{TableFilter,TableBody,Pagination,bottomFooter},
    data() {
        return {
            colConfig: [
                {
                    attrs: {  type:'selection', align: 'center' },
                },
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
                     slot: 'xianchang',
                    attrs: { label: '计划完成时间', prop: 'xianchang', align: 'left',    width:'250px'},
                },{
                    slot: 'qiege',
                    attrs: { label: '备注', prop: 'qiege', align: 'left'  },
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
                    qiege: '-'
                    },{
                        page: '涂装',
                        caizhi: 'L1-1AM',
                        gao: '8',
                        kuang: '4',
                        chang: '2021.10.31',
                        shuliang: '进砂房',
                        gongyi: '转运车间',
                        xianchang: '2021.10.31',
                        qiege: '-'
                }]
            },
            colConfig2: [
                {
                    attrs: { label: '操作类型',prop: 'name',  align: 'center', },
                },{
                    attrs: { label: '操作人', prop: 'name', align: 'center' },
                },{
                    attrs: { label: '执行结果', prop: 'age', align: 'center' },
                },{
                    attrs:  { label: '操作时间', prop: 'hobby', align: 'center' },
                }],
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        changePage(){
        },
         back(){
            this.$router.push({
				name: 'process-plan',
            })
        },
        handleEditSave(){
        }
    }
};
</script>

<style scoped lang="scss">
.mian {
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    .top {
        background-color: #fff;
        flex: 2;
        .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:21px 16px;
            p {
                font-size: 16px;
                font-weight: 700;
            }

    }
    }
    .tabData {
        padding: 0 16px;
    }
    .botton {
        // margin-top: 16px;
        padding: 16px;
        background-color: #fff;
        flex: 1;
        ::v-deep .el-divider--horizontal {
            margin: 0;
        }
        p{
            font-size: 14px;
            line-height: 52px;
            margin: 0 16px;
            font-weight: 700;
        }
    }
}
</style>
