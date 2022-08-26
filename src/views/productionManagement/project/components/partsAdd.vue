<!--新增零件-->
<template>
    <div>
         <el-dialog :title="title" :visible.sync="partshow" :close-on-click-modal="false" width="510px">
             <el-form ref="form" v-if="form" :model="form" label-width="120px" :rules="addpartsRules">
                <el-form-item label="零件编号：" prop="partNumber">
                    <el-input :disabled="isEdit" v-model="form.partNumber"></el-input>
                </el-form-item>
                <el-form-item label="零件编码："  prop="partCode">
                    <el-input :disabled="isEdit" v-model="form.partCode"></el-input>
                </el-form-item>
                <el-form-item label="零件重量(单重)："  prop="partWeight">
                    <el-input v-model.number="form.partWeight" class="input-with-select">
                          <el-button slot="append" >吨</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="零件数量："  prop="partSize">
                    <el-input v-model.number="form.partSize"></el-input>
                </el-form-item>
                <el-form-item label="零件流向："  >
                    <el-input v-model="form.partProcessFlow"></el-input>
                </el-form-item>
                </el-form>
                <div  class="footer">
                    <el-button @click="colse">取消</el-button>
                    <!-- <el-button type="primary" @click="onSubmit('form')">保存</el-button> -->
                </div>
        </el-dialog>
    </div>
</template>

<script>
import {addpartsRules} from '@/utils/productionManagement/valid'
export default {
    data() {
        return {
            isEdit: false,
            addpartsRules,
            partshow: false,
            title:"",
            form:{}
        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        initUser(id,row) {
            this.form = row
            if(id){
                this.isEdit = true
                this.title="修改零件"
            }else{
                this.isEdit = false
                this.title="新增零件"
            }
            this.partshow = true;
        },
        //保存
        onSubmit(formName){
            this.$refs[formName].validate(valid => {
                if(valid) {
                    this.isEdit?this.$emit('parts-add',{
                        ...this.form,
                        nestingPartGrooveBoList: this.form.nestingPartGrooveVoList,
                        nestingAreaBoList: this.form.nestingAreaVoList
                    })
                    :this.$emit('parts-add',{
                        ...this.form,
                        type: 'add',
                        nestingPartVoList: [],
                        nestingPartGrooveBoList: [],
                        nestingAreaBoList: []
                    })
                    this.form={};
                    this.partshow=false;
                }
            })
        },
        //取消
        colse(){
            this.form={};
            this.partshow=false;
        }
    }
};
</script>

<style scoped lang="scss">
::v-deep .el-form .el-form-item {
    width: 100%;
}
::v-deep .el-form .el-form-item__label {
    margin-right: 0 !important;
}
.footer {
        text-align: right;
        .el-form .el-form-item {
             width: 100% !important;
     }
}
</style>
