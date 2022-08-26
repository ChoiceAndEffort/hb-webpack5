<!--数据管理-->
<template>
  <div class="sub-page">
    <div class="searchBar">
      <div>
        <search
          ref="search"
          :renderData="prefabricationData"
          @handle-submit="handleSubmit"
          @handle-reset="handleReset"
        ></search>
      </div>
    </div>
    <div class="container">
      <div class="mag-left">
        <el-col>
          <b>{{ title }}</b>
        </el-col>
        <el-col>
          <el-select
            key="material"
            v-if="configType === 'material'"
            filterable
            @change="handleFilter"
            v-model="form.value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in form.materialList"
              :key="item.projectProcessId"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-select
            key="nesting"
            v-else-if="configType === 'nesting' && isLayingOff"
            filterable
            @change="handleFilter"
            v-model="form.value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in form.nestingList"
              :key="item.nestingPoolId"
              :label="item.nestingName"
              :value="item.nestingPoolId"
            >
            </el-option>
          </el-select>

          <el-button
            v-if="configType === 'nesting' && !isLayingOff"
            type="primary"
            @click="goback"
            class="mag-rey"
            >返回</el-button
          >
          <el-button
            v-else
            type="primary"
            :disabled="editStatus"
            @click="edit"
            class="mag-rey"
            >编辑</el-button
          >
        </el-col>
      </div>
      <!-- v-loading="isLoading" -->
      <div v-if="isLayingOff">
        <TableBody
          class="table-body"
          v-if="tableData.length !== 0"
          :colConfig="listProps"
          :data="tableData.data"
          border
        >
          <template slot="btn" slot-scope="{ scope }">
            <span class="details" @click="details(scope.row, 'nesting')"
              >详情</span
            >
          </template>
        </TableBody>
        <Pagination
          :data="tableData"
          @changePage="handlePage"
          v-if="tableData.data && tableData.data.length != 0"
        />
      </div>
      <div v-else>
        <TableBody
          :colConfig="colConfig"
          :data="data.data"
          v-loading="listLoading"
          border
          :concatIndexArr="[0, 1]"
          :concatKey="configType === 'nesting' ? 'nestingPage' : 'materialCode'"
        >
        </TableBody>
        <Pagination :data="data" @changePage="changePage" />
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
import { TableBody, Pagination } from "gggj_lib";
import selectSearch from "../components/selectSearch.vue";
import search from "../components/search.vue";
import {
  quotaNestingConfig,
  quotaMaterialConfig,
  quota_allocation_Config_nesting,
  quota_allocation_Config_material,
  NestingConfig,
} from "@/utils/productionManagement/data_config.js";
import { getNestingPoolList } from "@/api/productionManagement/projectMasterPlan";
import {
  getNestingPage,
  getNestingQuotallocationList,
  getMaterialQuotallocationList,
  getProjectProcessList,
  getMaterialProcessList,
  getnestingListPage,
} from "@/api/productionManagement/project.js";
export default {
  components: {
    TableBody,
    Pagination,
    selectSearch,
    search,
  },
  data() {
    return {
      // 当前配置状态 例如 套料/物料/...
      configType: "nesting",
      // 项目联段工序显示
      title: "",
      // 编辑按钮禁用状态
      editStatus: true,
      // 当前渲染模块标识
      active: 1,
      drawer: false,
      // 下拉框绑定值
      searchobj: {
        engineeringProjectId: "", // 项目id
        couplingId: "", // 联段id
        procedureId: "", // 工序id
      },
      // 配置搜索框
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
      ],
      // 选择联段下拉框 下拉数据
      couplingList: [],
      procedureId: [],
      // 选择项目下拉框 下拉数据
      ProjectList: [],
      // 分页参数 初始化
      data: {
        total: 0,
        size: 10,
        page: 0,
        lastPage: 0,
        nestingPage: 2,
        first: true,
        last: true,
        data: [],
      },
      listLoading: false,
      // 渲染列表字段
      colConfig: null,
      // bom模态框状态
      bomAddFlag: false,
      // bom每一项数
      bomFormData: {
        tableData: {},
      },
      // 筛选下拉数据
      form: {
        value: "",
        nestingList: [],
        materialList: [],
      },
      listProps: NestingConfig,
      tableData: {
        page: 0,
        size: 10,
        data: [],
      },
      isLayingOff: true, //是否为下料
    };
  },
  // computed: {
  //   isShow() {
  //     if(this.configType =='nesting'){

  //     }else{

  //     }
  //     return 
  //   },
  // },
  activated() {
    this.getChildNestingList(this.searchobj);
  },
  created() {
    this.initRequest();
    this.colConfig = quotaNestingConfig;
  },
  mounted() {},
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
      this.prefabricationData[2].attrs.keys++;
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
        title = `${value1}${value2 ? " - " + value2 : ""}${
          value3 ? " - " + value3 : ""
        }`;
        this.title = title;
      });
    },
    //   编辑跳转
    async edit() {
      let res, headerKeys;
      if (this.configType === "nesting") {
        res = await getNestingQuotallocationList({
          nestingPoolId: this.form.value,
        });
        headerKeys = quota_allocation_Config_nesting;
      } else {
        res = await getMaterialProcessList({
          ...this.searchobj,
          processName: this.form.value,
        });
        headerKeys = quota_allocation_Config_material;
      }
      const data = res.data;
      const queryData = { data, headerKeys };
      sessionStorage.setItem("queryData", JSON.stringify(queryData));
      this.$router.push({
        name: "quota-edit",
        query: { data, headerKeys },
      });
    },
    // 翻页
    changePage(e) {
      this.data.page = e;
      if (this.configType === "nesting") {
        this.getNestingList(this.searchobj);
      } else {
        this.getMaterialList(this.searchobj);
      }
    },
    handlePage(e) {
      this.tableData.page = e;
      this.getnestingListPage(this.searchobj);
    },
    // 查询数据
    getChildNestingList(searchobj, nestingPoolId) {
      if (this.configType === "nesting") {
        this.searchobj.couplingId && this.getNestingList(searchobj, nestingPoolId);
      } else {
        !this.searchobj.procedureId && this.$message.warning("请选择工序");
        this.searchobj.procedureId && this.getMaterialList(searchobj);
      }
    },
    // 套料查询
    getNestingList(searchobj, nestingPoolId) {
      this.listLoading = true;
      let params = {
        engineeringProjectId: searchobj.engineeringProjectId,
        couplingId: searchobj.couplingId,
        nestingPoolId: this.form.value,
        page: this.data.page,
        size: this.data.size,
      };
      if (nestingPoolId) {
        params.nestingPoolId = nestingPoolId;
      }
      getNestingPage(params).then((res) => {
        this.listLoading = false;
        this.form.value && (this.editStatus = false);
        if (res.code === 0) {
          this.data.data = res.data.data;
          this.data.total = res.data.total;
          if (!this.form.value) {
            // 套料过滤查询
            this.formOptions(searchobj);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    formOptions(searchobj) {
      getNestingPoolList({
        ...searchobj,
      })
        .then((res) => {
          this.form.nestingList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    //查看套料详情
    details(row) {
      this.getChildNestingList(this.searchobj, row.nestingPoolId);
      this.isLayingOff = false;
    },
    // 物料查询
    getMaterialList(searchobj) {
      this.listLoading = true;
      let { page, size } = this.data;
      getMaterialQuotallocationList({
        ...searchobj,
        page,
        size,
      }).then((res) => {
        this.listLoading = false;
        this.form.value && (this.editStatus = false);
        if (res.code === 0) {
          this.data.data = res.data.data;
          this.data.total = res.data.total;
          if (!this.form.value) {
            // 物料工艺过滤查询
            getProjectProcessList({
              projectWorkingProcedureId: this.searchobj.procedureId,
            })
              .then((res) => {
                this.form.materialList = res.data;
              })
              .catch((err) => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 查询数据
    handleSubmit(data) {
      this.searchobj = { ...data };
      if (data.procedureIds != "") {
        //GX_XL 为下料
        if (data.workingProcedureCode == "GX_XL") {
          this.isLayingOff = true;
          this.getnestingListPage(data);
          this.formOptions(data);
        } else {
          this.isLayingOff = false;
          this.getChildNestingList(data);
        }
      } else {
        this.isLayingOff = false;
        this.$message.error("请选择项目工序");
      }
    },
    //返回按钮
    goback() {
      if (this.configType == "nesting" && !this.isLayingOff) {
        this.isLayingOff = true;
      }
    },
    getnestingListPage(data) {
      getnestingListPage({
        ...data,
        page: 0,
        size: 0,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
    // 选择套料图过滤数据
    handleFilter(value) {
      if (this.configType === "nesting") {
        this.getNestingList(this.searchobj);
      } else {
        this.getMaterialList({
          ...this.searchobj,
          processName: this.form.value,
        });
      }
    },
    // 工序下拉框事件
    handleProcedureChange(payload) {
      this.data.data = [];
      this.form = {
        value: "",
        nestingList: [],
        materialList: [],
      };
      this.data.total = 0;
      if (payload.workingProcedureCode === "GX_XL") {
        this.configType = "nesting";
        this.colConfig = quotaNestingConfig;
      } else {
        this.configType = "material";
        this.colConfig = quotaMaterialConfig;
      }
    },
    // 重置
    handleReset() {
      this.prefabricationData[2].attrs.keys++;
      this.prefabricationData.forEach((item) => {
        if (item.attrs.key === "engineeringProjectId") return;
        item.attrs.options && (item.attrs.options = []);
      });
      this.returnTitle();
    },
    // 重置分页
    handleResetPage() {
      this.data.page = 0;
      this.data.size = 10;
    },
  },
};
</script>

<style scoped lang="scss">
.vies {
  margin-bottom: 5px;
}
.sub-page {
  background-color: transparent;
  padding: 0;
  .searchBar {
    margin-bottom: 16px;
    .bntList {
      margin-top: 11px;
    }
  }
  .container {
    background-color: #fff;
    padding: 16px;
    .navBar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .el-input {
        width: 240px;
      }
    }
    ::v-deep .el-table {
      margin-top: 16px;
      .details {
        color: #1989fa;
        cursor: pointer;
      }
    }
  }
}
.list {
  li {
    display: flex;
    justify-content: space-between;
    a,
    i {
      line-height: 36px;
    }
    i {
      color: red;
    }
  }
}
::v-deep .el-drawer__body {
  padding: 16px;
  position: relative;
  .add {
    height: 40px;
    margin-top: 30px;
    line-height: 40px;
    border: 1px dotted #e4e7ed;
    text-align: center;
    color: #606266;
  }
  .footer {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
}
::v-deep .el-upload {
  width: 100%;
}
.fileArr {
  padding-top: 16px;
  li {
    padding: 16px;
  }
}
.vue-xlsx-container {
  margin-right: 20px;
}
.mag-left {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.mag-left > .el-col {
  display: flex;
  align-items: center;
  word-break: keep-all;
  &:nth-child(2) {
    justify-content: flex-end;
  }
}
.mag-rey {
}
</style>
