<!--工费统计-->
<template>
  <div id="main"
    class="prefabrication_box fa_box flex_column_space">
    <search ref="search"
      :renderData="prefabricationData"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"></search>
    <div class="workshop_cost">
      <div class="select-List">
        <!-- 导航 -->
        <div class="nav">
          <div class="nav-left">
            <span>{{ title }}</span>
          </div>
          <div class="nav-right">
            <el-button type="primary"
              icon="el-icon-plus"
              @click="newPlan">
              新增计划
            </el-button>
            <el-button @click="handleDataSubmit"
              :loading="isSubmitLoading">提交</el-button>
          </div>
        </div>
        <!-- 表格内容 -->
        <div>
          <TableBody v-if="data"
            :key="colKey"
            ref="workingTable"
            tableName="table"
            :colConfig="colConfig"
            :data="data.data"
            @selection-change="workSelectionChange"
            row-key="selectId"
            v-loading="isLoading">
            <template slot="expand"
              slot-scope="{ scope }">
              <TableBody :colConfig="childColConfig"
                :data="scope.row.child">
              </TableBody>
            </template>
            <template slot="index"
              slot-scope="{ scope }">
              <span>{{ indexMethod(scope.$index) }}</span>
            </template>
            <template slot="status"
              slot-scope="{ scope }">
              <span :class="[
                  scope.row.isApprove === 2 ? 'submitted' : 'not-submitted',
                ]">{{ scope.row.isApprove === 2 ? "已提交" : "未提交" }}</span>
            </template>
            <template slot="btn"
              slot-scope="{ scope }">
              <el-button type="text"
                @click="workdetailsRow(scope.row)">编辑</el-button>
            </template>
          </TableBody>
          <Pagination :data="data"
            @changePage="changePage"
            v-if="data.data && data.data.length != 0" />
        </div>
      </div>
    </div>
    <!-- 套料弹框 -->
    <el-dialog title="编辑时间"
      :visible.sync="nestingPlanVisible"
      width="500px"
      @close="handleClose('editNestingTime')">
      <el-form ref="editNestingTime"
        :model="nestingPlanForm"
        :rules="nestingRules"
        label-position="top">
        <el-form-item label="数控划线时间"
          prop="lineationDate">
          <el-date-picker v-model="nestingPlanForm.lineationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="数控切割时间"
          prop="cuttingDate">
          <el-date-picker v-model="nestingPlanForm.cuttingDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item v-for="(item, index) in nestingPlanForm.grooveList"
          :key="index"
          :label="`${item.partNumber ? item.partNumber + '坡口开制时间' : ''}`"
          :prop="item.partNumber ? `grooveList.${index}.grooveDate` : ''"
          :rules="
            filterWaste(item.partNumber)
              ? {
                  required: true,
                  message: '请选择时间',
                  trigger: 'change',
                }
              : {}
          ">
          <el-date-picker v-if="item.partNumber"
            v-model="item.grooveDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="handleClose('editNestingTime')">取 消</el-button>
        <el-button type="primary"
          @click="handleNestingTimeConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物料弹框 -->
    <el-dialog title="编辑时间"
      :visible.sync="materialPlanVisible"
      width="500px"
      @close="handleClose('editMaterialTime')">
      <el-form ref="editMaterialTime"
        :model="materialPlanForm"
        label-position="top">
        <el-form-item label="物料编码"
          prop="materialCode">
          <el-input disabled
            v-model="materialPlanForm.materialCode"></el-input>
        </el-form-item>
        <el-form-item v-for="(item, index) in materialPlanForm.processList"
          :key="index"
          :label="`${item.processName ? item.processName + '完成时间' : ''}`"
          :prop="`processList.${index}.endTime`"
          :rules="[
            { required: true, message: '请选择时间', tirgger: 'change' },
          ]">
          <el-date-picker v-model="item.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="handleClose('editMaterialTime')">取 消</el-button>
        <el-button type="primary"
          @click="handleMaterialTimeConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物料-运输弹窗 -->
    <el-dialog title="编辑时间"
      :visible.sync="YSPlanVisible"
      width="500px"
      @close="handleClose('editYSTime')">
      <el-form ref="editYSTime"
        :model="YSPlanForm"
        label-position="top">
        <el-form-item label="运输计划时间"
          prop="transPlanTime"
          :rules="[
            { required: true, message: '请选择时间', tirgger: 'change' },
          ]">
          <el-date-picker type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="YSPlanForm.transPlanTime">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="装配计划时间"
          prop="assemblePlanTime"
          :rules="[
            { required: true, message: '请选择时间', tirgger: 'change' },
          ]">
          <el-date-picker type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="YSPlanForm.assemblePlanTime">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="handleClose('editYSTime')">取 消</el-button>
        <el-button type="primary"
          @click="handleYSTimeConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入组件
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
} from "@/api/productionManagement/project.js";
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
import {
  workingNestingConfig,
  workingNestingChildConfig,
  workingMaterialConfig,
  workingMaterialChildConfig,
  workingMaterialConfigYS,
} from "@/utils/productionManagement/data_config";
import { TableBody, Form, Pagination } from "gggj_lib";
import Search from "../components/search.vue";
import {
  getProjectWorkingProcedureRoundsPlanList,
  workingProcedurePage,
  workingMaterialPage,
  saveWorkingProcedure,
  saveMaterialWorkingProcedure,
  submitApprove,
  submitMaterialApprove,
} from "@/api/productionManagement/projectMasterPlan";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import {
  getTransPlan,
  editYSPlanTime,
  submitYSPlanTime,
} from "@/api/productionManagement/transport.js";
import { indexMethod } from "@/utils/productionManagement/tool";
export default {
  //注册组件
  components: { Form, TableBody, Pagination, Search },
  data() {
    return {
      // 当前配置状态 例如 套料/物料/...
      configType: "nesting",
      // 项目/联段/工序名
      title: "",
      // 加载
      isLoading: false,
      // 套料编辑弹窗 显示
      nestingPlanVisible: false,
      // 套料弹窗编辑数据
      nestingPlanForm: {
        lineationDate: "", // 划线
        cuttingDate: "", // 切割
        grooveList: [], // 坡口
      },
      materialPlanVisible: false,
      materialPlanForm: {
        materialCode: "", // 物料编码
        processList: "", // 工艺
      },
      YSPlanVisible: false,
      YSPlanForm: {
        transPlanTime: "", // 运输计划时间
        assemblePlanTime: "", // 装配计划时间
        endTime: "", // 作业计划完成时间
      },
      /* 搜索栏配置数据 */
      prefabricationData: [
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
            clear: this.returnTitle,
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
            clear: this.returnTitle,
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
            clear: this.returnTitle,
          },
        },
        {
          tag: "el-select",
          label: "轮次",
          attrs: {
            key: "roundsPlanId",
            keys: 0,
            options: [],
            placeholder: "请选择轮次",
          },
        },
        {
          tag: "el-date-picker",
          label: "时间",
          attrs: {
            "value-format": "yyyy-MM",
            key: "pickervalue",
            type: "month",
            placeholder: "请选择时间",
          },
        },
        {
          tag: "el-cascader",
          label: "责任单位",
          attrs: {
            key: "departmentPickId",
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
          tag: "el-select",
          label: "状态",
          attrs: {
            key: "state",
            options: [
              {
                value: 0,
                label: "未提交",
              },
              {
                value: 2,
                label: "已提交",
              },
            ],
            placeholder: "全部",
          },
        },
      ],
      /* 后端数据可以在此接收 */
      data: {},
      /* 车间工费的勾选数据 */
      multipleSelection: [],
      /* 项目工费的表头内容 */
      colConfig: null,
      /* 嵌套表格表头内容 */
      childColConfig: null,
      // 分页数据
      pageData: {
        page: 0,
        size: 10,
      },
      // 编辑时间验证规则
      nestingRules: {
        lineationDate: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        cuttingDate: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      // 过滤数据
      filterData: [],
      // 提交按钮加载
      isSubmitLoading: false,
      // 表格key
      colKey: 0,
    };
  },
  created() {
    this.initRequest();
    this.getDepartment();
    this.colConfig = workingNestingConfig;
    this.childColConfig = workingNestingChildConfig;
  },
  mounted() { },
  methods: {
    // 自定义列
    indexMethod,
    // 获取项目列表
    async initRequest() {
      let res;
      res = await getEngineeringProjectList({ status: 1 });
      // console.log(res, 'res');
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      this.prefabricationData[0].attrs.options = res.data;
    },
    // 清空事件
    selectClear(type) {
      const searchComp = this.$refs["search"];
      this.prefabricationData[2].attrs.keys++;
      this.prefabricationData[3].attrs.keys++;
      this.prefabricationData[3].attrs.options = [];
      if (type) {
        searchComp.formData.procedureIds = "";
        searchComp.formData.procedureId = "";
        searchComp.formData.workingProcedureCode = "";
        searchComp.formData.roundsPlanId = "";
        if (type === "project") {
          searchComp.formData.couplingId = "";
          this.prefabricationData[1].attrs.options = [];
        }
        if (type !== "procedure") {
          this.prefabricationData[2].attrs.options = [];
        }
      }
    },
    // 获取联段
    async firstInputRequest(value) {
      let res;
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
        this.prefabricationData[1].attrs.options = res.data;
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 获取工序
    async secondInputRequest(value) {
      let res;
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
      this.prefabricationData[2].attrs.options = res.data;
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      const searchComp = this.$refs["search"];
      const procedureList = this.prefabricationData[2].attrs.options;
      if (!value.length) {
        this.selectClear("procedure");
        return;
      }
      let index, indexs, temp;
      searchComp.formData.procedureId = value[value.length - 1];
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
      searchComp.formData.workingProcedureCode = temp.workingProcedureCode;
      this.handleProcedureChange(temp);
      this.returnTitle();
      this.handleResetPage();
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2, value3;
        title = value1 = value2 = value3 = "";
        const searchComp = this.$refs["search"];
        const { selectCoupling, selectProcedure, selectProject } =
          searchComp.$refs;
        value1 = selectProject.selectedLabel;
        value2 = selectCoupling.selectedLabel;
        value3 = selectProcedure.presentText;
        title = `${value1}${value2 ? " - " + value2 : ""}${value3 ? " - " + value3 : ""
          }`;
        this.title = title;
      });
    },
    // 过滤废料余料
    filterWaste(value) {
      const reg = /^(F|Y)/i;
      return !reg.test(value);
    },
    // 获取工序作业计划分页(套料)数据
    async getWorkingProcedurePage(data) {
      let res;
      const {
        state,
        pickervalue,
        departmentPickId,
        roundsPlanId,
        workingProcedureCode,
      } = data;
      const queryData = {
        ...data,
        status: 1,
        state,
        roundsPlanId,
        departmentPickId: departmentPickId[departmentPickId.length - 1],
        yearMonth: pickervalue,
        ...this.pageData,
      };
      this.isLoading = true;
      if (this.configType === "nesting") {
        res = await workingProcedurePage(queryData);
        // console.log(res, 888, '套料数据')
      } else {
        // 如果工序为运输 调用运输车次计划接口
        if (workingProcedureCode === "GX_YS") {
          queryData.status = 0;
          res = await getTransPlan(queryData);
        } else {
          res = await workingMaterialPage(queryData);
        }
      }
      res && (this.isLoading = false);
      res && (this.isSubmitLoading = false);
      res.data.data.forEach((item, index) => {
        item["child"] = item.children;
        this.$delete(item, "children");
        if (item.nestingPlanId) {
          item["selectId"] = item.nestingPlanId + index;
        } else {
          workingProcedureCode === "GX_YS"
            ? (item["selectId"] = item.tranNumber + index)
            : (item["selectId"] = item.materialId + index);
        }
      });
      this.data = { ...res.data };
    },
    // 获取责任单位
    async getDepartment() {
      let res;
      res = await getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1,
      });
      this.prefabricationData[5].attrs.options = res.data;
    },
    // 提交工序作业计划
    async handleDataSubmit() {
      let res, flag;
      if (this.multipleSelection.length) {
        let flag = this.multipleSelection.every(item => {
          if (item.workingProcedureCode == 'GX_YS') {
            if (item.assemblePlanTime === null || item.transPlanTime === null) {
              return true
            }
          } else {
            if (item.endTime == null) {
              return true
            }
          }
        })
        if (flag) {
          this.$message.error("请编辑计划时间");
          return;
        }
        this.isSubmitLoading = true;
        this.isLoading = true;
        if (this.configType === "nesting") {
          res = await submitApprove(this.multipleSelection);
        } else {
          this.submitForm.workingProcedureCode === "GX_YS"
            ? (res = await submitYSPlanTime(this.multipleSelection))
            : (res = await submitMaterialApprove(this.multipleSelection));
        }

        this.$refs["workingTable"].$refs["table"].clearSelection();
        res.code === 0 && this.$message.success("提交成功");
        this.getWorkingProcedurePage(this.submitForm);
        this.isSubmitLoading = false;
        this.isLoading = false;
      } else {
        this.$message.error("请选择工序作业计划");
      }
    },
    // 工序下拉框事件
    async handleProcedureChange(payload) {
      if (!payload) return;
      this.data.data = [];
      this.prefabricationData[3].attrs.options = [];
      this.$refs["search"].formData.roundsPlanId = "";
      let res;
      const { workingProcedureCode } = payload;
      if (workingProcedureCode === "GX_XL") {
        this.configType = "nesting";
        this.colConfig = workingNestingConfig;
        this.childColConfig = workingNestingChildConfig;
      } else {
        this.configType = "material";
        if (workingProcedureCode === "GX_YS") {
          this.colConfig = workingMaterialConfigYS;
        } else {
          this.colConfig = workingMaterialConfig;
          this.childColConfig = workingMaterialChildConfig;
        }
      }
      res = await getProjectWorkingProcedureRoundsPlanList({
        ...payload,
      });
      res.data.forEach((item) => {
        item["value"] = item.roundsPlanId;
        item["label"] = item.name;
      });
      this.prefabricationData[3].attrs.options = res.data;
    },
    /*新增计划*/
    newPlan() {
      this.$router.push({ name: "working-procedure-edit" });
    },
    /* 项目工费的多选 */
    workSelectionChange(list) {
      this.multipleSelection = list;
    },
    /* 车间工费详情 */
    workdetailsRow(row) {
      if (row.isApprove !== 2) {
        let temp = JSON.parse(JSON.stringify(row));
        if (this.configType === "nesting") {
          this.nestingPlanForm = temp;
          this.nestingPlanForm.grooveList = temp.child;
          this.nestingPlanVisible = true;
        } else {
          // 工序为运输单独处理
          if (temp.workingProcedureCode === "GX_YS") {
            this.YSPlanForm = temp;
            this.YSPlanVisible = true;
          } else {
            this.materialPlanForm = temp;
            this.materialPlanForm.processList = temp.child;
            this.materialPlanVisible = true;
          }
        }
      } else {
        this.$message.error("已生成预派工单，不可再编辑！");
      }
    },
    // 切换页码
    changePage(e) {
      this.pageData.page = e;
      this.getWorkingProcedurePage(this.submitForm);
    },
    // 表单提交按钮事件
    handleSubmit(value) {
      if (!value.procedureId) {
        this.$message.warning("请选择工序！");
        return;
      }
      this.submitForm = value;
      this.getWorkingProcedurePage(value);
    },
    // 编辑套料弹窗时间
    handleNestingTimeConfirm() {
      this.$refs["editNestingTime"].validate(async (valid) => {
        let res;
        if (valid) {
          let temp = this.nestingPlanForm.grooveList.map((item) => {
            return { ...item, ...this.nestingPlanForm };
          });
          res = await saveWorkingProcedure(temp);
          res.code === 0 && this.$message.success("编辑成功");
          this.nestingPlanVisible = false;
          setTimeout(() => {
            this.getWorkingProcedurePage(this.submitForm);
          }, 300);
          this.multipleSelection = [];
          this.$refs["workingTable"].$refs["table"].clearSelection();
        }
      });
    },
    // 编辑物料弹窗时间
    handleMaterialTimeConfirm() {
      let res;
      this.$refs["editMaterialTime"].validate(async (valid) => {
        if (valid) {
          res = await saveMaterialWorkingProcedure(
            this.materialPlanForm.processList
          );
          res.code === 0 && this.$message.success("编辑成功");
          this.materialPlanVisible = false;
          setTimeout(() => {
            this.getWorkingProcedurePage(this.submitForm);
          }, 300);
          this.multipleSelection = [];
          this.$refs["workingTable"].$refs["table"].clearSelection();
        }
      });
    },
    // 编辑运输时间
    handleYSTimeConfirm() {
      let res;
      this.$refs["editYSTime"].validate(async (valid) => {
        if (valid) {
          res = await editYSPlanTime(this.YSPlanForm);
          res.code === 0 && this.$message.success("编辑成功");
          this.YSPlanVisible = false;
          setTimeout(() => {
            this.getWorkingProcedurePage(this.submitForm);
          }, 300);
          this.multipleSelection = [];
          this.$refs["workingTable"].$refs["table"].clearSelection();
        }
      });
    },
    // 模态框关闭
    handleClose(form) {
      this.$refs[form].resetFields();
      this.nestingPlanForm = {};
      this.materialPlanForm = {};
      this.YSPlanForm = {};
      this.YSPlanVisible = false;
      this.nestingPlanVisible = false;
      this.materialPlanVisible = false;
    },
    // 重置
    handleReset() {
      this.prefabricationData[2].attrs.keys++;
      this.prefabricationData[3].attrs.keys++;
      this.prefabricationData.forEach((item) => {
        if (
          item.attrs.key === "engineeringProjectId" ||
          item.attrs.key === "departmentPickId"
        )
          return;
        item.attrs.options && (item.attrs.options = []);
      });
      this.returnTitle();
    },
    // 重置分页
    handleResetPage() {
      this.pageData = {
        page: 0,
        size: 10,
        total: 0,
      };
    },
  },
  watch: {
    colConfig: {
      handler(newValue, oldValue) {
        this.colKey = Date.now().valueOf();
      },
    },
  },
};
</script>

<style scoped lang="scss">
#main {
  ::v-deep .el-table {
    height: 100%;
  }
  .workshop_cost {
    flex: 1;
    background-color: #fff;
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
      }
      .submitted {
        color: #1989fa;
      }
      .not-submitted {
        color: #fa5555;
      }
    }
  }

  .el-dialog {
    .el-form-item {
      .el-date-editor {
        width: 100%;
      }
    }
  }
}
</style>
