<!--月度计划完成情况-->
<template>
  <div class="main">
    <div class="searchBox">
      <TableFilter
        :searchobj.sync="searchobj"
        :config="headerData"
        @search="getFilterList"
        :buttonText="buttonText"
      />
    </div>
    <div class="tab_list">
      <!-- concatKey表示开始合并的字段 -->
      <!-- concatIndexArr表示开始合并的列 -->
      <TableBody
        :colConfig="colConfig"
        :data="data.data"
        :concatKey="bumen"
        :concatIndexArr="[0, 1, 7]"
        border
      >
      </TableBody>
    </div>
  </div>
</template>

<script>
import { TableFilter, TableBody, Pagination } from "gggj_lib";
export default {
  components: { TableFilter, TableBody, Pagination },
  data() {
    return {
      searchobj: {
        date: "",
      },
      buttonText: "确定",
      headerData: [
        {
          code: "date",
          title: "月份",
          type: "mergeDate",
          width: "180px",
        },
      ],
      colConfig: [
        {
          attrs: { label: "部门", prop: "bumen", align: "left" },
        },
        {
          attrs: { label: "责任人", prop: "personresponsible", align: "left" },
        },
        {
          attrs: { label: "计划类型", prop: "type", align: "left" },
        },
        {
          attrs: { label: "计划数量", prop: "plan_num", align: "right" },
        },
        {
          attrs: { label: "完成数量", prop: "complete", align: "right" },
        },
        {
          attrs: { label: "延期完成", prop: "yanqi_complete", align: "right" },
        },
        {
          attrs: { label: "延期数量", prop: "yanqi_num", align: "right" },
        },
        {
          attrs: { label: "完成率", prop: "completion_rate", align: "left" },
        },
        {
          attrs: {
            label: "延期完成滞后时间(天)",
            prop: "lag_time",
            align: "left",
          },
        },
      ],
      data: {
        total: 0,
        pageSize: 1,
        currentPage: 0,
        lastPage: 0,
        totalPages: 0,
        first: true,
        last: true,
        data: [
          {
            bumen: "安质部",
            personresponsible: "高攀",
            type: "普通",
            plan_num: "13",
            complete: "8",
            yanqi_complete: "0",
            yanqi_num: "0",
            completion_rate: "0",
            lag_time: "0",
          },
          {
            bumen: "安质部",
            personresponsible: "高攀",
            type: "重点",
            plan_num: "1",
            complete: "8",
            yanqi_complete: "0",
            yanqi_num: "0",
            completion_rate: "0",
            lag_time: "0",
          },
          {
            bumen: "技术部",
            personresponsible: "甘泉",
            type: "普通",
            plan_num: "13",
            complete: "8",
            yanqi_complete: "0",
            yanqi_num: "0",
            completion_rate: "0",
            lag_time: "0",
          },
          {
            bumen: "技术部",
            personresponsible: "甘泉",
            type: "重点",
            plan_num: "1",
            complete: "8",
            yanqi_complete: "0",
            yanqi_num: "0",
            completion_rate: "0",
            lag_time: "0",
          },
        ],
      },
    };
  },
  computed: {
    /* 表格合并的样式规则在里面写 */
    bumen() {
      return "bumen";
    },
  },
  created() {},
  mounted() {},
  methods: {
    //搜索
    getFilterList() {
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  .cell span {
    padding: 0 8px;
  }
  .status-01 {
    span {
      display: inline-block;
      background: #fff1f0;
      border: 1px solid #fbc4c4;
      color: #fa5555;
    }
  }
  .status-02 {
    span {
      display: inline-block;
      color: #fa8e55;
      background: #fdf5e6;
      border: 1px solid #f5dab1;
    }
  }
  .status-03 {
    span {
      display: inline-block;
      border: 1px solid #a3d0fd;
      color: #409eff;
      background-color: #ecf5ff;
    }
  }
  .searchBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .el-button {
      height: 36px;
      line-height: 15px;
      border-radius: 0;
      margin-top: 10px;
    }
  }
  ::v-deep .el-table__header-wrapper {
    .has-gutter {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }
}
</style>
