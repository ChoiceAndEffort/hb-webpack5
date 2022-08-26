<template>
    <el-container class="login">
        <img class="login-bg" src="@/assets/images/userInfos/bg.jpg" />
        <div class="login-main">
            <img class="logo" src="@/assets/images/userInfos/logo@2x.png"/>
            <div class="text-wrap">
                <div class="text">Hi, 你好!</div>
                <div class="text">欢迎进入伟谋数智—智慧ERP管理系统</div>
                <div class="text-small">Hello, welcome to Weimou digital intelligence ERP management system</div>
            </div>
            <div class="form">
                <div class="form-title">密码找回</div>
                <Form ref="form" formName="form" :renderData="renderData" width="100%" @getFormData="getFormData" @handleSubmit="handleSubmit">
                    <template slot="captcha-code" slot-scope="{scope}">
                       <CaptchaCode v-model="scope['code']" :mobile='scope.mobile' :api="codeApi"/>
                    </template>
                </Form>
                <div class="btns">
                    <el-button class="submit-btn" type="primary" @click="handleLogin">确定</el-button>
<!--                    <SubmitBtn ref="submitBtn" :data="formData" :api="retrievalPasswordApi" @isOk="handleIsOk"  @isErr="handleIsErr"></SubmitBtn>-->
                    <router-link class="back" to="/login">使用已有账户登录</router-link>
                </div>
            </div>
        </div>
    </el-container>
</template>

<script>
    import { sendSmsVerificationCode } from '@/api/gggjMain/cus.js'
    import { retrievalPassword } from '@/api/gggjMain/login.js'
    import { Form,CaptchaCode,SubmitBtn } from 'gggj_lib'
    export default{
        data(){
            var monilerule = (rule, value, cd) => {
                if(this.formData.newLoginPwd != value){
                    cd(new Error())
                }
                cd()
            }
            return{
                codeApi: sendSmsVerificationCode,
                retrievalPasswordApi: retrievalPassword,
                formData: {},
                renderData: [{
                    tag: 'el-input',
                    attrs: {
                        key: 'mobile',
                        type: 'text',
                        value: '',
                        placeholder: '请输入账号',
                        maxlength: "11",
                        minlength: "11",
                        rules: [{
                           required: true,
                           message: '账号不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    slot: 'captcha-code',
                    attrs: {
                        key: 'code',
                        type: 'text',
                        'prefix-icon': 'el-icon-user',
                        value: '',
                        rules: [{
                           required: true,
                           message: '验证码不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'newLoginPwd',
                        type: 'text',
                        value: '',
                        maxlength: "32",
                        minlength: "6",
                        placeholder: '请输入密码',
                        'show-password':true,
                        rules: [{
                           required: true,
                           message: '密码不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'newLoginPwd2',
                        type: 'text',
                        value: '',
                        placeholder: '请重复输入密码',
                        'show-password':true,
                        maxlength: "32",
                        minlength: "6",
                        rules: [{
                           required: true,
                           message: '密码不能为空',
                           trigger: 'blur'
                        },{
                            validator: monilerule,
                            message: '两次输入密码不同',
                            trigger: 'blur'
                        }]
                    }
                }],
                isLoading: false,
                disabled: false,
            }
        },
        components:{
            Form,
            CaptchaCode,
            SubmitBtn
        },
        methods: {
            getFormData(formData){
                this.formData = {...formData};
                delete this.formData.newLoginPwd2
            },
            handleIsOk() {
                this.$message.success('修改成功');
                this.$router.push({
                    path: '/'
                })
            },
            handleIsErr(err) {
            },
            handleLogin(){
                this.$refs['form'].handleSubmit()
            },
            handleSubmit(data){
                this.disabled = true;
                this.isLoading = true;
                retrievalPassword(this.formData).then((res)=>{
                    this.handleIsOk();
                }).catch((err)=>{
                }).finally(()=>{
                    this.disabled = false
                    this.isLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~@/styles/element-variables.scss';
    .login{
        position: relative;
    }
    .login-bg{
        margin-top: -100px;
        height: 160%;
        width: 100%;
    }
    .login-main{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0px;
        right: 0px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(18, 124, 245, 0.3);
        .logo{
            position: absolute;
            height: 58px;
            width: 58px;
            top: 40px;
            left: 40px;
        }
        .text-wrap{
            margin-left: 82px;
            color: #FFFFFF;
            .text{
                font-size: 40px;
                font-weight: 600;
                margin-bottom: 6px;
            }
            .text-small{
                font-size: 18px;
                font-weight: 400;
            }
        }
        .form{
            margin: auto 76px;
            width: 438px;
            background: #FFFFFF;
            padding: 35px;
            box-sizing: border-box;
            .form-title{
                font-size: 24px;
                color: #56585C;
                font-weight: 600;
                padding-bottom: 36px;
            }
        }
    }
    ::v-deep .el-tabs__nav-wrap::after{
        background: #FFFFFF !important;
    }
    ::v-deep .submit-btn{
        width: 100%;
    }
    .back{
        margin-top: 25px;
        float: right;
        font-size: 14px;
        color: $--color-primary;
    }
</style>
