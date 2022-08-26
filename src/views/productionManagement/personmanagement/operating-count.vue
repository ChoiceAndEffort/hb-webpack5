<!--工费统计-->
<template>
  <div id="main">
    <div class="tab">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="车间工费" name="first">
          <!-- 车间费用 -->
          <div class="workshop_cost">
            <!-- 左侧部分 -->
            <div class="left">
              <div class="selectBox">
                <el-input
                  v-model="input3"
                  class="input-with-select"
                  @change="hangleSelect"
                >
                  <i slot="suffix" class="el-input__icon el-icon-search"></i>
                  <el-select
                    v-model="select"
                    slot="prepend"
                    placeholder="请选择"
                  >
                    <el-option label="部门" value="1"></el-option>
                    <el-option label="公司" value="2"></el-option>
                  </el-select>
                </el-input>
              </div>
              <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                :filter-node-method="filterNode"
                ref="tree"
              ></el-tree>
            </div>
            <!-- 右侧部分 -->
            <div class="right">
              <div class="m-sselect">
                <TableFilter
                  :searchobj.sync="searchobj"
                  :config="headerData"
                  @search="getFilterList"
                  :buttonText="buttonText"
                  :showclear="true"
                />
              </div>
              <!-- 表格介绍和内容导出 -->
              <div class="select-List">
                <!-- 导航 -->
                <div class="nav">
                  <p>下料车间工费统计</p>
                  <div class="navallBnt">
                    <el-button type="primary" @click="out"
                      ><i class="el-icon-upload2"></i>导出</el-button
                    >
                  </div>
                </div>
                <!-- 表格内容 -->
                <div>
                  <TableBody
                    :colConfig="colConfig1"
                    :data="data1.data"
                    @selection-change="workSelectionChange"
                  >
                    <template slot="btns" slot-scope="{ scope }">
                      <el-button
                        size="mini"
                        type="text"
                        @click="workdetailsRow(scope.row)"
                        >详情</el-button
                      >
                    </template>
                  </TableBody>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目工费" name="second">
          <!-- 项目工费 -->
          <div class="project_cost">
            <!-- 可搜索具体项目 -->
            <div class="project_item">
              <el-select v-model="value" filterable placeholder="请选择">
                <el-option
                  v-for="item in project"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button type="primary" :loading="false">确定</el-button>
            </div>
            <!-- 项目名称和导出 -->
            <div class="export">
              <p class="project_name">繁华大道项目工费</p>
              <el-button type="primary" @click="out1"
                ><i class="el-icon-upload2"></i>导出</el-button
              >
            </div>
            <!-- 项目的内容 -->
            <div>
              <TableBody
                :colConfig="colConfig"
                :data="data2.data"
                @selection-change="projectSelectionChange"
              >
                <template slot="btns" slot-scope="{ scope }">
                  <el-button
                    size="mini"
                    type="text"
                    @click="projectdetailsRow(scope.row)"
                    >详情</el-button
                  >
                </template>
              </TableBody>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
//引入组件
import { TableFilter, TableBody } from "gggj_lib";
export default {
  //注册组件
  components: { TableFilter, TableBody },
  data() {
    return {
      activeName: "first",
      //搜索
      input3: "",
      //选择部门还是公司
      select: "1",
      //选择树的内容
      data: [
        {
          label: "海波重科",
          children: [
            {
              label: "汉阳子公司",
              children: [
                {
                  label: "下料车间",
                },
                {
                  label: "单元件配件车间",
                },
                {
                  label: "单元件隔板制作车间",
                },
                {
                  label: "总装装配车间",
                },
                {
                  label: "总装焊接车间",
                },
                {
                  label: "转运车间",
                },
              ],
            },
            {
              label: "江夏子公司",
              children: [
                {
                  label: "下料车间",
                },
                {
                  label: "单元件配件车间",
                },
                {
                  label: "单元件隔板制作车间",
                },
                {
                  label: "总装装配车间",
                },
                {
                  label: "总装焊接车间",
                },
                {
                  label: "转运车间",
                },
              ],
            },
          ],
        },
      ],
      //默认选项
      defaultProps: {
        children: "children",
        label: "label",
      },
      /* 右侧头部内容 */
      searchobj: {
        name: "",
        gonghao: "",
      },
      /* 右侧头部内容 */
      headerData: [
        {
          code: "name",
          title: "姓名",
          width: "180px",
          label: "姓名：",
        },
        {
          code: "gongzhong",
          title: "工种",
          width: "180px",
          label: "工种：",
        },
        {
          code: "shijian",
          title: "时间",
          width: "180px",
          label: "时间：",
          type: "mergeDate",
        },
      ],
      //右侧头部查询
      buttonText: "查询",
      options: [
        {
          label: "生产架构",
          value: "0",
        },
        {
          label: "行政架构",
          value: "1",
        },
      ],
      /* 项目工费的表头内容 */
      colConfig1: [
        /* 勾选框 */
        {
          attrs: { align: "center", type: "selection" },
        },
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
          attrs: { label: "姓名", prop: "gongxu", align: "center" },
        },
        {
          attrs: {
            label: "工种",
            prop: "budget",
            align: "center",
          },
        },
        {
          attrs: {
            label: "已报工资(元)",
            prop: "monthcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "检验合格工资(元)",
            prop: "totalcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "differencecost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "progressreward",
            align: "center",
            sortable: true,
          },
        },
        {
          slot: "btns",
          attrs: { label: "操作", fixed: "right", width: 80, align: "center" },
        },
      ],
      /* 后端数据可以在此接收 */
      data1: {
        data: [
          {
            gongxu: "张翔",
            budget: "生产",
            monthcost: "1345",
            totalcost: "1345",
            differencecost: "94.15",
            progressreward: "107.6",
            detail: [
              {
                bianhao: "L3-16-1AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "张翔",
                time: "2022-2-23 10:15",
                amount1: "380.00",
                amount2: "26.60",
                amount3: "30.40",
              },
              {
                bianhao: "L3-16-2AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "张翔",
                time: "2022-2-23 11:55",
                amount1: "325.00",
                amount2: "22.75",
                amount3: "26.00",
              },
              {
                bianhao: "L3-16-3AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "张翔",
                time: "2022-2-23 13:58",
                amount1: "355.00",
                amount2: "24.85",
                amount3: "27.52",
              },
              {
                bianhao: "L3-16-4AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "张翔",
                time: "2022-2-23 15:33",
                amount1: "285.00",
                amount2: "19.95",
                amount3: "21.84",
              },
            ],
          },
          {
            gongxu: "阮平",
            budget: "生产",
            monthcost: "1250",
            totalcost: "1250",
            differencecost: "87.5",
            progressreward: "100",
            detail: [
              {
                bianhao: "L4-16-1AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "阮平",
                time: "2022-2-23 10:25",
                amount1: "298.00",
                amount2: "20.86",
                amount3: "23.84",
              },
              {
                bianhao: "L4-16-2AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "阮平",
                time: "2022-2-23 11:45",
                amount1: "335.00",
                amount2: "23.45",
                amount3: "26.80",
              },
              {
                bianhao: "L4-16-3AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "阮平",
                time: "2022-2-23 13:15",
                amount1: "344.00",
                amount2: "24.08",
                amount3: "27.52",
              },
              {
                bianhao: "L4-16-4AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "阮平",
                time: "2022-2-23 15:33",
                amount1: "273.00",
                amount2: "19.11",
                amount3: "21.84",
              },
            ],
          },
          {
            gongxu: "范益明",
            budget: "生产",
            monthcost: "1300",
            totalcost: "1300",
            differencecost: "91",
            progressreward: "104",
            detail: [
              {
                bianhao: "L5-16-1AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "范益明",
                time: "2022-2-23 09:52",
                amount1: "270.00",
                amount2: "18.90",
                amount3: "21.60",
              },
              {
                bianhao: "L5-16-2AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "范益明",
                time: "2022-2-23 10:33",
                amount1: "360.00",
                amount2: "25.20",
                amount3: "28.80",
              },
              {
                bianhao: "L5-16-3AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "范益明",
                time: "2022-2-23 12:00",
                amount1: "326.00",
                amount2: "22.82",
                amount3: "26.08",
              },
              {
                bianhao: "L5-16-4AM",
                wanchenggongyi: "校正",
                liang: "1件",
                name: "范益明",
                time: "2022-2-23 14:03",
                amount1: "344.00",
                amount2: "24.08",
                amount3: "27.52",
              },
            ],
          },
        ],
      },
      /* 车间工费的勾选数据 */
      multipleSelection: [],
      /* 项目工费的勾选数据 */
      multipleSelection1: [],
      //
      value: "",
      /* 项目工费的搜索可选项 */
      project: [
        {
          label: "江夏大道",
          value: "0",
        },
        {
          label: "南湖大道",
          value: "1",
        },
      ],
      /* 项目工费的表头内容 */
      colConfig: [
        /* 勾选框 */
        {
          attrs: { align: "center", type: "selection" },
        },
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
          attrs: { label: "工序", prop: "gongxu", align: "center" },
        },
        {
          attrs: {
            label: "工费预算(元)",
            prop: "budget",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "本月工费(元)",
            prop: "monthcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "累计工费(元)",
            prop: "totalcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "计划工费统计(元)",
            prop: "plancost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "工费差异(元)",
            prop: "differencecost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "progressreward",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "qualityreward",
            align: "center",
            sortable: true,
          },
        },
        {
          slot: "btns",
          attrs: { label: "操作", fixed: "right", width: 80, align: "center" },
        },
      ],
      /* 后端数据可以在此接收 */
      data2: {
        data: [
          {
            gongxu: "下料",
            budget: "138848.70",
            monthcost: "16222.00",
            totalcost: "16222.00",
            plancost: "20827.30",
            differencecost: "-4604.30",
            progressreward: "1135.61",
            qualityreward: "1297.84",
            detail: [
              {
                bianhao: "L3-16-1AM",
                wanchenggongyi: "划线",
                liang: "1件",
                name: "张翔",
                time: "2022-2-23 10:15",
                amount1: "5382.00",
                amount2: "376.74",
                amount3: "430.56",
              },
              {
                bianhao: "L3-16-1AM",
                wanchenggongyi: "切割",
                liang: "1件",
                name: "阮平",
                time: "2022-2-23 11:55",
                amount1: "4833.00",
                amount2: "338.31",
                amount3: "386.64",
              },
              {
                bianhao: "L3-16-1AM",
                wanchenggongyi: "坡口开制",
                liang: "1件",
                name: "范益明",
                time: "2022-2-23 13:58",
                amount1: "6007.00",
                amount2: "420.49",
                amount3: "480.56",
              },
            ],
          },
          // {
          //   gongxu: "机加",
          //   budget: "10882.60",
          //   monthcost: "6036.00",
          //   totalcost: "6036.00",
          //   plancost: "8706.08",
          //   differencecost: "-2670.08",
          //   progressreward: "422.52",
          //   qualityreward: "482.88",
          //   detail: [
          //     {
          //       bianhao: "L3-16-1AM",
          //       wanchenggongyi: "划线",
          //       liang: "1件",
          //       name: "权蓉子",
          //       time: "10:03",
          //       amount1: "100.00",
          //       amount2: "100.00",
          //       amount3: "100.00",
          //     },
          //     {
          //       bianhao: "L3-16-1AM",
          //       wanchenggongyi: "切割",
          //       liang: "1件",
          //       name: "权蓉子",
          //       time: "10:03",
          //       amount1: "100.00",
          //       amount2: "100.00",
          //       amount3: "100.00",
          //     },
          //     {
          //       bianhao: "L3-16-1AM",
          //       wanchenggongyi: "坡口开制",
          //       liang: "1件",
          //       name: "权蓉子",
          //       time: "10:03",
          //       amount1: "100.00",
          //       amount2: "100.00",
          //       amount3: "100.00",
          //     },
          //   ],
          // },
          {
            gongxu: "机加",
            budget: "10882.60",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
          {
            gongxu: "单元件",
            budget: "159400.90",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
          {
            gongxu: "总装",
            budget: "269562.80",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
          {
            gongxu: "涂装",
            budget: "177748.50",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
          {
            gongxu: "运输",
            budget: "271212.50",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
          {
            gongxu: "安装",
            budget: "521562.50",
            monthcost: "0",
            totalcost: "0",
            plancost: "0",
            differencecost: "0",
            progressreward: "0",
            qualityreward: "0",
            detail: [],
          },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {},
    //搜索
    hangleSelect() {},
    //树节点选择
    handleNodeClick(data) {},
    //对树节点进行筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //右侧头部搜索
    getFilterList() {},
    /* 车间花费的导出 */
    out() {},
    /* 项目花费的导出 */
    out1() {},
    /* 项目工费的多选 */
    workSelectionChange(val) {
      this.multipleSelection = val;
    },
    /* 车间工费详情 */
    workdetailsRow(row) {
      this.$router.push({
        name: "workshop-details",
        query: {
          row: JSON.stringify(row),
          //   designQaId:row.designQaId,
        },
      });
    },
    /* 项目工费详情 */
    projectdetailsRow(row) {
      //新增项目
      this.$router.push({
        name: "project-details",
        query: {
          row: JSON.stringify(row),
          //   designQaId:row.designQaId,
        },
      });
    },
    //项目工费的多选
    projectSelectionChange(val) {
      this.multipleSelection1 = val;
    },
  },
};
</script>

<style scoped lang="scss">
#main {
  height: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  .tab {
    height: 100%;
    padding: 16px 16px;
    box-sizing: border-box;
    /* 车间花费 */
    ::v-deep .el-tabs {
      height: 100%;
    }
    .workshop_cost {
      display: flex;
      height: 100%;
      flex-direction: row;
      box-sizing: border-box;
      border: 1px solid #e4e7ed;
      .left {
        height: 100%;
        flex: 0 0 322px;
        margin-right: 8px;
        padding: 16px;
        box-sizing: border-box;
        background-color: #fafafa;
        .selectBox {
          width: 100%;
          box-sizing: border-box;
          padding: 16px 0;
          .el-select {
            width: 85px;
          }
        }
        ::v-deep .el-tree-node__content {
          .el-tree-node__label {
            padding: 8px 0;
          }
        }
        .el-tree {
          background-color: #fafafa;
        }
      }
      .right {
        flex: 1;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow-x: auto;
        .m-sselect {
          height: 66px;
          background-color: #fff;
          padding: 0 16px;
          border-bottom: 1px solid #ebeef5;
        }
        .select-List {
          flex: 1;
          margin-top: 8px;
          background-color: #fff;
          padding: 10px 16px 0 16px;
          .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            p {
              font-size: 16px;
              font-weight: 700;
            }
            .navallBnt {
              .el-button {
                padding: 8px 20px;
                border-radius: 0;
              }
            }
          }
        }
      }
    }
    /* 项目花费 */
    .project_cost {
      .project_item {
        margin-bottom: 10px;
        .el-button {
          margin-left: 10px;
          border-radius: 0;
        }
      }
      .export {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10px;
        .project_name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
        .el-button {
          padding: 8px 20px;
          border-radius: 0;
        }
      }
    }
  }
}
</style>
