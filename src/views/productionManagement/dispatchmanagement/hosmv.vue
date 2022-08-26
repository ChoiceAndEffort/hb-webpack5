<template>
  <div class="hosmv_box">
    <div>
      <el-card class="box-card">
        <div slot="header" class="header_box">
          <div class="title">工单基础信息</div>
        </div>
        <div class="option" v-if="$route.query.id">
          <div>
            <div>项目名称：{{ workorderDetails.engineeringProjectName }}</div>
            <div>工艺：{{ workorderDetails.processName }}</div>
            <div>派单时间：{{ workorderDetails.dispatchDate | shorttime }}</div>
          </div>
          <div>
            <div>联段：{{ workorderDetails.couplingName }}</div>
            <div v-if="workorderDetails.partNumber!=null">编号：{{ workorderDetails.partNumber }}</div>
            <div v-else>图纸名称（页码）：{{ workorderDetails.nestingName }}（{{ workorderDetails.nestingPage }}）</div>
            <div>计划完成时间：{{ workorderDetails.plannedTime | shorttime }}</div>
          </div>
          <div>
            <div>工序：{{ workorderDetails.procedureName }}</div>
            <div>实际完成时间：{{ workorderDetails.completedTime | shorttime }}</div>
          </div>
        </div>
          <div class="option" v-else>
              <div>
                  <div>项目名称：{{ workorderDetails.engineeringProjectName }}</div>
                  <div>工艺：{{ workorderDetails.processName }}</div>
                  <div>物料材质：{{ workorderDetails.materialQuality }}</div>
                  <div>派单时间：{{ workorderDetails.dispatchDate | shorttime }}</div>
              </div>
              <div>
                  <div>联段：{{ workorderDetails.couplingName }}</div>
                  <div>物料编码：{{ workorderDetails.materialCode }}</div>
                  <div>物料数量：{{ workorderDetails.materialAmount }}</div>
                  <div>计划完成时间：{{ workorderDetails.plannedTime | shorttime }}</div>
              </div>
              <div>
                  <div>工序：{{ workorderDetails.procedureName }}</div>
                  <div>物料编号：{{ workorderDetails.materialNumber }}</div>
                  <div>物料重量(千克)：{{ workorderDetails.materialWeight }}</div>
                  <div>实际完成时间：{{ workorderDetails.completedTime | shorttime }}</div>
              </div>
          </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="header_box">
          <div class="title">工单定额信息</div>
        </div>
        <div class="option">
          <div>
            <div>工单定额(元)：{{workorderDetails.quota}}</div>
<!--            <div class="plope">生效质量奖(元)：{{workorderDetails.qualityRewardValid}}</div>-->
          </div>
          <div>
            <div>质量奖励(元)：{{workorderDetails.qualityReward}}</div>
<!--            <div class="plope">生效进度奖(元)：{{workorderDetails.progressRewardValid}}</div>-->
          </div>
          <div>
            <div>进度奖励(元)：{{workorderDetails.progressReward}}</div>
          </div>
        </div>
          <div class="quota_box">
              <p>定额分配信息：</p>
              <TableBody :colConfig="quotaColConfig" :data="jobWorkCooperationStaffVos">
              </TableBody>
          </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="header_box">
          <div class="title">工单检验信息</div>
        </div>
        <div class="option">
          <div>
            <div>报工人：{{workorderDetails.jobWorkReportName}}</div>
              <div>
                  专检退检次数：
                  <span class="pre"> {{workorderDetails.specialBack}}</span>&nbsp&nbsp
                  <a  class="pra"  @click="getdetailedInf(2)"  style="cursor: pointer">查看专检信息</a>
              </div>
          </div>
          <div>
            <div>报工时间：{{workorderDetails.reportTime}}</div>
            <div>外部检验退检次数：
              <span class="pre"> {{workorderDetails.externalBack}}</span>&nbsp&nbsp
              <a class="pra"  @click="getdetailedInf(3)"  style="cursor: pointer">查看安全检验信息</a>
            </div>
          </div>
          <div>
            <div>互检退检次数：
                <span class="pre"> {{workorderDetails.mutualBack}}</span>&nbsp&nbsp
                <a class="pra"  @click="getdetailedInf(1)"  style="cursor: pointer">查看互检信息</a>
            </div>
          </div>
        </div>
      </el-card>
        <bottomFooter :isReturn="true"></bottomFooter>
    </div>
      <!-- 互检弹窗 -->
      <el-dialog :title="dialogType==='mutual'?'互检信息':'安全检验信息'" width="600px" :visible.sync="showMutual" >
          <qualityHistoryMutual :dialogType="dialogType" :checkData="dialogType==='mutual'?mutualInspection:externalInspection"></qualityHistoryMutual>
          <template #footer>
              <el-button type="primary" size="mini" @click="handleCancel">返回</el-button>
          </template>
      </el-dialog>
      <!-- 专检弹窗 -->
      <el-dialog title="专检信息" width="600px" :visible.sync="showSpecial" >
          <qualityHistorySpecial :checkData="specialInspection"></qualityHistorySpecial>
          <template #footer>
              <el-button type="primary" size="mini" @click="handleCancel">返回</el-button>
          </template>
      </el-dialog>
  </div>
</template>
<script>
import {
    getCompletedOrderDetail, getmaterialCompletedOrderDetail, getExamineHistory
} from '@/api/productionManagement/dispatch.js'
import { TableBody } from "gggj_lib";
import qualityHistoryMutual from '../qualitymanagement/quality-history-mutual.vue'
import qualityHistorySpecial from '../qualitymanagement/quality-history-special.vue'
import bottomFooter from '../components/bottomFooter.vue'
export default {
  components: { qualityHistoryMutual, qualityHistorySpecial,bottomFooter,TableBody },
  data() {
    return {
      // 点击打开模态框
        showMutual: false,
        showSpecial: false,
        dialogType: '', // 模态框类型
        // 互检信息
        mutualInspection: [],
        // 专检信息
        specialInspection: [],
        // 外部检验信息
        externalInspection: [],
      /* 后端数据可以在此接收 */
        workorderDetails: {
            gongxu: "武汉南湖路",
            budget: "0",
            monthcost: "0",
            totalcost: "数控划线",
            differencecost: "L1-1A",
            progreward: "118m²",
            progressreward: "2021.12.22",
            qualityreward: "2021.12.22",
            qualityreflex: "2021.12.26",
      },
        quotaColConfig: [
            /* 序号 */
            {
                attrs: {
                    label: "序号",
                    prop: "index",
                    align: "center",
                    type: "index",
                    width: "50"
                },
            },
            {
                attrs: { label: "姓名", prop: "staffName", align: "center" },
            },
            {
                attrs: { label: "工单金额（元）", prop: "distributionAmount", align: "center" },
            },
            {
                attrs: { label: "质量奖（元）", prop: "qualityRewardValid", align: "center" },
            },
            {
                attrs: { label: "进度奖（元）", prop: "progressRewardValid", align: "center" },
            },
        ],
        jobWorkCooperationStaffVos: []
    };
  },
    created() {
        this.getPagelist()
    },
    methods: {
      getPagelist() {
          const sendData = this.$route.query.id?{
              jobOrderDetailedId: this.$route.query.id
          }:{
              materialOrderDetailedId: this.$route.query.materialOrderDetailedId
          }
          const resultData = this.$route.query.id?getCompletedOrderDetail(sendData):getmaterialCompletedOrderDetail(sendData)
          resultData.then(res => {
              this.workorderDetails = res.data
              this.$set(this,'jobWorkCooperationStaffVos',[...this.workorderDetails.jobWorkCooperationStaffVos])
          })
      },
        getdetailedInf(sign) {
          const sendData = {
              jobWorkReportId: this.$route.query.id ? this.workorderDetails.jobWorkReportId : this.workorderDetails.materialWorkReportId,
              type: sign
          }
          sign==1? this.dialogType = 'mutual' : sign==3? this.dialogType = 'external' : this.dialogType = 'special'
          sign==1 || sign==3? this.showMutual = true : this.showSpecial = true
            getExamineHistory(sendData).then(res => {
                sign==1? this.$set(this,'mutualInspection', res.data) : sign==2? this.$set(this, 'specialInspection', res.data) : this.$set(this, 'externalInspection', res.data)
            })
        },
        handleCancel() {
          this.showMutual = false
          this.showSpecial = false
        },
    },
};
</script>

<style scoped lang="scss">
.hosmv_box{
    .header_box{
        .title{
            font-size: 14px;
            font-weight: bold;
        }
    }
    .quota_box{
        padding: 25px 0;
        p{
            font-size: 14px;
            margin-bottom: 16px;
        }
    }
}
.box-card+.box-card {
  margin-top: 10px;
}
.option {
  display: flex;
}
.option > div {
  flex: 1;
}
.option > div > div{
    font-size: 14px;
    color: #606266;
}
.option > div > div+div {
  margin-top: 24px;
}
.pra {
  color: #1989fa;
  text-decoration: none;
}
.pre {
  color: red;
}
.title {
  color: #000;
}
.ios_opi {
  display: flex;
}
.ios_opi > div {
  flex: 1;
}
.ios_pos > div {
  margin-top: 20px;
}
.ios_vop {
  display: flex;
}
img {
  width: 300px;
  height: 100px;
  background-color: pink;
}
.plope {
  color: #6fb5fc;
}
.moter {
  display: flex;
  justify-content: flex-end;
}
</style>
