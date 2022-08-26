<template>
  <div>
    <el-tabs type="border-card"
      v-model="activeName">
      <el-tab-pane label="待接收"
        name="1"></el-tab-pane>
      <div>
        <search ref="search"
          :renderData="renderData"
          @handle-submit="handleSubmit"
          @handle-reset="handleReset"></search>
      </div>
      <div class="tabletitle">
        <span>转序列表</span>
      </div>
      <TableBody :data="outputTData"
        :colConfig="colConfig"
        :max-height="330">
        <template slot="serial"
          slot-scope="{ scope }">
          <span>{{indexMethod(scope.$index)}}</span>
        </template>
        <template #btn="{scope}">
          <el-button type="text"
            @click="receptionDetail(scope.row)">接收</el-button>
        </template>
      </TableBody>
    </el-tabs>

  </div>
</template>
<script>
import { TableBody, Pagination } from "gggj_lib";
import search from "@/views/productionManagement/components/search.vue"
import { indexMethod } from '@/utils/productionManagement/tool'
import { conversionSection } from '@/utils/productionManagement/reportTableConfig'
import { getDictData } from '@/api/productionManagement/systemManagement'
import { getEngineeringProjectList, getCouplinglist, getPageOfToBeAcceptWithSwitched, getWorkingProcedureList } from '@/api/productionManagement/project'
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
          tag: "el-select",
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
          label: "联段名称",
          attrs: {
            ref: "selectProject",
            key: "couplingId",
            options: [],
            placeholder: "请选择联段名称",
          },
          // listeners: {
          //   change: this.handleProjectChange,
          // },
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
      colConfig: [
        { slot: "serial", attrs: { label: "序号", 'min-width': '25%', type: "serial", width: "50" } },
        { attrs: { label: "转序单号", 'min-width': '25%', prop: "orderNumber" } },
        { attrs: { label: "转序车间", 'min-width': '25%', prop: "sourceWorkshopName" } },
        { attrs: { label: "接收车间", 'min-width': '25%', prop: "targetWorkshopName" } },
        { attrs: { label: "转序人", 'min-width': '30%', prop: "addName" } },
        { attrs: { label: "转序时间", 'min-width': '25%', prop: "orderTime" } },
        { slot: "btn", attrs: { label: "操作", align: "center", width: "200px", fixed: "right" }, },
      ],
      outputTData: [],
    }
  },
  mounted() {
    this.getOptionsList()
  },
  methods: {
    indexMethod(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
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
    receptionDetail(row) {
      // console.log(row, "row")
      this.$router.push({
        name: 'turnOrderDetail',
        params: { row: JSON.stringify(row), isReceive: true }
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
      this.searchData.orderState = 1;
      getPageOfToBeAcceptWithSwitched(this.searchData).then((res) => {
        // console.log(res.data, "11")
        // res.data.data.forEach(item => {
        //   item.switchAmount = item.toBeSwitchAmount
        // })
        this.outputTData = res.data.data;
      })
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