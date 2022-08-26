<!--工费统计-->
<template>
  <div id="main"
    class="prefabrication_box">
    <div class="tab">
      <div class="m-sselect">
        <search ref="search"
          :renderData="prefabricationData"
          @handle-submit="handleSubmit"
          @handle-reset="handleReset">
        </search>
      </div>
      <!-- 车间费用 -->
      <div class="workshop_cost">
        <!-- 右侧部分 -->
        <div class="right">
          <!-- 表格介绍和内容导出 -->
          <div class="select-List">
            <!-- 导航 -->
            <div class="nav">
              <p>{{ title ? title : "" }}</p>
              <div class="navallBnt">
                <el-button type="primary"
                  @click="handleCancel">返回</el-button>
                <el-button type="primary"
                  icon="el-icon-edit"
                  @click="handleEdit">配置</el-button>
              </div>
            </div>
            <!-- 表格内容 -->
            <div>
              <TableBody ref="table"
                :colConfig="colConfig"
                :data="data.data"
                height="500"
                @selection-change="workSelectionChange"
                row-key="selectId"
                v-loading="isLoading">
                <template slot="expand"
                  slot-scope="{ scope }">
                  <TableBody :colConfig="childColConfig"
                    :data="scope.row.child">
                  </TableBody>
                </template>
              </TableBody>
              <Pagination :data="data"
                @changePage="changePage" />
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
} from "@/api/productionManagement/project.js";
import { TableBody, Form, Pagination } from "gggj_lib";
import Search from "../components/search.vue";
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import {
  workingProcedurePage,
  workingMaterialPage,
  getProjectWorkingProcedureRoundsPlanList,
} from "@/api/productionManagement/projectMasterPlan";
import {
  workingNestingAddPlanConfig,
  workingNestingAddPlanChildConfig,
  workingMaterialAddPlanConfig,
  workingMaterialAddPlanChildConfig,
  working_procedure_edit_Config,
  working_procedure_edit_material_Config,
} from "@/utils/productionManagement/data_config";
export default {
  //注册组件
  components: { Form, TableBody, Pagination, Search },
  data() {
    return {
      // 当前配置状态 例如 套料/物料/...
      configType: "nesting",
      // 加载
      isLoading: false,
      //标题
      title: "",
      /* 后端数据可以在此接收 */
      data: {
        page: 0,
        size: 10,
        total: 0,
      },
      /* 车间工费的勾选数据 */
      multipleSelection: [],
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
          label: "轮次",
          attrs: {
            key: "roundsPlanId",
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
            clearable: true,
            placeholder: "请选择责任单位",
          },
        },
      ],
      /* 项目工费的表头内容 */
      colConfig: null,
      childColConfig: null
    };
  },
  created() {
    this.initRequest();
    this.getDepartment();
    this.colConfig = workingNestingAddPlanConfig;
    this.childColConfig = workingNestingAddPlanChildConfig
  },
  activated() {
    // 路由生命周期
    this.data = {};
    this.data.total = 0;
    // this.multipleSelection = []
    this.handleReset();
  },
  mounted() { },
  methods: {
    // 获取项目列表
    async initRequest() {
      let res;
      res = await getEngineeringProjectList({ status: 1 });
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      this.prefabricationData[0].attrs.options = res.data;
    },
    // 清空事件
    selectClear(type) {
      const searchComp = this.$refs["search"];
      this.prefabricationData[2].attrs.keys++
      this.prefabricationData[3].attrs.options = []
      if (type) {
        searchComp.formData.procedureIds = "";
        searchComp.formData.procedureId = "";
        searchComp.formData.workingProcedureCode = "";
        searchComp.formData.roundsPlanId = "";
        if (type === 'project') {
          searchComp.formData.couplingId = "";
          this.prefabricationData[1].attrs.options = []
        }
        if (type !== 'procedure') {
          this.prefabricationData[2].attrs.options = []
        }
      }
    },
    // 获取联段
    async firstInputRequest(value) {
      let res;
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
        this.prefabricationData[1].attrs.options = res.data
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 获取工序
    async secondInputRequest(value) {
      let res;
      // 清空工序
      this.selectClear('coupling')
      res = await getProcedureList({
        id: value,
      });
      res.data.forEach((item) => {
        if (item.children.length === 0) {
          this.$delete(item, "children");
        }
      });
      this.prefabricationData[2].attrs.options = res.data
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      const searchComp = this.$refs["search"];
      const procedureList = this.prefabricationData[2].attrs.options
      if (!value.length) {
        this.selectClear('procedure')
        return
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
      searchComp.formData.workingProcedureCode = temp.workingProcedureCode
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
        const { selectCoupling, selectProcedure, selectProject } = searchComp.$refs
        value1 = selectProject.selectedLabel
        value2 = selectCoupling.selectedLabel
        value3 = selectProcedure.presentText
        title = `${value1}${value2 ? " - " + value2 : ""}${value3 ? " - " + value3 : ""
          }`;
        this.title = title
      })
    },
    // 获取部门数据
    async getDepartment() {
      const res = await getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1,
      });
      this.prefabricationData[5].attrs.options = res.data;
    },
    // 获取分页数据
    async getWorkingProcedurePage(data) {
      let res;
      const { pickervalue, departmentPickId, roundsPlanId } =
        data;
      const queryData = {
        ...data,
        status: 0,
        isApprove: 0,
        roundsPlanId,
        departmentPickId: departmentPickId[departmentPickId.length - 1],
        yearMonth: pickervalue,
        ...this.data
      };
      this.isLoading = true;
      if (this.configType === "nesting") {
        res = await workingProcedurePage(queryData);
      } else {
        res = await workingMaterialPage(queryData);
      }
      res && (this.isLoading = false);
      this.data.total = res.data.total;
      res.data.data.forEach((item, index) => {
        item['child'] = item.children
        this.$delete(item, 'children')
        if (item.nestingPlanId) {
          item["selectId"] = item.nestingPlanId + index;
        } else {
          item["selectId"] = item.materialId + index;
        }
      });
      this.data = { ...res.data };
    },
    // 工序下拉框事件
    async handleProcedureChange(payload) {
      this.data.data = [];
      this.prefabricationData[3].attrs.options = [];
      this.$refs["search"].formData.roundsPlanId = "";
      let res;
      const { workingProcedureCode } = payload;
      if (workingProcedureCode === "GX_XL") {
        this.configType = "nesting";
        this.colConfig = workingNestingAddPlanConfig;
        this.childColConfig = workingNestingAddPlanChildConfig
      } else {
        this.configType = "material";
        this.colConfig = workingMaterialAddPlanConfig;
        this.childColConfig = workingMaterialAddPlanChildConfig
      }
      res = await getProjectWorkingProcedureRoundsPlanList({
        ...payload
      });
      res.data.forEach((item) => {
        item["value"] = item.roundsPlanId;
        item["label"] = item.name;
      });
      this.prefabricationData[3].attrs.options = res.data;
    },
    /* 多选 */
    workSelectionChange(list) {
      console.log(list, "list")
      this.multipleSelection = list
    },
    // 切换页码
    changePage(e) {
      this.data.page = e;
      this.multipleSelection = [];
      this.getWorkingProcedurePage(this.form);
    },
    // 按钮查询
    handleSubmit(value) {
      if (!value.procedureId) {
        this.$message.warning("请选择工序！");
        return;
      }
      this.form = value;
      this.getWorkingProcedurePage(value);
    },
    // 取消事件
    handleCancel() {
      this.$router.back();
    },
    // 编辑事件
    handleEdit() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }
      let temp = []
      this.multipleSelection.forEach(item => {
        if (item.child.length > 0) {
          item.child.forEach(items => {
            if (this.configType === "nesting") {
              items.endTime = item.endTime ? item.endTime.substring(0, 10) : "";
            } else {
              items.endTime = item.endTime ? item.endTime.substring(0, 10) : "";
              items.planTime = items.pslanTime ? items.planTime.substring(0, 10) : "";
            }
            let obj = { ...item, ...items }
            temp.push(obj)
          })
        } else {
          temp.push(item)
        }
      });
      console.log(temp, "temp")
      const queryData = {
        headerKeys:
          this.configType === "nesting"
            ? working_procedure_edit_Config
            : working_procedure_edit_material_Config,
        data: temp,
      };
      sessionStorage.setItem("queryData", JSON.stringify(queryData));
      this.$router.push({
        name: "working-procedure-add",
        query: queryData,
      });
    },
    // 重置
    handleReset() {
      this.prefabricationData[2].attrs.keys++
      this.prefabricationData.forEach(item => {
        if (item.attrs.key === 'engineeringProjectId' || item.attrs.key === 'departmentPickId') return
        item.attrs.options && (item.attrs.options = [])
      })
      this.returnTitle()
    },
    // 重置分页
    handleResetPage() {
      this.data = {
        page: 0,
        size: 10,
        total: 0,
      };
    },
  },
};
</script>

<style scoped lang="scss">
#main {
  .tab {
    box-sizing: border-box;
    /* 车间花费 */

    .workshop_cost {
      display: flex;
      flex-direction: row;
      box-sizing: border-box;
      border: 1px solid #e4e7ed;
      .submit_btn_box {
        margin: 40px 0 10px;
        display: flex;
        justify-content: end;
      }
      .left {
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
</style>
