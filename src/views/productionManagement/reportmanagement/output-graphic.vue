<template>
  <div class="graphic-form">
    <el-row>
      <el-col :span="12">
        <ul>
          <li v-for="(item,i) in cardData"
            :key="i">
            <h4>{{item.titleName}}</h4>
            <p>{{item.workStartDate}}~{{item.workEndDate}}</p>
            <div>
              <b>{{item.valueOf}}</b><span>元</span>
            </div>
            <div><span>同比</span>
              <p :class="item.isIncreased?'up':'down'"><i></i><span>{{item.increasedPercentage}}</span></p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <div id="chart-bar"></div>
      </el-col>
    </el-row>
    <el-row>

      <div class="title">
        产值趋势
        <el-select v-model="workshopValue"
          multiple
          collapse-tags
          style="margin-left: 20px;float:right"
          placeholder="请选择车间"
          ref="workshopSelect"
          @change="handlePlant">
          <el-option v-for="item in workshopOptions"
            :key="item.departmentId"
            :label="item.name"
            :value="item.departmentId">
          </el-option>
        </el-select>
      </div>
      <div id="chart-line"
        style="height:500px"></div>

    </el-row>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import { getChartOfEnterpriseOutputValueByMonth, getChartOfWorkShopOutputValueByMonth, getDepartmentList, getTrendChartOfOutputValueByYear } from "@/api/productionManagement/project"
export default {
  props: {
    searchData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      cardData: [],
      barOption: {
        backgroundColor: '#fff',
        title: {
          text: "各厂区产值情况",
          textStyle: {
            fontWeight: 600,
            fontSize: 16,
            color: '#303133'
          }
        },
        grid: {
          top: 90,
          left: 85,
          bottom: 18,
          right: 16,
        },
        color: ['#158FFF', '#87C1FE'],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["当月产值", "当月工费"],
          right: 20,
          itemHeight: 8,
          itemGap: 35,
          formatter: ["{a|{name}}"].join("\n"),
          textStyle: {
            fontSize: 14,
            height: 10,
            rich: {
              a: {
                verticalAlign: "top",
              },
            },
          },
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            color: "#303133",
          },
          axisLine: {
            lineStyle: {
              color: "#E4E7ED",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            type: "value",
            name: "(元)",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        barWidth: 30,
        series: [
          {
            name: "当月产值",
            type: "bar",
            data: [85420, 25486, 15684],
          },
          {
            name: "当月工费",
            type: "bar",
            data: [35874, 68451, 95465],
          },
        ],
      },
      lineOption: {
        backgroundColor: '#fff',
        title: [],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          icon: "rect",
          right: 20,
          top: 40,
          itemHeight: 8,
          itemGap: 35,
          formatter: ["{a|{name}}"].join("\n"),
          textStyle: {
            fontSize: 14,
            height: 10,
            rich: {
              a: {
                verticalAlign: "middle",
              },
            },
          },
        },
        color: ['#1677FF', '#FA8E55', '#52C41A'],
        grid: {
          top: 90,
          left: 60,
          bottom: 30,
          right: 10,
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: [],
          axisLabel: {
            color: "#303133",
          },
          axisLine: {
            lineStyle: {
              color: "#E4E7ED",
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          name: "(元)",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: []
      },
      workshopOptions: [],
      workshopValue: '',
      currenData: {}
    }
  },
  mounted() {
    this.getPlantAreaList()
  },
  methods: {
    getList(data) {
      this.currenData = data
      let params = {
        workMonth: data.workMonth,
        workYear: data.workYear,
        enterpriseId: enterpriseId,
      }
      getChartOfEnterpriseOutputValueByMonth(params).then((res) => {
        if (res.code == 0) {
          this.cardData = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
      this.barOption.xAxis.data = []
      this.barOption.series[0].data = [];
      this.barOption.series[1].data = []
      getChartOfWorkShopOutputValueByMonth(params).then((res) => {
        if (res.code == 0) {
          res.data.forEach(item => {
            this.barOption.xAxis.data.push(item.workshopName);
            this.barOption.series[0].data.push(item.workOutputValue)
            this.barOption.series[1].data.push(item.workLaborCost)
          });
          let myBarChart = this.$echarts.init(document.getElementById("chart-bar"));
          console.log(myBarChart, "myBarChart ")
          myBarChart.setOption(this.barOption, true);
        } else {
          this.$message.error(res.message);
        }
      });
      if (localStorage.getItem('workshopValue')) {
        this.workshopValue = JSON.parse(localStorage.getItem('workshopValue'))
        this.handlePlant()
      }
    },
    getPlantAreaList() {
      let params = {
        enterpriseId: enterpriseId,
        level: 1,
        status: 1,
        type: 1
      }
      getDepartmentList(params).then((res) => {
        if (res.code == 0) {
          this.workshopOptions = res.data
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handlePlant() {
      this.lineOption.xAxis.data = []
      this.lineOption.series = []
      localStorage.setItem("workshopValue", JSON.stringify(this.workshopValue));
      let params = {
        workYear: this.currenData.workYear,
        workMonth: this.currenData.workMonth,
        workshopIds: this.workshopValue,
        enterpriseId: enterpriseId,
      }
      getTrendChartOfOutputValueByYear(params).then((res) => {
        if (res.code == 0) {
          res.data.forEach(item => {
            this.lineOption.xAxis.data.push(`${item.workYear}-${item.workMonth < 10 ? `0${item.workMonth}` : `${item.workMonth}`}`)
            console.log(this.lineOption.xAxis.data)
          })
          this.workshopValue.forEach((a, b) => {
            obj = { data: [], type: "line", showSymbol: false, areaStyle: {} }
            for (let [index, item] of res.data.entries()) {
              obj.name = item.plantAreaOutputValueList[b].workshopName
              obj.data.push(item.plantAreaOutputValueList[b].totalWorkLaborCost)
            }
            this.lineOption.series.push(obj)
          })

          let myLineChart = this.$echarts.init(document.getElementById("chart-line"));
          myLineChart.setOption(this.lineOption);
        } else {
          this.$message.error(res.message);
        }
      });

    },
  }
}
</script>
<style lang="scss" scoped>
.graphic-form {
  margin-top: 16px;
  .el-row:first-child {
    height: 340px;
    margin-bottom: 16px;
    .el-col {
      padding-right: 16px;
      ul {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 49%;
          padding: 16px;
          background: #fff;
          font-weight: 500;
          border-radius: 5px;
          &:nth-child(1),
          &:nth-child(2) {
            margin-bottom: 16px;
          }
          > h4 {
            font-size: 16px;
            color: #303133;
            font-weight: 600;
          }
          > p {
            font-size: 12px;
            color: #909399;
            margin-top: 18px;
            margin-bottom: 22px;
          }
          > div:nth-child(3) {
            margin-bottom: 18px;
            b {
              font-size: 28px;
              // color: #000;
              margin-right: 18px;
              font-weight: 700;
            }
            span {
              color: #909399;
              font-size: 14px;
              font-weight: 400;
            }
          }
          > div:last-child {
            display: flex;
            align-items: center;
            span {
              color: #606266;
              font-weight: 400;
              font-size: 14px;
              margin-right: 12px;
            }
            p {
              span {
                font-weight: 400;
                font-size: 14px;
                position: relative;
                &:before {
                  border-left: 5px solid transparent;
                  border-right: 5px solid transparent;
                  content: "";
                  position: relative;
                  width: 0;
                  margin-right: 6px;
                }
              }
              &.up {
                span {
                  color: #52c41a;
                  &:before {
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-bottom: 3px solid #52c41a;
                    top: -11px;
                  }
                }
              }
              &.down {
                span {
                  color: #fa5555;
                  &:before {
                    border-left: 3px solid transparent;
                    border-right: 3px solid transparent;
                    border-top: 3px solid #fa5555;
                    top: 11px;
                  }
                }
              }
            }
          }
        }
      }
      &:last-child {
        padding: 14px;
        background: #fff;
        border-radius: 5px;
        #chart-bar {
          width: 100%;
          height: 312px;
        }
      }
    }
  }
  .el-row:last-child {
    padding: 14px;
    background: #fff;
    border-radius: 5px;
    #chart-line {
      width: 100%;
      height: 527px;
    }
  }
}
.title {
  font-size: 16px;
  font-weight: 600;
  margin: 15px 0;
  span {
    margin-left: 10px;
    font-size: 12px;
  }
}
</style>