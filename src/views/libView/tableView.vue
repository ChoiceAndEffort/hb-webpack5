<template>
  <Table
    :colConfig="colConfig"
    :tableData="tableData"
    :selection="true"
    :border="true"
    @selectionEvent="selectionEvent"
  >
    <template slot="state" slot-scope="{ scope }">
      <BillState :stateId="scope.row.state"></BillState>
    </template>
    <template slot="opCol">
      <el-button type="text">详情</el-button>
      <el-button type="text">删除</el-button>
    </template>
    <template slot="dateHeader">
      <el-col>
        <span>筛选</span>
        <i class="el-icon-share"></i>
      </el-col>
    </template>
  </Table>
</template>
<script>
import Table from "../../components/Table/index.vue";
import BillState from "../../components/billState.vue";
export default {
  components: { Table, BillState },
  data() {
    return {
      colConfig: [
        {
          attrs: {
            label: "序号",
            prop: "id",
            align: "left",
          },
          sortable: true,
        },
        {
          attrs: {
            label: "姓名",
            prop: "name",
            align: "left",
          },
        },
        {
          attrs: {
            label: "报销金额",
            prop: "money",
            align: "left",
          },
        },
        {
          attrs: { label: "状态", prop: "state", align: "center" },
          sortable: true,
          slot: "state",
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: { label: "CODE", prop: "code", align: "left" },
        },
        {
          attrs: {
            label: "时间",
            prop: "date",
            align: "left",
            resizable: true,
          },
          sortable: true,
        },
        {
          slotHeader: "dateHeader",
          attrs: {
            label: "时间",
            prop: "date",
            align: "left",
            resizable: true,
          },
        },
        {
          attrs: {
            label: "地址",
            prop: "address",
            align: "left",
            widthFlex: "flex",
            showOverflowTooltip: true,
            resizable: true,
          },
          widthFixed: true,
        },
        {
          slot: "opCol",
          attrs: { label: "操作列", align: "left", fixed: "right", width: 130 },
        },
      ],
      tableData: [
        {
          id: "001",
          date: "2016-05-02",
          name: "王小虎",
          code: "3154613613",
          money: "54563113",
          state: "0",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: "002",
          date: "2016-05-04",
          name: "王小虎",
          code: "3154613613",
          money: "54563113",
          state: "1",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          id: "003",
          date: "2016-05-01",
          name: "王小虎",
          code: "3154613613",
          money: "54563113",
          state: "2",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          id: "004",
          date: "2016-05-03",
          name: "王小虎",
          code: "3154613613",
          money: "54563113",
          state: "3",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    selectionEvent(val) {
      console.log(val);
    },
  },
};
</script>