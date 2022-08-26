<template>
  <div class="wrap">
    <el-row>
      <el-col :span="21">
        <el-cascader v-model="value"
          :options="factoryOptions"
          placeholder="请选择厂区"
          class="inputBox">
        </el-cascader>
        <el-date-picker v-model="currentDate"
          type="date"
          placeholder="选择日期"
          class="inputBox"
          @change="changeDate">
        </el-date-picker>
        <el-button type="primary"
          @click="searchBtn">确定</el-button>
      </el-col>
      <el-col :span="3">
        <el-radio-group v-model="radioCheck"
          @change="selectTable"
          size="small">
          <el-radio-button label="图形表">
            <img :src="require(`@/assets/productionManagement/icon/${radioCheck == '图形表' ? 'graph1' : 'graph'}.png`)"
              alt="graph"
              class="graphImg" />
          </el-radio-button>
          <el-radio-button label="报表">
            <img :src="require(`@/assets/productionManagement/icon/${ radioCheck == '图形表' ? 'report1' : 'report'}.png`)"
              alt="report"
              class="reportImg" />
          </el-radio-button>
        </el-radio-group>
        <el-button type="primary"
          class="derive"
          v-show="radioCheck == '报表'"
          @click="exportExel">导出</el-button>
      </el-col>
    </el-row>
    <div v-show="radioCheck == '图形表'">
      <el-row :gutter="16">
        <el-col :span="8">
          <div class="box part1">
            <el-empty description="暂无数据"
              v-if="outputPerCapita"
              :image-size="100"></el-empty>
            <div v-else>
              <div class="title">{{outputPerCapita.pathName}}</div>
              <div class="subhead">人均产量(吨)</div>
              <div class="content">
                <span class="num">{{outputPerCapita.averageWorkload}}</span><span>同比</span><span class="toFall"><img src="@/assets/productionManagement/icon/top.png"
                    alt="" />{{outputPerCapita.comparedAverageWorkload}}</span>
              </div>
              <div class="subhead">人均产值(元)</div>
              <div class="content">
                <span class="num">{{outputPerCapita.averageAmount}}</span><span>同比</span>
                <span class="goUp"><img src="@/assets/productionManagement/icon/bottom.png"
                    alt="" /> {{outputPerCapita.comparedAverageAmount}}</span>
              </div>
            </div>

          </div>
        </el-col>
        <el-col :span="16">
          <div class="box part2">
            <div class="title">车间评论</div>
            <div class="project">
              <el-select v-model="projectValue"
                placeholder="请选择项目">
                <el-option v-for="item in projectOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <el-empty description="暂无数据"
              :image-size="75"></el-empty>
            <!-- <ul>
              <li>
                <div>
                  <el-row>
                    <el-col :span="5" class="information">
                      <img
                        src="../../assets/img/index/index13.png"
                        alt=""
                        class="avatar"
                      />
                      <div class="name">
                        <div>何蒙</div>
                        <div>2021-03-11</div>
                      </div>
                    </el-col>
                    <el-col :span="10" style="color: #909399; font-size: 12px"
                      >下料间 车间主任</el-col
                    >
                    <el-col
                      :span="9"
                      style="text-align: right; font-weight: 600"
                      >徐州南三环项目</el-col
                    >
                  </el-row>
                </div>
                <div>
                  车间当日计划正常,1:1号划线机控制盒不工作导致不出墨,目前影响生产,已联系厂家尽快维修购买噢
                </div>
              </li>
              <li>
                <div>
                  <el-row>
                    <el-col :span="5" class="information">
                      <img
                        src="../../assets/img/index/index13.png"
                        alt=""
                        class="avatar"
                      />
                      <div class="name">
                        <div>何蒙</div>
                        <div>2021-03-11</div>
                      </div>
                    </el-col>
                    <el-col :span="10" style="color: #909399; font-size: 12px"
                      >下料间 车间主任</el-col
                    >
                    <el-col
                      :span="9"
                      style="text-align: right; font-weight: 600"
                      >徐州南三环项目</el-col
                    >
                  </el-row>
                </div>
                <div>
                  下料车间中开高速项目下料进度正14#15#钢盖梁已经开始下料
                </div>
              </li>
            </ul> -->
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="14">
          <div class="box part3">
            <div class="title">工序效能</div>
            <el-table :data="tableData"
              style="width: 100%"
              maxHeight="420">
              <el-table-column prop="process"
                label="工序"
                width="100"></el-table-column>
              <el-table-column prop="craft"
                label="工艺"
                width="100">
              </el-table-column>
              <el-table-column label="计划工作量">
                <el-table-column prop="quality"
                  label="物量"> </el-table-column>
                <el-table-column prop="weight"
                  label="重量"
                  width="120"></el-table-column>
              </el-table-column>
              <el-table-column prop="direct"
                label="直接生产工人"
                align="right"
                width="150">
              </el-table-column>
              <el-table-column prop="outputValue"
                label="人均产值"
                width="150"
                align="right">
              </el-table-column>
              <el-table-column prop="output"
                label="人均产量"
                width="150"
                align="right">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="box part3 part4">
            <div class="title">生产工人排行</div>
            <el-table :data="rankingData"
              height="430"
              style="width: 100%"
              class="ranking"
              header-row-class-name="tableTitle">
              <el-table-column label=""
                algin="center"
                width="50">
                <template slot-scope="scope"><span :class="`${
                      scope.$index + 1 < 4 ? 'serial serial1' : 'serial'
                    }`">{{ scope.$index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="staffName"
                label="姓名"
                width="200">
              </el-table-column>
              <el-table-column prop="distributionAmount"
                label="报工金额(元)">
              </el-table-column>
              <el-table-column prop="qualityRewardValid"
                label="质量奖(元)">
              </el-table-column>
              <el-table-column prop="progressRewardValid"
                label="进度奖(元)">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="14">
          <div class="box part3">
            <el-radio-group v-model="chartCheck"
              size="medium"
              class="btn"
              @change="chosenComparison">
              <el-radio-button label="派工对比"></el-radio-button>
              <el-radio-button label="成本对比"></el-radio-button>
            </el-radio-group>
            <div id="chart1"
              class="box chart1"></div>
            <!-- <div id="chart1" class="box chart1" v-show="chartCheck=='成本对比'"></div> -->
          </div>
        </el-col>
        <el-col :span="10">
          <div class="box part3"
            id="chart2"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="box part5">
            <div id="chart3"></div>
            <div></div>
            <div id="chart4">1</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="box part3">
            <div class="title">
              产量趋势
              <el-cascader v-model="processValue"
                :options="processOptions"
                @change="handleTrend"
                style="float:right"
                placeholder="请选择工序"
                :props="{ multiple: true }"
                collapse-tags
                clearable></el-cascader>
            </div>
            <div id="chart5"
              style="height:500px"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="radioCheck == '报表'">
      <workshopTable :currentDate="currentDate"
        :departmentId="shopId"
        ref="reportForms"></workshopTable>
      <!-- <iframe src="https://bi.aliyun.com/token3rd/dashboard/view/pc.htm?pageId=f02ce7fc-0983-4fd0-8f3a-89fb90d75856&accessTicket=cad5bf1d-d47d-4194-9ad3-ec8b7984ff51" height="1920" width="100%" name="demo" frameborder="0" scrolling="auto" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"  ></iframe> -->
    </div>
  </div>
</template>
<script>
import workshopTable from "./workshop-table.vue";
import * as echarts from "echarts";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import { getEngineeringProjectList, getWorkingProcedureList } from "@/api/productionManagement/project.js";
import { timeFormat, shortTime } from '@/utils/productionManagement/tool.js'
import { getPmsGdProjectStaffingCostPage, getPmsGdAttendanceSituation, getPmsGdPerCapitaOutputPage, getWorkAttendanceOrder, getGoalsPerCapacity } from '@/api/productionManagement/project'
import { workshopReport } from '@/utils/productionManagement/echartsOptions'
export default {
  components: { workshopTable },
  data() {
    return {
      shopId: '',
      options: [
        {
          value: "zhinan",
          label: "江夏厂区",
          children: [
            {
              value: "shejiyuanze",
              label: "下料车间",
            },
            {
              value: "daohang",
              label: "机加车间",
            },
            {
              value: "danyuan",
              label: "单元件车间",
            },
            {
              value: "zongzhuang",
              label: "总装车间",
            },
          ],
        },
        {
          value: "zujian",
          label: "江夏厂区",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "下料车间",
                },
                {
                  value: "color",
                  label: "机加车间",
                },
                {
                  value: "typography",
                  label: "单元件车间",
                },
                {
                  value: "icon",
                  label: "总装车间",
                },
              ],
            },
          ],
        },
      ],
      factoryOptions: [],
      value: "",
      currentDate: new Date(),
      radioCheck: "图形表",
      chartCheck: "派工对比",
      tableData: [
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
        {
          process: "下料",
          craft: "划线",
          quality: "100米",
          weight: "200吨",
          direct: 5,
          outputValue: 5,
          output: 2400,
        },
      ],
      rankingData: [],
      chartOptionsProd: "",
      projectOption: [],
      projectValue: "",
      processOptions: [],
      costData: [],//成本对比数据
      dispatching: [],//派工对比数据
      outputPerCapita: '',//人均产量产值
      shouldbeNum: [],
      attendanceNum: [],
      processList: [],//产量趋势选择框
      processValue: []
    };
  },
  mounted() {
    if (localStorage.getItem("factorySelect")) {
      this.value = JSON.parse(localStorage.getItem("factorySelect"))
      this.shopId = this.value[this.value.length - 1];
    }
    if (localStorage.getItem("productionSelect")) {
      this.processValue = JSON.parse(localStorage.getItem("productionSelect"))
      this.handleTrend(this.processValue)
    }
    this.drawLine();
    this.getFactoryList(); //获取厂区列表
    this.getProjectList(); //获取项目列表
    this.getprocessList();
    this.getCharsCostList();//获取图形表厂区
    this.currentDate = shortTime(timeFormat(this.currentDate))
  },
  methods: {
    handleTrend(e) {
      localStorage.setItem("productionSelect", JSON.stringify(e));
      this.processList = []
      for (let item of e) {
        this.processList.push(item[item.length - 1])
      }
      this.getProductionTrendList()

    },
    searchBtn() {
      localStorage.setItem("factorySelect", JSON.stringify(this.value));
      this.shopId = this.value[this.value.length - 1];
      if (this.radioCheck == "报表") {
        this.$refs.reportFohrms.getList(this.currentDate, this.shopId);
      } else {
        this.getCharsCostList();
        this.getAttendanceSituation()
      }
    },
    changeDate() {
      this.currentDate = shortTime(timeFormat(this.currentDate))
    },
    //获取派工成本情况列表
    getCharsCostList() {
      this.getAttendanceSituation();
      // this.shopId = '211223A3AN1H7WPH'
      getPmsGdProjectStaffingCostPage({ departmentId: this.shopId, workTime: this.currentDate }).then((res) => {
        if (res.code == 0) {
          this.dispatching = [res.data.data[0].planNum, res.data.data[0].cumulativeOrderNum, res.data.data[0].cumulativeWorkNum]
          this.costData = [res.data.data[0].planAmount, res.data.data[0].cumulativeOrderAmount, res.data.data[0].cumulativeWorkAmount]
          this.chosenComparison()
        } else {
          this.$message.error(res.message);
        }
      });

    },
    //获取出勤人数列表
    getAttendanceSituation() {
      //每次请求需要清空以免一直push
      this.shouldbeNum = [];
      this.attendanceNum = []
      getPmsGdAttendanceSituation({ departmentId: this.shopId, workTime: this.currentDate }).then((res) => {
        if (res.code == 0) {

          res.data.forEach(item => {
            this.shouldbeNum.push(item.attendanceNum);
            this.attendanceNum.push(item.actualAttendanceNum);
          })
          workshopReport.attendance.series[0].data = this.shouldbeNum
          workshopReport.attendance.series[1].data = this.attendanceNum
          let myChart1 = this.$echarts.init(document.getElementById("chart2"));
          myChart1.setOption(workshopReport.attendance);
        } else {
          this.$message.error(res.message);
        }
      });
      //获取车间人均产量产值
      getPmsGdPerCapitaOutputPage({ departmentId: this.shopId, workTime: this.currentDate }).then((res) => {
        if (res.code == 0) {
          this.outputPerCapita = res.data.data
        } else {
          this.$message.error(res.message);
        }
      });
      //生产工人排行（不分页）
      getWorkAttendanceOrder({ departmentId: this.shopId, workTime: this.currentDate }).then((res) => {
        if (res.code == 0) {
          this.rankingData = res.data
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getProductionTrendList() {
      workshopReport.productionTrend.xAxis.data = []
      workshopReport.productionTrend.series = []
      getGoalsPerCapacity({ departmentId: this.shopId, workTime: this.currentDate, codeList: this.processList }).then((res) => {
        if (res.code == 0) {
          for (let item of res.data) {
            workshopReport.productionTrend.xAxis.data.push(item.workTime)
          }
          this.processList.forEach((a, b) => {
            obj = { data: [], type: "line", showSymbol: false, areaStyle: {} }
            for (let [index, item] of res.data.entries()) {
              obj.name = item.dataList[b].workingProcedureName
              obj.data.push(item.dataList[b].planWorkload)
            }
            workshopReport.productionTrend.series.push(obj)
          })
          let myChart5 = this.$echarts.init(document.getElementById("chart5"));
          myChart5.setOption(workshopReport.productionTrend, true);
        } else {
          this.$message.error(res.message);
        }
      });
    },

    selectTable() {
      if (this.radioCheck == "报表") {
        this.$refs.reportForms.getList(this.currentDate, this.shopId);
      }
    },
    getFactoryList() {
      getDepartmentList({ enterpriseId: enterpriseId, type: 1, status: 1 }).then((res) => {
        if (res.code == 0) {
          this.factoryOptions = res.data.map((item) => {
            item.label = item.name;
            item.value = item.enterpriseId;
            item.children.forEach((el) => {
              el.label = el.name;
              el.value = el.departmentId;
              el.children = null;
            });
            return item;
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getProjectList() {
      getEngineeringProjectList({
        status: 1,
      }).then((res) => {
        let options = [];
        res.data.forEach((item) => {
          options.push({
            label: item.name,
            value: item.engineeringProjectId,
          });
        });
        this.projectOption = options;
        // this.$set(this.renderData[0].attrs, 'options', options);
      });
    },
    /**获取工序列表数据*/
    getprocessList() {
      getWorkingProcedureList({
        couplingId: ""
      }).then((res) => {
        if (res.code == 0) {
          res.data.forEach(item => {
            item.label = item.name;
            item.value = item.workingProcedureCode;
            if (item.children.length == 0) {
              item.children = null
            } else {
              item.children.forEach(el => {
                el.label = el.name;
                el.value = el.workingProcedureCode;
              })
            }
          })
          this.processOptions = res.data
        }
      })
    },
    chosenComparison() {
      if (this.chartCheck == '派工对比') {
        workshopReport.cost.yAxis.name = '(单)'
        workshopReport.cost.series[0].data = this.dispatching
        workshopReport.cost.xAxis.data = ["计划工单数量", "累计派工数量", "累计报工数量"];
      } else {
        workshopReport.cost.series[0].data = this.costData;
        workshopReport.cost.xAxis.data = ["计划工单金额", "累计派工金额", "累计报工金额"];
        workshopReport.cost.yAxis.name = '(元)'
      }
      let myChart = this.$echarts.init(document.getElementById("chart1"));
      myChart.setOption(workshopReport.cost);
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart3 = this.$echarts.init(document.getElementById("chart3"));
      let myChart4 = this.$echarts.init(document.getElementById("chart4"));
      // 绘制图表
      var data = [
        { value: 80, name: "累计完成", percent: "80%", num: "39302.992" },
        { value: 20, name: "未完成", percent: "20%", num: "8319.748" },
      ];
      myChart3.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            var res = "";

            for (var i = 0; i < data.length; i++) {
              if (data[i].name == params.name) {
                res +=
                  data[i].name +
                  ":" +
                  data[i].percent +
                  "</br>" +
                  `
                          <p style="text-align:center">${data[i].num}吨</p>`;
              }
            }
            return res;
          },
        },
        title: [
          {
            text: "计划产量完成情况",
          },
          {
            subtext: "362628.74",
            text: "计划产量(吨)",
            textAlign: "center",
            textStyle: {
              color: "#333",
              fontWeight: 500,
              fontSize: 13,
            },
            top: "45%",
            left: "29%",
            subtextStyle: {
              color: "#333",
              fontSize: 18,
              fontWeight: 600,
            },
          },
        ],
        legend: {
          right: "25%",
          top: "30%",
          icon: "circle",
          width: 50,
          textStyle: {
            rich: {
              a: {
                fontSize: 20,
                verticalAlign: "top",
                align: "center",
                padding: [10, 0, 10, 0],
              },
              b: {
                padding: [40, 0, 0, 0],
              },
            },
          },
          formatter: (name) => {
            var total = 0;
            var target;
            var num;
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                target = data[i].value;
                num = data[i].num;
              }
            }
            return `{b|${name}       ${(target / total) * 100
              }%} \n {a|${num}}吨`;
          },
        },
        series: [
          {
            // name: 'Access From',
            type: "pie",
            center: ["30%", "52%"],
            radius: ["45%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emptyCircleStyle: {
              color: "#0F85FF",
            },
            emphasis: {
              // label: {
              //   show: false,
              //   fontSize: '40',
              //   fontWeight: 'bold'
              // }
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 80, name: "累计完成", itemStyle: { color: "#0F85FF" } },
              { value: 20, name: "未完成", itemStyle: { color: "#E7F2FF" } },
            ],
          },
        ],
      });
      var data1 = [
        { value: 65, name: "当日完成", percent: "65%", num: "4000.21" },
        { value: 35, name: "当日未完成", percent: "35%", num: "200.21" },
      ];
      myChart4.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            var res = "";
            for (var i = 0; i < data1.length; i++) {
              if (data1[i].name == params.name) {
                res +=
                  data1[i].name +
                  ":" +
                  data1[i].percent +
                  "</br>" +
                  `
                          <p style="text-align:center">${data1[i].num}吨</p>`;
              }
            }
            return res;
          },
        },
        title: [
          {
            subtext: "6702.97",
            text: "计划日产量(吨)",
            textAlign: "center",
            textStyle: {
              color: "#333",
              fontWeight: 500,
              fontSize: 13,
            },
            top: "45%",
            left: "29%",
            subtextStyle: {
              color: "#333",
              fontSize: 18,
              fontWeight: 600,
            },
          },
        ],
        legend: {
          right: "25%",
          top: "30%",
          icon: "circle",
          width: 50,
          textStyle: {
            rich: {
              a: {
                fontSize: 20,
                verticalAlign: "top",
                align: "center",
                padding: [10, 0, 10, 0],
              },
              b: {
                padding: [40, 0, 0, 0],
              },
            },
          },
          formatter: (name) => {
            var total = 0;
            var target;
            var num;
            for (var i = 0, l = data1.length; i < l; i++) {
              total += data1[i].value;
              if (data1[i].name == name) {
                target = data1[i].value;
                num = data1[i].num;
              }
            }
            return `{b|${name}       ${(target / total) * 100
              }%} \n {a|${num}}吨`;
          },
        },
        series: [
          {
            // name: 'Access From',
            type: "pie",
            center: ["30%", "52%"],
            radius: ["45%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emptyCircleStyle: {
              color: "#0F85FF",
            },
            emphasis: {
              // label: {
              //   show: false,
              //   fontSize: '40',
              //   fontWeight: 'bold'
              // }
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 65, name: "当日完成", itemStyle: { color: "#FF9900" } },
              {
                value: 35,
                name: "当日未完成",
                itemStyle: { color: "#FFF2DF" },
              },
            ],
          },
        ],
      });
    },
    exportExel() {
      const defaultSettings = require("@/settings");
      let baseUrl = "";
      if (process.env.NODE_ENV === "production") {
        if (process.env.VUE_APP_TITLE === "test") {
          baseUrl = defaultSettings.testApi;
        } else {
          baseUrl = defaultSettings.productionApi;
        }
      } else if (process.env.NODE_ENV === "development") {
        baseUrl = defaultSettings.developmentApi;
      }
      var url = `${baseUrl}/rms/c/v1/pms/excel/excel/exprot?fileName=车间日报表&departmentId=${this.shopId}&workTime=${this.currentDate}`;
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", url);
      a.click();
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 16px 16px 16px 6px;
  .inputBox {
    margin-right: 10px;
    &:first-child {
      width: 300px;
    }
  }
  .derive {
    margin-left: 20px;
  }
  .graphImg,
  .reportImg {
    width: 20px;
    height: 20px;
  }
  .box {
    width: 100%;
    background-color: #fff;
    height: 240px;
    border-radius: 5px;
    padding: 20px 30px;
    font-size: 14px;
    .title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      span {
        margin-left: 10px;
        font-size: 12px;
      }
    }
  }
  .part1 {
    .subhead {
      margin-bottom: 15px;
    }
    .content {
      margin-bottom: 30px;
      span {
        margin-right: 10px;
        font-size: 12px;
        img {
          vertical-align: bottom;
        }
        &:nth-of-type(2) {
          margin-left: 20px;
        }
      }
      .goUp {
        color: #fa5555;
      }
      .toFall {
        color: #52c41a;
      }
      .num {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  .part2 {
    position: relative;
    .project {
      position: absolute;
      right: 30px;
      top: 10px;
    }
    ul {
      height: 165px;
      overflow: auto;
      li {
        padding: 10px;
      }
    }
    .el-row {
      margin-bottom: 10px;
    }
    .information {
      display: flex;
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        margin-right: 10px;
      }
      .name {
        flex: 1;
        & div:last-of-type {
          color: #909399;
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
  }
  .part3 {
    height: 550px;
    position: relative;
    .paging {
      position: absolute;
      bottom: 40px;
      right: 10px;
    }
    .btn {
      position: absolute;
      top: 40px;
      right: 10px;
      z-index: 1000;
    }
    .chart1 {
      width: 100%;
      height: 500px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .part4 {
    padding: 20px;
    font-size: 12px;
    ::v-deep .el-table th.el-table__cell > .cell {
      color: #909399 !important;
      font-weight: 400 !important;
    }
    .serial {
      width: 22px;
      height: 22px;
      display: inline-block;
      text-align: center;
      vertical-align: center;
      line-height: 22px;
      font-size: 12px;
      border-radius: 50%;
      background-color: #f2f6fc;
      color: #606266;
    }
    .serial1 {
      background-color: #ecf5ff;
      color: #1989fa;
    }
  }
  .part5 {
    height: 300px;
    overflow: hidden;
    div {
      float: left;
      &:nth-child(2n) {
        width: 1px;
        margin-top: 80px;
        border-left: 1px solid #e4e7ed;
        height: 150px;
      }
      &:nth-child(2n-1) {
        width: calc(50% - 1px);
        height: 300px;
      }
    }
  }
}
.el-row {
  margin-bottom: 20px;
  .box {
    width: 100%;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
::v-deep .ranking.el-table th.el-table__cell.is-leaf,
.el-table td.el-table__cell {
  /* 去除上边框 */
  border: none;
}
::v-deep .ranking.el-table::before {
  /* 去除下边框 */
  height: 0;
}

::v-deep .ranking.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border: none;
}
::v-deep .el-radio-button--small .el-radio-button__inner {
  font-size: 13px;
}
::v-deep.el-radio-button--small .el-radio-button__inner {
  padding: 5px 15px;
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #ecf5ff !important;
  border-color: #a3d0fd !important;
  color: #a3d0fd !important;
}
</style>
