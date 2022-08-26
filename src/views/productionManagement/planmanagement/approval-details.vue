<!-- 审批详情 -->
<template>
  <div class="main">
    <!-- 存放图表 -->
    <div class="chart">
      <!-- 图表左侧部分 -->
      <div class="chart_left">
        <div class="left_head">
          <TableFilter
            :searchobj.sync="searchobj"
            :config="headerData"
            @search="getFilterList"
            :buttonText="buttonText"
          />
        </div>
        <div id="main" style="width: 983px; height: 450px"></div>
      </div>
      <!-- 图表右侧部分 -->
      <div class="chart_right">
        <div class="process_info">审批流信息</div>
        <!-- 流程图 -->
        <div class="process">
          <el-steps direction="vertical" :active="2">
            <el-step>
              <template slot="title">
                <div class="groupleader_info">
                  <img :src="status.groupleader.imgurl" alt="" />
                  <div class="groupleader_name">
                    <p class="info">
                      <span class="groupleader">{{
                        status.groupleader.ziwei
                      }}</span>
                      <span class="time">{{ status.groupleader.time }}</span>
                    </p>
                    <p class="name">{{ status.groupleader.name }}</p>
                  </div>
                </div>
              </template>
              <template slot="description">
                <div class="state">{{ status.groupleader.states }}</div>
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="groupleader_info">
                  <img :src="status.minister.imgurl" alt="" />
                  <div class="groupleader_name">
                    <p class="info">
                      <span class="groupleader">{{
                        status.minister.ziwei
                      }}</span>
                      <span class="time">{{ status.minister.time }}</span>
                    </p>
                    <p class="name">{{ status.minister.name }}</p>
                  </div>
                </div>
              </template>
              <template slot="description">
                <div class="state">{{ status.minister.states }}</div>
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="groupleader_info">
                  <img :src="status.vicepresident.imgurl" alt="" />
                  <div class="groupleader_name">
                    <p class="info">
                      <span class="groupleader">{{
                        status.vicepresident.ziwei
                      }}</span>
                      <span class="time">{{ status.vicepresident.time }}</span>
                    </p>
                    <p class="name">{{ status.vicepresident.name }}</p>
                  </div>
                </div>
              </template>
              <template slot="description">
                <div class="state">{{ status.vicepresident.states }}</div>
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="groupleader_info">
                  <img :src="status.generalmanager.imgurl" alt="" />
                  <div class="groupleader_name">
                    <p class="info">
                      <span class="groupleader">{{
                        status.generalmanager.ziwei
                      }}</span>
                      <span class="time">{{ status.generalmanager.time }}</span>
                    </p>
                    <p class="name">{{ status.generalmanager.name }}</p>
                  </div>
                </div>
              </template>
              <template slot="description">
                <div class="state">{{ status.generalmanager.states }}</div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
    </div>
    <!-- 项目图表 -->
    <div class="project_table">
      <div class="content_table">
        <TableBody :colConfig="colConfig" :data="data2.data" show-summary>
        </TableBody>
      </div>
    </div>
    <!-- 底部提交审批 -->
    <div class="submit">
      <span class="cancel" @click="cancel">取消</span>
      <span class="confirm" @click="confirm">提交审批</span>
    </div>
  </div>
</template>

<script>
import * as echarts from '@/utils/productionManagement/echarts.min.js';
import { TableFilter, TableBody, Pagination } from "gggj_lib";
export default {
  components: { TableFilter, TableBody, Pagination },
  data() {
    return {
      groupleaderimgurl: require("@/assets/productionManagement/logo.png"),
      searchobj: {
        keyWords: "",
        projectName: "",
      },
      headerData: [
        {
          code: "keyWords",
          title: "厂区",
          type: "select",
          width: "220px",
          options: [
            { label: "江夏厂区", value: 1 },
            { label: "汉南厂区", value: 2 },
          ],
        },
        {
          code: "projectName",
          title: "操作",
          type: "select",
          width: "220px",
          options: [
            { label: "下料", value: 1 },
            { label: "上料", value: 2 },
          ],
        },
      ],
      buttonText: "确定",
      /* 审批人状态假数据 */
      status: {
        groupleader: {
          imgurl: require("@/assets/productionManagement/logo.png"),
          time: "2021.08.03",
          ziwei: "计调主管",
          name: "法良",
          states: "提交审批",
        },
        minister: {
          imgurl: require("@/assets/productionManagement/logo.png"),
          time: "2021.08.04",
          ziwei: "生产部长",
          name: "达宏",
          states: "审批完成",
        },
        vicepresident: {
          imgurl: require("@/assets/productionManagement/logo.png"),
          time: "2021.08.05",
          ziwei: "生产副总",
          name: "鲍志可",
          states: "审批中",
        },
        generalmanager: {
          imgurl: require("@/assets/productionManagement/logo.png"),
          time: "2021.08.06",
          ziwei: "总经理",
          name: "待贞锦",
          states: "待审批",
        },
      },
      colConfig: [
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
          },
        },
        {
          attrs: { label: "材料编号", prop: "bianhao", align: "center" },
        },
        {
          attrs: { label: "完成工艺", prop: "wanchenggongyi", align: "center" },
        },
        {
          attrs: { label: "完成工作量", prop: "liang", align: "center" },
        },
        {
          attrs: { label: "施工人员", prop: "name", align: "center" },
        },
        {
          attrs: {
            label: "检验合格时间",
            prop: "time",
            align: "center",
          },
        },
        {
          attrs: { label: "工费(元)", prop: "amount1", align: "center" },
        },
        {
          attrs: { label: "进度奖(元)", prop: "amount2", align: "center" },
        },
        {
          attrs: { label: "质量奖(元)", prop: "amount3", align: "center" },
        },
      ],
      /* 后端数据可以在此接收 */
      data2: {
        data: [
          {
            bianhao: "L3-16-1AM",
            wanchenggongyi: "校正",
            liang: "1件",
            name: "权蓉子",
            time: "10:03",
            amount1: "100.00",
            amount2: "100.00",
            amount3: "100.00",
          },
          {
            bianhao: "L3-16-1AM",
            wanchenggongyi: "校正",
            liang: "1件",
            name: "权蓉子",
            time: "10:03",
            amount1: "100.00",
            amount2: "100.00",
            amount3: "100.00",
          },
          {
            bianhao: "L3-16-1AM",
            wanchenggongyi: "校正",
            liang: "1件",
            name: "权蓉子",
            time: "10:03",
            amount1: "100.00",
            amount2: "100.00",
            amount3: "100.00",
          },
          {
            bianhao: "L3-16-1AM",
            wanchenggongyi: "校正",
            liang: "1件",
            name: "权蓉子",
            time: "10:03",
            amount1: "100.00",
            amount2: "100.00",
            amount3: "100.00",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    //图表
    this.draw();
  },
  methods: {
    //搜索
    getFilterList() {
    },
    /* 图表(加了stack需要进行数据的遍历计算，这是累加计算) */
    draw() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "汉江厂区下料工序",
        },
        /* 鼠标悬停在线条上的提示 */
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#303133",
            },
          },
        },
        /* 提示 */
        legend: {
          itemHeight: 4,
          itemWidth: 14,
          icon: "rect", //表示矩形
          data: ["峰值产能", "下料月负荷"],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        /* x轴的数据 */
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "2021-05",
              "2021-06",
              "2021-07",
              "2021-08",
              "2021-09",
              "2021-10",
              "2021-11",
            ],
          },
        ],
        /* y轴的数据 */
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 7000,
            axisLabel: {
              formatter: function (value) {
                var texts = [];
                if (value == 0) {
                  texts.push("0");
                } else if (value <= 1000) {
                  texts.push("1000");
                } else if (value <= 2000) {
                  texts.push("2000");
                } else if (value <= 3000) {
                  texts.push("3000");
                } else if (value <= 4000) {
                  texts.push("4000");
                } else if (value <= 5000) {
                  texts.push("5000");
                } else if (value <= 6000) {
                  texts.push("6000");
                } else {
                  texts.push("7000");
                }
                return texts;
              },
            },
          },
        ],
        /* 折线数据(其中包括背景颜色和样式) */
        series: [
          {
            name: "峰值产能",
            type: "line", //线性样式
            showSymbol: false, //不显示，鼠标悬停的时候显示
            stack: "Total",
            symbol: "circle", // 设定为实心点
            symbolSize: 5, // 设定实心点的大小
            emphasis: {//鼠标悬停时显示自己的内容，淡化别人的内容
              focus: "series",
            },
            /* 显示数值的 */
            /* label: {
              normal: {
                show: true,
                position: "top",
              },
            }, */
            areaStyle: {
              type: "default",
              //渐变色实现
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, //变化方向
                //渐变色
                [
                  { offset: 0, color: "rgba(33, 142, 255, 1)" },
                  { offset: 1, color: "rgba(22, 119, 255, 0)" },
                ]
              ),
            },
            itemStyle: {
              normal: {
                color: "#1677FF", //折线点的颜色
                lineStyle: {
                  color: "#1677FF", //折线的颜色
                },
              },
            },
            data: [3120, 3460, 3600, 4100, 4400, 4800, 5800],
          },
          {
            name: "下料月负荷",
            type: "line",
            showSymbol: false, //不显示，鼠标悬停的时候显示
            stack: "Total",
            symbol: "circle", // 设定为实心点
            symbolSize: 5, // 设定实心点的大小
            emphasis: {//鼠标悬停时显示自己的内容，淡化别人的内容
              focus: "series",
            },
            /* label: {
              normal: {
                show: true,
                position: "top",
              },
            }, */
            areaStyle: {
              type: "default",
              //渐变色实现
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1, //变化方向
                //渐变色
                [
                  { offset: 0, color: "rgba(253, 193, 142, 1)" },
                  { offset: 1, color: "rgba(250, 142, 85, 0)" },
                ]
              ),
            },
            itemStyle: {
              normal: {
                color: "#FA8E55", //折线点的颜色
                lineStyle: {
                  color: "#FA8E55", //折线的颜色
                },
              },
            },
            data: [820, 932, 901, 934, 950, 980, 1000],
            /* data: [2300, 2500, 3100, 3500, 4200, 4500, 5500], */
          },
        ],
      });
    },
    /* 取消 */
    cancel() {
    },
    /* 提交审批 */
    confirm() {
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  .chart {
    display: flex;
    justify-content: space-between;
    .chart_left {
      flex: 0 0 1015px;
      height: 561px;
      box-sizing: border-box;
      padding: 16px;
      background-color: #ffffff;
    }
    .chart_right {
      box-sizing: border-box;
      margin-left: 8px;
      flex: 1;
      background-color: #ffffff;
      padding: 10px;
      display: flex;
      flex-direction: column;
      .process_info {
        flex: 0 0 50px;
        line-height: 50px;
      }
      .process {
        flex: 1;
        .groupleader_info {
          display: flex;
          img {
            width: 32px;
            height: 32px;
            border-radius: 16px;
            vertical-align: middle;
          }
          .groupleader_name {
            margin-left: 8px;
            flex: 1;
            font-size: 10px;
            .info {
              display: flex;
              justify-content: space-between;
              height: 16px;
              line-height: 16px;
              color: #909399;
            }
            .name {
              height: 16px;
              font-weight: 500;
              color: #303133;
              line-height: 16px;
            }
          }
        }
        .state {
          margin-top: 10px;
        }
      }
    }
  }
  .project_table {
    box-sizing: border-box;
    height: 250px;
    background-color: #ffffff;
    margin-top: 8px;
    padding: 16px 16px 0 16px;
    overflow: auto;
    .content_table {
      box-sizing: border-box;
      /* 表头和总计加背景样式和字体样式 */
      ::v-deep.has-gutter {
        tr,
        th,
        td {
          background-color: #f2f6fc;
          color: #303133;
          font-size: 14px;
          font-weight: 500;
        }
      }
      /* 给总计的样式单独加颜色和总计居中(注意位置不要随意交换) */
      ::v-deep.el-table__footer-wrapper {
        .has-gutter {
          tr,
          th,
          td {
            background-color: #ffffff;
          }
          .el-table_1_column_1 {
            text-align: center;
          }
        }
      }
      /* 后面这两行样式是将表格中的总计放到第一行显示 */
      ::v-deep.el-table {
        display: flex;
        flex-direction: column;
      }
      /* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
      ::v-deep.el-table__body-wrapper {
        order: 1;
      }
    }
  }
  .submit {
    width: calc(100% - 142px);
    position: fixed;
    left: 142px;
    bottom: 0px;
    height: 50px;
    background-color: #ffffff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
    span {
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      height: 32px;
      padding: 0 15px;
      line-height: 32px;
      border: 1px solid #dcdfe6;
      background-color: #ffffff;
      color: #606266;
      margin-right: 16px;
    }
    .confirm {
      color: #ffffff;
      background-color: #0486fe;
    }
  }
}
</style>
