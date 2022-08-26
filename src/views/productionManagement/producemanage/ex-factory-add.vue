<template>
  <div class="wrap">
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <span>新增非产品类需求</span>
      </div>
      <el-form class="info-form"
        :rules="RulesInfo"
        ref="infoForm"
        :model="infoFormData"
        label-position="top">
        <el-row :gutter="80">
          <el-col :xl="{ span: 8 }">
            <el-form-item label="项目名称"
              prop="projectId">
              <el-select v-model="infoFormData.projectId"
                placeholder="请输入请选择项目"
                @change="
                  firstInputRequest({
                    engineeringProjectId: infoFormData.projectId,
                  })
                "
                clearable>
                <el-option v-for="(item, index) in prefabricationData"
                  :key="index"
                  :label="item.name"
                  :value="item.engineeringProjectId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="联段名称"
              prop="couplingId">
              <el-select v-model="infoFormData.couplingId"
                placeholder="请输入请选择联段"
                clearable>
                <el-option v-for="(item, index) in CouplingList"
                  :key="index"
                  :label="item.name"
                  :value="item.couplingId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="收货联系人">
              <el-input v-model="infoFormData.liaison"
                placeholder="请输入收货联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="80">
          <el-col :xl="{ span: 8 }">
            <el-form-item label="联系方式">
              <el-input v-model="infoFormData.liaisonPhone"
                placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="运输目的地">
              <el-input v-model="infoFormData.transportPlace"
                placeholder="请输入运输目的地"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="装车吨单价(元)">
              <el-input v-model="infoFormData.loadQuota"
                placeholder="请输入装车吨单价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="运输吨单价(元)">
              <el-input v-model="infoFormData.quota"
                placeholder="请输入运输吨单价"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="外协单位：">
              <el-cascader ref="cascaderAddr"
                style="width: 500px"
                :show-all-levels="false"
                :options="getDepart"
                :props="{ checkStrictly: true }"
                clearable
                @change="handleLable"
                placeholder="请选择外协单位"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xl="{ span: 8 }">
            <el-form-item label="装车车间：">
              <el-cascader ref="cascaderLoadingWork"
                style="width: 500px"
                :show-all-levels="false"
                :options="getDepart"
                :props="{ checkStrictly: true }"
                clearable
                @change="changeNew"
                placeholder="请选择装车车间"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 物资或工装 -->
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <span>物料或工装</span>
      </div>
      <el-form ref="form"
        :model="formData">
        <el-form-item>
          <el-table :data="formData.tableData"
            style="width: 100%"
            :header-cell-style="{ background: '#F2F6FC ', color: '#606266' }">
            <el-table-column label="序号"
              type="index">
              <template scope="{ $index}">
                <span>{{ indexMethod($index) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="物料名称">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.name`"
                  :rules="transportRules.name">
                  <el-input v-if="!row.editState"
                    v-model="row.name"></el-input>
                  <span v-else>{{ row.name }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.type`">
                  <el-select v-if="!row.editState"
                    v-model="row.type">
                    <el-option label="物资类"
                      :value="0"></el-option>
                    <el-option label="工装类"
                      :value="1"></el-option>
                    <el-option label="设备类"
                      :value="2"></el-option>
                  </el-select>
                  <span v-else>{{
                    row.type === 0
                      ? "物资类"
                      : row.type === 1
                      ? "工装类"
                      : "设备类"
                  }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="编号">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.number`"
                  :rules="row.type === 2 ? transportRules.number : {}">
                  <el-input v-if="!row.editState"
                    v-model="row.number"></el-input>
                  <span v-else>{{ row.number }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="高度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.height`"
                  :rules="transportRules.height">
                  <el-input v-if="!row.editState"
                    v-model="row.height"></el-input>
                  <span v-else>{{ row.height }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="宽度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.width`"
                  :rules="transportRules.width">
                  <el-input v-if="!row.editState"
                    v-model="row.width"></el-input>
                  <span v-else>{{ row.width }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="长度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.length`"
                  :rules="transportRules.length">
                  <el-input v-if="!row.editState"
                    v-model="row.length"></el-input>
                  <span v-else>{{ row.length }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="数量">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.amount`"
                  :rules="transportRules.amount">
                  <el-input v-if="!row.editState"
                    v-model="row.amount"></el-input>
                  <span v-else>{{ row.amount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="单重(千克)">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.weight`"
                  :rules="transportRules.weight">
                  <el-input v-if="!row.editState"
                    v-model="row.weight"></el-input>
                  <span v-else>{{ row.weight }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="总重(千克)">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.totalW`"
                  :rules="transportRules.totalW">
                  <el-input v-if="!row.editState"
                    v-model="row.totalW"></el-input>
                  <span v-else>{{ row.totalW }}</span>

                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column class-name="operation"
              label="操作">
              <template scope="{row , $index}">
                <template v-if="!row.editState">
                  <el-link type="primary"
                    :underline="false"
                    @click="handleSave(row)">保存</el-link>
                  <el-popconfirm title="是否确认删除？"
                    @confirm="handleDelConfirm({ row, index: $index })"
                    @cancel="handleDelCancel">
                    <el-link slot="reference"
                      type="danger"
                      :underline="false">删除</el-link>
                  </el-popconfirm>
                  <el-link type="primary"
                    :underline="false"
                    @click="handleCancel(row)">取消</el-link>
                </template>
                <template v-else>
                  <el-link type="primary"
                    :underline="false"
                    @click="handleEdit(row)">编辑</el-link>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <div class="add"
        @click="handleAddData">
        <span><i icon="el-icon-plus"></i>+添加一个物资或工装</span>
      </div>
    </el-card>

    <!-- 设备 -->
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <span>设备</span>
      </div>
      <el-form ref="form"
        :model="formList">
        <el-form-item>
          <el-table :data="formList.tableData"
            style="width: 100%"
            :header-cell-style="{ background: '#F2F6FC ', color: '#606266' }">
            <el-table-column label="序号"
              type="index">
              <template scope="{ $index}">
                <span>{{ indexMethod($index) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="设备名称">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.name`"
                  :rules="transportRules.name">
                  <el-input v-if="!row.editState"
                    v-model="row.name"></el-input>
                  <span v-else>{{ row.name }}</span>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="设备编号">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.number`"
                  :rules="row.type === 2 ? transportRules.number : {}">
                  <el-input v-if="!row.editState"
                    v-model="row.number"></el-input>
                  <span v-else>{{ row.number }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="高度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.height`"
                  :rules="transportRules.height">
                  <el-input v-if="!row.editState"
                    v-model="row.height"></el-input>
                  <span v-else>{{ row.height }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="宽度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.width`"
                  :rules="transportRules.width">
                  <el-input v-if="!row.editState"
                    v-model="row.width"></el-input>
                  <span v-else>{{ row.width }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="长度">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.length`"
                  :rules="transportRules.length">
                  <el-input v-if="!row.editState"
                    v-model="row.length"></el-input>
                  <span v-else>{{ row.length }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="数量">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.amount`"
                  :rules="transportRules.amount">
                  <el-input v-if="!row.editState"
                    v-model="row.amount"></el-input>
                  <span v-else>{{ row.amount }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="单重(千克)">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.weight`"
                  :rules="transportRules.weight">
                  <el-input v-if="!row.editState"
                    v-model="row.weight"></el-input>
                  <span v-else>{{ row.weight }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column align="right"
              label="总重(千克)">
              <template scope="{row , $index}">
                <el-form-item :prop="`tableData.${$index}.totalW`"
                  :rules="transportRules.totalW">
                  <el-input disabled
                    v-if="!row.editState"
                    v-model="row.totalW"></el-input>
                  <span v-else>{{ row.totalW }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column class-name="operation"
              label="操作">
              <template scope="{row , $index}">
                <template v-if="!row.editState">
                  <el-link type="primary"
                    :underline="false"
                    @click="handleSaveList(row)">保存</el-link>
                  <el-popconfirm title="是否确认删除？"
                    @confirm="handleDelConfirmList({ row, index: $index })"
                    @cancel="handleDelCancelList">
                    <el-link slot="reference"
                      type="danger"
                      :underline="false">删除</el-link>
                  </el-popconfirm>
                  <el-link type="primary"
                    :underline="false"
                    @click="handleCancelList(row)">取消</el-link>
                </template>
                <template v-else>
                  <el-link type="primary"
                    :underline="false"
                    @click="handleEditList(row)">编辑</el-link>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <div class="add"
        @click="handleAddList">
        <span><i icon="el-icon-plus"></i>+添加一个设备</span>
      </div>
    </el-card>

    <div class="footer">
      <el-button @click="Result">取消</el-button>
      <el-button type="primary"
        @click="ReleaseBtn">发布需求</el-button>
    </div>

    <!-- <el-dialog
      title="请选择外协单位"
      :visible.sync="dialogState"
      :close-on-click-modal="false"
      width="380px"
    >
      <el-form :model="dialogData" ref="dialogForm">
        <el-form-item label="装车车间：">
          <el-select v-model="dialogData.workshop" placeholder="请选择装车车间">
            <el-option label="1" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外协单位：">
          <el-select
            v-model="dialogData.department"
            placeholder="请选择外协单位"
          >
            <el-option label="1" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogState = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { indexMethod } from "@/utils/productionManagement/tool";
import { transportRules } from "@/utils/productionManagement/valid";
import { TableBody, Pagination } from "gggj_lib";
import { getEngineeringProjectList, getCouplinglist } from "@/api/productionManagement/project.js";
// 获取部门列表数据
import { getDepartmentList } from "@/api/productionManagement/departmentRole.js";
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
// 非产品新增需求
import { addTransportWithNonProduct } from "@/api/productionManagement/producemanage.js";

import exfactoryChilid from "./components/ex-factory-add-child.vue";
import dataManagementVue from "../project/data-management.vue";
import { format } from "echarts";
export default {
  components: { exfactoryChilid },
  data() {
    return {
      // 项目下拉框数据
      prefabricationData: [],
      // 联段名称
      CouplingList: [],
      dataList: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      // 获取部门
      getDepart: [
        {
          label: "",
          children: [
            {
              label: "",
              children: [
                {
                  label: "",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 编辑
      formData: {
        tableData: [],
      },
      //
      formList: {
        tableData: [],
      },
      // 基础信息表单数据
      infoFormData: {
        projectId: "",
        couplingId: "",
        liaisonPhone: "",
        liaison: "",
        transportPlace: "",
        loadQuota: "",
        quota: "",
        department: "",
        workshop: "",
        supplierId: "", // 外协单位Id
        loadingWorkshopId: "", // 装车车间Id
      },
      RulesInfo: {
        projectId: [{ required: true, message: "请选择项目", trigger: "blur" }],
        couplingId: [
          { required: true, message: "请选择联段", trigger: "blur" },
        ],
      },
      // 验证规则
      transportRules,
      // 弹窗表单数据
      dialogData: {
        wrokshop: "",
        department: "",
      },
      // 弹窗开启状态
      dialogState: true,
    };
  },
  created() {
    let res = [{}];
    res.forEach((item) => {
      item.name = "";
      item.editState = false;
      item.type = 0;
    });
    this.formData.tableData = res;
  },
  mounted() {
    this.initRequest();
    // this.firstInputRequest();
    this.getDepartmentList();
  },
  computed: {
    getSummaries() {
      return parseInt(this.formData.tableData.weight + this.formData.tableData.amount).toString(2)
    }
  },
  methods: {
    // 树形控件
    handleNodeClick(getDepart) {
      console.log(getDepart, "控件");
    },
    // 自定义序号
    indexMethod,
    // 操作保存事件
    handleSave(row) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          row.editState = true;
        } else {
          this.$message.warning("请填写必填信息！");
        }
      });
    },
    handleSaveList(row) {
      this.$refs["form"].validate((item) => {
        if (!item) return this.$message.warning("请填写必要字段");
        row.editState = true;
      });
    },
    // 操作取消事件
    handleCancel(row) {
      row.editState = true;
    },
    handleCancelList(row) {
      row.editState = true;
    },
    // 操作编辑事件
    handleEdit(row) {
      row.editState = false;
    },
    handleEditList(row) {
      row.editState = false;
    },
    // 删除确认事件
    handleDelConfirm(data) {
      const { row, index } = data;
      this.formData.tableData.splice(index, 1);
    },
    handleDelConfirmList(data) {
      const index = data.index;
      this.formList.tableData.splice(index, 1);
    },
    // 删除取消事件
    handleDelCancel() {
      this.$message.info("已取消删除！");
    },
    handleDelCancelList() {
      this.$message.info("取消删除");
    },
    // 添加数据
    handleAddData() {
      this.formData.tableData.push({
        name: "",
        editState: false,
        type: 0,
        number: "",
        height: "",
        width: "",
        length: "",
        amount: "",
        weight: "",
        totalW: "",
      });
    },
    handleAddList() {
      this.formList.tableData.push({
        name: "",
        editState: false,
        type: 0,
        number: "",
        height: "",
        width: "",
        length: "",
        amount: "",
        weight: "",
        totalW: "",
      });
    },
    // 发布需求
    async ReleaseBtn() {
      let params = {};
      let obj = this.prefabricationData.find(
        (item) => item.engineeringProjectId == this.infoFormData.projectId
      );
      let obj2 = this.CouplingList.find(
        (item) => item.couplingId == this.infoFormData.couplingId
      );
      params.engineeringProjectName = obj.name;
      params.couplingName = obj2.name;
      this.formData.tableData.forEach((item) => {
        item.totalWeight = item.totalW;
      });
      params.transportOrderDetailedBoList = this.formData.tableData;
      Object.assign(params, this.infoFormData);
      params.engineeringProjectId = params.projectId;
      console.log(params, "77");
      let res = await addTransportWithNonProduct(params);
      console.log(res, "res");
      this.CouplingList = res.data;
      this.$router.push("ex-factory");
    },
    // 获取项目列表
    async initRequest() {
      let { data: res } = await getEngineeringProjectList({
        status: 1,
      });
      this.prefabricationData = res;
    },
    // 获取联段
    // {
    //     engineeringProjectId: this.infoFormData.couplingId,
    //   }
    async firstInputRequest(params) {
      let res = await getCouplinglist(params);
      this.CouplingList = res.data;
    },
    // 获取外协单位
    async getDepartmentList() {
      let { data: res } = await getDepartmentList({
        enterpriseId,
        status: 1,
        type: 1,
      });
      res.forEach((item) => {
        item.label = item.name;
        item.value = item.departmentId;
        if (item.children) {
          item.children.forEach((el) => {
            el.label = el.name;
            el.value = el.departmentId;
            console.log(el.children);
            if (el.children) {
              el.children.forEach((a) => {
                a.label = a.name;
                a.value = a.departmentId;
              });
            }
          });
        }
      });
      this.getDepart = res;
      console.log(res, "res");
    },
    handleLable(e) {
      console.log(e, "e");
      this.infoFormData.supplierId = e[e.length - 1];
      const arr = this.$refs["cascaderAddr"].getCheckedNodes()[0].pathLabels;
      this.infoFormData.supplierName = arr[arr.length - 1];
    },
    // 专车车间
    changeNew(e) {
      console.log(e, "装车");
      this.infoFormData.loadingWorkshopId = e[e.length - 1];
      const arr =
        this.$refs["cascaderLoadingWork"].getCheckedNodes()[0].pathLabels;
      this.infoFormData.loadingWorkshopName = arr[arr.length - 1];
    },
    // 取消
    Result() {
      this.$router.push("ex-factory");
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  ::v-deep .el-dialog {
    .el-dialog__body {
      padding: 18px 40px 0;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
    }
  }
  ::v-deep .box-card {
    font-size: 14px;
    margin-bottom: 16px;
    .el-card__header,
    .el-card__body {
      padding: 16px 24px;
    }
    .el-card__header {
      font-weight: bolder;
    }
    .info-form {
      .el-form-item {
        .el-select {
          width: 100%;
        }
      }
    }
    .el-table {
      .el-form-item {
        margin-bottom: 0;
      }
      .operation {
        > span,
        a {
          margin-right: 16px;
        }
        > a:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .add {
    height: 36px;
    border: 1px dotted #e4e7ed;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
    span {
      font-weight: bold;
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 8px 16px;
    box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
    z-index: 999;
    .el-button--default {
      background-color: transparent !important;
    }
  }
}
</style>
