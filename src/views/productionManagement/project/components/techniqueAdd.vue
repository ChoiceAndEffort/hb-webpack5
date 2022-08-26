<!--配置工艺-->
<template>
    <div class="workmanship_box">
        <el-dialog :title="title" :visible.sync="techinqueshow" :close-on-click-modal="false" width="450px">
              <el-form class="workmanship_form" ref="form" :model="form" label-width="120px">
                  <el-form-item label="工艺名称：" prop="name" :rules="[{ required: true, message: '请输入工艺名称', trigger: 'blur' }]">
                     <el-input v-model="form.name"></el-input>
                  </el-form-item>
                  <el-form-item label="自检：" prop="isSelfInspection">
                      <el-radio-group v-model="form.isSelfInspection">
                          <el-radio :label=1>是</el-radio>
                          <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="互检：" prop="isMutualInspection">
                      <el-radio-group v-model="form.isMutualInspection">
                          <el-radio :label=1>是</el-radio>
                          <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="专检：" prop="isSpecialInspection">
                      <el-radio-group v-model="form.isSpecialInspection">
                          <el-radio :label=1>是</el-radio>
                          <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="安全检查：" prop="isSpecialInspection">
                      <el-radio-group v-model="form.isSecurityCheck">
                          <el-radio :label=1>是</el-radio>
                          <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="进度奖比例：" prop="resource">
                      <el-input v-model="form.progressAward" type="number" v-only-number="{max:100,min:0,precision:2}" class="input-with-select">
                          <el-button slot="append" >%</el-button>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="质量奖比例：" prop="resource">
                      <el-input v-model="form.qualityAward" type="number" v-only-number="{max:100,min:0,precision:2}" class="input-with-select">
                          <el-button slot="append" >%</el-button>
                      </el-input>
                  </el-form-item>
            </el-form>
            <div  class="footer">
                <el-button @click="colse">取消</el-button>
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { projectProcesave } from "@/api/productionManagement/project.js";
export default {
    props: ['projectWorkingProced'],
    data() {
        return {
            title: '新增工艺',
            techinqueshow:false,
            form:{
                isMutualInspection: 0, // 是否互检
                isSpecialInspection: 0, // 是否专检
                isSelfInspection: 0, // 是否自检
                isSecurityCheck: 0, // 安全检查
                name:'',
                progressAward: '', //进度奖
                qualityAward: '' //质量奖
            }
        };
    },
    created() {
    },
    mounted() {

    },
    methods: {
        initUser(sign,row){
            this.title = sign ? '编辑工艺' : '新增工艺'
            this.form = sign ? row : {
                isMutualInspection: 0, // 是否互检
                isSpecialInspection: 0, // 是否专检
                isSelfInspection: 0, // 是否自检
                isSecurityCheck: 0, // 安全检查
                name:'',
                progressAward: '', //进度奖
                qualityAward: '' //质量奖
            }
            this.techinqueshow=true;
            console.log(this.projectWorkingProced)
        },
         //保存
        onSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const isObject = typeof this.projectWorkingProced === 'object'
                    this.techinqueshow=false;
                    const sendData = {
                        projectWorkingProcedureId: isObject?this.projectWorkingProced.projectWorkingProcedureId:this.projectWorkingProced,
                        workingProcedureCode: isObject?this.projectWorkingProced.workingProcedureCode:'',
                        ...this.form
                    }
                    projectProcesave(sendData).then(res => {
                        this.$parent.getprocessPage(this.projectWorkingProced)
                    })
                } else {
                    return false;
                }
            });
        },
        //取消
        colse(){
            this.techinqueshow=false;
            this.form.gongyi="";
        }
    }
};
</script>

<style scoped lang="scss">
.workmanship_box{
    ::v-deep .el-dialog {
        .el-dialog__body {
            padding: 0 16px 12px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #E4E7ED;
        }
    }
    .workmanship_form{
        width: 100%;
        padding-right: 50px;
        padding-top: 20px;
    }
}
.footer {
        text-align: right;
        .el-form .el-form-item {
             width: 100% !important;
     }
}
</style>
