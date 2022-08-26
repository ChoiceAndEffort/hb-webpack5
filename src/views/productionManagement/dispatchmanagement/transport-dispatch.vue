<template>
  <div class="wrap">
    <search ref="searchDispatch"
      :renderData="renderData.searchDispatch"
      @handle-submit="dispatchSearch"
      @handle-reset="handleReset"
      v-show="activeName == 0"
      key="searchone">
    </search>
    <search ref="searchDispatched"
      :renderData="renderData.searchDispatched"
      @handle-submit="dispatchSearch"
      @handle-reset="handleReset"
      v-show="activeName == 1"
      key="searchtwo">
    </search>
    <div class="wrap-content">
      <div class="content-header">
        <p>{{ title }}</p>
        <div>
          <el-radio-group v-model="activeName"
            @change="handleRadioChange">
            <el-radio-button :label="0">待派工工单</el-radio-button>
            <el-radio-button :label="1">已派工工单</el-radio-button>
          </el-radio-group>

          <el-button :style="{marginLeft: '20px'}"
            type="primary"
            v-if="activeName === 0"
            @click="handleDispatch">工单派工</el-button>
        </div>
      </div>
      <TableBody @selection-change="handleSelectionChange"
        v-loading="loading"
        :key="colKey"
        :data="data"
        :colConfig="colConfig">
        <template #index="{scope}">
          <!-- 序号 -->
          <span>{{indexMethod(scope.$index)}}</span>
        </template>
        <template #transportOrderType="{scope}">
          <!-- 工单类型的数据 -->
          <span>{{transportTypeFilter(scope.row,scope.column,scope.row.transportOrderType)}}</span>
        </template>
        <template #plannedTime="{scope}">
          <!-- 过滤时间 -->
          <span>{{tableTimeFilter(scope.row,scope.column,scope.row.plannedTime)}}</span>
        </template>
        <template #startTime="{scope}">
          <span>{{tableTimeFilter(scope.row,scope.column,scope.row.startTime)}}</span>
        </template>
        <!-- <template #couplingName='{scope}'>
          <span>{{scope.row.processName}}</span>
        </template> -->
        <template #operation="{scope}">
          <el-button type="text"
            @click="handleDetail(scope)">查看详情</el-button>
          <!-- <el-button type="text" @click="handleEdit(scope)">编辑</el-button> -->
        </template>
      </TableBody>
      <Pagination :data="pageData"
        @changePage="handleChangePage" />
    </div>
  </div>
</template>

<script>
//引入组件
import { TableBody, Form, Pagination } from "gggj_lib";
import Search from "../components/search.vue";
import { getTransDispatch } from "@/api/productionManagement/dispatch"
import {
  getEngineeringProjectList,
  getCouplinglist
} from "@/api/productionManagement/project.js";
import { getRoundsPlan, getTransPlan, nullifyPlan } from '@/api/productionManagement/transport.js'
// 工具函数tableTimeFilter时间化处理
import { indexMethod, tableTimeFilter } from '@/utils/productionManagement/tool'
export default {
  //注册组件
  components: {
    Form,
    TableBody,
    Pagination,
    Search,
  },
  data() {
    return {
      // 加载
      loading: false,
      // 项目名
      title: '',
      // 待派工/已派工
      activeName: 0,
      // 查询数据
      model: {},
      // 搜索栏数据
      renderData: {
        searchDispatch: [
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
              clear: this.returnTitle
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
            listeners: {
              change: this.handleCouplingChange,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-select",
            label: "轮次",
            attrs: {
              key: "roundsPlanId",
              options: [],
              placeholder: "请选择轮次",
            },
          },
          {
            tag: "el-date-picker",
            label: "需求日期",
            attrs: {
              "value-format": "yyyy-MM-dd",
              key: "touchTime",
              type: "date",
              placeholder: "请选择时间",
            },
          },
          {
            tag: "el-date-picker",
            label: "计划完成日期",
            attrs: {
              "value-format": "yyyy-MM-dd",
              key: "plannedTime",
              type: "date",
              placeholder: "请选择时间",
            },
          },
        ],
        searchDispatched: [
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
              clear: this.returnTitle
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
            listeners: {
              change: this.handleCouplingChange,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-select",
            label: "轮次",
            attrs: {
              key: "roundsPlanId",
              options: [],
              placeholder: "请选择轮次",
            },
          },
          {
            tag: "el-date-picker",
            label: "需求日期",
            attrs: {
              "value-format": "yyyy-MM-dd",
              key: "touchTime",
              type: "date",
              placeholder: "请选择时间",
            },
          },
          {
            tag: "el-date-picker",
            label: "计划完成日期",
            attrs: {
              "value-format": "yyyy-MM-dd",
              key: "plannedTime",
              type: "date",
              placeholder: "请选择时间",
            },
          },
        ]
      },
      // 分页数据
      pageData: {
        page: 0,
        size: 10,
        total: 0
      },
      // 表格数据
      data: [],
      // 表格字段配置
      pubColConfig: [
        { attrs: { 'width': "64", fixed: 'left', type: "selection", align: "center", } },
        { slot: "index", attrs: { label: "序号", 'width': "64", fixed: 'left' } },
        { slot: 'transportOrderType', attrs: { label: "工单类型", prop: "transportOrderType", "min-width": "80" } },
        { attrs: { label: "工艺", prop: "processName", "min-width": "50" } },
        { attrs: { label: "计划运输轮次", prop: "roundsPlanName", "min-width": "160" } },
        { attrs: { label: "车次编号", prop: "transportOrderCode", "min-width": "160" } },
        // { attrs: { label: "车次名称", prop: "workReportOrderId", "min-width": "160" } },
        { attrs: { label: "物料数量", prop: "goodsNum", "min-width": "160" } },
        { attrs: { label: "物料重量(千克)", prop: "weight", "min-width": "160" } },
        { attrs: { label: "需求时间", prop: "touchTime", "min-width": "160" } },
        { slot: 'plannedTime', attrs: { label: "计划完成时间", prop: "plannedTime", "min-width": "160" } },
        { attrs: { label: "工单状态", prop: "transportOrderStatusName", "min-width": "160" } },
        { slot: 'startTime', attrs: { label: "工单完成时间", prop: "arriveTime", "min-width": "160" } },
        { attrs: { label: "报工人", prop: "reportName", "min-width": "160" } },
        { attrs: { label: "备注", prop: "departmentName", "min-width": "200" } },
        { slot: "operation", attrs: { label: "操作", "width": "120", fixed: 'right', align: "center" } },
      ],
      colConfig: [],
      // 搜索框组件数组
      searchComp: ['searchDispatch', 'searchDispatched'],
      // 列表渲染key
      colKey: 0,
      // 选中数据
      selectList: []
    };
  },
  created() {
    let tempCol = JSON.parse(JSON.stringify(this.pubColConfig))
    this.colConfig = [].concat(tempCol.slice(0, 9), tempCol.slice(-2, -1))
    this.initRequest()
    this.getTransDispatchData()
  },
  mounted() { },
  methods: {
    // 获取数据
    async getTransDispatchData(params = {}) {
      this.loading = true
      let res = await getTransDispatch({
        ...params,
        ...this.pageData,
        isDispatched: this.activeName ? 1 : 0
      })
      // console.log(res.data.data, 'res');
      this.data = res.data.data
      this.pageData = { ...res.data }
      this.loading = false
    },
    // 自定义列表
    indexMethod,
    // 过滤时间
    tableTimeFilter,
    // 过滤工单类型
    transportTypeFilter(row, column, cellValue, index) {
      if (typeof cellValue !== 'number')
        return ''
      switch (cellValue) {
        case 0: return '产品类';
        case 1: return '非产品类';
        case 2: return '内厂转运';
      }
    },
    // 获取项目列表
    async initRequest() {
      let res;
      res = await getEngineeringProjectList({ status: 1 });
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      Object.keys(this.renderData).forEach(item => {
        this.renderData[item][0].attrs.options = res.data
      })
    },
    // 清空事件
    selectClear(type) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]];
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      // curSearchData[3].attrs.options = []
      // curSearchComp.formData.transPlanId = ""
      switch (type) {
        case 'all': { curSearchComp.formData.engineeringProjectId = "" }
        case 'project': {
          curSearchData[1].attrs.options = []
          curSearchComp.formData.couplingId = ""
        }
        case 'coupling': {
          curSearchData[2].attrs.options = []
          curSearchComp.formData.roundsPlanId = ""
        }
        default: break;
      }
      if (type == 'all') {
        curSearchComp.formData.pickervalue = ""
        curSearchComp.formData.pickerneedvalue = ""
      }
    },
    // 项目切换 获取联段
    async handleProjectChange(value) {
      let res;
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      // 清空联段 工序
      this.selectClear('project')
      if (value) {
        res = await getCouplinglist({
          engineeringProjectId: value,
        });
        res.data.forEach((item) => {
          item.value = item.couplingId;
          item.label = item.name;
        });
        curSearchData[1].attrs.options = res.data
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 联段切换 获取工序
    async handleCouplingChange(value) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]]
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      const { engineeringProjectId } = curSearchComp.formData
      let res;
      // 清空工序
      this.selectClear('coupling')
      // res = await getRoundsPlan({
      //   engineeringProjectId,
      //   couplingId: value,
      //   workingProcedureCode: 'GX_YS',
      //   page: 0,
      //   size: 10
      // });
      // res.data.forEach(item => {
      //   item.label = item.name
      //   item.value = item.roundsPlanId
      // })
      // curSearchData[2].attrs.options = res.data
      this.returnTitle();
      this.handleResetPage();
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2;
        title = value1 = value2 = "";
        const curSearchComp = this.$refs[this.searchComp[this.activeName]];
        const { selectCoupling, selectProject } = curSearchComp.$refs
        value1 = selectProject.selectedLabel
        value2 = selectCoupling.selectedLabel
        title = `${value1}${value2 ? " - " + value2 : ""}`;
        this.title = title
      })
    },
    dispatchSearch(model) {
      this.model = model
      this.getTransDispatchData(model)
    },
    // 按钮切换
    handleRadioChange() {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]]
      this.model = curSearchComp.formData
      let tempCol = JSON.parse(JSON.stringify(this.pubColConfig))

      this.getTransDispatchData(this.model)
      this.title = this.returnTitle()
      this.activeName ?
        this.colConfig = tempCol.slice(1) :
        this.colConfig = [].concat(tempCol.slice(0, 9), tempCol.slice(-2, -1))
    },
    // 选中事件
    handleSelectionChange(list) {
      // console.log(list, 'list');
      this.selectList = list
    },
    // 工单派工
    handleDispatch() {
      this.$router.push({
        name: 'transport-dispatch-add',
        query: {
          list: JSON.stringify(this.selectList)
        }
      })
    },
    // 修改派工
    handleDispatchEdit() {

    },
    // 查看详情
    handleDetail(scope) {
      this.$router.push({
        name: 'transport-dispatch-detail',
        query: {
          transportOrderId: scope.row.transportOrderId
        }
      })
    },
    // 编辑派工
    handleEdit(scope) {

    },
    // 重置
    handleReset() {
      this.selectClear('all')
    },
    // 重置分页
    handleResetPage() {
      this.pageData.page = 0
      this.pageData.size = 10
    },
    // 分页事件
    handleChangePage(page) {
      this.pageData.page = page
      this.getTransDispatchData(this.model)
    }
  },
  watch: {
    colConfig: {
      handler(newValue, oldValue) {
        this.colKey = Date.now().valueOf()
      }
    }
  }
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
    }
  }
}
</style>
