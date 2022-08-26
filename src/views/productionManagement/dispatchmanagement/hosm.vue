<!--工费统计-->
<template>
  <div id="main" class="prefabrication_box fa_box flex_column_space">
    <search
      ref="searchDispatch"
      :renderData="renderData.searchDispatch"
      @handle-submit="dispatchSearch"
      @handle-reset="handleReset"
      v-show="activeName == 0"
      key="searchone"
    >
    </search>
    <search
      ref="searchDispatched"
      :renderData="renderData.searchDispatched"
      @handle-submit="dispatchSearch"
      @handle-reset="handleReset"
      v-show="activeName == 1"
      key="searchtwo"
    >
    </search>
    <div class="tab bf">
      <div class="flex_row_space">
        <p>{{ title }}</p>
        <div>
          <el-radio-group v-model="activeName" @change="handleClick">
            <el-radio-button :label="0">待派工工单</el-radio-button>
            <el-radio-button :label="1">已派工工单</el-radio-button>
          </el-radio-group>
          <el-button
            class="margin_l_10px"
            type="primary"
            size="small"
            icon="el-icon-s-custom"
            @click="workSelectionChange"
            v-if="jobOrderDetailedIds.length > 0"
            >派工</el-button
          >
        </div>
      </div>
      <!-- 未下发工单 -->
      <div v-if="activeName == 0" class="workshop_cost">
        <!-- 右侧部分 -->
        <div class="right">
          <!-- 表格介绍和内容导出 -->
          <div class="select-List">
            <!-- 导航 -->
            <!-- 表格内容 -->
            <div>
              <TableBody
                key="dispatch"
                :colConfig="
                  dispatchSearchData[activeName].workingProcedureCode == 'GX_XL'
                    ? selection.concat(colConfig, colConfigbe)
                    : dispatchSearchData[activeName].workingProcedureCode ==
                      'GX_TZ'
                    ? selection.concat(tzColConfig)
                    : selection.concat(otcolConfig)
                "
                :data="beissuedData.data"
                :row-key="getRowKeys"
                @selection-change="listSelectionChange"
                border
                v-loading="isLoading"
              >
                <template slot="plannedTime" slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="workload" slot-scope="{ scope }">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      <div class="flex_row_space">
                        <p>外表面: {{ scope.row.outsideArea }}m²</p>
                        <p class="margin_l_10px">
                          内表面: {{ scope.row.internalArea }}m²
                        </p>
                      </div>
                      <br />
                      <div class="flex_row_space">
                        <p>顶板面: {{ scope.row.topArea }}m²</p>
                        <p class="margin_l_10px">
                          摩擦面: {{ scope.row.frictionArea }}m²
                        </p>
                      </div>
                    </div>
                    <p>{{ scope.row.workload }}</p>
                  </el-tooltip>
                </template>
              </TableBody>
              <Pagination
                :data="beissuedData"
                @changePage="(e) => changePage(e, 0)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 已下发工单 -->
      <div v-if="activeName == 1" class="workshop_cost">
        <!-- 右侧部分 -->
        <div class="right">
          <!-- 表格介绍和内容导出 -->
          <div class="select-List">
            <!-- 导航 -->
            <!-- 表格内容 -->
            <div>
              <TableBody
                key="dispatched"
                :colConfig="
                  dispatchSearchData[activeName].workingProcedureCode == 'GX_XL'
                    ? colConfig.concat(colConfiged)
                    : dispatchSearchData[activeName].workingProcedureCode ==
                      'GX_TZ'
                    ? tzColConfig.concat(otcolConfiged)
                    : otcolConfig.concat(otcolConfiged)
                "
                :data="issuedData.data"
                border
                v-loading="isLoading"
              >
                <template slot="plannedTime" slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="reportStatus" slot-scope="{ scope }">
                  <template v-for="item in reportStatus">
                    <p :key="item.value">
                      <el-tag
                        v-if="item.value == scope.row.reportStatus"
                        :type="item.type"
                        >{{ item.label }}</el-tag
                      >
                    </p>
                  </template>
                </template>
                <template slot="viewwork" slot-scope="{ scope }">
                  <el-button
                    size="small"
                    type="primary"
                    @click="viewworkReport(scope.row)"
                    >详情</el-button
                  >
                </template>
                <template slot="workload" slot-scope="{ scope }">
                  <el-tooltip class="item" effect="dark" placement="top">
                    <div slot="content">
                      <div class="flex_row_space">
                        <p>外表面: {{ scope.row.outsideArea }}m²</p>
                        <p class="margin_l_10px">
                          内表面: {{ scope.row.internalArea }}m²
                        </p>
                      </div>
                      <br />
                      <div class="flex_row_space">
                        <p>顶板面: {{ scope.row.topArea }}m²</p>
                        <p class="margin_l_10px">
                          摩擦面: {{ scope.row.frictionArea }}m²
                        </p>
                      </div>
                    </div>
                    <p>{{ scope.row.workload }}</p>
                  </el-tooltip>
                </template>
              </TableBody>
              <Pagination
                :data="issuedData"
                @changePage="(e) => changePage(e, 1)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
  getProjectProcessList,
} from "@/api/productionManagement/project.js";
import {
  findJobOrderPage,
  findMaterialOrderPage,
  getjobOrderdetailed,
  getmaterialOrderdetailed,
  workOrderDistribution,
} from "@/api/productionManagement/dispatch.js";
import {
  getNestingList,
  getNestingPoolList,
} from "@/api/productionManagement/projectMasterPlan";
//引入组件
// import moment from "moment";
import { TableBody, Form, Pagination } from "gggj_lib";
import Search from "../components/search.vue";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
import { format } from "date-fns";
export default {
  //注册组件
  components: { Form, TableBody, Search , Pagination },
  data() {
    return {
      // 项目名
      title: "",
      // 加载状态
      isLoading: false,
      activeName: 0,
      //搜索
      input3: "",
      //选择部门还是公司
      select: "1",
      /* 待下单 */
      beissuedData: {
        total: 0,
        size: 10,
        page: 0,
        currentPage: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        data: [],
      },
      // 
      value: "",
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
							change: this.firstInputRequest,
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
							change: this.secondInputRequest,
							clear: this.returnTitle
						},
					},
					{
						tag: "el-cascader",
						label: "项目工序",
						attrs: {
							ref: "selectProcedure",
							key: "procedureIds",
							keys: 0,
							options: [],
							props: {
								value: "projectWorkingProcedureId",
								label: "name",
								children: "children",
								expandTrigger: "hover",
							},
							clearable: true,
							placeholder: "请选择工序",
						},
						listeners: {
							change: this.handleProcedureConfirm,
							clear: this.returnTitle
						},
					},
					{
						tag: "el-select",
						label: "工艺",
						attrs: {
							ref: "selectProcess",
							key: "processName",
							options: [],
							placeholder: "请选择工艺",
						},
						listeners: {
						},
					},
					{
						tag: "el-select",
						label: "图纸",
						attrs: {
							ref: "selectDraw",
							key: "nestingId",
							options: [],
							placeholder: "请选择图纸",
						},
						listeners: {
							change: this.handleNestingList
						},
					},
					{
						tag: "el-select",
						label: "图纸页码",
						attrs: {
							ref: "selectDrawPage",
							key: "nestingPoolId",
							options: [],
							placeholder: "请选择图纸页码",
						},
						listeners: {
						},
					},
					{
						tag: "el-cascader",
						label: "责任单位",
						attrs: {
							key: "departmentId",
							options: [],
							props: {
								value: "departmentId",
								label: "name",
								children: "children",
                checkStrictly: true,
							},
							placeholder: "请选择责任单位",
						},
					},
					{
						tag: "el-date-picker",
						label: "时间",
						attrs: {
							"value-format": "yyyy-MM-dd",
							key: "pickervalue",
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
							change: this.firstInputRequest,
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
							change: this.secondInputRequest,
							clear: this.returnTitle
						},
					},
					{
						tag: "el-cascader",
						label: "项目工序",
						attrs: {
							ref: "selectProcedure",
							key: "procedureIds",
							keys: 0,
							options: [],
							props: {
								value: "projectWorkingProcedureId",
								label: "name",
								children: "children",
								expandTrigger: "hover",
							},
							clearable: true,
							placeholder: "请选择工序",
						},
						listeners: {
							change: this.handleProcedureConfirm,
							clear: this.returnTitle
						},
					},
					{
						tag: "el-select",
						label: "工艺",
						attrs: {
							ref: "selectProcess",
							key: "processName",
							options: [],
							placeholder: "请选择工艺",
						},
						listeners: {
						},
					},
					{
						tag: "el-select",
						label: "图纸",
						attrs: {
							ref: "selectDraw",
							key: "nestingId",
							options: [],
							placeholder: "请选择图纸",
						},
						listeners: {
							change: this.handleNestingList
						},
					},
					{
						tag: "el-select",
						label: "图纸页码",
						attrs: {
							ref: "selectDrawPage",
							key: "nestingPoolId",
							options: [],
							placeholder: "请选择图纸页码",
						},
						listeners: {
						},
					},
					{
						tag: "el-cascader",
						label: "责任单位",
						attrs: {
							key: "departmentId",
							options: [],
							props: {
								value: "departmentId",
								label: "name",
								children: "children",
                checkStrictly: true,
							},
							placeholder: "请选择责任单位",
						},
					},
					{
						tag: "el-date-picker",
						label: "时间",
						attrs: {
							"value-format": "yyyy-MM-dd",
							key: "pickervalue",
							type: "date",
							placeholder: "请选择时间",
						},
					},
				]
      },
      /**工单状态*/
      reportStatus: [
        {
          label: "未派工",
          value: 0,
          type: "primary",
        },
        {
          label: "已派工",
          value: 1,
          type: "primary",
        },
        {
          label: "已互检",
          value: 2,
          type: "warning",
        },
        {
          label: "已专检",
          value: 3,
          type: "warning",
        },
        {
          label: "已监理检",
          value: 4,
          type: "warning",
        },
        {
          label: "专检退检",
          value: 5,
          type: "danger",
        },
        {
          label: "互检退检",
          value: 6,
          type: "danger",
        },
        {
          label: "外部检验退检",
          value: 7,
          type: "danger",
        },
      ],
      /* 项目工费的表头内容 */
      selection: [
        /* 勾选框 */
        {
          attrs: {
            align: "center",
            type: "selection",
            "reserve-selection": true,
          },
        },
      ],
      colConfig: [
        /* 序号 */
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
            width: "50",
          },
        },
        {
          attrs: { label: "图纸名称", prop: "nestingName", align: "center" },
        },
        {
          attrs: {
            label: "图纸页码",
            prop: "nestingPage",
            align: "center",
            width: "80",
          },
        },
        {
          attrs: {
            label: "零件编号",
            prop: "partNumber",
            align: "center",
          },
        },
        {
          attrs: {
            label: "零件数量(件)",
            prop: "partSize",
            align: "center",
            width: "80",
          },
        },
        {
          attrs: {
            label: "责任单位",
            prop: "departmentName",
            align: "center",
          },
        },
        {
          attrs: {
            label: "工单工艺",
            prop: "processName",
            align: "center",
            width: "100",
          },
        },
        {
          attrs: {
            label: "工作量（米）",
            prop: "workload",
            align: "center",
            width: "80",
          },
        },
        {
          slot: "plannedTime",
          attrs: {
            label: "计划完成时间",
            prop: "plannedTime",
            align: "center",
            width: "120",
            formatter: this.formatTime,
          },
        },
      ],
      colConfiged: [
        {
          slot: "reportStatus",
          attrs: {
            label: "工单状态",
            prop: "reportStatus",
            align: "center",
            width: "90",
          },
        },
        {
          attrs: {
            label: "工单完成时间",
            prop: "progressReward",
            align: "center",
            width: "120",
            formatter: this.formatTime,
          },
        },
        {
          attrs: {
            label: "定额(元)",
            prop: "quota",
            align: "center",
            width: "60",
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "progressReward",
            align: "center",
            width: "100",
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "qualityReward",
            align: "center",
            width: "100",
          },
        },
        {
          slot: "viewwork",
          attrs: {
            label: "操作",
            prop: "qualityReward",
            align: "center",
            width: "80",
          },
        },
      ],
      colConfigbe: [
        {
          attrs: {
            label: "定额(元)",
            prop: "quota",
            align: "center",
            width: "60",
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "progressReward",
            align: "center",
            width: "100",
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "qualityReward",
            align: "center",
            width: "100",
          },
        },
      ],
      /**其它工序*/
      otcolConfig: [
        /* 序号 */
        {
          attrs: {
            label: "序号",
            align: "center",
            type: "index",
            width: "50",
          },
        },
        {
          attrs: {
            label: "物料编码",
            prop: "materialCode",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "物料编号",
            prop: "materialNumber",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "物料材质",
            prop: "materialQuality",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "高度/厚度(毫米)",
            prop: "materialHeight",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "宽度(毫米)",
            prop: "materialWidth",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "长度(毫米)",
            prop: "materialLength",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "数量(件)",
            prop: "materialAmount",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "责任单位",
            prop: "departmentName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "工单工艺",
            prop: "processName",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: "plannedTime",
          attrs: {
            label: "计划完成时间",
            prop: "plannedTime",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "定额(元)",
            prop: "quota",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "进度奖励(元)",
            prop: "progressReward",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "质量奖励(元)",
            prop: "qualityReward",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "附属件编号",
            prop: "subsidiaryNumber",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "附属件名称",
            prop: "subsidiaryName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "工作量（米）",
            prop: "workload",
            align: "center",
            width: "200px",
          },
        },
      ],
      otcolConfiged: [
        {
          slot: "reportStatus",
          attrs: {
            label: "工单状态",
            prop: "reportStatus",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: "viewwork",
          attrs: {
            label: "操作",
            prop: "qualityReward",
            fixed: "right",
            align: "center",
            width: "200px",
          },
        },
      ],
      /**涂装工序*/
      tzColConfig: [
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
          attrs: {
            label: "物料编码",
            prop: "materialCode",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "物料编号",
            prop: "materialNumber",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "数量(件)",
            prop: "materialAmount",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "责任单位",
            prop: "departmentName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "工单工艺",
            prop: "processName",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: "workload",
          attrs: {
            label: "工作量（米）",
            prop: "workload",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: "plannedTime",
          attrs: {
            label: "计划完成时间",
            prop: "plannedTime",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "定额(元)",
            prop: "quota",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "进度奖励（元）",
            prop: "progressReward",
            align: "center",
            width: "200px",
          },
        },
      ],
      /* 已下单 */
      issuedData: {
        total: 0,
        size: 10,
        page: 0,
        currentPage: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        data: [],
      },
      linkageSearchobj: [
        {
          engineeringProjectId: "", // 项目id
          couplingId: "", // 联段id
          procedureId: "", // 工序id
        },
        {
          engineeringProjectId: "", // 项目id
          couplingId: "", // 联段id
          procedureId: "", // 工序id
        },
      ], // 项目联段查询
      dispatchSearchData: [{}, {}], // 页面搜索字段
      projectNameone: "", // 页面显示搜索项目名称
      projectNametwo: "", // 页面显示搜索项目名称
      jobOrderDetailedIds: [], // 选择的列表id集合
      searchComp: ['searchDispatch','searchDispatched']
    };
  },
  created() {},
  mounted() {
    this.initRequest()
  },
  methods: {
    // 获取项目列表
    async initRequest() {
      let res, department;
      res = await getEngineeringProjectList({ status: 1 });
      department = await getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1,
      });
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      Object.keys(this.renderData).forEach((item) => {
        this.renderData[item][0].attrs.options = res.data;
        this.renderData[item][6].attrs.options = department.data;
      });
    },
    // 获取联段
    async firstInputRequest(value) {
      let res;
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      // 清空联段 工序
      this.selectClear("project");
      if (value) {
        res = await getCouplinglist({
          engineeringProjectId: value,
        });
        res.data.forEach((item) => {
          item.value = item.couplingId;
          item.label = item.name;
        });
        curSearchData[1].attrs.options = res.data;
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 获取工序
    async secondInputRequest(value) {
      let res;
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      // 清空工序
      this.selectClear("coupling");
      res = await getProcedureList({
        id: value,
      });
      res.data.forEach((item) => {
        if (item.children.length === 0) {
          this.$delete(item, "children");
        }
      });
      curSearchData[2].attrs.options = res.data;
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]];
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      const procedureList = curSearchData[2].attrs.options;
      if (!value.length) {
        this.selectClear("procedure");
        return;
      }
      let index, indexs, temp;
      curSearchComp.formData.procedureId = value[value.length - 1];
      index = procedureList.findIndex(
        (item) => item.projectWorkingProcedureId === value[0]
      );
      if (value.length > 1) {
        indexs = procedureList[index].children.findIndex(
          (item) => item.projectWorkingProcedureId === value[value.length - 1]
        );
      }
      temp =
        value.length > 1
          ? procedureList[index].children[indexs]
          : procedureList[index];
      curSearchComp.formData.workingProcedureCode = temp.workingProcedureCode;
      this.handleProcedureChange(temp);
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框 数据处理后
    async handleProcedureChange(payload) {
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      const { projectWorkingProcedureId, couplingId, engineeringProjectId } =
        payload;
      let processList = await getProjectProcessList({
        projectWorkingProcedureId,
      });
      let nestingList = await getNestingPoolList({
        engineeringProjectId,
        couplingId,
      });
      processList.data.forEach((item) => {
        item.value = item.name;
        item.label = item.name;
      });
      nestingList.data.forEach((item) => {
        item.value = item.nestingPoolId;
        item.label = item.nestingName;
      });
      curSearchData[3].attrs.options = processList.data;
      curSearchData[4].attrs.options = nestingList.data;
      console.log(payload);
    },
    // 图纸切换事件
    async handleNestingList(value) {
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      this.selectClear("nesting");
      let res = await getNestingList({
        nestingPoolId: value,
      });
      res.data.forEach((item) => {
        item.value = item.nestingId;
        item.label = item.nestingPage;
      });
      curSearchData[5].attrs.options = res.data;
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2, value3;
        title = value1 = value2 = value3 = "";
        const curSearchComp = this.$refs[this.searchComp[this.activeName]];
        const { selectCoupling, selectProcedure, selectProject } =
          curSearchComp.$refs;
        value1 = selectProject.selectedLabel;
        value2 = selectCoupling.selectedLabel;
        value3 = selectProcedure.presentText;
        title = `${value1}${value2 ? " - " + value2 : ""}${
          value3 ? " - " + value3 : ""
        }`;
        this.title = title;
      });
    },
    // 清空事件
    selectClear(type) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]];
      const curSearchData = this.renderData[this.searchComp[this.activeName]];
      curSearchData[2].attrs.keys++;
      curSearchData[5].attrs.options = [];
      curSearchComp.formData.nestingPoolId = "";
      switch (type) {
        case "all": {
          curSearchComp.formData.engineeringProjectId = "";
        }
        case "project": {
          curSearchData[1].attrs.options = [];
          curSearchComp.formData.couplingId = "";
        }
        case "coupling": {
          curSearchData[2].attrs.options = [];
          curSearchComp.formData.procedureIds = "";
        }
        case "procedure": {
          curSearchData[3].attrs.options = [];
          curSearchData[4].attrs.options = [];
          curSearchComp.formData.processName = "";
          curSearchComp.formData.nestingId = "";
        }
        default:
          break;
      }
      if (type == "all") {
        curSearchData[6].attrs.keys++;
        curSearchComp.formData.departmentId = "";
        curSearchComp.formData.pickervalue = "";
      }
    },
    // 重置分页
    handleResetPage() {
      if (parseInt(this.activeName)) {
        this.issuedData.page = 0;
        this.issuedData.size = 10;
      } else {
        this.beissuedData.page = 0;
        this.beissuedData.size = 10;
      }
    },
    handleReset() {
      this.selectClear("all");
    },
    // 过滤时间
    formatTime(value) {
      // return value ? moment(value).format("YYYY-MM-DD") : "";
      return value ? format(value).format("yyyy-MM-dd") : "";
      
    },
    /**新增生产人员*/
    getRowKeys(row) {
      return row.jobOrderDetailedId;
    },
    /**查看已报工详情*/
    viewworkReport(row){
        this.$router.push({
            name: "hosmv",
            query: this.dispatchSearchData[1].workingProcedureCode=='GX_XL'?{id: row.jobOrderDetailedId} : {materialOrderDetailedId: row.materialOrderDetailedId}
        });
    },
    getPage() {
      this.isLoading = true;
      let _this = this;
      const sendData = {
        page:
          this.activeName == 0 ? this.beissuedData.page : this.issuedData.page,
        size:
          this.activeName == 0 ? this.beissuedData.size : this.issuedData.size,
        allocationStatus: 1, // 0:未派工 1:已派工
        ...this.dispatchSearchData[this.activeName],
      };
      // 待派工加status 已派工加sentStatus findMaterialOrderPage
      this.activeName == 0
        ? (sendData.reportStatus = 0)
        : (sendData.sentStatus = 0);
      const resultData =
        this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_XL"
          ? findJobOrderPage(sendData)
          : findMaterialOrderPage(sendData);
      resultData
        .then((res) => {
          if (this.activeName == "0") {
            // 待下单
            this.beissuedData.data = res.data.data;
            this.beissuedData.total = res.data.total;
          } else {
            // 已下单
            this.issuedData.data = res.data.data;
            this.issuedData.total = res.data.total;
          }
          setTimeout(() => {
            _this.isLoading = false;
          }, 500);
        })
        .finally(() => {
         setTimeout(() => {
            _this.isLoading = false;
          }, 1000);
        });
    },
    changePage(e, sign) {
      // 分页
      sign == 0 ? (this.beissuedData.page = e) : (this.issuedData.page = e);
      this.getPage();
    },
    dispatchSearch(searchData, sign) {
      // 页面搜索组件传值回来
      const { departmentId } = searchData;
      // 页面搜索组件传值回来
      this.dispatchSearchData[this.activeName] = {
        ...searchData,
        departmentId: departmentId.length
          ? departmentId[departmentId.length - 1]
          : "",
      };
      if (
        this.dispatchSearchData[this.activeName].workingProcedureCode == "" ||
        this.dispatchSearchData[this.activeName].workingProcedureCode == null
      )
        return this.$message.warning("请先选择工序");
      this.getPage();
    },
    handleClick(tab, event) {
      this.returnTitle();
    },
    /* 列表复选框 */
    listSelectionChange(val) {
      this.jobOrderDetailedIds = val;
    },
    /* 工单下发 */
    /* 派工 */
    workSelectionChange(row) {
      let sendIdlist = [];
      this.jobOrderDetailedIds.map((res) => {
        sendIdlist.push(
          this.dispatchSearchData[this.activeName].workingProcedureCode ==
            "GX_XL"
            ? res.jobOrderDetailedId
            : res.materialOrderDetailedId
        );
      });
      this.$router.push({
        name: "hosms",
        query: {
          ids: JSON.stringify(sendIdlist),
          workingProcedureCode:
            this.dispatchSearchData[this.activeName].workingProcedureCode,
        },
      });
    },
    /* 项目工费详情 */
    projectdetailsRow(index, row) {
      //新增项目
      this.$router.push({
        name: "project-details",
        query: {
          //   designQaId:row.designQaId,
        },
      });
    },
  },
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
  .tab {
    height: 100%;
    padding: 16px 16px;
    box-sizing: border-box;
    .flex_row_space {
      margin-bottom: 16px;
    }
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
          ::v-deep .el-tag {
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            p {
              font-size: 16px;
              //font-weight: 700;
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
</style>
