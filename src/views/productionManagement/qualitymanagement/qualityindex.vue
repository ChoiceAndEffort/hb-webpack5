<template>
  <div id="qualityindex">
    <!-- 基础信息 -->
    <el-card class="box-card" :body-style="{ padding: '24px 16px' }">
      <div slot="header" class="clearfix">
        <span>工单基础信息</span>
      </div>
      <div class="basic-info">
        <div class="row">
          <div>项目名称： {{form.engineeringProjectName}}</div>
          <div>联段： {{form.couplingName}}</div>
          <div>工序： {{form.procedureName}}</div>
        </div>
        <div class="row">
          <div>工艺： {{form.processName}}</div>
          <template v-if="configType === 'nesting'">
            <div v-if="form.partNumber">编号： {{form.partNumber}}</div>
            <div v-if="!form.partNumber">图纸名称: {{form.nestingName}}</div>
            <div v-if="!form.partNumber">图纸页码: {{form.nestingPage}}</div>
          </template>
          <template v-else>
            <div>物料编码: {{form.materialCode}}</div>
            <div>物料编号: {{form.materialNumber}}</div>
          </template>
        </div>
      </div>
    </el-card>

    <!-- 工单互检信息 -->
    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <div>
          <span>工单互检信息</span>
          <template  v-if="isNumber(mutualInspection[0]?mutualInspection[0].status:'')">
            <el-tag size="mini" :type="mutualInspection[0].status | formatStatus('color')">
              {{mutualInspection[0].status | formatStatus('text')}}
            </el-tag>
          </template>
        </div>
        <span class="history" @click="handleDialogVisible('mutual')">历史检验信息</span>
        <i class="el-icon-arrow-right active" v-if="!mutualShow" @click="mutualShow = true"></i>
        <i class="el-icon-arrow-down active" v-else @click="mutualShow = false"></i>
      </div>
      <!-- <el-collapse-transition>
        <div v-show="mutualShow"> -->
          <div class="mutual-check">
            <div class="row">
              <div>互检意见： {{mutualInspection[0]?mutualInspection[0].suggestion:''}}</div>
              <div>互检人员： {{mutualInspection[0]?mutualInspection[0].addName:''}}</div>
              <div>互检时间： {{mutualInspection[0]?mutualInspection[0].addTime:'' | shorttime}}</div>
            </div>
          </div>
          <div class="images">
            <div class="title">互检图片</div>
            <div :class="['images-list',imageList.mutual.length===0?'image-none':'']">
              <template v-if="imageList.mutual.length">
                <el-image
                        v-for="(item,index) in imageList.mutual"
                        :key="index"
                        :src="item.attachmentUrl"
                        :preview-src-list="[item.attachmentUrl]"
                        style="width: 178px; height: 178px">
                </el-image>
              </template>
              <template v-else>
                <span>暂无图片</span>
              </template>
            </div>
          </div>
        <!-- </div>
      </el-collapse-transition> -->
    </el-card>

    <!-- 工单专检信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span>工单专检信息</span>
          <template  v-if="isNumber(specialInspection[0]?specialInspection[0].status:'')">
            <el-tag size="mini" :type="specialInspection[0].status | formatStatus('color')">
              {{specialInspection[0].status | formatStatus('text')}}
            </el-tag>
          </template>
        </div>
        <span class="history" @click="handleDialogVisible('special')">历史检验信息</span>
        <i class="el-icon-arrow-right active" v-if="!specialShow" @click="specialShow = true"></i>
        <i class="el-icon-arrow-down active" v-else @click="specialShow = false"></i>
      </div>
      <!-- <el-collapse-transition>
        <div v-show="specialShow"> -->
          <!-- 表格内容 -->
          <div class="row marjor-row" >
            <div>专检项目</div>
            <TableBody
              class="marjor-table"
              :colConfig="colConfig"
              :data="specialInspection[0]?specialInspection[0].inspectionItemsVoList:[]"
              style="margin-top: 16px"
            >
              <template slot="theoretical" slot-scope="{ scope }">
                <el-input
                  disabled
                  :placeholder="scope.row.theoreticalValue">
                </el-input>
              </template>
              <template slot="actual" slot-scope="{ scope }">
                <el-input 
                  disabled
                  :placeholder="scope.row.actualValue">
                </el-input>
              </template>
            </TableBody>
          </div>
          <!-- <el-divider></el-divider> -->
          <div class="row">
            <div>专检意见： {{specialInspection[0]?specialInspection[0].suggestion:''}}</div>
            <div>专检人员： {{specialInspection[0]?specialInspection[0].addName:''}}</div>
            <div>专检时间： {{specialInspection[0]?specialInspection[0].addTime:'' | shorttime}}</div>
          </div>
          <!-- 图片 -->
          <div class="images">
            <div class="title">专检图片</div>
            <div :class="['images-list',imageList.major.length===0?'image-none':'']">
              <template v-if="imageList.major.length">
                <el-image
                        v-for="(item,index) in imageList.major"
                        :key="index"
                        :src="item.attachmentUrl"
                        :preview-src-list="[item.attachmentUrl]"
                        style="width: 178px; height: 178px">
                </el-image>
              </template>
              <template v-else>
                <span>暂无图片</span>
              </template>
            </div>
          </div>
        <!-- </div>
      </el-collapse-transition> -->
    </el-card>

    <!-- 工单外部检验 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span>工单外部检验</span>
          <template  v-if="isNumber(externalInspection[0]?externalInspection[0].status:'')">
            <el-tag size="mini" :type="externalInspection[0].status | formatStatus('color')">
              {{externalInspection[0].status | formatStatus('text')}}
            </el-tag>
          </template>
        </div>
        <span class="history" @click="handleDialogVisible('external')">历史检验信息</span>
        <i class="el-icon-arrow-right active" v-if="!externalShow" @click="externalShow = true"></i>
        <i class="el-icon-arrow-down active" v-else @click="externalShow = false"></i>
      </div>
      <!-- <el-collapse-transition>
        <div v-show="externalShow"> -->
          <div class="row">
            <div>检验意见： {{externalInspection[0]?externalInspection[0].suggestion:''}}</div>
            <div>检验人员： {{externalInspection[0]?externalInspection[0].addName:''}}</div>
            <div>检验时间： {{externalInspection[0]?externalInspection[0].addTime:'' | shorttime}}</div>
          </div>
          <!-- 图片 -->
          <div class="images">
            <div class="title">专检图片</div>
            <div :class="['images-list',imageList.external.length===0?'image-none':'']">
              <template v-if="imageList.external.length">
                <el-image
                        v-for="(item,index) in imageList.external"
                        :key="index"
                        :src="item.attachmentUrl"
                        :preview-src-list="[item.attachmentUrl]"
                        style="width: 178px; height: 178px">
                </el-image>
              </template>
              <template v-else>
                <span>暂无图片</span>
              </template>
            </div>
          </div>
        <!-- </div>
      </el-collapse-transition> -->
    </el-card>

    <!-- 专检项目 暂时不用 -->
    <!-- <el-card class="box-card" v-if="checkMove!==1">
      <div slot="header" class="clearfix">
        <span>专检项目</span>
      </div>
      <div>
        <TableBody
          :colConfig="colConfig"
          :data="data"
        >
          <template slot="actual" slot-scope="{ scope }">
            <el-input v-model="input" placeholder="请输入"></el-input>
          </template>
        </TableBody>
      </div>
    </el-card> -->

    <!-- 互检/专检/监理填报 -->
    <el-card v-if="checkType==='check'" class="box-card" :body-style="{ padding: '24px 16px' }">
      <div slot="header" class="clearfix">
        <span>{{checkMove===1?'检验意见填报':checkMove===2?'专检填报':'监理填报'}}</span>
      </div>
      <TableBody
        v-if="checkMove===2"
        class="marjor-table"
        :colConfig="colConfig"
        :data="data"
      >
        <template slot="theoretical" slot-scope="{ scope }">
          <el-input v-model="scope.row.theoreticalValue" placeholder="请输入"></el-input>
        </template>
        <template slot="actual" slot-scope="{ scope }">
          <el-input v-model="scope.row.actualValue" placeholder="请输入"></el-input>
        </template>
      </TableBody>
      <!-- 单选框 -->
      <div class="radio" v-if="checkMove!==3">
        <span>{{checkMove===1?'是否是首件：':'是否需要监理校验：'}}</span>
        <el-radio-group v-model="opinion.radio">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <!-- 检验意见 -->
      <div class="opinion" :style="checkMove!==3?'':{marginTop: 0}">
        <span>{{checkMove===1?'检验意见：':checkMove===2?'专检意见：':'监理意见：'}}</span>
        <el-input
          v-model="opinion.value"
          type="text"
          placeholder="简要说明，检验意见"
        ></el-input>
      </div>
      <!-- 上传图片 -->
      <div class="images">
        <div class="title">{{checkMove===1?'互检图片':checkMove===2?'专检图片':'监理图片'}}</div>
        <UploadFile class="upload-demo"
                    :limitNum="20"
                    :uploadUrl="uploadSingleurl"
                    :listType="picturecardt"
                    @onSuccess="uploadonSuccess"
                    @handleRemove="uploadonSuccess"
        >
        </UploadFile>
      </div>
    </el-card>

    <!-- 操作 -->
    <el-row class="operation">
        <el-button v-if="checkType!=='check'" type="primary" @click="() => this.$router.back()">返回</el-button>
        <el-button v-if="checkType==='check'" @click="() => this.$router.back()">取消</el-button>
        <el-button v-if="checkType==='check'" @click="handleApprovedOrFail('fail')">退检</el-button>
        <el-button v-if="checkType==='check'" type="primary" @click="handleApprovedOrFail('approved')">检验合格</el-button>
    </el-row>

    <!-- 互检弹窗 -->
    <el-dialog :title="dialogType==='mutual'?'互检信息':'监理信息'" width="600px" :visible.sync="showMutual" >
      <qualityHistoryMutual :dialogType="dialogType" :checkData="dialogType==='mutual'?mutualInspection:externalInspection"></qualityHistoryMutual>
      <template #footer>
        <!-- <el-button size="mini" @click="handleCancel">取消</el-button> -->
        <el-button type="primary" size="mini" @click="handleCancel">确定</el-button>
      </template>
    </el-dialog>
    <!-- 专检弹窗 -->
    <el-dialog title="专检信息" width="600px" :visible.sync="showSpecial" >
      <qualityHistorySpecial :checkData="specialInspection"></qualityHistorySpecial>
      <template #footer>
        <!-- <el-button size="mini" @click="handleCancel">取消</el-button> -->
        <el-button type="primary" size="mini" @click="handleCancel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  mutualInspection,
  mutualInspectionMaterial,
  specialInspection,
  specialInspectionMaterial,
  externalInspection,
  externalInspectionMaterial,
  inspectionDetails,
  inspectionMaterialDetails
} from '@/api/productionManagement/quality.js'
import { enterpriseId, enterpriseName } from "@/assets/productionManagement/comjs/login.js";
import { uploadSingleurl } from '@/api/productionManagement/cus.js'
import { UploadFile, TableBody } from 'gggj_lib';
import qualityHistoryMutual from './quality-history-mutual.vue'
import qualityHistorySpecial from './quality-history-special.vue'
export default {
  components: {
    UploadFile,
    TableBody,
    qualityHistoryMutual,
    qualityHistorySpecial
  },
  data() {
    return {
      mutualShow: false,
      specialShow: false,
      externalShow: false,
      // 当前配置状态 例如 套料/物料/...
      configType: 'nesting',
      checkType: '', // 工单检验状态
      form: {}, // 表单信息
      checkMove: 0, // 人员类型
      uploadSingleurl, // 图片上传接口
      picturecardt: 'picture-card', // 图像展示类型
      showSpecial: false, // 模态框专检
      showMutual: false, // 模态框互检
      dialogType: '', // 模态框类型
      // 检验意见数据
      opinion: {
        radio: 1, // 单选按钮值
        value: '', // 检验意见
      },
      //  表格 字段待修改
      colConfig: [
        /* 序号 */
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
          },
        },
        {
          attrs: { label: "检验项目", prop: "inspectionItems", align: "center" },
        },
        {
          attrs: { label: "注意事项", prop: "attentionPoints", align: "center" },
        },
        {
          attrs: { label: "允许偏差", prop: "allowableDeviation", align: "center" },
        },
        {
          slot: "theoretical",
          attrs: { label: "理论值", prop: "theoreticalValue", align: "center" },
        },
        {
          slot: "actual",
          attrs: { label: "实际值", prop: "actualValue", align: "center" },
        },
      ],
      data: [
        {
          gongxu: "",
          budget: "",
          monthcost: "",
          totalcost: "",
        },
      ],
      // 图片数组
      imageList: {
        major: [],
        mutual: [],
        external: []
      },
      // 上传图片数组
      uploadImageList: [],
      // 互检信息
      mutualInspection: [],
      // 专检信息
      specialInspection: [],
      // 外部检验信息
      externalInspection: [],
    };
  },
  created() {
    if (this.$route.query.id) {
      const { checkType, configType } = this.$route.query
      this.getInspectionDetails(this.$route.query)
      this.checkType = checkType
      this.configType = configType
    }
  },
  mounted() {},
  filters: {
    // 审核状态格式化
    formatStatus(value,type) {
      if (typeof value !== 'number')
        return
      switch(value) {
        case 0: {return type==='text'?'驳回':'danger'};
        case 1: {return type==='text'?'通过':'primary'}
      }
    }
  },
  computed: {
    isNumber() {
      return (value) => {
        return typeof value === 'number'
      }
    }
  },
  methods: {
    // 查看检验详情
    async getInspectionDetails(route) {
      let res
      const { id } = route
      if (route.configType === 'nesting') {
        res = await inspectionDetails(id)
      } else {
        res = await inspectionMaterialDetails(id)
      }
      const { mutualInspectionVos, specialInspectionVos, externalInspectionVos, itemConfigurationVos } = res.data
      this.form = res.data
      this.checkMove = res.data.checkMove
      this.data = itemConfigurationVos
      this.mutualInspection = mutualInspectionVos
      this.specialInspection = specialInspectionVos
      this.externalInspection = externalInspectionVos
      // 互检图片数组
      this.mutualInspection.length!==0?
      this.imageList.mutual=this.mutualInspection[0].projectAttachmentVoList:[]
      // 专检图片数组
      this.specialInspection.length!==0?
      this.imageList.major=this.specialInspection[0].projectAttachmentVoList:[]
      // 外部检验图片数组
      this.externalInspection.length!==0?
      this.imageList.external=this.externalInspection[0].projectAttachmentVoList:[]
    },
    
    //#region 
    // 退检处理事件
    // async handleFail() {
    //   let res
    //   let configType = this.configType
    //   if (this.opinion.value === '') {
    //     this.$message.warning('请填写检验意见！')
    //     return
    //   }
    //   if (this.uploadImageList.length===0) {
    //     this.$message.warning('图片至少上传1张！')
    //     return
    //   }
    //   if (this.uploadImageList.length>20) {
    //     this.$message.warning('图片不能超过20个！')
    //     return
    //   }
    //   const payload = {
    //     enterpriseId,
    //     enterpriseName,
    //     projectAttachmentBoList: this.uploadImageList,
    //     status: 0,
    //     type: this.checkMove,
    //     isFirstPiece: this.opinion.radio,
    //     suggestion: this.opinion.value,
    //     jobWorkReportExamineId: this.form.jobWorkReportExamineId,
    //     jobWorkReportId: this.form.jobWorkReportId
    //   }
    //   switch (this.checkMove) {
    //     case 1: {
    //       if (configType === 'nesting') {
    //         res = await mutualInspection(payload)
    //       } else {
    //         res = await mutualInspectionMaterial(payload)
    //       }
          
    //     };break;
    //     case 2: {
    //       payload.specialInspectionItemsBoList = this.data
    //       if (configType === 'nesting') {
    //         res = await specialInspection(payload)
    //       } else {
    //         res = await specialInspectionMaterial(payload)
    //       }
          
    //     };break;
    //     case 3: {
    //       if (configType === 'nesting') {
    //         res = await externalInspection(payload)
    //       } else {
    //         res = await externalInspectionMaterial(payload)
    //       }
          
    //     };break;
    //   }
    //   res.code === 0 && this.$message.success('退检成功')
    //   res.code === 0 && this.$router.back()
    // },
    // 检验通过事件
    // async handleApproved() {
    //   let res
    //   let configType = this.configType
    //   if (this.opinion.value === '') {
    //     this.$message.warning('请填写检验意见！')
    //     return
    //   }
    //   if (this.uploadImageList.length===0) {
    //     this.$message.warning('图片至少上传1张！')
    //     return
    //   }
    //   if (this.uploadImageList.length>20) {
    //     this.$message.warning('图片不能超过20个！')
    //     return
    //   }
    //   const payload = {
    //     enterpriseId,
    //     enterpriseName,
    //     projectAttachmentBoList: this.uploadImageList,
    //     status: 1,
    //     type: this.checkMove,
    //     suggestion: this.opinion.value,
    //     jobWorkReportExamineId: this.form.jobWorkReportExamineId,
    //     jobWorkReportId: this.form.jobWorkReportId
    //   }
    //   switch (this.checkMove) {
    //     case 1: {
    //       payload.isFirstPiece = this.opinion.radio
    //       if (configType === 'nesting') {
    //         res = await mutualInspection(payload)
    //       } else {
    //         res = await mutualInspectionMaterial(payload)
    //       }
          
    //     };break;
    //     case 2: {
    //       payload.isSupervisorExamine = this.opinion.radio
    //       payload.specialInspectionItemsBoList = this.data
    //       if (configType === 'nesting') {
    //         res = await specialInspection(payload)
    //       } else {
    //         res = await specialInspectionMaterial(payload)
    //       }
          
    //     };break;
    //     case 3: {
    //       payload.isSupervisorExamine = this.opinion.radio
    //       if (configType === 'nesting') {
    //         res = await externalInspection(payload)
    //       } else {
    //         res = await externalInspectionMaterial(payload)
    //       }
          
    //     };break;
    //   }
    //   res.code === 0 && this.$message.success('检验成功')
    //   res.code === 0 && this.$router.back()
    // },
    //#endregion

    // 退检/通过 事件
    async handleApprovedOrFail(inspectionType) {
      let res
      let configType = this.configType
      if (this.opinion.value === '') {
        this.$message.warning('请填写检验意见！')
        return
      }
      if (this.uploadImageList.length===0) {
        this.$message.warning('图片至少上传1张！')
        return
      }
      if (this.uploadImageList.length>20) {
        this.$message.warning('图片不能超过20个！')
        return
      }
      const payload = {
        enterpriseId,
        enterpriseName,
        projectAttachmentBoList: this.uploadImageList,
        status: inspectionType === 'approved'? 1 : 0,
        type: this.checkMove,
        suggestion: this.opinion.value,
        jobWorkReportExamineId: this.form.jobWorkReportExamineId,
        jobWorkReportId: this.form.jobWorkReportId
      }
      if (inspectionType === 'fail')
        payload.isFirstPiece = this.opinion.radio
      switch (this.checkMove) {
        case 1: {
          inspectionType === 'approved' && (payload.isFirstPiece = this.opinion.radio)
          if (configType === 'nesting') {
            res = await mutualInspection(payload)
          } else {
            res = await mutualInspectionMaterial(payload)
          }
          
        };break;
        case 2: {
          inspectionType === 'approved' && (payload.isSupervisorExamine = this.opinion.radio)
          payload.specialInspectionItemsBoList = this.data
          if (configType === 'nesting') {
            res = await specialInspection(payload)
          } else {
            res = await specialInspectionMaterial(payload)
          }
          
        };break;
        case 3: {
          inspectionType === 'approved' && (payload.isSupervisorExamine = this.opinion.radio)
          if (configType === 'nesting') {
            res = await externalInspection(payload)
          } else {
            res = await externalInspectionMaterial(payload)
          }
          
        };break;
      }
      if (res.code === 0) {
        this.$message.success(`${inspectionType === 'approved'?'检验成功':'退检成功'}`) 
        this.$router.back()
      }
    },
    // 上传图片接收上传组件传来的url list
    uploadonSuccess(file,list,sendfile) { // sendfile是最终的url list
      this.uploadImageList = sendfile.map(item => {
        return {
          attachmentUrl: item
        }
      })
    },
    // 模态框展示
    handleDialogVisible(type) {
      switch(type) {
        case 'special': {
          this.dialogType = 'special'
          this.showSpecial = true
        };break;
        case 'mutual': {
          this.dialogType = 'mutual'
          this.showMutual = true
        };break;
        case 'external': {
          this.dialogType = 'external'
          this.showMutual = true
        };break
      }
    },
    // 模态框取消
    handleCancel() {
      this.showSpecial = false
      this.showMutual = false
    }
  },
};
</script>



<style lang="scss" scoped>
#qualityindex {
  .box-card {
    font-size: 14px;
    margin-bottom: 26px;
    .active:hover {
      color: #409EFF;
      cursor: pointer;
    }
    &:last-child {
      padding-bottom: 48px;
    }
    .row {
      display: flex;
      div {
        width: 33%;
      }
    }
    .marjor-row {
      display: flex;
      flex-direction: column;
      >div {
        width: 100%;
        .el-input {
          width: 100%;
        }
      }
    }
    // 表格样式
    .marjor-table {
      margin-bottom: 16px;
    }
    // 卡片头部样式
    .clearfix {
      display: flex;
      align-items: center;
      div {
        flex: 1;
      }
      span {
        margin-right: 8px;
      }
      .history {
        text-align: right;
        color: #1989FA;
        cursor: pointer;
        align-self: center;
      }
    }
    // 基础信息
    .basic-info {
      display: flex;
      flex-direction: column;
      .row {
        display: flex;
        &:last-child {
          margin-top: 24px;
        }
        div {
          flex: 1;
        }
      }
    }
    // 卡片头部插槽
    ::v-deep .el-card__header {
      padding: 16px;
      .clearfix {
        span {
          font-weight: 600;
        }
      }
    }
    // 单选
    .radio {
      span {
        margin-right: 24px;
      }
    }
    // 检验意见
    .opinion {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 32px;
      margin-top: 24px;
      ::v-deep .el-input {
        width: 500px;
        margin-left: 8px;
        input {
          height: 32px;
        }

      }
    }
    // 图像
    .images {
      margin-top: 24px;
      border: 1px solid #EBEEF5;
      border-radius: 4px;
      .el-image {
        margin-right: 20px;
      }
      .title {
        padding: 0 16px;
        height: 40px;
        line-height: 40px;
        background-color: #F8F8F8;
      }
      .upload-demo, .images-list {
        margin: 24px 16px;
      }
      .image-none {
        text-align: center;
      }
    }
  }
  // 模态框
  ::v-deep .el-dialog {
    .el-dialog__header {
      padding-left: 16px;
      border-bottom: 1px solid #E4E7ED;
    }
    .el-dialog__body {
      padding: 12px 16px;
      .footer {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  // 底部操作
  .operation {
    display: flex;
    padding: 8px 16px;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 48px;
    box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
    background: #fff;
    z-index: 999;
    button {
      display: flex;
      align-items: center;
      height: 32px;
    }
  }
}
</style>
