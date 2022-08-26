<template>
  <div class="gggj_style main_container configure-outsourcing">
    <div class="flex_row_space">
      <div>{{ routeData.workingProced.split("-")[2] }}工序外协单位配置</div>
      <div>
        <el-button plain icon="el-icon-plus" @click="addSupplier"
          >新增供应商</el-button
        >
      </div>
    </div>
    <TableBody
      :colConfig="colConfig"
      :data="data.tabledata"
      v-loading="loading"
      :key="randomNumber"
      height="600"
    >
      <template slot="operation" slot-scope="{ scope }">
        <el-button
          icon="el-icon-delete"
          class="col"
          circle
          @click="deleteSupplier(scope.$index, scope)"
        ></el-button>
        <!--                <el-button type="text" @click="AddTechnique(true,scope.row)"><i class="el-icon-delete"></i></el-button>-->
      </template>
    </TableBody>
    <bottomFooter :isReturn="true">
      <el-button type="primary" @click="preservation">保存</el-button>
    </bottomFooter>
    <el-dialog
      title="新增供应商"
      :visible.sync="newSupplierVisible"
      class="newSupplier_box"
      :close-on-click-modal="false"
      width="60%"
    >
      <div class="newSupplier_box_body">
        <div class="flex_row_space">
          <div class="title">供应商列表</div>
          <div>
            <el-input
              placeholder="请输入内容"
              v-model="supplierSearch.input"
              class="input-with-select"
            >
              <el-select
                v-model="supplierSearch.select"
                clearable
                slot="prepend"
                placeholder="请选择"
                @change="
                  supplierSearch.input = '';
                  addSupplier();
                "
              >
                <el-option
                  v-for="(item, index) in supplierType"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="addSupplier()"
              ></el-button>
            </el-input>
          </div>
        </div>
        <TableBody
          :colConfig="suppliercolConfig"
          :data="supplierdata.data"
          v-loading="loading"
          row-key="supplierId"
          @selection-change="handleSelectionChange"
        >
          <template slot="operation" slot-scope="{ scope }">
            <!--                        <el-button type="text" @click="AddTechnique(true,scope.row)"><i class="el-icon-delete"></i></el-button>-->
          </template>
        </TableBody>
        <Pagination :data="supplierdata" @changePage="changePage" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newSupplierVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { TableBody, Pagination } from "gggj_lib";
import {
  procedureSupplierConfiguration,
  suppliergetPage,
  saveBatchprocedureSupplier,
  deleteProcedureSupplierConfiguration,
} from "@/api/productionManagement/project.js";
import bottomFooter from "../components/bottomFooter.vue";
export default {
  components: { TableBody, Pagination, bottomFooter },
  name: "configure-outsourcing",
  data() {
    return {
      colConfig: [
        {
          attrs: { label: "序号", type: "index" },
        },
        {
          attrs: { label: "供应商名称", prop: "supplierName", align: "center" },
        },
        {
          attrs: { label: "配置人", prop: "addName", align: "center" },
        },
        {
          attrs: { label: "配置时间", prop: "addTime", align: "center" },
        },
        {
          slot: "operation",
          attrs: { label: "操作", prop: "operation", align: "center" },
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
        tabledata: [],
      },
      /**新增供应商弹框*/
      newSupplierVisible: false,
      supplierSearch: {
        input: "",
        select: "",
      },
      suppliercolConfig: [
        {
          attrs: {
            align: "center",
            type: "selection",
            "reserve-selection": true,
          },
        },
        {
          attrs: { label: "序号", type: "index" },
        },
        {
          attrs: { label: "供应商名称", prop: "supplierName", align: "center" },
        },
        {
          attrs: { label: "供应商类型", prop: "supplierType", align: "center" },
        },
      ],
      supplierType: [],
      supplierdata: {
        total: 0,
        size: 10,
        page: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        data: [],
      },
      newSupplierdata: [],
      checkDuplicate: [],
      loading: false,
      randomNumber: "",
      routeData: { workingProced: "" }, // 路由传递数据
    };
  },
  mounted() {
    if (this.$route.query) {
      this.routeData = { ...this.$route.query };
    }
    this.getMainpage();
    this.commonJs.getDictdata("SUPPLIER_TYPE").then((res) => {
      this.supplierType = res.data.dictItemList;
    });
  },
  methods: {
    getMainpage() {
      const { workingProced } = this.routeData;
      const sendData = {
        page: this.data.page,
        procedureId: workingProced.split("-")[0],
        size: 10000,
      };
      procedureSupplierConfiguration(sendData).then((res) => {
        this.data.tabledata = res.data.data;
        res.data.data.forEach((item) => {
          this.checkDuplicate.push(item.supplierId); // 用来新增查重
        });
      });
    },
    /**删除供应商*/
    deleteSupplier(index, scope) {
      const { procedureSupplierConfigurationId } = scope.row;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProcedureSupplierConfiguration(
            procedureSupplierConfigurationId
          ).then((res) => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getMainpage()
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**打开新增供应商弹框*/
    addSupplier() {
      this.newSupplierVisible = true;
      const sendData = {
        page: this.supplierdata.page,
        size: this.supplierdata.size,
        supplierType: this.supplierSearch.select,
        supplierName: this.supplierSearch.input,
        status: 1,
      };
      suppliergetPage(sendData).then((res) => {
        this.supplierdata.data = res.data.data;
        this.supplierdata.total = res.data.total;
      });
    },
    changePage(e) {
      this.supplierdata.page = e;
      this.addSupplier();
    },
    handleSelectionChange(val) {
      this.newSupplierdata = [...val];
    },
    onSubmit() {
      console.log(this.newSupplierdata);
      this.newSupplierdata.forEach((res, index) => {
        const checkDuplicate = new Set(this.checkDuplicate);
        if (!checkDuplicate.has(res.supplierId)) {
          this.checkDuplicate.push(res.supplierId);
          this.data.tabledata.push(res);
        }
      });
      this.$set(this, "randomNumber", Math.random());
      this.newSupplierVisible = false;
    },
    preservation() {
      let temp = this.data.tabledata.map((item) => {
        let temp = {};
        temp = { ...item, ...this.routeData, ...this.routeData.workingProced };
        temp.procedureId = temp.workingProced.split("-")[0];
        temp.workingProcedureCode = temp.workingProced.split("-")[1];
        return temp;
      });
      let procedureSupplierConfigurationBoList = temp;
      this.$confirm("是否保存配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      })
        .then(() => {
          saveBatchprocedureSupplier({
            procedureSupplierConfigurationBoList,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success("配置成功");
              this.$router.back();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.configure-outsourcing {
  .flex_row_space {
    margin-bottom: 16px;
    align-items: center;
  }
  .newSupplier_box {
    ::v-deep .el-dialog {
      .el-dialog__body {
        padding: 0 16px 12px;
      }
      .el-dialog__header {
        border-bottom: 1px solid #e4e7ed;
      }
    }
    .newSupplier_box_body {
      padding-top: 20px;
      .flex_row_space {
        .title {
          font-size: 14px;
          font-weight: 600;
          color: #303133;
        }
        ::v-deep .el-input-group__prepend {
          background: #fff;
        }
        ::v-deep .el-select input {
          width: 155px !important;
        }
      }
    }
    .footer {
      text-align: right;
      .el-form .el-form-item {
        width: 100% !important;
      }
    }
  }
  .col {
    color: #fa5555;
    border: none;
  }
}
</style>
