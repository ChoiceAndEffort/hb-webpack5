<template>
  <el-dialog title="选择物料"
    :visible.sync="dialogFormVisible">
    <div class="top_search">
      <div>
        <p>联段：</p>
        <el-select v-model="searchobj.couplingId"
          placeholder="请选择联段"
          clearable
          disabled
          filterable
          @change="getLinkage('two')"
          size="small">
          <el-option v-for="item in couplingList"
            :key="item.couplingId"
            :label="item.name"
            :value="item.couplingId"></el-option>
        </el-select>
      </div>
      <div>
        <p>工序：</p>
        <!-- 工序下拉框 -->
        <el-cascader ref="cascader"
          disabled
          v-model="searchobj.procedureId"
          :show-all-levels="false"
          :options="procedureList"
          :props="props"
          style="width: 216px"
          @change="getLinkage('three')"></el-cascader>
      </div>
      <div>
        <p>编号：</p>
        <!-- 工序下拉框 -->
        <el-input placeholder="请输入物料编号"
          v-model="searchobj.materialNumber"
          clearable>
        </el-input>
      </div>

      <el-button type="primary"
        size="small"
        @click="getMaterialPageData">查询</el-button>
    </div>
    <TableBody class="table"
      v-loading="isLoading"
      :colConfig="colConfig"
      :data="tableData.data"
      height="500"
      row-key="selectId"
      @selection-change="handleSelectionChange"
      v-loadmore="touchGround">
      <template slot="current"
        slot-scope="{ scope }">
        <el-input-number v-if="scope.row.thisAmount != 0"
          v-model="scope.row.thisAmount"
          :precision="0"
          :step="1"
          :min="0"
          :max="scope.row.materialAmount - scope.row.actualAmount"></el-input-number>
        <el-input-number v-if="scope.row.thisAmount == 0"
          v-model="scope.row.diffValue"
          :precision="0"
          :step="1"
          :min="0"
          :max="scope.row.materialAmount - scope.row.actualAmount"></el-input-number>
      </template>
    </TableBody>
    <!-- <Pagination :data="tableData" @changePage="changePage"/> -->
    <div class="btns">
      <el-button size="small"
        @click="dialogFormVisible = false">取消</el-button>
      <el-button size="small"
        type="primary"
        @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SubmitBtn, TableBody, Pagination, Form } from "gggj_lib";
import {
  getNestingPoolList,
  materialGetPage,
} from "@/api/productionManagement/projectMasterPlan.js";
import {
  getCouplinglist,
  getProcedureList,
  getEngineeringProjectList,
} from "@/api/productionManagement/project.js";
export default {
  props: ["queryData"],
  data() {
    return {
      dialogFormVisible: false,
      searchData: {
        page: 0,
        size: 10,
      },
      nestingPoolList: [], //套料数组
      // queryData: {},
      colConfig: [
        {
          attrs: { align: "center", type: "selection" },
        },
        {
          attrs: {
            label: "物料编码",
            prop: "materialCode",
            align: "center",
          },
        },
        {
          attrs: {
            label: "物料编号",
            prop: "materialNumber",
            align: "center",
          },
        },
        {
          attrs: {
            label: "物料材质",
            prop: "materialQuality",
            align: "center",
          },
        },
        {
          attrs: {
            label: "高度(厚度)",
            prop: "materialHeight",
            align: "center",
          },
        },
        {
          attrs: {
            label: "宽度",
            prop: "materialWidth",
            align: "center",
          },
        },
        {
          attrs: {
            label: "长度",
            prop: "materialLength",
            align: "center",
          },
        },
        {
          attrs: {
            label: "物料重量(千克)",
            prop: "materialWeight",
            align: "center",
          },
        },
        {
          attrs: {
            label: "物料数量",
            prop: "materialAmount",
            align: "center",
            fixed: "right",
          },
        },
        {
          attrs: {
            label: "已关联数量",
            prop: "actualAmount",
            align: "center",
            fixed: "right",
          },
        },
        {
          slot: "current",
          attrs: {
            label: "本轮生产量",
            prop: "thisAmount",
            align: "center",
            fixed: "right",
          },
        },
      ],
      tableData: {
        total: 0,
        page: 0,
        currentPage: 0,
      },
      submitData: {},
      isLoading: false,
      props: {
        value: "projectWorkingProcedureId",
        label: "name",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false,
      },
      searchobj: {
        engineeringProjectId: "", // 项目id
        couplingId: "", // 联段id
        procedureId: "", // 工序id
      },
      projectList: [], // 项目
      couplingList: [], // 联段框
      procedureList: [], // 工序框
    };
  },
  components: {
    Form,
    SubmitBtn,
    TableBody,
    Pagination,
  },
  mounted() {
    console.log(this.queryData);
    this.searchobj.engineeringProjectId = this.queryData.engineeringProjectId; // 项目id
    this.getLinkage("one");
  },
  methods: {
    //触底加载
    touchGround() {
      this.getMaterialPageData('1');
    },
    handleDialogFormVisible() {
      this.dialogFormVisible = true;
    },
    getLinkage(sign) {
      switch (sign) {
        case "one":
          // 清空选择联段框
          this.couplingList = [];
          // 清空选择工序框
          this.procedureList = [];
          this.searchobj.couplingId = "";
          this.searchobj.workingProcedureCode = "";
          if (this.searchobj.engineeringProjectId == "") {
            break;
          }
          this.$emit("getProjectName", this.searchobj.engineeringProjectId);
          getCouplinglist({
            engineeringProjectId: this.searchobj.engineeringProjectId,
          }).then((res) => {
            if (res.code === 0) {
              this.couplingList = res.data;
              this.searchobj.couplingId = this.queryData.couplingId;
              this.getLinkage("two");
            } else {
              this.$message.error(res.message);
            }
          });
          break;
        case "two":
          // 清空选择工序框
          this.procedureList = [];
          this.searchobj.workingProcedureCode = "";
          if (this.searchobj.couplingId == "") {
            break;
          }
          getProcedureList({
            id: this.searchobj.couplingId,
          }).then((res) => {
            if (res.code === 0) {
              this.procedureList = res.data;
              this.procedureList.forEach((res) => {
                if (res.children.length < 1) delete res.children;
                if (
                  res.workingProcedureCode ==
                  this.queryData.workingProcedureCode
                )
                  return (this.searchobj.procedureId =
                    res.projectWorkingProcedureId);
                if (res.children != undefined)
                  res.children.forEach((item) => {
                    if (
                      item.workingProcedureCode ==
                      this.queryData.workingProcedureCode
                    )
                      return (this.searchobj.procedureId =
                        item.projectWorkingProcedureId);
                  });
              });
              this.getMaterialPageData();
            } else {
              this.$message.error(res.message);
            }
          });
          break;
        case "three":
          this.$refs.cascader.dropDownVisible = false;
          break;
      }
    },
    // 切换下一页
    changePage(page) {
      this.searchData.page = page;
      this.getMaterialPageData();
    },
    // 多选
    handleSelectionChange(val, d) {
      console.log(val);
      let arr = [];
      /*         val.forEach((valItem)=>{
                    this.tableData.data.forEach((item)=>{
                        if(valItem.concatId == item.concatId){
                            arr.push(item);
                        }
                    })
                })
                this.submitData.nestingPlanList = arr;*/
      this.submitData.nestingPlanList = val;
    },
    // 获取套料选项列表
    getNestingPoolListData() {
      getNestingPoolList({
        couplingId: this.searchData.couplingId,
        engineeringProjectId: this.searchData.engineeringProjectId,
      }).then((res) => {
        this.$set(this, "nestingPoolList", res.data);
      });
    },
    // 获取套料列表
    getMaterialPageData(isTouch) {
      if (isTouch == '1') {
        if (this.tableData.currentPage + 1 < this.tableData.totalPages) {
          this.searchData.page += 1;
        }
      }
      let data = Object.assign({ status: 0 }, this.searchobj, this.searchData);
      this.isLoading = true;
      materialGetPage(data)
        .then((res) => {
          res.data.data.forEach((item, index) => {
            item["selectId"] = item.materialId + index;
            item["diffValue"] = item.materialAmount - item.actualAmount;
            // item['concatId'] = `${item.nestingName}_${item.nestingId}`
          });
          if (isTouch == '1') {
            if (this.tableData.currentPage + 1 < this.tableData.totalPages) {
              this.tableData.data = [...this.tableData.data, ...res.data.data];
              this.tableData.currentPage = res.data.currentPage;
            }
          } else {
            this.tableData = res.data;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 提交
    handleSubmit() {
      if (
        !this.submitData.nestingPlanList ||
        !this.submitData.nestingPlanList.length
      ) {
        this.$message.warning("请勾选物料！");
        return;
      }
      this.submitData.nestingPlanList.forEach((item) => {
        item.thisAmount = item.diffValue;
      });
      this.$emit("handleSubmit", {
        nestingPlanList: this.submitData.nestingPlanList,
        nestingPoolId: this.searchData.nestingPoolId,
      });
      this.dialogFormVisible = false;
      this.searchData.page = 0;
    },
  },
};
</script>

<style scoped lang="scss">
.table {
  margin-top: 10px;
}
.btns {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.search-page {
  display: inline-block;
  width: 180px;
  margin: 0 10px;
}
.top_search {
  display: flex;
  p {
    min-width: 50px;
  }
  > div {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }
}
</style>
