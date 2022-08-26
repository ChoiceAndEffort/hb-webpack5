<template>
  <div class="wrap">
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-position="top"
    >
      <!-- 基础信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <!-- 供应商名称/供应商类型/法人代表 -->
        <el-row type="flex" justify="space-between">
          <!-- 供应商名称 -->
          <el-col :lg="7">
            <el-form-item prop="supplierName" label="供应商名称">
              <el-input
                :disabled="status === 'edit'"
                v-model="formData.supplierName"
                placeholder="请输入供应商名"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 供应商类型 -->
          <el-col :lg="7">
            <el-form-item prop="supplierType" label="供应商类型">
              <el-select
                v-model="formData.supplierType"
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item in supTypeList"
                  :key="item.dictItemId"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 法人代表 -->
          <el-col :lg="7">
            <el-form-item label="法人代表">
              <el-input
                v-model="formData.corporateRepresentative"
                placeholder="请输入法人代表"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 联系人/职位/联系电话 -->
        <el-row type="flex" justify="space-between">
          <!-- 联系人 -->
          <el-col :lg="7">
            <el-form-item label="联系人">
              <el-input
                v-model="formData.contactPerson"
                placeholder="请填写联系人"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 职位 -->
          <el-col :lg="7">
            <el-form-item label="职位">
              <el-input
                v-model="formData.contactPosition"
                placeholder="请填写职位"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 联系电话 -->
          <el-col :lg="7">
            <el-form-item label="联系电话">
              <el-input
                v-model="formData.contactNumber"
                placeholder="请填写联系电话"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 经营范围/开户行/账号 -->
        <el-row type="flex" justify="space-between">
          <!-- 经营范围 -->
          <el-col :lg="7">
            <el-form-item  label="经营范围">
              <el-input v-model="formData.businessScope" placeholder="请填写经营范围"></el-input>
            </el-form-item>
          </el-col>
          <!-- 开户行 -->
          <el-col :lg="7">
            <el-form-item  label="开户行">
              <el-input v-model="formData.openingBank" placeholder="请填写开户行"></el-input>
            </el-form-item>
          </el-col>
          <!-- 账号 -->
          <el-col :lg="7">
            <el-form-item  label="账号">
              <el-input v-model="formData.account" placeholder="请填写开户行账号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 业务部门/经办人/录入时间 -->
        <el-row type="flex" justify="space-between">
          <!-- 业务部门 -->
          <el-col :lg="7">
            <el-form-item label="业务部门">
              <el-input
                v-model="formData.departmentName"
                disabled
                :placeholder="formData.departmentName"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 经办人 -->
          <el-col :lg="7">
            <el-form-item label="经办人">
              <el-input
                v-model="formData.addName"
                disabled
                :placeholder="formData.addName"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 录入时间 -->
          <el-col :lg="7">
            <el-form-item label="录入时间">
              <el-input
                v-model="formData.addTime"
                disabled
                :placeholder="formData.addTime"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 资质信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>资质信息</span>
        </div>
        <!-- 营业执照有效期限/安全许可证有效期/道路运输经营许可证有效期 -->
        <el-row type="flex" justify="space-between">
          <!-- 营业执照有效期限 -->
          <el-col :lg="7">
            <el-form-item
              prop="businessLicenseValidity"
              label="营业执照有效期限"
            >
              <el-date-picker
                v-model="formData.businessLicenseValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 营业执照有效期限上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[0]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 0)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- 安全许可证有效期 -->
          <el-col :lg="7">
            <el-form-item label="安全许可证有效期">
              <el-date-picker
                v-model="formData.safetyPermitsValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 安全许可证有效期上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[1]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 1)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- 道路运输经营许可证有效期 -->
          <el-col :lg="7">
            <el-form-item label="道路运输经营许可证有效期">
              <el-date-picker
                v-model="formData.roadLicenseValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 道路运输经营许可证有效期上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[2]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 2)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 劳务分包有效期/危化品/危险经营许可有效期/其他类资质有效期 -->
        <el-row type="flex" justify="space-between">
          <!-- 劳务分包有效期 -->
          <el-col :lg="7">
            <el-form-item label="劳务分包有效期">
              <el-date-picker
                v-model="formData.serviceLicenseValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 劳务分包有效期上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[3]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 3)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- 危化品/危险经营许可有效期 -->
          <el-col :lg="7">
            <el-form-item label="危化品/危险经营许可有效期">
              <el-date-picker
                v-model="formData.riskLicenseValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 危化品/危险经营许可有效期上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[4]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 4)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <!-- 其他类资质有效期 -->
          <el-col :lg="7">
            <el-form-item label="其他类资质有效期">
              <el-date-picker
                v-model="formData.elseLicenseValidity"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
              <!-- 其他类资质有效期上传 -->
              <el-upload
                class="upload"
                accept="image/*"
                action=" "
                :file-list="fileList[5]"
                :http-request="handleRequest"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="
                  (file, fileList) => handleUploadChange(file, fileList, 5)
                "
              >
                <el-button type="text" icon="el-icon-upload"
                  >点击上传</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 认证信息 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>认证信息</span>
        </div>
        <!-- ISO9000 : 2015认证/ISO14001 : 2015认证/OHSAS1800 : 2007认证 -->
        <el-row type="flex" justify="space-between">
          <!-- ISO9000 : 2015认证 -->
          <el-col :lg="7">
            <el-form-item label="ISO9000 : 2015认证">
              <el-input
                v-model="formData.authentication1"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- ISO14001 : 2015认证 -->
          <el-col :lg="7">
            <el-form-item label="ISO14001 : 2015认证">
              <el-input
                v-model="formData.authentication2"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- OHSAS1800 : 2007认证 -->
          <el-col :lg="7">
            <el-form-item label="OHSAS1800 : 2007认证">
              <el-input
                v-model="formData.authentication3"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <bottomFooter @resetForm="handleCancel" @handleEditSave="handleEditSave"></bottomFooter>
  </div>
</template>

<script>
import { uploadSingleFile } from "@/api/productionManagement/cus";
import bottomFooter from "@/views/productionManagement/components/bottomFooter";
import { supplierSave, getSupplierDetail } from "@/api/productionManagement/systemManagement"
export default {
  components: {
    bottomFooter
  },
  data() {
    return {
      status: '',
      formData: {
        supplierName: "",
        supplierType: "",
        corporateRepresentative: "",
        contactPerson: "",
        contactPosition: "",
        contactNumber: "",
        businessScope: "",
        openingBank: "",
        account: "",
        departmentName: "",
        addName: "",
        addTime: "",
        businessLicenseValidity: "",
        safetyPermitsValidity: "",
        roadLicenseValidity: "",
        serviceLicenseValidity: "",
        riskLicenseValidity: "",
        elseLicenseValidity: "",
        authentication1: "",
        authentication2: "",
        authentication3: "",
      },
      formRules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" },
        ],
        supplierType: [
          { required: true, message: "请选择供应商类型", trigger: "blur" },
        ],
        businessLicenseValidity: [
          {
            required: true,
            message: "请选择营业执照有效期限",
            trigger: "blur",
          },
        ],
      },
      fileList: Array([], [], [], [], [], []),
      // 供应商类型数据
      supTypeList: [],
    };
  },
  created() {
    if (this.$route.query.supTypeList) {
      const { supTypeList } = this.$route.query;
      this.supTypeList = JSON.parse(supTypeList);
    }
    if (this.$route.query.id) {
      const { id } = this.$route.query;
      id && this.handleGetDetail(id)
    }
    if (this.$route.query.status) {
      const { status } = this.$route.query;
      this.status = status
    }
  },
  mounted() {},
  methods: {
    // 获取详情
    async handleGetDetail(id) {
      let res = await getSupplierDetail(id)
      this.formData = {...JSON.parse(JSON.stringify(res.data))}
      this.formData.projectAttachmentList.forEach(item => {
        item.name = item.fileName
        item.url = item.attachmentUrl
        this.fileList[parseInt(item.tag)-1].push(item)
      })
    },
    handleRequest() {},
    // 图片列表点击
    handlePreview(file) {
      console.log(file);
    },
    // 图片删除
    handleRemove(file, fileList) {
      if (file.attachmentId) {
      }
      const idnex = this.fileList[file.tag].findIndex(
        (item) => item.url === file.url
      );
      this.fileList[file.tag].splice(idnex, 1);
    },
    // 上传状态改变
    async handleUploadChange(file, fileList, type) {
      let formData = new FormData();
      formData.append("file", file.raw);
      let res = await uploadSingleFile(formData);
      if (res.code == 0) {
        this.fileList[type].push({
          attachmentUrl: res.data,
          fileName: file.name,
          name: file.name,
          url: res.data,
          tag: type+1,
        });
      }
    },
    // 保存
    handleEditSave() {
      if (!this.fileList[0].length) {
        this.$message.warning('请上传营业执照！')
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let res
          this.$confirm('是否保存配置?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            (async () => {
              this.formData.projectAttachmentList = this.fileList.flat(Infinity)
              res = await supplierSave(this.formData)
              if (res.code === 0) {
                this.$message.success('保存成功')
                this.$router.back()
              }
            })()
          }).catch(() => {
            this.$message.info('已取消')    
          })
        }
      })
    },
    // 取消
    handleCancel() {
      this.$confirm('是否放弃配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  ::v-deep .box-card {
    margin-bottom: 16px;
    .el-card__header {
      padding: 16px 24px;
      .clearfix {
        display: flex;
        align-items: center;
        span {
          flex: 1;
        }
      }
    }
    .el-card__body {
      padding: 16px 24px;
      .el-form-item {
        .el-select {
          width: 100%;
        }
        > .el-form-item__content {
          display: flex;
          .el-date-editor {
            width: 50%;
            height: 32px;
          }
          .upload {
            box-sizing: border-box;
            width: 50%;
            .el-upload {
              padding-left: 10px;
              text-align: center;
            }
          }
          .el-upload-list {
            position: relative;
            left: -100%;
          }
        }
      }
    }
  }
}
</style>
