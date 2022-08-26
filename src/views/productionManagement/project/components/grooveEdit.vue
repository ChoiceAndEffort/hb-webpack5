<!--编辑坡口-->
<template>
    <div>
        <el-dialog :title="title" :visible.sync="grooveshow" :close-on-click-modal="false" width="785px">
            <el-form :model="tableDataForm" ref="tableDataForm" style="width: 100%">
                <el-form-item style="width: 100%">
                    <el-table :data="tableDataForm.tableData" style="width: 100%" :header-cell-style="{ background: '#F2F6FC ', color: '#606266' }">
                        <el-table-column label="坡口名称" >
                            <template scope="{row , $index}">
                                <el-form-item :prop="`tableData.${$index}.grooveName`" :rules="editGroove.grooveName">
                                    <el-input v-model="row.grooveName" ></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="坡口类型">
                            <template scope="{row , $index}">
                                <el-form-item :prop="`tableData.${$index}.grooveType`" :rules="editGroove.grooveType">
                                    <el-input v-model="row.grooveType"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="坡口长度(单个零件坡口长度)" >
                            <template scope="{row , $index}">
                                <el-form-item :prop="`tableData.${$index}.grooveLength`" :rules="editGroove.grooveLength">
                                    <el-input v-model.number="row.grooveLength" class="input-with-select">
                                        <el-button slot="append" >米</el-button>
                                    </el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="90">
                            <template scope="{row}">
                                <el-button type="danger" @click="handleDel(row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div class="add" @click="addData">
                <span>+</span>添加
            </div>
            <div  class="footer">
                <el-button @click="colse">取消</el-button>
                <el-button type="primary" @click="onSubmit('tableDataForm')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import { editGroove } from '@/utils/productionManagement/valid'
export default {
    data() {
        return {
            grooveshow:false,
            title:"编辑坡口",
            rowData: [],
            tableDataForm: {
                tableData:[],
            },
            editGroove // 验证规则
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        initUser(data) {
            this.rowData = data
            const {nestingPartGrooveVoList} = data
            // 行数据中有坡口数据就赋值给tabledata
            this.tableDataForm.tableData = nestingPartGrooveVoList?nestingPartGrooveVoList:[]
            this.grooveshow = true;
        },
        //保存
        onSubmit(formName){
            this.$refs[formName].validate(valid => {
                if(valid) {
                    this.rowData.nestingPartGrooveVoList = this.tableDataForm.tableData
                    this.rowData.nestingPartGrooveBoList = this.tableDataForm.tableData
                    this.$emit('groove-edit',this.rowData)
                    this.grooveshow=false;
                }
            })
        },
        //取消
        colse(){
            this.grooveshow=false;
        },
        //新增
        addData(){
             this.tableDataForm.tableData.push({
                grooveName: '',
                grooveType: '',
                grooveLength: ''
            });
        },
        // 删除
        handleDel(row) {
            this.$emit('groove-del',{
                partsData: this.rowData,
                grooveData: row
            })
        }
    }
};
</script>

<style scoped lang="scss">
::v-deep .el-form-item {
    .el-form-item__content {
        margin-left: 0 !important;
    }
    .el-form-item,
    .is-error,
    .is-required {
        padding: 20px 0;
    }
}
.add {
    height: 36px;
    border: 1px dotted #E4E7ED ;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
}
.footer {
        text-align: right;
            margin-top: 20px;
        .el-form .el-form-item {
             width: 100% !important;
     }
}
</style>
