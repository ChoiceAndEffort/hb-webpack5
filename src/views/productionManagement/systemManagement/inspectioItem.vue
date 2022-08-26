<!--项目列表-->
<template>
  <div class="project">
    <search 
      ref="search"
			:renderData="prefabricationData"
			@handle-submit="handleSubmit"
      @handle-reset="handleReset">
    </search>
    <div class="projectList">
      <div class="nav">
        <p>{{title}}</p>
      </div>
      <div class="body_box">
        <TableBody
          :colConfig="colConfig"
          :data="data.data"
          v-loading="loading"
        >
          <template slot="addTime" slot-scope="{ scope }">
            {{ scope.row.addTime | shorttime }}
          </template>
          <template slot="name" slot-scope="{ scope }">
            <span class="projectName" @click="addProject(scope.row)">{{
              scope.row.name
            }}</span>
          </template>
          <template slot="configuration" slot-scope="{ scope }">
            <div class="status-01" @click="toConfigure(scope.row)">配置</div>
          </template>
        </TableBody>
        <Pagination :data="data" @size-change="handleSizeChange" @changePage="changePage" />
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
import { getInspectioItemPage } from "@/api/productionManagement/systemManagement.js";
import Search from "../components/search.vue";
import { TableBody, Pagination, Form } from "gggj_lib";
import { tableTimeFilter } from "@/utils/productionManagement/tool.js";
export default {
  components: { TableBody, Pagination, Form, Search },
  data() {
    return {
      title: "",
      // 查询数据
      model: {},
      headerClass: "table-header-gray",
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
        // {
        //   tag: "el-date-picker",
				// 	label: "时间",
        //   attrs: {
        //     "value-format": "yyyy-MM",
        //     key: "pickervalue",
        //     type: "daterange",
        //     placeholder: "请选择时间",
        //     "range-separator": "-",
        //     "start-placeholder": "开始日期",
        //     "end-placeholder": "结束日期"
        //   },
        // }
      ],
      headerData: [
        {
          code: "number",
          title: "编号名称",
          width: "160px",
          label: "项目编号：",
        },
        {
          code: "name",
          title: "项目名称",
          width: "160px",
          label: "项目名称：",
        },
        {
          code: "dateTime",
          titleStart: "时间范围",
          DateType: "daterange",
          type: "mergeDate",
          width: "350px",
          titleEnd: "时间范围",
          label: "时间：",
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
          attrs: {
            label: "项目名称",
            prop: "engineeringProjectName",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目编号",
            prop: "engineeringProjectNumber",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目重量(千克)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目创建时间",
            prop: "addTime",
            align: "center",
            formatter: tableTimeFilter,
          },
        },
        {
          attrs: {
            label: "工艺",
            prop: "projectProcessName",
            align: "center",
          },
        },
        {
          slot: "configuration",
          attrs: {
            label: "检验项目配置",
            prop: "isStaffed",
            align: "center",
            // width: 200,
          },
        },
      ],
      data: {
        total: 0,
        size: 10,
        page: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        data: [],
        dataId: [],
        segmentList: [],
      },
      model: {},
      loading: false,
    };
  },
  created() {
    this.initRequest()
    this.getProject();
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
      this.prefabricationData[2].attrs.keys++
      this.prefabricationData[2].attrs.options = []
      if (type) {
        searchComp.formData.procedureIds = "";
        searchComp.formData.procedureId = "";
        searchComp.formData.workingProcedureCode = "";
        searchComp.formData.roundsPlanId = "";
        if (type === 'project') {
          searchComp.formData.couplingId = "";
          this.prefabricationData[1].attrs.options = []
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
      this.returnTitle();
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
    // 搜索
    handleSubmit(model) {
      this.model = JSON.parse(JSON.stringify(model)) 
      this.getProject(this.model);
    },
    // 重置
    handleReset() {
      this.prefabricationData[2].attrs.keys++
      this.prefabricationData.forEach(item => {
        if (item.attrs.key === 'engineeringProjectId') return
        item.attrs.options && (item.attrs.options = [])
      })
      this.returnTitle()
    },
    //分页
    changePage(e) {
      this.data.page = e;
      this.getProject(this.model);
    },
    //新增和修改项目
    addProject(row) {
      if (row.engineeringProjectId) {
        this.$router.push({
          name: "project-edit",
          query: {
            id: row.engineeringProjectId,
          },
        });
      } else {
        this.$router.push({
          name: "project-add",
          query: {},
        });
      }
    },
    //配置工艺定额
    toConfigure(row) {
      this.$router.push({
        name: "inspection-configuration",
        query: {
          data: JSON.stringify(row),
        },
      });
    },
    //初始化列表
    getProject(model) {
      this.loading = true;
      getInspectioItemPage({
        projectWorkingProcedureCode: model?model.workingProcedureCode:'',
        projectWorkingProcedureId: model?model.procedureId:'',
        page: this.data.page,
        size: this.data.size,
      })
        .then((res) => {
          this.loading = false;
          if (res.code === 0) {
            this.data.data = res.data.data;
            res.data.data.map((res, index) => {
              this.data.dataId.push(res.engineeringProjectId);
              this.data.data[index].segmentList = [];
            });
            this.data.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 切换每页数量事件
    handleSizeChange(size) {
      this.data.size = size;
      this.getProject(this.model)
    }
  },
};
</script>

<style scoped lang="scss">
.project {
  height: 100%;
  display: flex;
  flex-direction: column;
  .projectList {
    padding: 16px;
    flex: 1;
    .projectName {
      color: #1677ff;
      cursor: pointer;
    }
    margin-top: 8px;
    background-color: #fff;
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      padding-top: 0;
      p {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .dot {
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .status-01 {
    color: #1989fa;
    s .dot {
      background: #fa8e55;
    }
  }
  .status-02 {
    color: #1677ff;
    .dot {
      background: #1677ff;
    }
  }
}
</style>
