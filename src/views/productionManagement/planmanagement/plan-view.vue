<!--准备计划查看-->
<template>
    <div class="main">
        <div class="basicData">
            <p class="title">流程进度</p>
                <el-divider></el-divider>
                 <el-steps :active="1">
                <el-step title="创建计划">
                     <template slot="description" >
                         <p><span>主管</span>丰青凝</p>
                         <p>2021.08.21 12:32</p>
                     </template>
                </el-step>
                <el-step title="部长审批"></el-step>
                <el-step title="分管副总审批"></el-step>
                <el-step title="完成"></el-step>
                </el-steps>
        </div>
        <div class="projectImg">
            <p class="title">计划内容</p>
            <el-divider></el-divider>
            <el-descriptions >
                <el-descriptions-item label="项目名称：">徐州南三环快速路</el-descriptions-item>
                <el-descriptions-item label="部门：">物资供应部</el-descriptions-item>
                <el-descriptions-item label="计划内容：">成品水密门采购回厂</el-descriptions-item>
                <el-descriptions-item label="创建人：">丰青凝</el-descriptions-item>
                <el-descriptions-item label="创建时间：">2021.08.21</el-descriptions-item>
                <el-descriptions-item label="计划完成时间：">2021.08.25</el-descriptions-item>
                <el-descriptions-item label="重要程度：">苏州市</el-descriptions-item>
                <el-descriptions-item label="备注：">-</el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="periodInfo">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="审批记录" name="first">
                    <TableBody :colConfig="colConfig" :data="data.data">
                        <template slot="agee" slot-scope="{scope}">
                                    <div class="status-01" v-if="scope.row.age == 0" @click="setTechnology(scope.row)">
                                        <span class="dot red"></span>失败
                                    </div>
                                    <div class="status status-02" v-if="scope.row.age == 1" @click="setTechnology(scope.row)">
                                        <span class="dot greet"></span>成功
                                    </div>
                                </template>
                    </TableBody>
                </el-tab-pane>
                <el-tab-pane label="修改记录" name="second">
                    <TableBody :colConfig="colConfig" :data="data.data">
                        <template slot="agee" slot-scope="{scope}">
                                    <div class="status-01" v-if="scope.row.age == 0" @click="setTechnology(scope.row)">
                                        <span class="dot red"></span>失败
                                    </div>
                                    <div class="status status-02" v-if="scope.row.age == 1" @click="setTechnology(scope.row)">
                                        <span class="dot greet"></span>成功
                                    </div>
                                </template>
                    </TableBody>
                </el-tab-pane>
            </el-tabs>

        </div>
        <!-- <div class="footer">
              <div class="bnt">
                  <el-button @click="resetForm">取消</el-button>
                  <el-button type="primary" @click="handleEditSave()">保存</el-button>
              </div>
        </div> -->
    </div>
</template>

<script>
import { TableBody,Pagination} from 'gggj_lib';
export default {
    components:{TableBody,Pagination},
    data() {
        return {
             activeName: 'second',
             colConfig: [
                {
                    attrs: { label: '操作类型', prop: 'time', align: 'left' },
                },{
                    attrs: { label: '操作人', prop: 'name', align: 'left' },
                },{
                    slot: 'agee',
                    attrs: { label: '执行结果', prop: 'age', align: 'left' },
                },{
                    attrs:  { label: '操作时间', prop: 'hobby', align: 'left' },
                },{
                    attrs: { label: '备注', prop: 'education', align: 'left' },
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
                        time:"创建计划",
                        name: '丰青凝',
                        age: '0',
                        hobby: '操作时间',
                        education: '不通过原因',
                    }]
                }
        };
    },
    created() {

    },
    mounted() {

    },
    computed:{

	},
    methods: {
        handleClick(tab, event) {
        }
    }
};
</script>

<style scoped lang="scss">
    .main {
        max-width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction:column;
        align-items:flex-start;
        ::v-deep .el-divider--horizontal {
            margin: 0;
        }
        ::v-deep .el-steps {
            padding: 32px;
            span {
                margin-right: 10px;
            }
        }
        ::v-deep .el-step__title.is-finish {
            color: #606266;
        }
        ::v-deep .el-descriptions__body {
            padding: 32px 0;
        }


        .basicData,.projectImg,.periodInfo {
            background: #fff;
            min-width: 100%;
            .title{
                font-size: 14px;
                color: #606266;
                line-height: 52px;
                margin: 0 16px;
                font-weight: 700;

            }
        }
        .periodInfo {
            flex: 1;
        }
        .projectImg,.periodInfo {
            margin-top: 8px;
        }
        .el-tabs {
            padding: 16px;
        }
        .dot{
            display: inline-block;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            margin-right: 5px;
        }
        .red {
            color: red;
        }
        .greet {
            color: #52C41A;
        }
        .footer {
            // position: fixed;
            position: sticky;
            bottom: 0;
            right: 0;
            height: 60px;
            background: #fff;
            text-align: right;
            width: 100%;
            .bnt {
                padding-right: 40px;
            }
        }
    }
</style>
