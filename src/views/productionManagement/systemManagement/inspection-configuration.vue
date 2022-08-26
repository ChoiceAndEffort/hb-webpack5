<template>
  <div class="coating_configuration main_container">
    <div class="flex_row_space">
      <p>{{title}}</p>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="addCoating"
        >新增</el-button
      >
    </div>
    <TableBody :colConfig="colConfig" :data="tableData" height="680">
      <template #del="{ scope }">
        <el-button 
          type="text" 
          style="color: #F56C6C !important" 
          icon="el-icon-delete"
          @click="handleDel(scope)">
        </el-button>
      </template>
    </TableBody>
    <div class="bottom">
      <el-button type="primary" @click="$router.back()">返回</el-button>
      <el-button type="primary" @click="preservation"
        >保存</el-button
      >
    </div>
    <el-dialog
      class="workmanship_box"
      title="新增检验项目配置"
      :visible.sync="coatingShow"
      :close-on-click-modal="false"
      @close="handleCloseDialog"
      width="450px"
    >
      <el-form
        class="workmanship_form"
        ref="form"
        :model="coatingForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="检验项目：" prop="inspectionItems">
          <el-input v-model="coatingForm.inspectionItems" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="注意要点：" prop="attentionPoints">
          <el-input v-model="coatingForm.attentionPoints" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="允许偏差：" prop="allowableDeviation">
          <el-input v-model="coatingForm.allowableDeviation" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="偏差单位：" prop="unit">
          <el-input v-model="coatingForm.unit" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="colse">取消</el-button>
        <el-button type="primary" @click="onSubmit('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Form, Pagination, TableBody } from "gggj_lib";
import { 
  getInspectioItemDetailPage,
  addInspectioItem
} from "@/api/productionManagement/systemManagement.js"
import bottomFooter from "../components/bottomFooter.vue";
export default {
  components: { TableBody, bottomFooter },
  name: "coatingConfiguration",
  data() {
    return {
      title: '',
      form: {},
      colConfig: [
        /* 序号 */
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
            width: "50",
          },
        },
        {
          attrs: { label: "检验项目", prop: "inspectionItems", align: "center" },
        },
        {
          attrs: { label: "注意要点", prop: "attentionPoints", align: "center" },
        },
        {
          attrs: { label: "允许偏差", prop: "allowableDeviation", align: "center" },
        },
        {
          attrs: { label: "单位", prop: "unit", align: "center" },
        },
        {
          slot: "del",
          attrs: { label: "操作", align: "center" },
        },
      ],
      coatingShow: false,
      tableData: [],
      coatingForm: {
        inspectionItems: '',
        attentionPoints: '',
        allowableDeviation: '',
        unit: ''
      },
      rules: {
        inspectionItems: [
          { required: true, message: '请输入检验项目', trigger: 'blur' }
        ],
        attentionPoints: [
          { required: true, message: '请输入注意要点', trigger: 'blur' }
        ],
        allowableDeviation: [
          { required: true, message: '请输入偏差值', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ]
      }
    };
  },
  async created() {
    let res
    if (this.$route.query.data) {
      this.form = JSON.parse(this.$route.query.data)
      const { 
        engineeringProjectName: projectName,
        couplingName,
        projectWorkingProcedureName: produceName,
        projectProcessName: processName,
        projectProcessId
      } = this.form
      this.title = projectName + couplingName + produceName + processName
      res = await getInspectioItemDetailPage(projectProcessId)
      res.data.length && (this.tableData = res.data)
    }
  },
  methods: {
    onSubmit() {
      let data
      this.$refs['form'].validate(valid => {
        if (valid) {
          let index = this.tableData.findIndex(item => 
            item.inspectionItems === this.coatingForm.inspectionItems
          )
          if (index !== -1) {
            this.$message.warning('检验项目重复！')
            return
          }
          data = {...this.coatingForm}
          this.tableData.unshift(data)
          this.coatingShow = false;
        }
      })

    },
    addCoating() {
      this.coatingShow = true;
    },
    async preservation() {
      if (!this.tableData.length) {
        this.$message.warning('至少一条配置数据！')
        return
      }
      this.tableData.forEach(item => item.inspectionItemConfigurationId = '')
      let res
      res = await addInspectioItem({
        ...this.form,
        inspectionItemConfigurationSaveBatchInsideBoList: [...this.tableData]
      })
      res.code === 0 && this.$message.success('新增成功')
      await getInspectioItemDetailPage(this.form.projectProcessId)
    },
    colse() {
      this.coatingShow = false;
    },
    handleCloseDialog() {
      this.$refs['form'].resetFields()
    },
    handleDel(value) {
      this.$confirm(`是否确认删除${value.row.inspectionItems}配置？`,{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(res => {
        this.tableData.splice(value.$index,1)
        this.$message.success('删除成功')
      }).catch(error => {
        this.$message.info('已取消删除')
      })
    }
  },
};
</script>

<style scoped lang="scss">
.coating_configuration {
  position: relative;
  .flex_row_space {
    margin-bottom: 20px;
  }
  .workmanship_box {
    ::v-deep .el-dialog {
      .el-dialog__body {
        padding: 0 16px 12px;
      }
      .el-dialog__header {
        border-bottom: 1px solid #e4e7ed;
      }
    }
    .workmanship_form {
      width: 100%;
      padding-right: 50px;
      padding-top: 20px;
    }
    .footer {
      text-align: right;
      .el-form .el-form-item {
        width: 100% !important;
      }
    }
  }
  .bottom {
    padding: 16px;
    text-align: right;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    // box-shadow: 0px -3px 8px 1px rgb(0 0 0 / 8%);
  }
}
</style>
