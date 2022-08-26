<template>
  <div class="quality-check">
    <search
      ref="search"
      :renderData="prefabricationData"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"
    >
    </search>
    <!-- 容器 -->
    <div class="wrap">
      <!-- 导航 -->
      <div class="nav">
        <span>{{title}}</span>
        <div class="operation">
          <el-radio-group v-model="checkType" @change="handleRadioChange">
            <el-radio-button label="check">待检验</el-radio-button>
            <el-radio-button label="checked">已检验</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 表格内容 -->
      <div>
        <TableBody
          v-if="colConfig"
          :colConfig="colConfig"
          :data="data.data"
          v-loading="isLoading"
        >
          <template slot="status" slot-scope="{ scope }">
            <el-tag v-if="typeof scope.row.status === 'number'" :type="scope.row.status | filterQualityStatus('color')">
              {{scope.row.status | filterQualityStatus('text')}}
            </el-tag>
          </template>
          <template slot="btns" slot-scope="{ scope }">
            <el-button
              size="mini"
              type="text"
              @click="handleCheck(scope.row)"
              >{{checkType === 'check'?'检验':'查看明细'}}</el-button>
          </template>
        </TableBody>
      </div>
      <!-- 分页 -->
      <Pagination :data="data" @changePage="changePage" />
    </div>
  </div>
</template>
<script>
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
  getprojectprocessPage,
} from "@/api/productionManagement/project.js";
import { TableBody, Form, Pagination } from "gggj_lib";
import Search from "../components/search.vue";
import { getDepartmentList } from "@/api/productionManagement/departmentRole";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import {
  getMutualInspectionPage,
  getMutualInspectionMaterialPage
} from "@/api/productionManagement/quality"
import {
  quality_check_config,
  quality_check_material_config
} from "@/utils/productionManagement/data_config"
export default {
  name: 'quality-check',
  components: {
    Form,
    TableBody,
    Pagination,
    Search
  },
  data() {
    return {
      // 待检验/已检验
      checkType: "check",
      // 当前配置状态 例如 套料/物料/...
      configType: 'nesting',
      isLoading: false, // 加载状态
      title: '', // 显示项目/联段/工序
      checkMove: '', // 互检/专检/监理检验
      data:{
        data: [],
        page: 0,
        size: 10,
        total: 0
      },
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
          label: "工艺",
          attrs: {
            key: "processName",
            options: [],
            placeholder: "请选择工艺",
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
        {
          tag: "el-date-picker",
          label: "时间",
          attrs: {
            key: "pickervalue",
            type: "daterange",
            'start-placeholder': "开始日期",
            'end-placeholder': "结束日期",
            'value-format': 'yyyy-MM-dd',
          },
        },
      ],
      colConfig: null, // 数据列表配置
    }
  },
  created() {
    this.initRequest()
    this.handleRadioChange('check')
  },
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
      this.getDepartmentListData()
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
        const { selectCoupling, selectProcedure, selectProject} = searchComp.$refs
        value1 = selectProject.selectedLabel
        value2 = selectCoupling.selectedLabel
        value3 = selectProcedure.presentText
        title = `${value1}${value2 ? " - " + value2 : ""}${
          value3 ? " - " + value3 : ""
        }`;
        this.title = title
      })
    },
    // 过滤列
    filterCol(list, filterList) {
      return list.filter((item,index) => {
        return (filterList.findIndex(items => items === index)) === -1
      })
    },
    // 工序切换事件
    handleProcedureChange(payload) {
      this.data.data = []
      const { projectWorkingProcedureId, workingProcedureCode } = payload
      if (workingProcedureCode === 'GX_XL') {
        this.configType = 'nesting'
        this.colConfig = this.checkType==='check'?this.filterCol(quality_check_config,[10,11]):quality_check_config
      } else {
        this.configType = 'material'
        this.colConfig = this.checkType==='check'?this.filterCol(quality_check_material_config,[10,11]):quality_check_material_config
      }
      this.getProcessPage(projectWorkingProcedureId)
    },
    // 获取工艺
    async getProcessPage(projectWorkingProcedureId) {
      const res = await getprojectprocessPage({
        projectWorkingProcedureId
      })
      res.data.data.forEach(item => {
        item.value = item.name
        item.label = item.name
      })
      this.prefabricationData[3].attrs.options = res.data.data
    },
    // 获取责任单位
    async getDepartmentListData() {
      const res = await getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1
      })
      this.prefabricationData[4].attrs.options = res.data
    },
    // 获取数据
    async getMutualInspectionPageData() {
      let res
      const { departmentPickId, pickervalue } = this.formData
      let queryData = {
        ...this.formData,
        departmentPickId: departmentPickId[departmentPickId.length - 1],
        // startTime: pickervalue[0],
        // endTime: pickervalue[1],
        ...this.data,
        status: this.checkType === 'check'?0:1
      }
      this.isLoading = true
      if (this.configType === 'nesting') {
        res = await getMutualInspectionPage(queryData)
      } else {
        res = await getMutualInspectionMaterialPage(queryData)
      }
      res && (this.isLoading = false)
      this.data = res.data
      // this.pageData.total = res.data.total
    },
    // 待检验/已检验 切换
    handleRadioChange(value) {
      // 待优化
      let temp
      let nestingConfig = [...quality_check_config]
      let materialConfig = [...quality_check_material_config]
      if (this.formData) {
        if (this.configType != "nesting") {
          if (value === 'check') {
            temp = this.filterCol(materialConfig,[10,11])
          } else {
            temp = materialConfig
          }
        } else {
          if (value === 'check') {
            temp = this.filterCol(nestingConfig,[10,11])
          } else {
            temp = nestingConfig
          }  
        }
        this.getMutualInspectionPageData()
      } else {
        if (this.configType != "nesting") {
          if (value === 'check') {
            temp = this.filterCol(materialConfig,[10,11])
          } else {
            temp = materialConfig
          }
        } else {
          if (value === 'check') {
            temp = this.filterCol(nestingConfig,[10,11])
          } else {
            temp = nestingConfig
          }  
        }
      }
      this.colConfig = temp
    },
    // 点击检验
    handleCheck(row) {
      let id,configType
      const {jobWorkReportId, materialWorkReportId} = row
      const checkType = this.checkType
      configType = this.configType
      id = jobWorkReportId?jobWorkReportId:materialWorkReportId
      this.checkType === 'check'?
      this.$router.push({name: "qualityindex", query: {id,checkType,configType}}):
      this.$router.push({name: "qualityindex", query: {id,checkType,configType}})
    },
    // 换页事件
    changePage(page) {
      this.data.page = page
      this.getMutualInspectionPageData()
    },
    // 下拉框确定按钮事件
    handleSubmit(data) {
      this.formData = data
      if (!data.procedureId) {
        this.$message.warning('请选择工序')
        return
      }
      this.getMutualInspectionPageData()
    },
    // 表单重置按钮事件
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
      this.data.page = 0
      this.data.size = 10
      this.data.total = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.quality-check {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ::v-deep .wrap {
    flex: 1;
    background-color: #ffffff;
    padding: 10px 16px 0 16px;
    .el-tag {
        margin: 0 auto;
        width: 72px;
        display: flex;
        justify-content: center;
    }
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      span {
        //font-weight: bold;
      }
      div {
        display: flex;
        align-items: center;
      }
      .el-select, .el-cascader {
        width: 160px;
        margin-right: 8px;
      }
      .el-form {
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-date-editor {
          width: 350px;
        }
      }
    }
  }
}
</style>
