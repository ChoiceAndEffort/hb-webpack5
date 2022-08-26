<template>
  <el-dialog title="选择套料"
    :visible.sync="dialogFormVisible">
    <div class="top_search">
      <div>
        <p>联段：</p>
        <el-select v-model="searchData.couplingId"
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
          v-model="searchData.procedureId"
          :show-all-levels="false"
          :options="procedureList"
          :props="props"
          style="width: 216px"
          @change="getLinkage('three')"></el-cascader>
      </div>
      <div>
        <p>套料图：</p>
        <el-select size="small"
          filterable
          clearable
          v-model="searchData.nestingPoolId"
          placeholder="请选择套料图">
          <el-option v-for="item in nestingPoolList"
            :key="item.nestingPoolId"
            :label="item.nestingName"
            :value="item.nestingPoolId"></el-option>
        </el-select>
      </div>
      <div>
        <p>页码：</p>
        <el-input v-model="searchData.nestingPage"
          clearable
          placeholder="请输入页码"
          style="width: 216px"></el-input>
      </div>
      <el-button size="small"
        type="primary"
        @click="getNestingPageData">查询</el-button>
    </div>
    <!-- :concatIndexArr="[0,1,2,3,4,5,6,7,8,9,10,11,12]" -->
    <TableBody class="table"
      v-loading="isLoading"
      :colConfig="colConfig"
      :data="tableData.data"
      v-loadmore="touchGround"
      height="400"
      row-key="selectId"
      concatKey="concatId"
      @selection-change="handleSelectionChange">
    </TableBody>

    <!-- <Pagination :data="tableData" @changePage="changePage" /> -->
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
  generateRoundsAndNestingPlan,
  getNestingPoolList,
  saveNestingPlanList,
} from "@/api/productionManagement/projectMasterPlan.js";
import {
  getCouplinglist,
  getProcedureList,
  getNestingPage,
} from "@/api/productionManagement/project.js";
export default {
  props: ["queryData"],
  //   directives: {
  //    'load-more': loadMore
  // },
  data() {
    return {
      dialogFormVisible: false,
      searchData: {
        engineeringProjectId: "", //项目
        couplingId: "", //联段
        nestingPoolId: "", // 套料图id
        procedureId: "", // 工序id
        page: 0,
        nestingPage: undefined,
        status: 0,
      },
      projectList: [], // 项目
      couplingList: [], // 联段框
      procedureList: [], // 工序框
      props: {
        value: "projectWorkingProcedureId",
        label: "name",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false,
      },
      nestingPoolList: [], //套料数组
      colConfig: [
        {
          attrs: {
            label: "编号",
            prop: "index",
            align: "center",
            type: "selection",
            "reserve-selection": true,
          },
        },
        {
          attrs: {
            label: "套料图名称",
            prop: "nestingName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "套料图页码",
            prop: "nestingPage",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料材质",
            prop: "rawMaterialTexture",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料高(毫米)",
            prop: "rawMaterialHeight",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料宽(毫米)",
            prop: "rawMaterialWidth",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料长(毫米)",
            prop: "rawMaterialLength",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料重量(单重/千克)",
            prop: "rawMaterialWeight",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "原材料数量(块)",
            prop: "rawMaterialSize",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "划线工艺",
            prop: "lineation",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "划线线长(米)",
            prop: "lineationLength",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "切割工艺",
            prop: "cuttingProcess",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "切割线长(米)",
            prop: "cuttingLength",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件编号",
            prop: "partNumber",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件编码",
            prop: "partCode",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件数量(件)",
            prop: "partSize",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件重量(单重/千克)",
            prop: "partWeight",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "零件工艺流向",
            prop: "partProcessFlow",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "坡口名称",
            prop: "grooveName",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "坡口类型1",
            prop: "grooveType",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "坡口长度(米)",
            prop: "grooveLength",
            align: "center",
            width: "220px",
          },
        },
        {
          attrs: {
            label: "面积类型1",
            prop: "nestingAreaType1",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积(平方米)",
            prop: "area1",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积类型2",
            prop: "nestingAreaType2",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积(平方米)",
            prop: "area2",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积类型3",
            prop: "nestingAreaType3",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积(平方米)",
            prop: "area3",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积类型4",
            prop: "nestingAreaType4",
            align: "center",
            width: "200px",
          },
        },
        {
          attrs: {
            label: "面积(平方米)",
            prop: "area4",
            align: "center",
            width: "200px",
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
    };
  },
  components: {
    Form,
    SubmitBtn,
    TableBody,
    Pagination,
  },
  mounted() {
    this.searchData.engineeringProjectId = this.queryData.engineeringProjectId;
    this.searchData.couplingId = this.queryData.couplingId;
    this.getNestingPoolListData();
    this.getLinkage("one");
  },
  methods: {
    //触底加载
    touchGround() {
      this.getNestingPageData('1')
    },
    handleDialogFormVisible(query) {
      this.dialogFormVisible = true;
    },
    // 重置表单
    handleResetForm() {
      this.$refs.nestingForm.resetForm();
    },
    // 切换下一页
    changePage(page) {
      console.log(page);
      this.searchData.page = page;
      this.getNestingPageData();
    },
    // 多选
    handleSelectionChange(val, d) {
      let arr = [];
      val.forEach((valItem) => {
        this.tableData.data.forEach((item) => {
          if (valItem.concatId == item.concatId) {
            arr.push(item);
          }
        });
      });
      this.submitData.nestingPlanList = arr;
    },
    getLinkage(sign) {
      switch (sign) {
        case "one":
          // 清空选择联段框
          this.couplingList = [];
          // 清空选择工序框
          this.procedureList = [];
          this.searchData.couplingId = "";
          this.searchData.workingProcedureCode = "";
          if (this.searchData.engineeringProjectId == "") {
            break;
          }
          this.$emit("getProjectName", this.searchData.engineeringProjectId);
          getCouplinglist({
            engineeringProjectId: this.searchData.engineeringProjectId,
          }).then((res) => {
            if (res.code === 0) {
              this.couplingList = res.data;
              this.searchData.couplingId = this.queryData.couplingId;
              this.getLinkage("two");
            } else {
              this.$message.error(res.message);
            }
          });
          break;
        case "two":
          // 清空选择工序框
          this.procedureList = [];
          this.searchData.workingProcedureCode = "";
          if (this.searchData.couplingId == "") {
            break;
          }
          getProcedureList({
            id: this.searchData.couplingId,
          }).then((res) => {
            if (res.code === 0) {
              this.procedureList = res.data;
              this.procedureList.forEach((res) => {
                if (res.children.length < 1) delete res.children;
                if (
                  res.workingProcedureCode ==
                  this.queryData.workingProcedureCode
                )
                  return (this.searchData.procedureId =
                    res.projectWorkingProcedureId);
                if (res.children != undefined)
                  res.children.forEach((item) => {
                    if (
                      item.workingProcedureCode ==
                      this.queryData.workingProcedureCode
                    )
                      return (this.searchData.procedureId =
                        item.projectWorkingProcedureId);
                  });
              });
              this.getNestingPageData();
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
    getNestingPageData(isTouch) {
      if (isTouch == '1') {
        if (this.tableData.currentPage + 1 < this.tableData.totalPages) {
          this.searchData.page += 1
        }
      }
      let data = Object.assign({}, this.searchData);
      console.log(isTouch, this.searchData, "888")
      this.isLoading = true;
      getNestingPage(data)
        .then((res) => {
          res.data.data.forEach((item, index) => {
            item["selectId"] = item.nestingPartId + index;
            item["concatId"] = `${item.nestingName}_${item.nestingId}`;
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
        // console.log(res)
        .finally(() => {
          this.isLoading = false;
        });
    },
    // 提交
    handleSubmit() {
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
