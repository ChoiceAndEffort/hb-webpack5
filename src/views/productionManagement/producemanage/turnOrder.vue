<template>
  <div>
    <el-tabs type="border-card"
      v-model="activeName"
      @tab-click="handleActive">
      <el-tab-pane label="待转序"
        name="1"></el-tab-pane>
      <el-tab-pane label="转序查询"
        name="2"></el-tab-pane>
      <div>
        <search ref="search"
          :renderData="renderData"
          :searchData="searchData"
          @handle-submit="handleSubmit"
          @handle-reset="handleReset">
        </search>
      </div>
      <div class="tabletitle">
        <span>转序列表</span>
        <el-button type="primary"
          v-show="activeName=='1'"
          style="text-align:right"
          icon="el-icon-document"
          :loading="isLoading"
          size="small"
          @click="conversionSection">转序</el-button>
      </div>
      <el-table ref="multipleTable"
        max-height="475"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :key="activeName"
        @selection-change="handleSelectionChange">
        <el-table-column v-if="activeName!='2'"
          type="selection"
          width="55"
          align="center">
        </el-table-column>

        <el-table-column v-for="item in productCol[activeName]"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.width"
          :key="item.id"
          :fixed="item.fixed"
          :align="item.align || 'center'">
          <template slot-scope="scope">
            <span v-if="item.prop == 'serial'">{{indexMethod(scope.$index)}}</span>
            <span v-else-if="item.prop == 'switchAmount'">
              <el-input-number v-if="scope.row.isCheck"
                v-model="scope.row.switchAmount"
                @change="handleChange"
                size="small"
                :min="1"
                :max="scope.row.toBeSwitchAmount*1"></el-input-number>
              <span v-else>{{scope.row[item.prop]}}</span>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName=='2'"
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)"
              type="text"
              size="small">查看明细</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
    <el-dialog title="转序明细"
      :visible.sync="dialogTableVisible"
      width="70%">
      <TableBody :data="detailTableData"
        :colConfig="colConfig"
        :max-height="330">
        <template slot="serial"
          slot-scope="{ scope }">
          <span>{{indexMethod(scope.$index)}}</span>
        </template>
      </TableBody>
    </el-dialog>
  </div>
</template>
<script>
import { TableBody, Pagination } from "gggj_lib";
import search from "@/views/productionManagement/components/search.vue"
import { indexMethod } from '@/utils/productionManagement/tool'
import { conversionSection } from '@/utils/productionManagement/reportTableConfig'
import { getDictData } from '@/api/productionManagement/systemManagement'
import { getEngineeringProjectList, getCouplinglist, getPageOfToBeWithSwitched, getPageOfAlreadyWithSwitched, getDetailsOfSwitchOrderInfo, getWorkingProcedureList } from '@/api/productionManagement/project'
export default {
  components: {
    TableBody,
    Pagination,
    search,
  },
  data() {
    return {
      activeName: '1',
      isLoading: false,
      // 搜索栏渲染数据
      renderData: [
        {
          tag: "el-cascader",
          label: "工序名称",
          attrs: {
            ref: "selectExFactoryType",
            options: [],
            placeholder: "请选择工序名称",
            clearable: true,
            value: "",
            key: "workingProcedureCode",
          },
          // listeners: {
          //   change: this.handleProductChange,
          // },
        },
        {
          tag: "el-select",
          label: "项目名称",
          attrs: {
            ref: "selectFactoryRegion",
            key: "engineeringProjectId",
            options: [],
            placeholder: "请选择项目名称",
          },
          listeners: {
            change: this.handleProjectChange,
          },
        },
        {
          tag: "el-select",
          label: "联段名称",
          attrs: {
            ref: "selectProject",
            key: "couplingId",
            options: [],
            placeholder: "请选择联段名称",
          },
          // listeners: {
          //   change: this.handleProjectChange,c 
          // },c 
        },
        {
          tag: "el-input",
          label: "物料编码",
          attrs: {
            ref: "inputMaterialNumber",
            key: "materialNumberLike",
            placeholder: "请输入物料编码",
          },
        },
      ],
      // 产品列配置
      productCol: {
        1: [
          { label: "序号", 'min-width': "52", prop: 'serial' },
          { label: "项目名称", prop: "engineeringProjectName", "width": "250" },
          { label: "联段名称", prop: "couplingName", width: "140" },
          { label: "物料编码", prop: "materialNumber" },
          { label: "高度(mm)", prop: "height", align: "right" },
          { label: "宽度(mm)", prop: "width", align: "right" },
          { label: "长度(mm)", prop: "length", align: "right" },
          { label: "数量(件)", prop: "toBeSwitchAmount", align: "right" },
          { label: "单重(kg)", prop: "weight", },
          { label: "物料流向", prop: "flowTo", },
          { label: "本次转序数量", prop: "switchAmount", width: "200" },
        ],
        2: [
          { label: "序号", 'min-width': "52", prop: 'serial' },
          { label: "工序", prop: "workingProcedureName", },
          { label: "转序单号", prop: "orderNumber", width: "140" },
          { label: "转序车间", prop: "sourceWorkshopName" },
          { label: "接收车间", prop: "targetWorkshopName", align: "right" },
          { label: "转序时间", prop: "orderTime", align: "right" },
          { label: "接收状态", prop: "orderStateName", align: "center" },
          { label: "接收人", prop: "confirmName", align: "right" },
        ],
      },
      tableData: [],
      multipleSelection: [],
      dialogTableVisible: false,
      colConfig: conversionSection.detail,
      detailTableData: [],
      searchData: {}

    }
  },
  mounted() {
    this.getOptionsList()
  },
  methods: {
    indexMethod(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
    },
    //选择待转序和转序查询
    handleActive() {
      if (this.activeName == '2') {
        if (this.renderData[this.renderData.length - 1].label != "接收状态") {
          this.renderData.push({
            tag: "el-input",
            label: "转序单号",
            attrs: {
              ref: "inputMaterialNumber",
              key: "orderNumberLike",
              placeholder: "请输入转序单号",
            },
          })
          this.renderData.push({
            tag: "el-select",
            label: "接收状态",
            attrs: {
              ref: "selectFactoryRegion",
              key: "orderState",
              options: [
                {
                  label: '待接收',
                  value: 0
                },
                {
                  label: '已接收',
                  value: 1
                }
              ],
              placeholder: "接收状态",
            },

          })
        }
        this.tableData = [];
      } else {
        if (this.renderData[this.renderData.length - 1].label == "转序单号") {
          this.renderData.pop()
        }
        this.tableData = []
      }
      console.log(this.searchData, "88")
    },
    handleSubmit(val) {
      this.searchData = val;
      let arr = val.workingProcedureCode
      this.searchData.workingProcedureCode = arr[arr.length - 1]
      if (val.workingProcedureCode == '') {
        this.$message.error("请选择工序");
        return
      }
      this.getTableList();
    },
    handleReset() {

    },
    handleChange() {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val, "val")
      // let subscript = []
      let selectObj = []
      this.tableData.forEach((item, index) => {
        item.isCheck = false;
        this.$set(this.tableData, index, item)
      });
      for (let i of val) {
        let index = this.tableData.findIndex(item => item.goodsInfoId == i.goodsInfoId)
        if (index > -1) {
          i.isCheck = true
          let obj = {
            subscript: index,
            data: i
          }
          selectObj.push(obj)
        }
      }
      console.log(selectObj, "selectObj")
      for (let item in selectObj) {
        this.$set(this.tableData, item.index, item.data)
      }

    },
    handleDetail(row) {
      console.log(row, "row")
      this.dialogTableVisible = true
      let params = {
        workingProcedureCode: row.workingProcedureCode,
        orderInfoId: row.orderInfoId
      }
      getDetailsOfSwitchOrderInfo(params).then((res) => {
        if (res.code == 0) {
          this.detailTableData = res.data.goodsInfoList;

        }
      })
    },
    conversionSection() {
      if (this.multipleSelection.length < 1) {
        this.$message.error("请勾选需要转序的物料！");
        return
      }
      this.$router.push({
        name: 'turnOrderDetail',
        params: { selectList: JSON.stringify(this.multipleSelection), isReceive: false }
      });
    },
    getOptionsList() {
      //获取工序option
      getWorkingProcedureList({ type: 1 }).then((res) => {
        if (res.code == 0) {
          res.data.forEach(item => {
            item.label = item.name;
            item.value = item.workingProcedureCode;
            if (item.children.length > 0) {
              item.children.forEach(el => {
                el.label = el.name;
                el.value = el.workingProcedureCode
              })

            } else {
              item.children = null
            }
          })
          console.log(res.data, "ces")
          this.renderData[0].attrs.options = res.data
        } else {
          this.$message.error(res.message);
        }
      })

      getEngineeringProjectList({ status: 1 }).then((res) => {
        // console.log(res)
        if (res.code == 0) {//engineeringProjectId
          res.data.forEach(item => {
            item.label = item.name;
            item.value = item.engineeringProjectId
          })
          this.renderData[1].attrs.options = res.data
        } else {
          this.$message.error(res.message);
        }
      });

    },
    handleProjectChange(value) {
      console.log(value, "value")
      getCouplinglist({
        engineeringProjectId: value,
      }).then((res) => {
        res.data.forEach((item) => {
          item.value = item.couplingId;
          item.label = item.name;
        });
        this.renderData[2].attrs.options = res.data
      })
    },
    getTableList() {
      //isComplete
      if (this.activeName == '1') {
        this.searchData.orderState = 0;
        getPageOfToBeWithSwitched(this.searchData).then((res) => {
          // console.log(res.data, "11")
          res.data.data.forEach(item => {
            item.switchAmount = item.toBeSwitchAmount
          })
          this.tableData = res.data.data;
        })
      } else {
        getPageOfAlreadyWithSwitched(this.searchData).then((res) => {
          this.tableData = res.data.data;
        })
      }

    }
  },
}
</script>
<style lang="scss" scoped>
.tabletitle {
  height: 50px;
  padding: 10px;
  font-weight: 700;
  overflow: hidden;
  button {
    float: right;
  }
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 15px 15px 30px 15px;
  height: 685px;
}
</style>