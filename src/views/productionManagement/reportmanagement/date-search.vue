<template>
  <el-row class="date-search">
    <el-col :span="15">
      <el-date-picker v-model="dateSelect"
        type="month"
        placeholder="选择月份"
        class="inputBox"
        @change="handleDate">
      </el-date-picker>
      <el-button type="primary"
        @click="searchBtn">确定</el-button>
    </el-col>
    <el-col :span="9">
      <el-radio-group v-model="radioSelect"
        @change="handleRadio"
        size="small">
        <el-radio-button label="图形表"><img :src="
                require(`@/assets/productionManagement/icon/${
                  radioSelect == '图形表' ? 'graph1' : 'graph'
                }.png`)
              "
            alt="graph"
            class="graphImg" /></el-radio-button>
        <el-radio-button label="报表"><img :src="
                require(`@/assets/productionManagement/icon/${
                  radioSelect == '图形表' ? 'report1' : 'report'
                }.png`)
              "
            alt="report"
            class="reportImg" /></el-radio-button>
      </el-radio-group>
    </el-col>
  </el-row>
</template>
<script>
import { monthTime, shortTime } from '@/utils/productionManagement/tool.js'
export default {
  props: {
    currentDate: {
      type: String,
      default: '',
    },
    radioCheck: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      radioSelect: "",
      dateSelect: "",
    }
  },
  watch: {
    currentDate: {
      handler(v, n) {
        this.dateSelect = v
      },
      immediate: true
    },
    radioCheck: {
      handler(v) {
        this.radioSelect = v
      },
      immediate: true
    }
  },
  methods: {
    searchBtn() {
      this.$emit('searchClick', this.dateSelect)
    },
    handleRadio() {
      this.$emit('changeTab', this.radioSelect)
    },
    handleDate() {
      this.dateSelect = shortTime(monthTime(this.dateSelect))
    }
  },
}
</script>
<style lang="scss" scoped>
.date-search {
  .el-col:last-child {
    text-align: right;
  }
  .graphImg,
  .reportImg {
    width: 20px;
    height: 20px;
  }
  .inputBox {
    margin-right: 12px;
  }
}
::v-deep .el-radio-button--small .el-radio-button__inner {
  font-size: 13px;
}
::v-deep.el-radio-button--small .el-radio-button__inner {
  padding: 5px 15px;
}
::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #ecf5ff !important;
  border-color: #a3d0fd !important;
  color: #a3d0fd !important;
}
</style>