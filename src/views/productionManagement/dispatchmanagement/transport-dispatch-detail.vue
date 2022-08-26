<template>
  <div class="wrap">
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <span>派工详情</span>
      </div>
      <el-descriptions>
        <el-descriptions-item label="需求车间">{{data.plantAreaName}}</el-descriptions-item>
        <el-descriptions-item label="司机">{{data.driverName}}</el-descriptions-item>
        <el-descriptions-item label="需求人">{{data.arriveTime}}</el-descriptions-item>
        <el-descriptions-item label="车辆">{{data.carNumber}}</el-descriptions-item>
        <el-descriptions-item label="需求时间">{{data.arriveTime}}</el-descriptions-item>
        <el-descriptions-item label="计划时间">{{data.plannedTime}}</el-descriptions-item>
        <el-descriptions-item label="装车地点">{{data.plantAreaName}}</el-descriptions-item>
        <el-descriptions-item label="接受地点">{{data.transportPlace}}</el-descriptions-item>
        <el-descriptions-item label="接收人">{{data.liaison}}</el-descriptions-item>
        <el-descriptions-item label="接受时间">{{data.arriveTime}}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="box-card">
      <div slot="header"
        class="clearfix">
        <span>装车内容</span>
      </div>
      <TableBody :colConfig="vehicleCol"
        :data="data.orderDetailedList">
        <template #index="{scope}">
          <span>{{indexMethod(scope.$index)}}</span>
        </template>
      </TableBody>
    </el-card>

    <div class="footer">
      <el-button @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { indexMethod, tableTimeFilter } from '@/utils/productionManagement/tool'
import { getTransportDetail } from '@/api/productionManagement/transport.js'
import { TableBody, Pagination } from "gggj_lib"
export default {
  components: {
    TableBody,
    Pagination
  },
  data() {
    return {
      // 数据源
      data: {},
      vehicleCol: [
        { slot: "index", attrs: { label: "序号", 'min-width': "52" } },
        // { attrs: { label: "物料名称", prop: "projectName", "min-width": "140" } },
        { attrs: { label: "物料编号", prop: "number", "min-width": "140" } },
        { attrs: { label: "厚度/高度(毫米)", prop: "height", "min-width": "100", align: "right" } },
        { attrs: { label: "宽度(毫米)", prop: "width", "min-width": "118", align: "right" } },
        { attrs: { label: "长度(毫米)", prop: "length", "min-width": "118", align: "right" } },
        // { attrs: { label: "长度", prop: "connectName", "min-width": "118", align: "right" } },
        { attrs: { label: "数量", prop: "amount", "min-width": "118", align: "right" } },
        // { attrs: { label: "单重(千克)", prop: "connectName", "min-width": "118", align: "right" } },
        { attrs: { label: "总重(千克)", prop: "totalWeight", "min-width": "138", align: "right" } },
      ]
    };
  },
  created() {
    if (this.$route.query?.transportOrderId) {
      const transportOrderId = this.$route.query?.transportOrderId
      this.getTransportDetailData(transportOrderId)
    }
  },
  mounted() { },
  methods: {
    // 自定义列名
    indexMethod,
    // 获取详情
    async getTransportDetailData(id) {
      let res = await getTransportDetail(id)
      this.data = res.data
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
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
    .el-table {
      .el-table__header {
        width: 100% !important;
      }
    }
    .el-descriptions {
      padding: 0;
      .el-descriptions-item {
        padding-bottom: 16px;
      }
      tbody:last-child {
        .el-descriptions-item {
          padding-bottom: 0;
        }
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
