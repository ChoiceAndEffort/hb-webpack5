<template>
  <div class="wrap">
    <div class="header">
      <span>配置列表</span>
    </div>
    <div class="content infinite-list">
      <TableBody :colConfig='colConfig'
        border
        auto
        height='300'
        :data='tableData'
        :concatIndexArr='[0,1]'
        concatKey="pid">
        <template slot="inputs"
          slot-scope="{ scope }">
          <el-input v-model="scope.row.unitPrice"
            placeholder="请输入数值"></el-input>
        </template>
      </TableBody>
    </div>
    <div class="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary"
        @click="handelBtnNext">保存</el-button>
    </div>
  </div>
</template>

<script>
import { TableBody } from 'gggj_lib'
import { ProcessList, batchOperationkid } from '@/api/productionManagement/systemManagement.js'

export default {

  components: { TableBody },
  data() {
    return {
      unitPrice: '',
      colConfig: [
        {
          attrs: {
            label: "序号",
            prop: "Nosort",
            align: "center",
            type: 'index',
            width: '64',
          },
        },
        {
          attrs: {
            label: "工序",
            prop: "pname",
            align: "center",
          },
        },
        {
          attrs: {
            label: "子工序",
            prop: "childName",
            align: "center",
          },
        },
        {
          attrs: {
            label: "工艺",
            prop: "name",
            align: "center",
          },
        },
        {
          slot: 'inputs',
          attrs: {
            label: "单价(元/吨)",
            align: "center",
          },
        },
      ],

      tableData: [],
      numdata: [],
      spanArr: [],
      pos: 0,
      spanArrdfytsl: [],
      posdfytsl: 0
    }
  },
  created() {
    if (this.$route.query.couplingId) {
      const { couplingId } = this.$route.query
      this.getProcessList(couplingId)
    }
  },
  mounted() {
  },
  methods: {
    async getProcessList(couplingId) {
      let res = await ProcessList(couplingId)
      res.data.forEach(ele => {
        ele.childName = ele.childName ? ele.childName : '—'
        ele.name = ele.name ? ele.name : '—'
      });
      this.tableData = res.data

      // 表格序号
      let Nosort = 0
      for (let n in this.spanArr) {
        if (this.spanArr[n] > 0) {
          Nosort += 1;
          this.$set(this.tableData[n], 'Nosort', Nosort) // this.list为最后展示的数组
        }
      }
    },
    //保存
    async handelBtnNext() {
      // unitPrice
      this.numdata = this.tableData

      let arr = this.numdata.filter(item => item.projectProcessId)

      let data = await batchOperationkid(arr)
      if (data.code == 0) {
        this.$message({
          showClose: true,
          message: '保存成功',
          type: 'success'
        })
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
// :v-eeep .infinite-list {
//   height: 300px;
// }
.wrap {
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  .header {
    padding: 16px 0 0 16px;
  }
  .content {
    padding: 16px;
    box-sizing: border-box;
    height: 90%;
    margin-top: 16px;
    // height: 300px;
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