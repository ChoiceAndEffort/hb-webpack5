<template>
  <div class="wrap">
    <el-form :model="model" label-position="top">
      <!-- 基础信息 -->
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <!-- 第一行 -->
        <el-row :gutter="80">
          <el-col :span="8">
            <el-form-item label="车次编号">
              <el-input v-model="model.serialNumberData.tranNumber" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配车单位">
              <el-input v-model="model.serialNumberData.transportName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="配车人">
              <el-input v-model="model.serialNumberData.addName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="80">
          <el-col :span="8">
            <el-form-item label="配车时间">
              <el-date-picker
                :value="Date.now()"
                :style="{width: 100 + '%'}"
                disabled
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 -->
        <div class="files">
          <div class="title">
            <span>运输文件</span>
            <el-upload
              v-if="$route.query.type === 'add'"
              accept=".pdf,.doc,.docx"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :action="uploadSingleurl"
              :show-file-list="false"
              :file-list="model.projectAttachmentList">
              <el-button type="text" icon="el-icon-upload">上传文件</el-button>
            </el-upload>
          </div>
          <div :class="['files-list',(model.projectAttachmentList && model.projectAttachmentList.length===0)?'files-none':'']">
            <template v-if="(model.projectAttachmentList && model.projectAttachmentList.length)">
              <div
                class="file-item"
                v-for="(item,index) in model.projectAttachmentList"
                :key="index"
                @click="handleFileClick(item)">
                <i class="el-icon-paperclip"></i>
                <span>{{`${item.fileName}.${item.fileSuffix}`}}</span>
              </div>
            </template>
            <template v-else>
              <span>暂无文件</span>
            </template>
          </div>
        </div>
      </el-card>
      <!-- 相关物料 -->
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span>相关物料</span>
          <el-button v-if="$route.query.type === 'add'" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <TableBody
          :data="shipmentPlanList"
          :colConfig="colConfig"
        >
          <template #index="{scope}">
            <span>{{indexMethod(scope.$index)}}</span>
          </template>
        </TableBody>
      </el-card>
    </el-form>

    <div class="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button v-if="$route.query.type === 'add'" type="primary" @click="handleSubmit">提交</el-button>
    </div>

    <el-dialog title="选择物料" width="80%" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" class="dialog-form" :model="dialogModel" label-width="75px" label-position="left">
        <el-row type="flex" align="middle" :gutter="20">
          <el-col :span="6">
            <el-form-item label="物料编号:">
              <el-input v-model="dialogModel.materialNumber" placeholder="请输入物料编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码:">
              <el-input v-model="dialogModel.materialCode" placeholder="请输入物料编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-form-item :style="{float: 'right'}">
              <el-button @click="handleRest">重置</el-button>
              <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <TableBody :colConfig="dialogColConfig" :data="dialogModel.tableData" row-key="selectId"   @selection-change="handleSelectionChange">
        <template slot="current" slot-scope="{scope}">
            <el-input-number v-if="scope.row.materialAmount != 0" v-model="scope.row.materialAmount" :precision="0" :step="1" :min="0" :max="scope.row.thisAmount-scope.row.shipmentAmount"></el-input-number>
            <el-input-number v-if="scope.row.materialAmount == 0" v-model="scope.row.diffValue" :precision="0" :step="1" :min="0" :max="scope.row.thisAmount-scope.row.shipmentAmount"></el-input-number>
        </template>
      </TableBody>
      <Pagination :data="dialogModel.pageData" @changePage="dialogChangePage"/>
      <div :style="{textAlign: 'right', marginTop: '10px'}">
        <el-button @click="dialogFormVisible= false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TableBody, Pagination, Form } from "gggj_lib"
import { uploadSingleurl } from "@/api/productionManagement/cus.js";
import { indexMethod, tableTimeFilter } from '@/utils/productionManagement/tool'
import { getMaterialPlan, getSerialNumber, savePlan, getVehicleDetail } from '@/api/productionManagement/transport.js'
export default {
  components: {
    Form,
    TableBody,
    Pagination
  },
  data() {
    return {
      // 查看详情/新增 状态
      type: '',
      isLoading: false,
      model: {
        projectAttachmentList: [],
        serialNumberData: {}
      },
      // 路由数据
      queryData: {},
      // 文件上传地址
      uploadSingleurl,
      // 表格表头配置
      colConfig: [
        { slot: "index", attrs: { label: "序号", 'width': "64", fixed: 'left' } },
        { attrs: { label: "物料编号", prop: "materialNumber", "min-width": "243" } },
        { attrs: { label: "物料编码", prop: "materialCode", "min-width": "180" } },
        { attrs: { label: "厚度/高度(mm)", prop: "materialHeight", "min-width": "160" } },
        { attrs: { label: "宽度(mm)", prop: "materialWidth", "min-width": "160" } },
        { attrs: { label: "长度(mm)", prop: "materialLength", "min-width": "160" } },
        { attrs: { label: "数量", prop: "materialAmount", "min-width": "160" } },
        { attrs: { label: "单重(kg)", prop: "materialWeight", "min-width": "160" } },
        { attrs: { label: "节点计划开始时间", prop: "startTime", "min-width": "160", formatter: this.tableTimeFilter} },
        { attrs: { label: "节点计划完成时间", prop: "endTime", "min-width": "160", formatter:  this.tableTimeFilter} },         
      ],
      // 模态框显示状态
      dialogFormVisible: false,
      // 模态框表格表头配置
      dialogColConfig: [
        { attrs: { align: "center", type: "selection" }, },
        { attrs: { label: "物料编号", prop: "materialNumber" },},
        { attrs: { label: "物料编码", prop: "materialCode" },},
        { attrs: { label: "厚度/高度(mm)", prop: "materialHeight" },},
        { attrs: { label: "宽度(mm)", prop: "materialWidth" },},
        { attrs: { label: "长度(mm)", prop: "materialLength" },},
        { attrs: { label: "物料数量", prop: "thisAmount" },},
        { attrs: { label: "已关联数量", prop: "shipmentAmount",},},
        { slot: 'current', attrs: { label: "本轮生产量", prop: "materialAmount",},}
      ],
      // 模态框搜索配置数据
      dialogModel: {
        materialNumber: '',
        materialCode: '',
        tableData: [],
        pageData: {
          page: 0,
          size: 10,
          total: 0
        }
      },
      // 选中物料 选中数据集合
      shipmentPlanList: []
    };
  },
  created() {
    if (this.$route.query?.queryData) {
      const queryData = JSON.parse(this.$route.query.queryData)
      this.queryData = queryData
    }
    this.type = this.$route.query?.type
    this.init()
  },
  mounted() {},
  methods: {
    // 获取基础信息
    init() {
      if (this.type === 'detail') {
        this.getVehicleDetailData()
      } else {
        this.getMaterialPlanData()
        this.getSerialNumberData()
      }

    },
    // 获取详情数据
    async getVehicleDetailData() {
      let res = await getVehicleDetail(this.$route.query?.transPlanId)
      if (res.code === 0) {
        this.shipmentPlanList = res.data.shipmentPlanList
        this.model.projectAttachmentList = res.data.projectAttachmentList
        this.model.serialNumberData = {...res.data}       
      }
    },
    // 获取车次
    async getSerialNumberData() {
      this.model.serialNumberData = (await getSerialNumber()).data
    },
    // 获取物料计划数据
    async getMaterialPlanData(params) {
      const { roundsPlanId } = JSON.parse(this.$route.query.queryData)
      const { pageData } = this.dialogModel
      let res = await getMaterialPlan({
        shipmentStatus: 0,
        status: 0,
        materialNumber: params?.materialNumber,
        materialCode: params?.materialCode,
        roundsPlanId,
        ...pageData
      })
      if (res.code == 0) {
        res.data.data.forEach(item => {
          item['selectId'] = item.materialNumber + item.materialCode
          item.shipmentAmount = item.shipmentAmount??0
          item.materialHeight = Number(item.materialHeight)
        })
        this.dialogModel.tableData = res.data.data
        this.dialogModel.pageData = {...pageData,...res.data}
      }
    },
    // 过滤时间
    tableTimeFilter,
    // 自定义列
    indexMethod,
    // 上传文件前
    handleBeforeUpload(file) {
    },
    // 上传完成
    handleSuccess(res, file, fileList) {
      this.model.projectAttachmentList.push({
        attachmentUrl: res.data,
        fileName: file.name.split('.')[0],
        fileSuffix: file.name.split('.')[1]
      })
    },
    // 点击文件事件
    handleFileClick(item) {
      window.open(item.attachmentUrl)
    },
    // 新增物料
    handleAdd() {
      this.dialogFormVisible = true
    },
    // 提交
    handleSubmit() {
      if (!this.shipmentPlanList.length || !this.model.projectAttachmentList.length) {
        this.$message.warning('运输文件与相关物料至少保存一条数据！')
        return
      }
      let maxHeight,maxLength,maxWidth,totalAmount,totalWeight;
      maxHeight = maxLength = maxWidth = totalAmount = totalWeight = 0;
      this.shipmentPlanList.forEach(item => {
        totalAmount += item.materialAmount
        totalWeight += item.materialAmount * item.materialWeight
        maxHeight = Math.max(item.materialHeight,maxHeight)
        maxLength = Math.max(item.materialLength,maxLength)
        maxWidth = Math.max(item.materialWidth,maxWidth)
      });
      (async () => {
        let res = await savePlan({
          ...this?.queryData,
          ...this.model.serialNumberData,
          projectAttachmentList: this.model.projectAttachmentList,
          shipmentPlanList: this.shipmentPlanList,
          maxHeight,
          maxLength,
          maxWidth,
          totalAmount,
          totalWeight
        })
        res.code === 0 ? this.$message.success('保存成功！') : this.$message.error('保存失败！')
        this.$router.back()
      })()
    },
    // 模态框重置
    handleRest() {
      this.dialogModel.materialNumber = "",
      this.dialogModel.materialCode = ""
    },
    // 模态框数据保存
    handleConfirm() {
      this.dialogFormVisible = false
    },
    // 模态框查询数据
    handleSearch() {
      this.getMaterialPlanData(this.dialogModel)
    },
    // 模态框表格选择事件
    handleSelectionChange(list) {
      this.shipmentPlanList = list
    },
    // 模态框分页事件
    dialogChangePage(page) {
      this.dialogModel.pageData.page = page
      this.getMaterialPlanData(this.dialogModel)
    }
  },
};
</script>

<style scoped lang="scss">
::v-deep .box-card {
  font-size: 14px;
  margin-bottom: 16px;
  .el-card__header,.el-card__body {
    padding: 16px 24px;
  }
  .el-card__header {
    font-weight: bold;
    .clearfix {
      display: flex;
      align-items: center;
      span {
        flex: 1;
      }
    }
  }
  // 图像
  .files {
    margin-top: 20px;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 16px;
      height: 40px;
      line-height: 40px;
      background-color: #F8F8F8;
    }
    .files-list {
      display: flex;
      margin: 24px 16px;
      .file-item {
        margin-right: 20px;
        cursor: pointer;
      }
      .file-item:hover {
        color: #409EFF;
      }
    }
    .files-none {
      text-align: center;
    }
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 8px 16px;
  box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
  z-index: 999;
  .el-button--default {
    background-color: transparent !important;
  }
}
// .dialog-form {

// }
</style>
