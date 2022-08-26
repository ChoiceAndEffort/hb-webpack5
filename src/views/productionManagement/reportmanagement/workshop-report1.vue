<template>
  <div class="wrap">
    <search
      ref="search"
      :renderData="prefabricationData"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"
    >
    </search>
    <div class="content">
      <el-row type="flex">
        <el-col>
          <p>半月度人均产量</p>
          <p>
            <span>{{StatisData.halfProd}}</span>
            <span>吨</span>
          </p>
        </el-col>
        <el-col>
          <p>半月度人均产值</p>
          <p>
            <span>{{StatisData.halfValue}}</span>
            <span>元</span>
          </p>
        </el-col>
        <el-col>
          <p>累计完成产量(下半月)</p>
          <p>
            <span>{{StatisData.totalProd}}</span>
            <span>吨</span>
          </p>
        </el-col>
        <el-col>
          <p>实际完成产量与计划差异(下半月)</p>
          <p>
            <span :class="[StatisData.halfDiff < 0 ? 'red': '']">{{StatisData.halfDiff}}</span>
            <span>吨</span>
          </p>
        </el-col>
        <el-col>
          <p>当日完成与日计划产量差异</p>
          <p>
            <span :class="[StatisData.dayDiff < 0 ? 'red': '']">{{StatisData.dayDiff}}</span>
            <span>吨</span>
          </p>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col class="workshop" :xl="{ span: 18 }">
          <div class="header">
            <p>车间管理工作</p>
          </div>
          <TableBody
            class="workshop-table"
            :data="workshopData.data"
            :colConfig="workshopConfig"
          >
          </TableBody>
          <Pagination :data="workshopData"></Pagination>
        </el-col>
        <el-col :xl="{ span: 6 }">
          <chart-view
            v-if="chartOptionsBar"
            class="echart-wrap"
            :chartOption="chartOptionsBar"
          >
          </chart-view>
        </el-col>        
      </el-row>
      <el-row type="flex">
        <el-col class="device" :xl="{ span: 18 }">
          <div class="header">
            <p>{{procedure?'统计类型/完成量':'设备管理'}}</p>
            <template v-if="procedure == 0">
              <el-radio-group v-model="activeDevice" @change="handleDeviceChange">
                <el-radio-button :label="0">下料设备</el-radio-button>
                <el-radio-button :label="1">机加设备</el-radio-button>
              </el-radio-group>
            </template>
          </div>
          <TableBody
            class="device-table"
            :data="deviceData.data"
            :colConfig="deviceConfig"
          >
          </TableBody>
          <Pagination :data="deviceData"></Pagination>
        </el-col>
        <el-col :xl="{ span: 6 }">
          <chart-view
            v-if="chartOptionsProd"
            class="echart-wrap"
            :chartOption="chartOptionsProd"
          >
          </chart-view>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :xl="{ span: 24 }">
          <div class="header">
            <p>{{procedure?'车间问题汇总':'车间问题管理'}}</p>
          </div>
          <TableBody :data="troubleData.data" :colConfig="troubleConfig">
          </TableBody>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :xl="{ span: 24 }">
          <div class="header">
            <p>点评</p>
          </div>
          <TableBody :data="commentData.data" :colConfig="commentConfig">
          </TableBody>
          <Pagination :data="commentData"></Pagination>
        </el-col>
      </el-row>

      <div class="footer">
        <el-input placeholder="请输入点评"></el-input>
        <el-button type="primary">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import search from "../components/search.vue";
import { TableBody, Pagination } from "gggj_lib";
import { mockXL, mockZz} from '@/utils/productionManagement/mock'
export default {
  components: { search, TableBody, Pagination },
  data() {
    return {
      chartOptionsProd: null,
      chartOptionsBar: null,
      // 工序状态
      procedure: 0,
      // 设备状态
      activeDevice: 0,
      // 当前选择时间
      currentTime: '2022-02-21',
      // 统计数据
      StatisData: {},
      // 搜索框渲染数据
      prefabricationData: [
        {
          tag: "el-cascader",
          label: "项目工序",
          attrs: {
            ref: "selectProcedure",
            key: "procedureIds",
            keys: 0,
            options: [
              {
                name: "下料",
                projectWorkingProcedureId: 0,
              },
              {
                name: "总装",
                projectWorkingProcedureId: 1,
              },
            ],
            props: {
              value: "projectWorkingProcedureId",
              label: "name",
              children: "children",
              expandTrigger: "hover",
            },
            clearable: true,
            placeholder: "请选择工序",
            value: [
              0
            ]
          },
          listeners: {
            change: this.handleProcedureConfirm,
          },
        },
        {
          tag: "el-date-picker",
          label: "时间",
          attrs: {
            key: "pickervalue",
            type: "date",
            placeholder: "选择日期",
            "value-format": "yyyy-MM-dd",
            "picker-options": {
              disabledDate: this.handleDisabledDate,
            },
            value: '2022-02-21'
          },
          listeners: {
            change: this.handleTimeChange,
          },
        },
      ],
      // 车间管理工作表格配置
      workshopConfig: [
        { attrs: { label: "当前车间管理工作",'min-width': "30%", prop: "work", align: "left" } },
        { attrs: { label: "重点事项描述",'min-width': "40%", prop: "desc", align: "left" } },
        { attrs: { label: "解决措施/结果",'min-width': "30%", prop: "result", align: "left" } },
      ],
      // 车间管理工作假数据
      workshopData: {
        data: [],
        total: 0
      },
      // 设备管理表格配置
      deviceConfig: [
        { attrs: { label: "设备",'min-width': "15%", prop: "name", align: "left" } },
        {
          attrs: {
            label: "日单机产量(吨)",
            'min-width': "15%",
            prop: "machineprod",
            align: "right",
          },
        },
        { attrs: { label: "直接生产工人",'min-width': "12.5%", prop: "person", align: "right", } },
        {
          attrs: {
            label: "日人均产量(吨)",
            'min-width': "15%",
            prop: "personprod",
            align: "right",
          },
        },
        {
          attrs: {
            label: "日人均产值(元)",
            'min-width': "15%",
            prop: "personvalue",
            align: "right",
          },
        },
      ],
      // 设备管理假数据
      deviceData: {
        data: [],
        total: 0
      },
      // 问题整理表格配置
      troubleConfigTotal: [
        { attrs: { label: "项目名称",'min-width': "20%", prop: "name", align: "left" } },
        { attrs: { label: "施工单位",'min-width': "20%", prop: "construction", align: "left" } },
        { attrs: {label: "半月计划(吨/个)",'min-width': "20%",prop: "halfplan", align: "right",}, },
        { attrs: { label: "下半月计划完成率(%)",'min-width': "20%", prop: "ratio", align: "right" }, },
        { attrs: { label: "问题描述",'min-width': "40%", prop: "trouble", align: "left" } },
        { attrs: {label: "总产量(吨)",'min-width': "20%",prop: "total", align: "right",}, },
        { attrs: { label: "下半月计划",'min-width': "20%", prop: "halfplan", align: "right" }, },
        { attrs: { label: "下半月累计完成",'min-width': "20%", prop: "finish",align: "right" } },
        { attrs: {label: "下半月计划完成率(%)",'min-width': "20%",prop: "halfplan", align: "right",}, },
        { attrs: { label: "计划派工总金额(元)",'min-width': "20%", prop: "planCash", align: "right" }, },
        { attrs: { label: "今日派工金额(元)",'min-width': "20%", prop: "dayCash",align: "right" } },
      ],
      troubleConfig: [],
      // 问题整理假数据
      troubleData: {
        total: 0
      },
      // 点评
      commentConfig: [
        { attrs: { label: "点评人","min-width": "20%", prop: "name", align: "left" } },
        { attrs: { label: "职位","min-width": "20%", prop: "position", align: "left" } },
        { attrs: {label: "点评时间","min-width": "20%",prop: "comDate", align: "left",}, },
        { attrs: { label: "点评内容", "min-width": "55%", prop: "comContent","header-align": "left", align: "left" } }, 
      ],
      // 点评假数据
      commentData: {
        data: [],
        total: 0
      }
    };
  },
  mounted() {
    
    const searchComp = this.$refs["search"]
    this.procedure = searchComp.formData.procedureIds[0]
    this.handleData(0,"2022-02-21")
  },
  methods: {
    // 赋值数据
    handleData(type, date) {
      let temp
      if (type == 0) {
        if (date == "2022-02-21") {
          temp  = mockXL[0]
        } else if (date == "2022-02-22") {
          temp  = mockXL[1]
        }
      } else if (type == 1) {
        if (date == "2022-02-21") {
          temp  = mockZz[0]
        } else if (date == "2022-02-22") {
          temp  = mockZz[1]
        }
      }
      const tempConfig = JSON.parse(JSON.stringify(this.troubleConfigTotal))
      const { workshopF, troubleF, commentF, xlF, jjF, zzF, statisF} = temp
      const {halfPlan, dayPlan, dayCount} = statisF
      this.workshopData.data = workshopF
      this.workshopData.total = workshopF.length
      this.troubleData.data = troubleF
      this.troubleData.total = troubleF.length
      type == 0 ? tempConfig.splice(5) : tempConfig.splice(2,3)
      this.troubleConfig = tempConfig
      this.commentData.data = commentF
      this.commentData.total = commentF.length
      type == 0 ? 
        this.activeDevice == 0 ? 
          this.deviceData.data = xlF : this.deviceData.data = jjF
          : this.deviceData.data = zzF
      this.deviceData.total = this.deviceData.data.length
      this.StatisData = statisF

      this.chartOptionsProd = this.$echartFn.getProd({
        halfPlan,
        dayPlan,
        dayCount
      });
      this.chartOptionsBar = this.$echartFn.getBar({
      series: [
        {
          type: 'bar',
          data: [statisF.pers1, statisF.pers2, statisF.pers3],
          name: '实际出勤人数',
          tooltip: {
            position: 'top',
          }
        },
        {
          type: 'bar',
          data: [statisF.per1, statisF.pers2, statisF.per3],
          name: '应出勤人数',
          tooltip: {
            position: 'top',
          }
        }
      ]
    })
    },
    handleSubmit(data) {
      if (!data.pickervalue) {
        this.$message.warning('请选择时间！')
      }
      if (!data.procedureIds) {
        this.$message.warning('请选择工序！')
      }
      this.handleData(data.procedureIds[0], data.pickervalue)
    },
    handleReset() {
      this.handleClear();
    },
    // 工序拉下事件
    handleProcedureConfirm(item) {
      if (!item.length) {
        this.handleClear();
        return;
      }
      this.procedure = item[0]
    },
    // 禁用时间
    handleDisabledDate(time) {
      return time.getTime() !== new Date('2022/2/21').getTime() && time.getTime() !== new Date('2022/2/22').getTime()
    },
    // 时间选择时间
    handleTimeChange(time) {
      this.currentTime = time
    },
    // 清空事件
    handleClear(type) {
      const searchComp = this.$refs["search"];
      searchComp.formData.pickervalue = "";
      searchComp.formData.procedureIds = "";
    },
    // 设备切换
    handleDeviceChange(item) {
      this.handleData(this.procedure,this.currentTime)
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  position: relative;
  top: 0;
  left: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  ::v-deep .content {
    flex: 1;
    th,td {
      padding: 16px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    > .el-row {
      width: 100%;
      margin-bottom: 16px;
      > .el-col {
        padding: 16px;
        margin-right: 16px;
        background-color: #fff;
      }
      .device {
        display: flex;
        flex-direction: column;
        .device-table {
          flex: 1;
        }
      }
      .el-col:last-child {
        margin-right: 0;
      }
    }
    > .el-row:first-child {
      width: 100%;
      > .el-col {
        flex: 1;
        padding: 16px;
        margin-right: 0;
        background-color: #fff;
        border-right: 1px solid #EBEEF5;
        p:first-child {
          margin-bottom: 16px;
        }
        p:nth-child(2) {
          span:first-child {
            font-size: 22px;
            font-weight: bold;
          }
          span:nth-child(2) {
            margin-left: 15px;
          }
        }
      }
      .el-col:last-child {
        border: none;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 8px 16px;
    box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
    z-index: 999;
    .el-input {
      margin-right: 32px;
    }
  }
}
.red {
  color: #FA5555;
}
</style>
