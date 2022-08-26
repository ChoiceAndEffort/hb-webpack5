<template>
  <div class="wrap">
    <search
      ref="search"
      :renderData="prefabricationData"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"
    ></search>
    <div class="content">
      <div class="content-header">
        <span>供应商列表</span>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
          >新增供应商</el-button
        >
      </div>
      <TableBody v-loading="loading" :colConfig="colConfig" :data="data.data">
        <template #btn="{ scope }">
          <el-button type="text" @click="handleDetail(scope.row)"
            >详情</el-button
          >
          <el-button
            type="text"
            style="color: red !important"
            @click="handleNullify(scope.row)"
            >作废</el-button
          >
        </template>
      </TableBody>
      <Pagination :data="data" @changePage="handleChangePage"></Pagination>
    </div>
  </div>
</template>

<script>
import Search from "@/views/productionManagement/components/search";
import { TableBody, Pagination } from "gggj_lib";
import { supplier_config } from "@/utils/productionManagement/data_config";
import { getDictData, getDictItemList } from "@/api/productionManagement/systemManagement";
import {
  getSupplierList,
  getSupplierDetail,
  getSupDepartment,
  delSupplier,
} from "@/api/productionManagement/systemManagement";
export default {
  name: "cooperative-supplier-manage",
  components: {
    Search,
    TableBody,
    Pagination,
  },
  data() {
    return {
      loading: false,
      colConfig: null,
      searchData: {},
      prefabricationData: [
        {
          tag: "el-input",
          label: "供应商名称",
          attrs: {
            key: "supplierName",
            placeholder: "请输入供应商名称",
          },
        },
        {
          tag: "el-select",
          label: "供应商类型",
          attrs: {
            key: "supplierType",
            options: [],
            placeholder: "请选择类型",
          },
        },
        {
          tag: "el-select",
          label: "部门",
          attrs: {
            key: "departmentId",
            options: [],
            placeholder: "请选择部门",
          },
        },
      ],
      fileList: [],
      supTypeList: [],
      data: {
        data: [],
        page: 0,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getSupplierType();
    this.getDepartment();
    this.getTableData();
    this.colConfig = supplier_config;
  },
  mounted() {},
  methods: {
    // 获取业务部门
    async getDepartment() {
      let res = await getSupDepartment();
      let temp = res.data.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      this.prefabricationData[2].attrs.options = temp;
    },
    // 获取供应商类型
    async getSupplierType() {
      let res = await getDictData("SUPPLIER_TYPE");
      let temp = await getDictItemList({
        dictId: res.data.dictId,
      });
      this.supTypeList = JSON.parse(JSON.stringify(temp.data));
      temp.data.forEach((item) => {
        item.code = item.value;
        item.value = item.name;
        item.label = item.name;
      });
      this.prefabricationData[1].attrs.options = temp.data;
    },
    // 获取列表数据
    async getTableData() {
      this.loading = true;
      let res = await getSupplierList({
        ...this.data,
        ...this.searchData,
        status: 1,
      });
      this.loading = false;
      this.data = res.data;
    },
    // 新增
    handleAdd() {
      this.$router.push({
        name: "cooperative-supplier-edit",
        query: {
          supTypeList: JSON.stringify(this.supTypeList),
          status: "add",
        },
      });
    },
    // 详情
    handleDetail(row) {
      this.$router.push({
        name: "cooperative-supplier-edit",
        query: {
          supTypeList: JSON.stringify(this.supTypeList),
          id: row.supplierId,
          status: "edit",
        },
      });
    },
    // 作废
    handleNullify(row) {
      this.$confirm(`是否作废${row.supplierName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          (async () => {
            let res = await delSupplier(row.supplierId);
            res.code === 0 && this.$message.success("作废成功!");
            res.code === 0 && this.getTableData();
          })();
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 查询
    handleSubmit(data) {
      this.searchData = data;
      this.getTableData();
    },
    // 重置
    handleReset() {
      this.data.page = 0;
    },
    // 分页
    handleChangePage(page) {
      this.data.page = page;
      this.getTableData();
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    background-color: #fff;
    padding: 16px;
    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
  }
}
</style>
