<!--新增文档-->
<template>
    <div class="main">
        <div class="basicData">
            <p>基础资料</p>
                <el-divider></el-divider>
                 <el-form ref="form" :model="form" label-width="80px" label-position="top" :inline="true" >
                    <div class="flex25">
                        <el-form-item label="项目名称:"  >
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="项目编号:" >
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                        <el-form-item label="文件名称:" >
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="文件编号:" >
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                        <el-form-item label="文件所属分类:" >
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                        <el-form-item label="归档时间:" >
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                        <el-form-item label="归档人：">
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                        <el-form-item label="归档部门：">
                            <el-input v-model="form.bianhao"></el-input>
                        </el-form-item>
                    </div>
                 </el-form>
        </div>
        <div class="projectImg">
            <p>文件</p>
            <el-divider></el-divider>
            <el-upload class="upload-demo" ref="upload2" action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false">
                <div class="upfles">+上传文件</div>
            </el-upload>
        </div>
        <div class="periodInfo">
                <p>权限</p>
                <el-divider></el-divider>
                 <el-form ref="form" :model="form" label-width="80px" label-position="top" :inline="true" >
                        <el-form-item label="查看权限">
                            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
                                @close="handleClose(tag)">{{tag}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
                        </el-form-item>
                        <el-form-item label="阅读权限">
                            <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
                                @close="handleClose(tag)">{{tag}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                                </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
                        </el-form-item>
                 </el-form>
        </div>
        <div class="footer">
              <div class="bnt">
                  <el-button @click="resetForm">取消</el-button>
                  <el-button type="primary" @click="handleEditSave('form')">保存</el-button>
              </div>
        </div>
    </div>
</template>

<script>
import { ImgUploader } from 'gggj_lib';
// import { addprojectRules } from "@/utils/productionManagement/valid";
export default {
    components:{ImgUploader},
    data() {
        return {
            // addprojectRules,
            form:{
               name:'',
               bianhao:'',
               jianjie:'',
               img1:'',
               img2:'',
               number:'',
               couplingList:[]
            },
            options: [{
                value: '0',
                label: '模板一'
                }, {
                value: '1',
                label: '模板二'
            }],
            dynamicTags: ['张恒', '刘骞'],
            inputVisible: false,
            inputValue: ''
        };
    },
    created() {

    },
    mounted() {

    },
    computed:{
		 sum(){
			 let result = 0;
    		this.form.couplingList.forEach((item)=>{
			 	result += parseFloat(item.totalWeight)||0;
			})
			this.form.totalWeight=result;
			return result;
    	}
	},
    methods: {
        //保存
        handleEditSave(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$router.push("/project/document-management");
                }
            })
        },
        //重置
         resetForm(formName) {
             this.$router.push("/project/document-management");
            // this.$refs[formName].resetFields();
        },
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
            this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
};
</script>

<style scoped lang="scss">
    .main {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction:column;
        align-items:flex-start;
        min-height: 100%;
        ::v-deep .el-divider--horizontal {
            margin: 0;
        }
        ::v-deep .el-form {
            padding: 16px;
            .el-form-item__label {
                padding: 0;
                margin-right: 10px;
            }
            .el-form-item {
                width: 91%;
            }
            .el-textarea__inner {
                min-height: 100px !important;
            }
            // .el-form-item__content {
            //         margin-top: 42px;
            // }
        }
        .flex50 {
            display: flex;
            .el-form-item {
                width: 45%;
            }
        }
        .flex30 {
            display: flex;
            .el-form-item {
                width: 30%;
            }
        }
        .flex25 {
            display: flex;
            flex-wrap: wrap;
            .el-form-item {
                width: 20%;
            }
            .el-button {
                margin-top: 42px;
            }
        }
        .basicData,.projectImg,.periodInfo {
            background: #fff;
            min-width: 100%;
            p{
                font-size: 14px;
                line-height: 52px;
                margin: 0 16px;
                font-weight: 700;
            }
        }
        .projectImg,.periodInfo {
            flex: 1;
        }
        .upfles {
            width: 100%;
            border: 1px solid #DCDFE6;
            padding: 10px 50px;
            margin: 16px;
            text-align: center;
            color: #DCDFE6;
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
    .el-tag + .el-tag {
            margin-left: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
    }
</style>

