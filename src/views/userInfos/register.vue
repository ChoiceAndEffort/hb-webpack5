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
                <div class="form-title">注册账户</div>
                <Form ref="form" formName="form" :renderData="renderData" @getFormData="getFormData" width="100%">
                    <template slot="captcha-code" slot-scope="{scope}">
                       <CaptchaCode v-model="scope['code']" :mobile='scope.mobile' :api="codeApi"/>
                    </template>
                </Form>
                <div class="btns">
                    <SubmitBtn ref="submitBtn" :data="formData" :api="retrievalPasswordApi" btnText="注册"></SubmitBtn>
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
            return{
                codeApi: sendSmsVerificationCode,
                retrievalPasswordApi: retrievalPassword,
                formData: {},
                renderData: [{
                    tag: 'el-input',
                    attrs: {
                        key: 'name',
                        type: 'text',
                        value: '',
                        placeholder: '请输入员工姓名',
                        rules: [{
                           required: true,
                           message: '员工姓名不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'enterpriseName',
                        type: 'text',
                        value: '',
                        placeholder: '请输入所属企业',
                        rules: [{
                           required: true,
                           message: '所属企业不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'loginPwd',
                        type: 'text',
                        value: '',
                        placeholder: '请输入密码',
                        rules: [{
                           required: true,
                           message: '密码不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'loginPwd2',
                        type: 'text',
                        value: '',
                        placeholder: '请重复输入密码',
                        rules: [{
                           required: true,
                           message: '重复密码不能为空',
                           trigger: 'blur'
                        }]
                    }
                },{
                    tag: 'el-input',
                    attrs: {
                        key: 'mobile',
                        type: 'text',
                        value: '',
                        placeholder: '请输入手机号码',
                        rules: [{
                           required: true,
                           message: '手机号码不能为空',
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
                }],
            }
        },
        components:{
            Form,
            CaptchaCode,
            SubmitBtn
        },
        methods: {
            handleSubmit(){
                this.$refs.submitBtn.handleSubmit(this.$refs.form.getSubmitData());
                this.$router.push({
                    path: '/'
                })
            },
            getFormData(formData){
                this.formData = formData
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
