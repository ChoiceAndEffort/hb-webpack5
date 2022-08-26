<template>
  <div class="sub-page">
    <div class="top-wrap">
      <div class="top-wrap__header">
        <h5 class="title">计划属性</h5>
        <!--  <el-button size="small" type="primary" @click="handleBack">返回</el-button> -->
      </div>
      <div class="form">
        <div class="form-item">
          <div class="label">责任单位:</div>
          <el-cascader ref="departmentName"
            :show-all-levels="false"
            v-model="form.departmentId"
            :options="departmentList"
            :props="{emitPath:false, expandTrigger: 'hover', label: 'name', value: 'departmentId',checkStrictly: true, }"
            @change="selectCascader('departmentName')"></el-cascader>
        </div>
        <!-- <div class="form-item">
                    <div class="label">是否需要转运单位协助:</div>
                    <div class="radio-wrap">
                        <el-radio v-model="form.radio" label="1">是</el-radio>
                        <el-radio v-model="form.radio" label="2">否</el-radio>
                    </div>
                </div> -->
        <!-- <div class="form-item" v-show="form.radio == 1">
                    <div class="label">选择转运单位:</div>
                    <el-cascader ref="transportationName" :show-all-levels="false" v-model="form.transportationId" :options="departmentList" :props="{emitPath:false, expandTrigger: 'hover', label: 'name', value: 'departmentId' }" @change="selectCascader('transportationName')"></el-cascader>
                </div> -->
      </div>
    </div>
    <div class="table-wrap">
      <div class="table-wrap__header">
        <h5 class="title">相关物料</h5>
        <div class="btns">
          <el-button size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="addNesting">新增</el-button>
        </div>
      </div>
      <div class="table-wrap__content">
        <TableBody :colConfig="colConfig"
          :data="tableData"
          height="470">
          <!--                <TableBody :colConfig="colConfig" :data="tableData" concatKey="concatId" :concatIndexArr="[0,1,2,3,4,5,6,7,8,9]">-->
          <template slot="btns"
            slot-scope="{scope}">
            <!--                        <el-button size="mini" type="primary" @click="handleDetail(scope.row,scope.$index)">详情</el-button>-->
            <el-button size="mini"
              type="primary"
              @click="handleDelete(scope.row,scope.$index)">删除</el-button>
          </template>
        </TableBody>
      </div>
    </div>
    <div class="btn-wrap">
      <el-button size="small"
        @click="handleBack">取消</el-button>
      <el-button size="small"
        type="primary"
        @click="handleSave">保存</el-button>
    </div>
    <MaterialPopup ref="MaterialPopup"
      :queryData=$route.query
      @handleSubmit="setNestingPlanList" />
    <MaterialDetailPopup ref="materialDetailPopup" />
  </div>
</template>

<script>
import { enterpriseId } from '@/assets/productionManagement/comjs/login'
import { TableBody } from 'gggj_lib'
import { nestingPlanGetPage, getMaterialPlanPage, generateMaterialAndAttachmentPlan, deletedMaterialPlan, getMaterialPlanList } from '@/api/productionManagement/projectMasterPlan.js'
import MaterialPopup from './components/materialPopup.vue'
import { getDepartmentList } from '@/api/productionManagement/departmentRole.js'
import MaterialDetailPopup from './components/materialDetailPopup.vue'
export default {
  data() {
    return {
      dialogFormVisible: false,
      searchData: {
        roundsPlanId: this.$route.query.roundsPlanId
      },
      colConfig: [{ attrs: { label: "序号", type: "index", fixed: "left", width: "50" } },
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
          label: "物料数量",
          prop: "materialAmount",
          align: "center",
        },
      },
      {
        attrs: {
          label: "本轮生产量",
          prop: "thisAmount",
          align: "center",
        },
      },
      {
        attrs: {
          label: "物料重量(千克)",
          prop: "materialWeight",
          align: "center",
        },
      }, {
        slot: 'btns',
        attrs: { label: '操作', fixed: 'right', width: 200 },
      }],
      tableData: [],
      baseTableData: [],
      tableDataId: [],
      form: {
        departmentId: '',
        departmentName: '',
        // radio: '1',
        transportationId: '',
        transportationName: ''
      },
      departmentList: [], //部门列表数据
      submitData: {
        workingProcedurePlanId: '',
        nestingPoolId: '',
        nestingPlanList: []
      },
      props: {
        value: 'departmentId'
      }
    }
  },
  components: {
    TableBody,
    MaterialPopup,
    MaterialDetailPopup
  },
  mounted() {
    this.getMaterialPlanGetPage();
    this.getDepartmentListData();
  },
  methods: {
    getDepartmentListData() {
      getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1
      }).then((res) => {
        this.departmentList = res.data;
      })
    },
    // 添加物料
    addNesting() {
      this.$refs.MaterialPopup.handleDialogFormVisible();
    },
    // 获取不分页套料
    getMaterialPlanGetPage() {
      let query = this.$route.query;
      getMaterialPlanList({
        workingProcedurePlanId: query.workingProcedurePlanId,
        // engineeringProjectId: query.engineeringProjectId,
        // couplingId: query.couplingId,
        roundsPlanId: query.roundsPlanId
      }).then((res) => {

        this.tableData = res.data;
        this.baseTableData = res.data;
      })
    },
    handleDetail(rowData) {
      this.$refs.materialDetailPopup.handleDialogFormVisible(rowData.nestingId);
    },
    handleDelete(rowData, index) {
      if (rowData.materialPlanId && rowData.isApprove == 2) return this.$message.warning('已生成工单，无法删除！');
      if (rowData.materialPlanId) {
        deletedMaterialPlan(rowData.materialPlanId).then((res) => {
          /*   for (var i = 0; i < this.tableData.length; i++) {
                 if(rowData.concatId == this.tableData[i].concatId){
                     this.tableData.splice(i, 1);
                     i--;
                 }
             }*/
          this.tableData.splice(index, 1);
          this.$message.success('删除成功');
          this.getMaterialPlanGetPage();
        })
      } else {
        this.tableData.splice(index, 1);
        /*for (var i = 0; i < this.tableData.length; i++) {
            if(rowData.concatId == this.tableData[i].concatId){
                this.tableData.splice(i, 1);
                i--;
            }
        }*/
      }
    },
    handleBack() {
      this.$router.back();
    },
    setNestingPlanList(data) {
      let tableData = this.baseTableData.concat(data.nestingPlanList);
      this.submitData.nestingPoolId = data.nestingPoolId;
      this.$set(this, 'tableData', tableData);
    },
    handleSave() {
      if (!this.form.departmentId) {
        this.$message.error('请选择责任单位');
        return
      }
      // if(this.form.radio == 1){
      //     if(!this.form.transportationId){
      //         this.$message.error('请选择转运单位');
      //         return
      //     }
      // }
      let query = this.$route.query;
      generateMaterialAndAttachmentPlan({
        name: query.name,
        departmentName: this.form.departmentName,
        departmentId: this.form.departmentId,
        roundsPlanId: query.roundsPlanId,
        transportName: this.form.transportationName,
        transportId: this.form.transportationId,
        workingProcedurePlanId: query.workingProcedurePlanId,
        nestingPoolId: this.submitData.nestingPoolId,
        materialPlanList: this.tableData,
        couplingId: query.couplingId,
        engineeringProjectId: query.engineeringProjectId,
        couplingPlanId: query.couplingPlanId,
        masterPlanId: query.masterPlanId,
      }).then((res) => {
        this.$message.success('保存成功')
        query.workingProcedureCode === "GX_YS" ?
          // 如果是运输工序跳转运输配车页面
          this.$router.push({
            name: 'vehicle-manage'
          }) : this.$router.back();
      })
    },
    selectCascader(name) {
      setTimeout(() => {
        this.form[name] = this.$refs[name].inputValue;
      }, 300)
    },

  }
}
</script>

<style scoped lang="scss">
.sub-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: transparent;
  box-sizing: border-box;
  padding: 0px;
}
.top-wrap {
  background: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  .top-wrap__header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
    .title {
      padding-bottom: 0px;
      line-height: 32px;
    }
  }
  .form {
    display: flex;
    .form-item {
      margin-right: 50px;
      margin-top: 16px;
      .label {
        font-size: 14px;
        color: #606266;
        padding-bottom: 8px;
      }
      .radio-wrap {
        margin-top: 10px;
      }
    }
  }
}
.title {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
  padding-bottom: 16px;
}
.table-wrap {
  flex: 1;
  margin-top: 8px;
  background: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  .title {
    line-height: 30px;
    padding-bottom: 0px !important;
  }
  .table-wrap__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
  }
}
.btn-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 48px;
  margin-top: 2px;
  background: #ffffff;
}
::v-deep .el-dialog {
  width: 90vw;
}
</style>
