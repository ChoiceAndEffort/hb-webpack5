<!--新增计划-->
<template>
    <div class="main">
        <el-form label-position="top" label-width="80px" :model="formLabelAlign">
            <el-form-item label="项目名称：">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="部门：">
                <el-input v-model="formLabelAlign.bumen"></el-input>
            </el-form-item>
            <el-form-item label="计划完成时间：">
                <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="formLabelAlign.rectificationTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="计划内容：">
               <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="formLabelAlign.textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
               <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="formLabelAlign.beizhu"></el-input>
            </el-form-item>
            <el-form-item label="重要程度：">
                <ul class="StarsWrap">
                    <li v-for="(i,index) in list" :key="index" @click="clickStars(index)">
                    <img :src="formLabelAlign.xing>index?stara:starb"/>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item >
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="resetForm">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formLabelAlign: {
                name: '',
                bumen: '',
                rectificationTime: '',
                textarea:'',
                beizhu:'',
                 xing:0,
            },
            stara:'../../static/img/details/shoucang.png',//亮星星
            list:[0,1,2,3,4],
            starb:'../../static/img/details/shouc.png',//暗星星

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        clickStars(i){
            this.formLabelAlign.xing = i+1
        },
        //提交
        onSubmit(){
        },
        //取消
         resetForm(formName) {
             this.$router.push("/planmanagement/plan-index");
            // this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped lang="scss">
    .main {
        height: 100%;
        background-color: #ffffff;
        padding: 16px;
        ::v-deep .el-form {
            width: 400px;
            margin: 12px auto;
            .el-form-item__label {
                padding: 0;
            }
            .el-input__inner {
                width: 70%;
            }
            .el-form-item {
                margin-bottom: 10px;
            }
        }
        .StarsWrap li{
            float: left;
            margin-right: 10px;
        }
    }
</style>
