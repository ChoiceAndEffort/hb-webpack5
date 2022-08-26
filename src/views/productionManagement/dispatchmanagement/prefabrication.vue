<!--工费统计-->
<template>
  <div id="main"
    class="prefabrication_box fa_box flex_column_space">
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
    <div class="tab bf">
      <div class="flex_row_space">
        <p>{{ title }}</p>
        <div>
          <el-radio-group v-model="activeName"
            @change="handleClick">
            <el-radio-button :label="0">待派工工单</el-radio-button>
            <el-radio-button :label="1">已派工工单</el-radio-button>
          </el-radio-group>

          <el-button class="margin_l_10px"
            type="primary"
            size="small"
            v-if="jobOrderDetailedIds.length > 0"
            @click="workSelectionChange">工单下发</el-button>
          <el-button class="margin_l_10px"
            type="primary"
            size="small"
            v-if="
              jobOrderDetailedIds.length > 0 ||
              dispatchSearchData[activeName].workingProcedureCode == 'GX_YS'
               && 
              dispatchSearchData[activeName].workingProcedureCode == 'GX_TZ'
            "
            @click="outSourcing">外协工单下发</el-button>
        </div>
      </div>
      <!-- 未下发工单 -->
      <div v-if="activeName == 0"
        class="workshop_cost">
        <!-- 右侧部分 -->
        <div class="right">
          <!-- 表格介绍和内容导出 -->
          <div class="select-List">
            <!-- 表格内容 -->
            <div class="table_box">
              <TableBody key="dispatch"
                :colConfig="
                  dispatchSearchData[0].workingProcedureCode == 'GX_XL'
                    ? selection.concat(colConfig, colConfigbe)
                    : dispatchSearchData[0].workingProcedureCode == 'GX_TZ'
                    ? selection.concat(tzColConfig)
                    : dispatchSearchData[0].workingProcedureCode == 'GX_YS'
                    ? selection.concat(transportConfig)
                    : selection.concat(otcolConfig)
                "
                :data="beissuedData.data"
                max-height="100%"
                @selection-change="listSelectionChange"
                v-loading="loading">
                <template slot="plannedTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="transportOrderType"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.transportOrderType == 0 ? "产品类" :  scope.row.transportOrderType == 1 ? "非产品类" : "内产转运"  }}</p>
                </template>
                <template slot="plannedTransTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTransTime | shorttime }}</p>
                </template>
                <template slot="plannedLoadTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedLoadTime | shorttime }}</p>
                </template>
                <template slot="plannedTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="workload"
                  slot-scope="{ scope }">
                  <el-tooltip class="item"
                    effect="dark"
                    placement="top">
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
              <Pagination :data="beissuedData"
                @changePage="(e) => changePage(e, 0)" />
            </div>
          </div>
        </div>
      </div>
      <!-- 已下发工单 -->
      <div v-if="activeName == 1"
        class="workshop_cost">
        <!-- 右侧部分 -->
        <div class="right">
          <!-- 表格介绍和内容导出 -->
          <div class="select-List">
            <!-- 表格内容 -->
            <div class="table_box">
              <TableBody key="dispatched"
                :colConfig="
                  dispatchSearchData[1].workingProcedureCode == 'GX_XL'
                    ? colConfig.concat(colConfiged)
                    : dispatchSearchData[1].workingProcedureCode == 'GX_TZ'
                    ? tzColConfig.concat(otcolConfiged)
                    : dispatchSearchData[1].workingProcedureCode == 'GX_YS'
                    ? transportConfig.concat(otcolConTransport)
                    : otcolConfig.concat(otcolConfiged)
                "
                :data="issuedData.data"
                v-loading="loading">
                <template slot="plannedTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="transportOrderType"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.transportOrderType == 0 ? "产品类" :  scope.row.transportOrderType == 1 ? "非产品类" : "内产转运"  }}</p>
                </template>
                <template slot="plannedTransTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTransTime | shorttime }}</p>
                </template>
                <template slot="plannedLoadTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedLoadTime | shorttime }}</p>
                </template>
                <template slot="dispatchDate"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.dispatchDate | shorttime }}</p>
                </template>
                <template slot="plannedTime"
                  slot-scope="{ scope }">
                  <p>{{ scope.row.plannedTime | shorttime }}</p>
                </template>
                <template slot="reportStatus"
                  slot-scope="{ scope }">
                  <template v-for="(item, index) in reportStatus">
                    <p :key="index"
                      v-if="item.value == scope.row.reportStatus">
                      <el-tag :type="
                          item.value == 0
                            ? 'danger'
                            : item.value == 1
                            ? 'warning'
                            : ''
                        ">{{ item.label }}</el-tag>
                    </p>
                  </template>
                </template>
                <template slot="transportOrderStatus"
                  slot-scope="{ scope }">
                  <template v-for="(item, index) in transportOrderStatus">
                    <p :key="index"
                      v-if="item.value == scope.row.transportOrderStatus">
                      <el-tag :type="
                          item.value == false
                            ? 'danger'
                            : item.value == true
                            ? 'warning'
                            : ''
                        ">{{ item.label }}</el-tag>
                    </p>
                  </template>
                </template>
                <template slot="workload"
                  slot-scope="{ scope }">
                  <el-tooltip class="item"
                    effect="dark"
                    placement="top">
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
              <Pagination :data="issuedData"
                @changePage="(e) => changePage(e, 1)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="请选择外协单位"
      :visible.sync="outSourcingVisible"
      class="outSourcingVisible_box"
      :close-on-click-modal="false"
      width="500px">
      <div class="container-padding outSourcingVisible_body">
        <el-form :model="outSourcingData"
          ref="outSourcingData"
          label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="外协单位："
            prop="region"
            :rules="[
              { required: true, message: '请选择外协单位', trigger: 'change' },
            ]">
            <el-select v-model="outSourcingData.region"
              placeholder="请选择外协单位">
              <template v-for="(item, index) in outSourcingData.supplierData">
                <el-option :key="index"
                  v-if="item.supplierEnterpriseId != null"
                  :label="item.supplierName"
                  :value="item.supplierEnterpriseId + '-' + item.supplierName"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="outSourcingVisible = false">取消</el-button>
        <el-button type="primary"
          @click="outSourcingworkSelectionChange()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
  getProjectProcessList
} from "@/api/productionManagement/project.js";
import {
  getjobOrderdetailed,
  workOrderDistribution,
  getmaterialOrderdetailed,
  getProcedureSupplierConfigurationList,
  outSourcingDistribution,
} from "@/api/productionManagement/dispatch.js";
import { getNestingList, getNestingPoolList } from "@/api/productionManagement/projectMasterPlan";

import { pageOfTransportWorkOrder, allocationTransportOrders } from "@/api/productionManagement/transport.js"
//引入组件
import { TableBody, Form, Pagination } from "gggj_lib";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import Search from "../components/search.vue";
import { enterpriseId } from '@/assets/productionManagement/comjs/login'
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
      // 项目名
      title: '',
      // 待派工/已派工
      activeName: 0,
      // 加载状态
      loading: false,
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
              value: "processCode",
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
      /* 运输单状态 */
      transportOrderStatus: [
        {
          label: '未完成',
          value: false
        },
        {
          label: '已完成',
          value: true
        }
      ],
      /**工单状态*/
      reportStatus: [
        {
          label: "未派工",
          value: 0,
        },
        {
          label: "已派工",
          value: 1,
        },
        {
          label: "已互检",
          value: 2,
        },
        {
          label: "已专检",
          value: 3,
        },
        {
          label: "已监理检",
          value: 4,
        },
      ],
      /* 项目工费的表头内容 */
      selection: [
        /* 勾选框 */
        {
          attrs: { align: "center", type: "selection" },
        },
      ],
      colConfig: [
        /* 序号 */
        {
          attrs: {
            label: "序号",
            align: "center",
            type: "index",
          },
        },
        {
          attrs: {
            label: "图纸名称",
            prop: "nestingName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "图纸页码",
            prop: "nestingPage",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件编号",
            prop: "partNumber",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件数量(件)",
            prop: "partSize",
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
      ],
      colConfiged: [
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
          slot: 'dispatchDate',
          attrs: {
            label: "工单完成时间",
            prop: "dispatchDate",
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
      ],
      colConfigbe: [
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
        {
          attrs: {
            label: "质量奖励（元）",
            prop: "qualityReward",
            align: "center",
            width: "200px",
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
      /* 运输工序 */
      transportConfig: [
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
          }
        },
        {
          attrs: {
            label: "运单编号",
            prop: "transportOrderCode",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: "transportOrderType",
          attrs: {
            label: "运输单类型",
            prop: "transportOrderType",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "运输目的地",
            prop: "transportPlace",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "工序名称",
            prop: "procedureName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "工艺名称",
            prop: "processName",
            align: "center",
            width: "200px",
          },
        },
        {
          slot: 'plannedLoadTime',
          attrs: {
            label: "计划装车时间",
            prop: "plannedLoadTime",
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
          slot: 'plannedTransTime',
          attrs: {
            label: "计划运输时间",
            prop: "plannedTransTime",
            align: "center",
            width: "200px",
          },
        },
      ],
      otcolConTransport: [
        {
          slot: "transportOrderStatus",
          attrs: {
            label: '运输单状态',
            prop: 'transportOrderStatus',
            align: 'center',
            width: '200px'
          }
        }
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
      // 项目联段查询
      dispatchSearchData: [{}, {}], // 页面搜索字段
      jobOrderDetailedData: [], // 选择的列表集合数据
      jobOrderDetailedIds: [], // 选择的列表id集合
      /**搜索项目中文名称*/
      projectName: [[], []],
      /**外协工单下发*/
      outSourcingVisible: false,
      outSourcingData: {
        supplierData: [],
        supplierImf: "",
      },
      searchComp: ['searchDispatch', 'searchDispatched']
    }
  },
  created() { },
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
        type: 1
      })
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      Object.keys(this.renderData).forEach(item => {
        this.renderData[item][0].attrs.options = res.data
        this.renderData[item][6].attrs.options = department.data
      })
    },
    // 获取联段
    async firstInputRequest(value) {
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
    // 获取工序
    async secondInputRequest(value) {
      let res;
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      // 清空工序
      this.selectClear('coupling')
      res = await getProcedureList({
        id: value,
      });
      res.data.forEach((item) => {
        if (item.children.length === 0) {
          this.$delete(item, "children");
        }
      })
      curSearchData[2].attrs.options = res.data
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]]
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      const procedureList = curSearchData[2].attrs.options
      if (!value.length) {
        this.selectClear('procedure')
        return
      }
      let index, indexs, temp
      curSearchComp.formData.procedureId = value[value.length - 1]
      index = procedureList.findIndex(
        (item) => item.projectWorkingProcedureId === value[0]
      )
      if (value.length > 1) {
        indexs = procedureList[index].children.findIndex(
          (item) => item.projectWorkingProcedureId === value[value.length - 1]
        )
      }
      temp =
        value.length > 1
          ? procedureList[index].children[indexs]
          : procedureList[index]
      curSearchComp.formData.workingProcedureCode = temp.workingProcedureCode
      this.handleProcedureChange(temp)
      this.returnTitle()
      this.handleResetPage()
    },
    // 工序选择框 数据处理后
    async handleProcedureChange(payload) {
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      const { projectWorkingProcedureId, couplingId, engineeringProjectId } = payload
      let processList = await getProjectProcessList({
        projectWorkingProcedureId
      })
      let nestingList = await getNestingPoolList({
        engineeringProjectId,
        couplingId
      })
      processList.data.forEach(item => {
        item.value = item.name
        item.label = item.name
      })
      nestingList.data.forEach(item => {
        item.value = item.nestingPoolId
        item.label = item.nestingName
      })
      curSearchData[3].attrs.options = processList.data
      curSearchData[4].attrs.options = nestingList.data
    },
    // 图纸切换事件
    async handleNestingList(value) {
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      this.selectClear('nesting')
      let res = await getNestingList({
        nestingPoolId: value
      })
      res.data.forEach(item => {
        item.value = item.nestingId
        item.label = item.nestingPage
      })
      curSearchData[5].attrs.options = res.data
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2, value3;
        title = value1 = value2 = value3 = "";
        const curSearchComp = this.$refs[this.searchComp[this.activeName]];
        const { selectCoupling, selectProcedure, selectProject } = curSearchComp.$refs
        value1 = selectProject.selectedLabel
        value2 = selectCoupling.selectedLabel
        value3 = selectProcedure.presentText
        title = `${value1}${value2 ? " - " + value2 : ""}${value3 ? " - " + value3 : ""
          }`;
        this.title = title
      })
    },
    // 清空事件
    selectClear(type) {
      const curSearchComp = this.$refs[this.searchComp[this.activeName]];
      const curSearchData = this.renderData[this.searchComp[this.activeName]]
      curSearchData[2].attrs.keys++
      curSearchData[5].attrs.options = []
      curSearchComp.formData.nestingPoolId = ""
      switch (type) {
        case 'all': { curSearchComp.formData.engineeringProjectId = "" }
        case 'project': {
          curSearchData[1].attrs.options = []
          curSearchComp.formData.couplingId = ""
        }
        case 'coupling': {
          curSearchData[2].attrs.options = []
          curSearchComp.formData.procedureIds = ""
        }
        case 'procedure': {
          curSearchData[3].attrs.options = []
          curSearchData[4].attrs.options = []
          curSearchComp.formData.processName = ""
          curSearchComp.formData.nestingId = ""
        }
        default: break;
      }
      if (type == 'all') {
        curSearchData[6].attrs.keys++
        curSearchComp.formData.departmentId = ""
        curSearchComp.formData.pickervalue = ""
      }
    },
    // 重置分页
    handleResetPage() {
      if (parseInt(this.activeName)) {
        this.issuedData.page = 0
        this.issuedData.size = 10
      } else {
        this.beissuedData.page = 0
        this.beissuedData.size = 10
      }
    },
    handleReset() {
      this.selectClear('all')
    },
    getPage() {
      this.$set(this, "loading", true)
      let _this = this
      const sendData = {
        page:
          this.activeName == 0 ? this.beissuedData.page : this.issuedData.page,
        size:
          this.activeName == 0 ? this.beissuedData.size : this.issuedData.size,
        allocationStatus: this.activeName, // 0:未派工 1:已派工
        ...this.dispatchSearchData[this.activeName],
        orderStatus: this.activeName == 0 ? -2 : -1
      }
      const resultData =
        this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_XL"
          ? getjobOrderdetailed(sendData)
          : this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_YS"
            ? pageOfTransportWorkOrder(sendData)
            : getmaterialOrderdetailed(sendData)
      resultData
        .then((res) => {
          setTimeout(() => {
            _this.loading = false
          }, 500)
          if (this.activeName == 0) {
            // 待下单
            this.beissuedData.data = res.data.data
            this.beissuedData.total = res.data.total
          } else {
            // 已下单
            this.issuedData.data = res.data.data
            this.issuedData.total = res.data.total
          }
        })
        .finally(() => {
          setTimeout(() => {
            _this.loading = false
          }, 1000)
        })
    },
    changePage(e, sign) {
      // 分页
      sign == 0 ? (this.beissuedData.page = e) : (this.issuedData.page = e)
      this.getPage()
    },
    dispatchSearch(searchData, sign) {
      const { departmentId } = searchData
      // 页面搜索组件传值回来
      this.dispatchSearchData[this.activeName] = {
        ...searchData,
        departmentId: departmentId.length ? departmentId[departmentId.length - 1] : ''
      }
      if (
        this.dispatchSearchData[this.activeName].workingProcedureCode == "" ||
        this.dispatchSearchData[this.activeName].workingProcedureCode == null
      )
        return this.$message.warning("请先选择工序")
      this.getPage()
    },
    handleClick(tab, event) {
      this.jobOrderDetailedIds = []
      this.returnTitle()
    },
    /* 列表复选框 */
    listSelectionChange(val) {
      this.jobOrderDetailedData = val
      this.jobOrderDetailedIds = []
      val.map((res) => {
        this.jobOrderDetailedIds.push(res.jobOrderDetailedId)
      })
    },
    /** 工单下发 */

    outSourcingworkSelectionChange(row) {
      this.$refs["outSourcingData"].validate((valid) => {
        if (valid) {
          this.jobOrderDetailedIds = [];
          this.jobOrderDetailedData.map((res) => {
            this.jobOrderDetailedIds.push(
              this.dispatchSearchData[0].workingProcedureCode == "GX_XL"
                ? res.jobOrderDetailedId
                : this.dispatchSearchData[0].workingProcedureCode == "GX_YS"
                  ? res.workReportOrderId
                  : res.materialOrderDetailedId
            )
          })
          const sendData = {
            jobOrderDetailedIds: this.jobOrderDetailedIds,
            workingProcedureCode:
              this.dispatchSearchData[0].workingProcedureCode,
            supplierId: this.outSourcingData.region.split("-")[0],
            supplierName: this.outSourcingData.region.split("-")[1],
            workReportOrderIds: this.jobOrderDetailedIds
          }

          if (this.dispatchSearchData[0].workingProcedureCode == "GX_YS") {
            allocationTransportOrders(sendData).then((res) => {
              this.$message.success("下发成功")
              this.outSourcingVisible = false
              this.getPage()
            })
          } else {
            outSourcingDistribution(sendData).then((res) => {
              this.$message.success("下发成功");
              this.getPage();
            })
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 工单下发 */
    workSelectionChange(row) {
      if (this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_YS") {
        // const ysData = []
        this.jobOrderDetailedIds = []
        this.jobOrderDetailedData.map(res => {
          this.jobOrderDetailedIds.push(
            this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_YS" ? res.workReportOrderId : res.materialOrderDetailedId
          )
        })
        this.$confirm("是否确定下发工单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          allocationTransportOrders({
            workReportOrderIds: this.jobOrderDetailedIds
          }).then(res => {
            this.$message.success("下发成功")
            this.getPage()
          })
        })
      } else {
        this.jobOrderDetailedIds = []
        this.jobOrderDetailedData.map((res) => {
          this.jobOrderDetailedIds.push(
            this.dispatchSearchData[this.activeName].workingProcedureCode == "GX_XL"
              ? res.jobOrderDetailedId
              : res.materialOrderDetailedId
          )
        })
        this.$confirm("是否确定下发工单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            workOrderDistribution({
              jobOrderDetailedIds: this.jobOrderDetailedIds,
              workingProcedureCode:
                this.dispatchSearchData[this.activeName].workingProcedureCode,
            }).then((res) => {
              this.$message.success("下发成功")
              this.getPage()
            })
          })
          .catch(() => { })
      }
    },
    /**外协工单下发*/
    outSourcing() {
      this.outSourcingVisible = true
      const sendData = {
        engineeringProjectId: this.dispatchSearchData[this.activeName].engineeringProjectId,
        couplingId: this.dispatchSearchData[this.activeName].couplingId,
        workingProcedureCode: this.dispatchSearchData[this.activeName].workingProcedureCode,
      }
      getProcedureSupplierConfigurationList(sendData).then((res) => {
        this.outSourcingData.supplierData = res.data;
      })
    },
    /* 项目工费详情 */
    projectdetailsRow(index, row) {
      //新增项目
      this.$router.push({
        name: "project-details",
        query: {
          //   designQaId:row.designQaId,
        },
      })
    },
    //项目工费的多选
    projectSelectionChange(val) { },
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
  //background-color: #ffffff;
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
  .outSourcingVisible_box {
    ::v-deep .el-dialog {
      .el-dialog__body {
        padding: 0 16px 12px;
      }
      .el-dialog__header {
        border-bottom: 1px solid #e4e7ed;
      }
    }
    .outSourcingVisible_body {
      padding-top: 40px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
