<!--新增项目-->

<template>
  <div class="main">
    <div class="content">
      <div class="basicData">
        <el-radio-group
          v-model="projectRadio"
          size="medium"
          class="redio"
          @change="handleRadio"
          :disabled="this.$route.query.type"
        >
          <el-radio-button label="联段">桥梁</el-radio-button>
          <el-radio-button label="机型">风电</el-radio-button>
        </el-radio-group>
        <p>基础资料</p>
        <el-divider></el-divider>
        <el-form
          ref="formDom"
          :model="form"
          label-width="80px"
          label-position="top"
          :inline="true"
          :rules="addprojectRules"
        >
          <div class="flex30">
            <el-form-item label="项目名称:" prop="name">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目编号:" prop="number">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.number"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目总重:">
              <el-input
                v-model="sum"
                :disabled="true"
                class="input-with-select"
              >
                <el-button class="input-append" slot="append">千克</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="目的地:" prop="transportPlace">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.transportPlace"
              ></el-input>
            </el-form-item>
            <el-form-item label="收货人:" prop="liaison">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.liaison"
              ></el-input>
            </el-form-item>
            <el-form-item label="收货人联系方式:" prop="liaisonPhone">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.liaisonPhone"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="项目简介:" prop="remark">
            <el-input
              type="textarea"
              @change="handleTextareaChange"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="projectImg">
        <p>项目效果图</p>
        <el-divider></el-divider>
        <div class="projectImgBoxs">
          <img-uploader
            v-model="form.projectAttachmentList[0].attachmentUrl"
            class="imgBox"
          ></img-uploader>
          <img-uploader
            v-model="form.projectAttachmentList[1].attachmentUrl"
            class="imgBox"
          ></img-uploader>
        </div>
      </div>
      <div class="periodInfo">
        <p>{{projectRadio}}信息</p>
        <el-divider></el-divider>
        <el-form
          ref="formDom2"
          :model="form"
          label-width="80px"
          label-position="top"
          :inline="true"
          :rules="{
            required: true,
            message: `请输入${projectRadio}数量`,
            trigger: 'blur',
          }"
        >
          <div class="flex25">
            <el-form-item :label="`${projectRadio=='联段'?'联段数量':'机型种类'}:`" prop="couplingSize">
              <el-input
                :disabled="Boolean($route.query.id)"
                v-model="form.couplingSize"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button
                :disabled="Boolean($route.query.id)"
                @click="addConditions"
                >确定</el-button
              >
            </el-form-item>
          </div>
          <template v-if="form.couplingList.length > 0">
            <div
              class="flex25"
              v-for="(item, index) in form.couplingList"
              :key="index"
            >
              <el-form-item
                :label="`项目${projectRadio}:`"
                :prop="'couplingList.' + index + '.name'"
                :rules="{
                  required: true,
                  message: `请输入${projectRadio}名称`,
                  trigger: 'blur',
                  max: 64,
                }"
              >
                <el-input
                  :disabled="Boolean($route.query.id)"
                  v-model="item.name"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="`${projectRadio}编号:`"
                :prop="'couplingList.' + index + '.number'"
                :rules="{
                  required: true,
                  message: `请输入${projectRadio}编号`,
                  trigger: 'blur',
                }"
              >
                <el-input
                  :disabled="Boolean($route.query.id)"
                  v-model="item.number"
                ></el-input>
              </el-form-item>
              <el-form-item
              v-if="projectRadio=='机型'"
                label="机型数量(套):"
                :prop="'couplingList.' + index + '.cover'"
                :rules="{
                  required: true,
                  message: `请输入机型数量`,
                  trigger: 'blur',
                }"
              >
                <el-input
                  :disabled="Boolean($route.query.id)"
                  v-model="item.cover"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="`${projectRadio}重量:`"
                :prop="'couplingList.' + index + '.totalWeight'"
                :rules="{
                  required: true,
                  message: `请输入${projectRadio}重量`,
                  trigger: 'blur',
                }"
              >
                <el-input
                  :disabled="Boolean($route.query.id)"
                  v-model="item.totalWeight"
                >
                  <el-button class="input-append" slot="append">千克</el-button>
                </el-input>
              </el-form-item>
            </div>
          </template>
        </el-form>
      </div>
    </div>
         <!-- <div class="footer-wrap"> -->
    <bottomFooter v-if="isEdit" :isReturn="true"></bottomFooter>
    <bottom-footer
      v-if="!isEdit"
      @handleEditSave="handleEditSave"
      @resetForm="resetForm"
    ></bottom-footer>
  </div>
</template>

<script>
// import { ImgUploader } from 'gggj_lib';
import ImgUploader from "../components/ImgUploader.vue";
import projectSon from "./components/projectSon.vue";
import { addprojectRules, addprojectRules2 } from "@/utils/productionManagement/valid";
import bottomFooter from "../components/bottomFooter.vue";
import { saveProject, getProjectdetail } from "@/api/productionManagement/project.js";
export default {
  components: { ImgUploader, bottomFooter, projectSon },
  data() {
    return {
      addprojectRules,
      addprojectRules2,
      form: {
        name: "",
        number: "",
        remark: "",
        transportPlace: "",
        liaison: "",
        liaisonPhone: "",
        projectAttachmentList: [{ attachmentUrl: "" }, { attachmentUrl: "" }],
        couplingSize: null,
        couplingList: [],
      },
      isEdit: false,
      projectRadio: "联段",
    };
  },
  created() {
    if (this.$route.query.id) {
      this.getdetails();
      this.isEdit = true;
    }
    if(this.$route.query.type){
      this.projectRadio = this.$route.query.type==1?'联段':'机型'
    }
  },
  mounted() {},
  computed: {
    sum() {
      let result = 0;
      this.form.couplingList.forEach((item) => {
        result += parseFloat(item.totalWeight) || 0;
      });
      this.form.totalWeight = result;
      return result;
    },
  },   
  methods: {
    /* 获取项目详情 */
    getdetails() {
      getProjectdetail(this.$route.query.id).then((res) => {
        // console.log(res)
        if (res.code === 0) {
          if (res.data.projectAttachmentList.length === 0) {
            res.data.projectAttachmentList = [
              { attachmentUrl: "" },
              { attachmentUrl: "" },
            ];
          }
          if (res.data.projectAttachmentList.length === 1) {
            res.data.projectAttachmentList = [
              {
                attachmentUrl: `${res.data.projectAttachmentList[0].attachmentUrl}`,
              },
              { attachmentUrl: "" },
            ];
          }
          this.form = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    addConditions() {
      this.form.couplingList = [];
      for (let i = 0; i < this.form.couplingSize; i++) {
        let obj = {
          number: "", //联段编号
          name: "", //联段名称
          totalWeight: "", //联段重量
        }
        if(this.projectRadio=='机型'){
          obj.cover = ""
        }
        this.form.couplingList.push(obj);
      }
    },
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve();
          } else reject();
        });
      });
    },
    //保存
    handleEditSave() {
      let list = [];
      list.push(this.checkForm("formDom"), this.checkForm("formDom2"));
      Promise.all(list)
        .then(() => {
          this.$confirm("是否确认保存项目？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.form.couplingSize = this.form.couplingList.length;
              this.form.type = this.projectRadio == "联段" ? 1 : 2;
              saveProject({ ...this.form })
                .then((res) => {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.$router.push("project-info");
                  // this.getdetails();
                })
                .finally(() => {
                  this.isLoading = false;
                });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //重置
    resetForm(formName) {
      this.$router.push("project-info");
      // this.$refs[formName].resetFields();
    },
    //文本框修改事件
    handleTextareaChange() {
      if (this.$route.query.id) {
        // this.handleEditSave()
      }
    },
    handleRadio() {
      this.form.couplingSize = "";
      this.$nextTick(() => {
        this.$refs["formDom2"].resetFields();
        this.form.couplingList = [];
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-height: 100%;
  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
  .redio {
    margin: 20px;
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
  }
  .flex50 {
    display: flex;
    .el-form-item {
      width: 45%;
    }
  }
  .flex30 {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 30%;
    }
  }
  .flex25 {
    display: flex;
    .el-form-item {
      width: 18%;
    }
    .el-button {
      margin-top: 33px;
    }
    .input-append {
      margin-top: -10px;
    }
  }
  .basicData,
  .projectImg,
  .periodInfo {
    background: #fff;
    min-width: 100%;
    p {
      font-size: 14px;
      line-height: 52px;
      margin: 0 16px;
      font-weight: 700;
    }
  }
  .projectImg,
  .periodInfo {
    margin-top: 8px;
  }
  .projectImg {
    .projectImgBoxs {
      display: flex;
      flex-direction: row;
      .imgBox {
        width: 178px;
        height: 178px;
        margin: 16px;
      }
    }
  }
}
.content {
  flex: 1;
  overflow-y: auto;
  width: 100%;
}

::v-deep .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner{
      background-color: #409EFF;
      color:#fff;
}
// .footer-wrap {
//   /* width: 100%;
//     box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
//     box-sizing: border-box;
//     z-index: 999;*/
// }
</style>
