<template>
  <div class="wrap">
    <search
      ref="search"
      :renderData="renderData"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"
    ></search>
    <div class="wrap-content">
      <div class="content-header">
        <p>运输配车列表</p>
        <el-button type="primary" icon="el-icon-plus" @click="handleVehicle"
          >新增配车</el-button
        >
      </div>
      <TableBody :data="data" :colConfig="colConfig">
        <template #index="{ scope }">
          <span>{{ indexMethod(scope.$index) }}</span>
        </template>
        <template #tranNumber="{ scope }">
          <el-button type="text" @click="handleVehicleDetail(scope.row)">{{
            scope.row.tranNumber
          }}</el-button>
        </template>
        <template #operation="{ scope }">
          <el-link
            type="danger"
            :underline="false"
            @click="handleNullify(scope.row)"
            >作废</el-link
          >
        </template>
      </TableBody>
    </div>
  </div>
</template>

<script>
import { TableBody, Pagination } from "gggj_lib";
import search from "@/views/productionManagement/components/search.vue";
import { indexMethod, tableTimeFilter } from "@/utils/productionManagement/tool";
import { getEngineeringProjectList, getCouplinglist } from "@/api/productionManagement/project.js";
import { getRoundsPlan, getTransPlan, nullifyPlan } from "@/api/productionManagement/transport.js";
export default {
  components: {
    TableBody,
    Pagination,
    search,
  },
  data() {
    return {
      // 标题
      title: "",
      // 搜索数据
      searchData: {},
      // 表格数据
      data: [],
      // 渲染搜索框数据
      renderData: [
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
          listeners: {
            change: this.handleCouplingChange,
          },
        },
        {
          tag: "el-select",
          label: "计划轮次",
          attrs: {
            key: "roundsPlanId",
            options: [],
            placeholder: "请选择轮次",
          },
        },
      ],
      // 表格字段配置
      colConfig: [
        { slot: "index", attrs: { label: "序号", width: "64", fixed: "left" } },
        {
          attrs: {
            label: "项目名称",
            prop: "engineeringProjectName",
            "min-width": "243",
          },
        },
        {
          attrs: {
            label: "联段名称",
            prop: "couplingName",
            "min-width": "180",
          },
        },
        {
          attrs: {
            label: "计划运输轮次",
            prop: "roundsPlanName",
            "min-width": "160",
          },
        },
        {
          slot: "tranNumber",
          attrs: { label: "车次编号", prop: "tranNumber", "min-width": "160" },
        },
        {
          attrs: {
            label: "最大高度(毫米)",
            prop: "maxHeight",
            "min-width": "160",
          },
        },
        {
          attrs: {
            label: "最大宽度(毫米)",
            prop: "maxWidth",
            "min-width": "160",
          },
        },
        {
          attrs: {
            label: "最大长度(毫米)",
            prop: "maxLength",
            "min-width": "160",
          },
        },
        {
          attrs: { label: "物料数量", prop: "totalAmount", "min-width": "160" },
        },
        {
          attrs: {
            label: "物料重量(千克)",
            prop: "totalWeight",
            "min-width": "160",
          },
        },
        {
          attrs: {
            label: "节点计划开始时间",
            prop: "startTime",
            "min-width": "160",
            formatter: this.tableTimeFilter,
          },
        },
        {
          attrs: {
            label: "节点计划完成时间",
            prop: "endTime",
            "min-width": "160",
            formatter: this.tableTimeFilter,
          },
        },
        {
          attrs: {
            label: "责任单位",
            prop: "departmentName",
            "min-width": "200",
          },
        },
        {
          slot: "operation",
          attrs: { label: "操作", width: "60", fixed: "right" },
        },
      ],
      // 分页字段
      pageData: {
        page: 0,
        size: 10,
        total: 0,
      },
    }
  },
  created() {
    this.initRequest();
  },
  mounted() {},
  methods: {
    // 运输车次数据
    async getTransPlanData(searchData) {
      if (!searchData) return;
      let res = await getTransPlan({
        isApprove: 0,
        ...searchData,
        ...this.pageData,
      });
      // console.log(res, 666)
      this.data = res.data.data;
    },
    // 时间过滤
    tableTimeFilter,
    // 自定义列头
    indexMethod,
    // 获取项目列表
    async initRequest() {
      let res;
      res = await getEngineeringProjectList({ status: 1 });
      res.data.forEach((item) => {
        console.log(item, 666)
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      this.renderData[0].attrs.options = res.data;
    },
    // 清空事件
    selectClear(type) {
      const searchComp = this.$refs["search"];
      if (type) {
        searchComp.formData.roundsPlanId = "";
        this.renderData[2].attrs.options = [];
        if (type === "project") {
          searchComp.formData.couplingId = "";
          this.renderData[1].attrs.options = [];
        }        
      }
    },
    // 项目切换 获取联段
    async handleProjectChange(value) {
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
        this.renderData[1].attrs.options = res.data;
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 联段切换 获取工序
    async handleCouplingChange(value) {
      const searchComp = this.$refs["search"];
      const { engineeringProjectId } = searchComp.formData;
      let res;
      // 清空工序
      this.selectClear("coupling");
      res = await getRoundsPlan({
        engineeringProjectId,
        couplingId: value,
        workingProcedureCode: "GX_YS",
        page: 0,
        size: 10,
      })
      res.data.forEach((item) => {
        item.label = item.name;
        item.value = item.roundsPlanId;
      });
      this.renderData[2].attrs.options = res.data;
      this.returnTitle();
      this.handleResetPage();
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2;
        title = value1 = value2 = "";
        const searchComp = this.$refs["search"];
        const { selectCoupling, selectProject } = searchComp.$refs;
        value1 = selectProject.selectedLabel;
        value2 = selectCoupling.selectedLabel;
        title = `${value1}${value2 ? " - " + value2 : ""}`;
        this.title = title;
      })
    },
    // 提交
    handleSubmit(data) {
      if (!data.roundsPlanId) {
        this.$message.warning("请选择轮次！");
        return;
      }
      this.searchData = data;
      this.getTransPlanData(this.searchData);
    },
    // 重置
    handleReset() {
      this.prefabricationData.forEach((item) => {
        if (item.attrs.key === "engineeringProjectId") return;
        item.attrs.options && (item.attrs.options = []);
      })
      this.returnTitle();
    },
    // 查看车次详情
    handleVehicleDetail(row) {
      this.$router.push({
        name: "vehicle-detail",
        query: {
          type: "detail",
          transPlanId: row.transPlanId,
        },
      })
    },
    // 新增配车
    handleVehicle() {
      const searchComp = this.$refs["search"];
      const { roundsPlanId } = searchComp.formData;
      if (!roundsPlanId) {
        this.$message.warning("请选择轮次！");
        return;
      }
      let cur = this.renderData[2].attrs.options.find(
        (item) => item.roundsPlanId == roundsPlanId
      );
      const queryData = JSON.stringify({
        ...cur,
      });
      this.$router.push({
        name: "vehicle-add",
        query: {
          queryData,
          type: "add",
        },
      });
    },
    // 作废
    handleNullify(row) {
      this.$confirm("此操作将作废该条数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          (async () => {
            let res = await nullifyPlan(row.transPlanId);
            res.code === 0
              ? this.$message.success("删除成功！")
              : this.$message.error("删除失败！");
            this.getTransPlanData(this.searchData);
          })();
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
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
      .el-link {
        text-decoration: none;
      }
    }
  }
}
</style>
