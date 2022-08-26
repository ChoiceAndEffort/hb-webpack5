<template>
  <div class="wrap">
    <div class="content">
      <div class="left">
        <span>厂区</span>
        <el-tabs :tab-position="tabPosition"
          :data='tableData'
          v-model="activeName"
          @tab-click='handleClick'
          style="height: 200px;">
          <el-tab-pane v-for="(item,index) in tableData"
            :key="index"
            :value='item.plantAreaId'
            :label="item.plantAreaName">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="right">
        <span>车间</span>
        <TableBody class="body"
          v-loading="loading"
          :colConfig="colConfig"
          :data='tableList'>
          <template slot="Productivity"
            slot-scope="{ scope }">
            <el-input v-model="scope.row.monthPeakProductivity"
              placeholder="请输入数值"></el-input>
          </template>
          <template slot="Amount"
            slot-scope="{ scope }">
            <el-input v-model="scope.row.monthStandardAmount"
              placeholder="请输入数值"></el-input>
          </template>
        </TableBody>
      </div>
    </div>
    <div class="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary"
        @click="handelBtn">保存</el-button>
    </div>
  </div>
</template>

<script>
import { TableBody } from "gggj_lib"

import { getPlantAreaList, getListpack, batchOperation } from '@/api/productionManagement/systemManagement.js'

export default {
  components: { TableBody },
  data() {
    return {
      activeName: '',
      monthPeakProductivity: '',// 月度峰值产能
      monthStandardAmount: '', // 月度标准产值
      Amount: '',
      tabPosition: 'left',
      title: '',
      loading: false,
      plantAreaId: '',
      colConfig: [
        {
          attrs: {
            label: "生产车间",
            prop: 'departmentName',
            align: "left",
          }
        },
        {
          slot: 'Productivity',
          attrs: {
            label: "月度峰值产能(t)",
            align: "left",
          }
        },
        {
          slot: 'Amount',
          attrs: {
            label: "月度标准产值(元)",
            align: "left",
          }
        },
      ],
      tableData: [],
      tableList: []
    }
  },

  created() {

  },
  mounted() {
    this.Plant()
  },
  methods: {
    // 页面初始化
    async Plant() {
      // , parmsli
      let res = await getPlantAreaList()
      if (res.code == 0) {
        this.tableData = res.data
        getListpack({ plantAreaId: this.tableData[0].plantAreaId }).then(res => {
          // console.log(res, 56);
          this.tableList = res.data
        })
      }
    },
    async handleClick(tab, event) {
      const { value } = tab.$attrs
      if (value) {
        let res = await getListpack({
          plantAreaId: value
        })
        this.tableList = res.data
      }
    },
    // 确定
    async handelBtn() {
      console.log(this.tableList, "zhi");
      // let bij = {
      //   departmentId: this.tableList.departmentId,
      //   departmentName: this.tableList.departmentName,
      //   monthPeakProductivity: this.tableList.monthPeakProductivity,
      //   monthStandardAmount: this.tableList.monthStandardAmount,
      // }
      let res = await batchOperation(this.tableList)
      // console.log(res, "3233");
      if (res.code === 0) {
        this.$message.success('保存成功')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.wrap {
  height: 100%;
  // padding: 16px;
  background: #fff;
  overflow: hidden;
  .content {
    margin: 16px;
    display: flex;
    height: 100%;
    .left {
      width: 238px;
    }
    .right {
      flex: 1;
      .body {
        margin-top: 16px;
      }
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