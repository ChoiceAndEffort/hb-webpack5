<!--工费统计-->
<template>
  <div id="main" class="prefabrication_box">
    <div class="tab">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="待检验" name="first">
          <div class="m-sselect">
            <linkage-search
              ref="linkagesarchone"
              :submit="true"
              submitContext="确定"
            ></linkage-search>
          </div>
          <!-- 车间费用 -->
          <div class="workshop_cost">
            <!-- 右侧部分 -->
            <div class="right">
              <!-- 表格介绍和内容导出 -->
              <div class="select-List">
                <!-- 导航 -->
                <div class="nav">
                  <p>武汉湖南路-联段1</p>
                  <div class="navallBnt">
                    <Form
                      ref="accountForm"
                      formName="accountForm"
                      width="auto"
                      :inline="true"
                      primary="primary"
                      size="small"
                      submitContext="确定"
                      :renderData="prefabricationData"
                    >
                    </Form>
                  </div>
                </div>
                <!-- 表格内容 -->
                <div>
                  <TableBody
                    :colConfig="colConfig"
                    :data="data1.data"
                    @selection-change="workSelectionChange"
                  >
                   <template slot="btns" slot-scope="{ scope }">
                  <el-button
                    size="mini"
                    type="text"
                    @click="projectdetailsRow(scope.row)"
                    >检验</el-button
                  >
                </template>
                  </TableBody>
                </div>
                <!-- 分页位置 -->
                <!-- <Pagination :data="data" @changePage="changePage" /> -->
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已检验" name="second">
          <div class="m-sselect">
            <linkage-search
              ref="linkagesarchtow"
              :submit="true"
              submitContext="确定"
            ></linkage-search>
          </div>
          <!-- 项目工费 -->
          <div class="project_cost">
            <!-- 项目名称和导出 -->
            <div class="nav">
              <p>武汉湖南路-联段1</p>
              <div class="navallBnt">
                <Form
                  ref="accountForm"
                  formName="accountForm"
                  width="auto"
                  :inline="true"
                  primary="primary"
                  size="small"
                  submitContext="确定"
                  :renderData="prefabricationDatas"
                >
                  <el-button
                    slot="slot-search"
                    slot-scope="{ scope }"
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="paiges"
                    >修改派工</el-button
                  >
                </Form>
              </div>
            </div>
            <!-- 项目的内容 -->
            <div>
              <TableBody
                :colConfig="colConfig1"
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
            <!-- 分页位置 -->
            <!-- <Pagination :data="data" @changePages="changePage" /> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
//引入组件
import { TableBody, Form } from "gggj_lib";
import linkageSearch from "../components/linkageSearch.vue";
export default {
  //注册组件
  components: { Form, TableBody, linkageSearch },
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
      // 已下单右侧头部内容
      prefabricationDatas: [
        {
          tag: "el-select",
          attrs: {
            key: "loginPwd",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "责任单位",
            "show-password": true,
          },
        },
        {
          tag: "el-date-picker",
          attrs: {
            key: "pickervalue",
            type: "date",
            value: "",
            placeholder: "选择完成时间",
          },
        },
        {
          tag: "el-select",
          attrs: {
            key: "loginPwds",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "全部",
            "show-password": true,
          },
        },
        {
          tag: "reset", // 重置按钮
        },
        {
          tag: "submit", // 提交按钮
        },
        {
          slot: "slot-search",
          attrs: {
            key: "loginPwd",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "请选择",
            "show-password": true,
          },
        },
      ],
      /* 右侧头部内容 */
      prefabricationData: [
        {
          tag: "el-select",
          attrs: {
            key: "loginPwd",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "工艺",
            "show-password": true,
          },
        },{
          tag: "el-select",
          attrs: {
            key: "loginPwd",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "厂区",
            "show-password": true,
          },
        },
        {
          tag: "el-date-picker",
          attrs: {
            key: "pickervalue",
            type: "date",
            value: "",
            placeholder: "选择完成时间",
          },
        },
        {
          tag: "reset", // 重置按钮
        },
        {
          tag: "submit", // 提交按钮
        },
        {
          slot: "slot-search",
          attrs: {
            key: "loginPwd",
            type: "text",
            options: [
              {
                value: 1,
                label: "测试",
              },
            ],
            value: "",
            placeholder: "请选择",
            "show-password": true,
          },
        },
      ],
      headerData: [
        {
          code: "auditStatus",
          title: "状态",
          type: "select",
          width: "180px",
          options: [
            { label: "状态1", value: 1 },
            { label: "状态2", value: 2 },
            { label: "状态3", value: 3 },
          ],
        },
        {
          code: "dateTime",
          title: "时间",
          // DateType: "daterange",
          type: "mergeDate",
          width: "180px",
          // titleEnd: "时间范围",
        },
      ],
      //右侧头部查询
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
          attrs: { label: "零件编号", prop: "gongxu", align: "center" },
        },
        {
          attrs: {
            label: "数量",
            prop: "budget",
            align: "center",
          },
        },
        {
          attrs: {
            label: "责任单位",
            prop: "monthcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "工单工艺",
            prop: "totalcost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "工作量米",
            prop: "differencecost",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "计划完成时间",
            prop: "progreward",
            align: "center",
            sortable: true,
          },
        },
        {
          slot: "progres",
          attrs: {
            label: "工单状态",
            prop: "progres",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "工单完成时间",
            prop: "progressreward",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "定额(元)",
            prop: "qualityreward",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "qualityreward",
            align: "center",
            sortable: true,
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "qualityreflex",
            align: "center",
            sortable: true,
          },
        },
        {
          slot: "btns",
          attrs: {
            label: "操作",
            prop: "btns",
            align: "center",
            fixed: "right",
          },
        },
      ],
      /* 后端数据可以在此接收 */
      data2: {
        data: [
          {
            gongxu: "下料下料下料",
            budget: "1000",
            monthcost: "1000",
            totalcost: "1000",
            differencecost: "1000",
            progreward: "1000",
            progres:"已报工",
            progressreward: "1000",
            qualityreward: "1000",
            qualityreflex: "1000",
            pposdas: "-",
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
          attrs: { label: "物料编号", prop: "gongxu", align: "center" },
        },
        {
          attrs: {
            label: "工序",
            prop: "budget",
            align: "center",
          },
        },
        {
          attrs: {
            label: "工艺",
            prop: "monthcost",
            align: "center",
          },
        },
        {
          attrs: {
            label: "申请车间",
            prop: "totalcost",
            align: "center",
          },
        },
        {
          attrs: {
            label: "申请人",
            prop: "differencecost",
            align: "center",
          },
        },
        {
          attrs: {
            label: "申请时间",
            prop: "progressreward",
            align: "center",
          },
        },
        {
          slot: "btns",
          attrs: {
            label: "操作",
            prop: "btns",
            align: "center",
            fixed: "right",
          },
        },

      ],
      /* 后端数据可以在此接收 */
      data1: {
        data: [
          {
            gongxu: "下料下料下料",
            budget: "1000",
            monthcost: "1000",
            totalcost: "1000",
            differencecost: "1000",
            progressreward: "1000",
            btns: "操作",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
    },
    //搜索
    hangleSelect() {
    },
    //树节点选择
    handleNodeClick(data) {
    },
    //对树节点进行筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //右侧头部搜索
    getFilterList() {
    },
    // 点击详情
    projectdetailsRow(index, row) {
      //新增项目
      this.$router.push({
        name: "qualityes",
        query: {
          //   designQaId:row.designQaId,
        },
      });
    },

  }
};
</script>

<style scoped lang="scss">
.prefabrication_box {
  .m-sselect {
    margin: 0 0 10px 10px;
  }
}
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
              display: flex;
              .order-distribution {
                padding-top: 10px;
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
      }
    }
  }
}
.project_cost {
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
      display: flex;
      .order-distribution {
        padding-top: 10px;
      }
    }
  }
}


</style>
