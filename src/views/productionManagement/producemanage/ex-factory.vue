<template>
  <div class="wrap">
    <search
      ref="search"
      :renderData="productState ? renderData.productNon : renderData.product"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"
    ></search>
    <div class="wrap-content">
      <div class="content-header">
        <p>产品类运输列表</p>
        <template v-if="productState === 0">
          <el-radio-group v-model="transportState" @change="handleRadioChange">
            <el-radio-button :label="0">待出厂</el-radio-button>
            <!-- <el-radio-button :label="1">已配车</el-radio-button> -->
            <el-radio-button :label="2">已运输</el-radio-button>
          </el-radio-group>
        </template>
        <template v-else>
          <el-button type="primary" icon="el-icon-plus" @click="handleDemand"
            >新增运输需求</el-button
          >
        </template>
      </div>
      <TableBody :data="tableData.data" :colConfig="colConfig">
        <template #index="{ scope }">
          <span>{{ indexMethod(scope.$index) }}</span>
        </template>
        <template #paint="{ scope }">
          <span
            :class="[
              scope.row.paintStatus ? 'status-pass' : 'status-fail',
              'origin',
            ]"
            >{{ scope.row.paintStatus ? "合格" : "不合格" }}</span
          >
        </template>
        <template #approve="{ scope }">
          <span
            :class="[
              scope.row.approveStatus ? 'approved' : 'unapproved',
              'origin',
            ]"
            >{{ scope.row.approveStatus ? "已审批" : "审批中" }}</span
          >
        </template>
        <template #transportOrderType="{ scope }">
          <span>{{
            scope.row.transportOrderType == 0
              ? "产品类"
              : scope.row.transportOrderType == 1
              ? "非产品类"
              : "内厂转运"
          }}</span>
        </template>
        <template slot="transportOrderStatus" slot-scope="{ scope }">
          <template v-for="(item, index) in transportOrderStatus">
            <p :key="index" v-if="item.value == scope.row.transportOrderStatus">
              <el-tag
                :type="
                  item.value == 0 ? 'danger' : item.value == 1 ? 'warning' : ''
                "
                >{{ item.label }}</el-tag
              >
            </p>
          </template>
        </template>
        <template #transitTime="{ scope }">
          <span>{{ shortTime(scope.row.transitTime) }}</span>
        </template>
        <template #btn="{ scope }">
          <el-button type="text" @click="handleOperation(scope.row)"
            >详情</el-button
          >
        </template>
        <template #btns="{ scope }">
          <el-button type="text" @click="handleBtn(scope.row)">作废</el-button>
        </template>
      </TableBody>

      <Pagination
        :data="tableData"
        @size-change="handleSizeChange"
        @changePage="handlePageChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script>
// 引入第三方组件库 gggj_lib
import { TableBody, Pagination } from "gggj_lib";
import { indexMethod, shortTime } from "@/utils/productionManagement/tool";
import {
  pageOfLeaveFactoryInventory,
  cancelTransportTask,
} from "@/api/productionManagement/producemanage.js";
import {
  getEngineeringProjectList,
  getProjectpage,
  getCouplinglist,
  getCouplingpage,
} from "@/api/productionManagement/project.js";

// 部门数据
import { getDepartmentList } from "@/api/productionManagement/departmentRole.js";

import search from "@/views/productionManagement/components/search.vue";

export default {
  components: {
    TableBody,
    Pagination,
    search,
  },
  data() {
    return {
      // 按钮组 状态
      transportState: 0,
      // 产品/非产品 状态
      productState: 0,
      // 搜索数据
      searchData: {},
      // 搜索栏渲染数据
      renderData: {
        product: [
          {
            tag: "el-select",
            label: "出厂类型",
            attrs: {
              ref: "selectExFactoryType",
              key: "exFactoryType",
              options: [
                {
                  value: "0",
                  label: "产品类",
                },
                {
                  value: "1",
                  label: "非产品类",
                },
              ],
              value: "0",
            },
            listeners: {
              change: this.handleProductChange,
            },
          },
          {
            tag: "el-select",
            label: "厂区选择",
            attrs: {
              ref: "selectFactoryRegion",
              key: "factoryRegion",
              options: [],
              placeholder: "请选择厂区",
            },
          },
          {
            tag: "el-select",
            label: "项目名称",
            attrs: {
              ref: "selectProject",
              key: "engineeringProjectId",
              options: [],
              placeholder: "请选择项目",
            },
            listeners: {
              change: this.handleProjectChange,
            },
          },
          {
            tag: "el-select",
            label: "项目联段",
            attrs: {
              ref: "selectCoupling",
              key: "couplingId",
              options: [],
              placeholder: "请选择联段",
            },
            listeners: {},
          },
          {
            tag: "el-input",
            label: "物料编号",
            attrs: {
              ref: "inputMaterialNumber",
              key: "materialNumber",
              placeholder: "请输入物料编号",
            },
          },
          {
            tag: "el-date-picker",
            label: "时间",
            attrs: {
              key: "pickervalue",
              type: "daterange",
              "start-placeholder": "开始日期",
              "end-placeholder": "结束日期",
              "value-format": "yyyy-MM-dd",
            },
          },
        ],
        productNon: [
          {
            tag: "el-select",
            label: "出厂类型",
            attrs: {
              ref: "selectExFactoryType",
              key: "exFactoryType",
              options: [
                {
                  value: "0",
                  label: "产品类",
                },
                {
                  value: "1",
                  label: "非产品类",
                },
              ],
              value: "1",
            },
            listeners: {
              change: this.handleProductChange,
            },
          },
          {
            tag: "el-select",
            label: "厂区选择",
            attrs: {
              ref: "selectFactoryRegion",
              key: "factoryRegion",
              options: [],
              placeholder: "请选择厂区",
            },
          },
          {
            tag: "el-select",
            label: "项目名称",
            attrs: {
              ref: "selectProject",
              key: "engineeringProjectId",
              options: [],
              placeholder: "请选择项目",
            },
          },
          {
            tag: "el-input",
            label: "物料编号",
            attrs: {
              ref: "inputMaterialNumber",
              key: "materialNumber",
              placeholder: "请输入物料编号",
            },
          },
          {
            tag: "el-date-picker",
            label: "时间",
            attrs: {
              key: "pickervalue",
              type: "daterange",
              "start-placeholder": "开始日期",
              "end-placeholder": "结束日期",
              "value-format": "yyyy-MM-dd",
            },
          },
        ],
      },
      // 列表配置数据
      config: {
        // 基础列配置
        baseCol: [
          { slot: "index", attrs: { label: "序号", "min-width": "48" } },
          {
            attrs: {
              label: "项目名称",
              prop: "engineeringProjectName",
              "min-width": "234",
            },
          },
          {
            attrs: {
              label: "联段名称",
              prop: "couplingName",
              "min-width": "180",
            },
          },
        ],
        // 车牌号列配置
        licenseCol: [
          { attrs: { label: "车辆牌照", prop: "license", "min-width": "160" } },
        ],
        // 运输信息列配置
        transportCol: [
          {
            attrs: {
              label: "重量(千克)",
              prop: "weight",
              width: 92,
              align: "right",
            },
          },
          {
            attrs: {
              label: "计划运输时间",
              prop: "planTime",
              "min-width": "140",
            },
          },
          { attrs: { label: "厂区", prop: "plant", "min-width": "120" } },
        ],
        // 涂装状态列配置
        paintingCol: [
          {
            slot: "paint",
            attrs: {
              label: "涂装工序检验状态",
              prop: "paintStatus",
              "min-width": "160",
            },
          },
        ],
        // 待出厂配置
        factoryCol: [
          {
            slot: "transportOrderType",
            attrs: {
              label: "运单类型",
              prop: "transportOrderType",
              "min-width": "160",
            },
          },
          {
            attrs: {
              label: "运输轮次计划",
              prop: "roundsPlanName",
              "min-width": "160",
            },
          },
          {
            attrs: {
              label: "车次编号",
              prop: "transportOrderCode",
              "min-width": "160",
            },
          },
          {
            attrs: { label: "最大高度（mm）", prop: "maxHeight", width: "160" },
          },
          {
            attrs: { label: "最大宽度（mm）", prop: "maxWidth", width: "160" },
          },
          {
            attrs: {
              label: "运输时间",
              prop: "transitTime",
              width: "160",
            },
          },
          {
            slot: "transportOrderStatus",
            attrs: {
              label: "运单状态",
              prop: "transportOrderStatus",
              width: "160",
            },
          },
          { slot: "btns", attrs: { label: "操作", width: "60" } },
        ],
        // 已配车列配置
        carCol: [
          {
            attrs: { label: "重量（kg）", prop: "weight", "min-width": "100" },
          },
          {
            slot: "transitTime",
            attrs: {
              label: "运输时间",
              prop: "transitTime",
              "min-width": "140",
            },
          },
          {
            attrs: {
              label: "车辆牌照",
              prop: "transportOrderCode",
              "min-width": "160",
            },
          },
          {
            attrs: { label: "厂区", prop: "plantAreaName", "min-width": "120" },
          },
          {
            attrs: { label: "流程单号", prop: "ProcessNo", "min-width": "160" },
          },
          {
            slot: "approve",
            attrs: {
              label: "运输状态",
              prop: "approveStatus",
              "min-width": "160",
            },
          },
          { slot: "btn", attrs: { label: "操作", fixed: "right", width: 60 } },
        ],
        // 已运输列配置
        completeCol: [
          {
            attrs: {
              label: "运输轮次计划",
              prop: "roundsPlanName",
              "min-width": "140",
            },
          },
          {
            attrs: {
              label: "车次编号",
              prop: "transportOrderCode",
              "min-width": "160",
            },
          },
          {
            attrs: {
              label: "物料重量（kg）",
              prop: "procedureId",
              "min-width": "160",
            },
          },
          {
            attrs: {
              label: "计划完成时间",
              prop: "procedureId",
              "min-width": "160",
            },
          },
          { attrs: { label: "实际", prop: "procedureId", "min-width": "60" } },
          // { slot: "btn", attrs: { label: "操作", fixed: "right", width: 60 } },
        ],
      },
      /* 运输单状态 */
      transportOrderStatus: [
        {
          label: "待配车",
          value: 0,
        },
        {
          label: "已配车",
          value: 1,
        },
        {
          label: "待装车",
          value: 2,
        },
        {
          label: "待装车",
          value: 2,
        },
        {
          label: "运输中",
          value: 3,
        },
        {
          label: "已运输",
          value: 4,
        },
        {
          label: "已做废",
          value: 5,
        },
      ],
      // 表格配置项
      colConfig: [],
      // 表格数据
      tableData: [],
      pageTotal: {
        page: 0,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    // 获取项目列表
    this.initRequest();
    // 初始化表格列
    this.handleRadioChange(0);
    this.pageOfLeave()
  },
  mounted() {},
  methods: {
    // 获取项目列表
    async initRequest() {
      let { data: res } = await getEngineeringProjectList({
        status: 1,
      });
      res.forEach((ele) => {
        ele.label = ele.name;
        ele.value = ele.engineeringProjectId;
      });
      this.renderData.product[2].attrs.options = res;
      this.renderData.productNon[2].attrs.options = res;

    },
    async pageOfLeave(){
      let serli = await pageOfLeaveFactoryInventory({
        factoryType: 0,
        factoryStatus: 0,
        ...this.pageTotal
      })
      this.tableData = serli.data

    },
    // 自定义列方法
    indexMethod,
    shortTime,
    // 产品/非产品下拉事件
    handleProductChange(item) {
      
    },
    // 项目框下拉事件
    async handleProjectChange(item) {
      let { data: res } = await getCouplinglist({
        engineeringProjectId: item,
      });
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.couplingId;
      });
      this.renderData.product[3].attrs.options = res;
    },
    // 按钮组切换事件
    handleRadioChange(item) {
      let temp = [];
      const {
        baseCol,
        factoryCol,
        paintingCol,
        licenseCol,
        transportCol,
        completeCol,
        carCol,
      } = this.config;
      this.transportState = item;
      switch (item) {
        // concat 用于合并数组的方法，返回一个新数组
        // slice 数组中截取字符的方法,start从包含某元素开始，end结束（不包含某元素）
        case 0:
          temp = temp.concat(baseCol, factoryCol);
          break;
        case 1:
          temp = temp.concat(baseCol, carCol);
          break;
        case 2:
          temp = temp.concat(baseCol, licenseCol, transportCol, completeCol);
          break;
        default:
          temp = temp.concat(
            baseCol.slice(0, 2),
            licenseCol,
            transportCol,
            carCol
          );
          break;
      }
      this.colConfig = temp;
    },

    // 新增需求
    handleDemand() {
      this.$router.push({
        name: "ex-factory-add",
      });
    },
    // 操作事件
    handleOperation(row) {
      console.log(row, "rowFactory");
      this.$router.push({
        name: "ex-factory-detail",
        query: {
          row: JSON.stringify(row),
          transportOrderId: row.transportOrderId,
        },
      });
    },
    // 作废
    handleBtn(row) {
      console.log(row);
      this.$confirm(`此操作将作废该条数据，是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          cancelTransportTask({
            leaveFactoryInventoryId: row.transportOrderId,
          }).then((res) => {
            console.log(res, "清除id");
            this.$message.success("作废成功");
          });
        })
        .catch((_) => {
          this.$message.info("已取消");
        });
    },
    // 搜索框确认事件
    async handleSubmit(data) {
      const { exFactoryType, couplingId, engineeringProjectId } = data;
      if (!exFactoryType) {
        this.$message.warning("请选择出厂类型！");
        return;
      }
      let state = parseInt(exFactoryType);
      this.productState = state;
      state ? this.handleRadioChange(1) : this.handleRadioChange(0);

      let obj = {
        factoryType: exFactoryType,
        factoryStatus: this.transportState == 0 ? 0 : 2,
        ...data
      }
      let res = await pageOfLeaveFactoryInventory(obj);
      // console.log(res, 'ms45');
    },
    // 搜索框重置事件
    handleReset() {},
    // 页码切换
    handlePageChange(page) {
      this.pageTotal.page = page
      this.pageOfLeave()
    },
    // 页展示个数切换
    handleSizeChange(size) {
      // console.log(`每页${size}条数`);
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .wrap-content {
    flex: 1;
    background-color: #fff;
    padding: 16px;
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    ::v-deep .el-table {
      .origin::before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .status-pass::before {
        background-color: #409eff;
      }
      .status-fail::before {
        background-color: #fa5555;
      }
      .approved::before {
        background-color: #1678ff;
      }
      .unapproved::before {
        background-color: #fa8e55;
      }
    }
  }
}
</style>
