<template>
  <SearchForm
    ref="search"
    :searchData="prefabricationData"
    @handle-submit="handleSubmit"
    @handle-reset="handleReset"
  ></SearchForm>
</template>
<script>
import SearchForm from "../../components/SearchForm/index.vue";
export default {
  components: { SearchForm },
  data() {
    return {
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
        {
          tag: "el-input",
          label: "名称",
          attrs: {
            key: "name",
            placeholder: "名称",
            clearable: true,
          },
        },
        {
          tag: "el-switch",
          label: "按年付费",
          attrs: {
            key: "yeras",
            placeholder: "",
          },
        },
      ],
      submitForm: null,
    };
  },
  methods: {
    // 表单提交按钮事件
    handleSubmit(value) {
      if (!value.procedureId) {
        this.$message.warning("请选择工序！");
        return;
      }
      this.submitForm = value;
      //   this.getWorkingProcedurePage(value);
    },
    // 重置
    handleReset() {
      // this.prefabricationData[2].attrs.keys++;
      // this.prefabricationData[3].attrs.keys++;
      this.prefabricationData.forEach((item) => {
        if (
          item.attrs.key === "engineeringProjectId" ||
          item.attrs.key === "departmentPickId"
        )
          return;
        item.attrs.options && (item.attrs.options = []);
      });
      //   this.returnTitle();
    },
    firstInputRequest() {},
    returnTitle() {},
    secondInputRequest() {},
    handleProcedureConfirm() {},
  },
};
</script>