<template>
  <div class="wrap"
    ref="wrap">
    <!-- 日期查询搜索框区域 -->
    <data-search v-if="isShowDetail"
      :currentDate="currentDate"
      :radioCheck="radioCheck"
      @changeTab="changeTab"
      @searchClick="searchClick"></data-search>
    <!-- 图形表区域 -->
    <div v-show="radioCheck == '图形表'">
      <el-row :gutter="20">
        <el-col :span="8"
          v-for="(item,index) in partData"
          :key="index">
          <div class="box">
            <div class="title">{{item.plantAreaName}}</div>
            <div class="part">
              <div class="lt">
                <p>{{item.workStartDate}}~{{item.workEndDate}}</p>
                <div>完成总标准吨</div>
                <div class="highlightNum"><span>{{item.completedTotalPipSumTon}}</span>吨</div>
                <div>同比<span :class="item.isIncreased?'ratioG':'ratioR'"><img :src="require(`@/assets/productionManagement/icon/${ item.isIncreased? 'Vector1' : 'Vector'}.png`)"
                      alt=""> {{item.increasedPercentage}}</span></div>
              </div>
              <div class="rt"><img :src="item.imgUrl"
                  alt=""></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"
          v-for="(item,index) in cahrtsData"
          :key="index">
          <div class="box box1">
            <div class="title">{{item.plantAreaName}}</div>
            <div :id="`chart${index+1}`"
              class="charts"></div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="box"
            style="height:560px">
            <div class="title">产量趋势</div>
            <div id="chartLast"
              style="height:500px"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 报表区域 -->
    <div v-show="radioCheck == '报表'">
      <productionTable :currentDate="currentDate"
        ref="reportForms"></productionTable>
    </div>
  </div>
</template>
<script>
import dataSearch from './date-search.vue'
import productionTable from "./production-table.vue";
import { timeFormat, monthTime, shortTime, monthDayTime, yearTime, getMonth, deepMerge } from "@/utils/productionManagement/tool"
import { getChartOfEnterpriseOutputByMonth, getChartOfPlantAreaOutputByMonth, getTrendChartOfOutputByMonth } from "@/api/productionManagement/project"
import { production } from "@/utils/productionManagement/echartsOptions"
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
export default {
  components: { dataSearch, productionTable },
  data() {
    return {
      currentDate: shortTime(monthTime(new Date())),
      radioCheck: "图形表",
      partData: [],
      cahrtsData: [],
      searchData: {},
      isShowDetail: true
    };
  },
  mounted() {
    this.searchClick(this.currentDate)
  },
  methods: {
    timeFormat, monthTime,
    getEnterpriseOutput() {
      let params = {
        workMonth: this.searchData.workMonth,
        workYear: this.searchData.workYear,
        enterpriseId: enterpriseId,
      }
      getChartOfEnterpriseOutputByMonth(params).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item, index) => {
            item.imgUrl = require(`@/assets/productionManagement/icon/product${index + 1}.png`)
          })
          this.partData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });

      let colorArr = ['#0176EF', "#0F85FF", "#5BABFF", "#87C1FE", "#FFB84E", "#FFD64E"]
      getChartOfPlantAreaOutputByMonth(params).then((res) => {
        if (res.code == 0) {
          this.cahrtsData = res.data.filter(item => {
            item.data = []
            if (item.workingProcedureOutputs) {
              item.workingProcedureOutputs.forEach((el, index) => {
                let obj = {}
                obj.name = el.workingProcedureName;
                obj.value = el.completedPipTon;
                obj.itemStyle = {
                  color: colorArr[index]
                }
                item.data.push(obj)
              })
            }
            return item
          })
          this.drawLine()
        } else {
          this.$message.error(res.message);
        }
      });

      getTrendChartOfOutputByMonth(params).then((res) => {
        if (res.code == 0) {
          production.trend.xAxis.data = []
          production.trend.series = []
          let arr = [];
          res.data[0].outputOfOrgans.forEach(item => {
            arr.push(item.organId)
          })
          res.data.forEach(item => {
            production.trend.xAxis.data.push(`${monthDayTime(item.workDate)}${item.workDescription}`)
          })
          arr.forEach((a, b) => {
            obj = { data: [], type: "line", showSymbol: false, areaStyle: {} }
            for (let [index, item] of res.data.entries()) {
              obj.name = item.outputOfOrgans[b].organName
              obj.data.push(item.outputOfOrgans[b].completedPipSumTon)
            }
            production.trend.series.push(obj)

          })
          let myChart5 = this.$echarts.init(document.getElementById("chartLast"));
          myChart5.setOption(production.trend);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 图形图标切换
    changeTab(v) {
      this.radioCheck = v
      this.searchClick(this.currentDate)

    },
    // 确定click
    searchClick(val) {
      this.currentDate = val;
      this.searchData = {
        workYear: Number(yearTime(val)),
        workMonth: Number(getMonth(val))
      }
      if (this.radioCheck == "报表") {
        this.$refs.reportForms.getList(this.searchData)
      } else {
        this.getEnterpriseOutput()
      }
    },
    // searchBtn() {

    // },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      // let myChartLL = this.$echarts.init(document.getElementById("chart1"));
      this.cahrtsData.forEach((item, index) => {
        let dom1Option = {
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              var res = '';
              for (var i = 0; i < item.data.length; i++) {
                if (item.data[i].name == params.name) {
                  res +=
                    item.data[i].name +
                    ':' +
                    item.data[i].value + '吨';
                }
              }
              return res;
            }
          },
          title: [
            {
              subtext: '吨',
              text: item.completedTotalPipSumTon,
              textAlign: 'center',
              textStyle: {
                color: '#333',
                fontSize: 18,
                fontWeight: 600

              },
              top: '35%',
              left: '29%',
              subtextStyle: {
                color: '#333',
                fontWeight: 500,
                fontSize: 13
              }
            }
          ],
          legend: {
            right: '10%',
            // top: '10%',
            icon: 'circle',
            width: 50,
            // type: 'scroll',
            textStyle: {
              rich: {
                a: {
                  fontSize: 20,
                  verticalAlign: 'top',
                  align: 'center',
                  padding: [10, 0, 10, 0]
                },
                b: {
                  padding: [40, 0, 0, 0]
                }
              }
            },
            formatter: (name) => {
              var total = 0;
              var target;
              var num;
              for (var i = 0, l = item.data.length; i < l; i++) {
                total += item.data[i].value;
                if (item.data[i].name == name) {
                  target = item.data[i].value;
                  num = item.data[i].value;
                }
              }
              return `${name}     ${num}`;
            }
          },
          series: [
            {
              // name: 'Access From',
              type: 'pie',
              center: ['30%', '42%'],
              radius: ['47%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false
              },
              itemStyle: {
                borderRadius: 4,
                borderColor: '#fff',
                borderWidth: 1
              },
              emptyCircleStyle: {
                color: '#0F85FF'
              },
              labelLine: {
                show: false
              },
              data: item.data
            }
          ]
        }
        this.$nextTick(function () {
          let dom = document.getElementById(`chart${index + 1}`)
          this.$echarts.init(dom).setOption(dom1Option);
        })


      })
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  padding: 16px 16px 16px 6px;
  .inputBox {
    margin-right: 10px;
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
    .part {
      overflow: hidden;
      .lt {
        width: 50%;
        float: left;
        > div {
          margin-bottom: 20px;
          img {
            width: 8px;
            height: 4px;
            vertical-align: middle;
            margin-left: 15px;
          }
        }
        .ratioG {
          color: #52c41a;
          // font-size: 14px;
        }
        .ratioR {
          color: #fa5555;
        }
        .highlightNum {
          span {
            font-weight: 700;
            font-size: 28px;
            margin-right: 10px;
          }
        }
      }
      .rt {
        width: 48%;
        float: right;
        img {
          width: 197px;
          height: 100px;
        }
      }
      p {
        color: #909399;
        margin-bottom: 20px;
        font-size: 12px;
      }
    }
  }
  .box1 {
    height: 280px;
  }
  .charts {
    height: 250px;
  }
}
.el-row {
  margin-bottom: 20px;
  .el-col {
    margin-bottom: 16px;
  }
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