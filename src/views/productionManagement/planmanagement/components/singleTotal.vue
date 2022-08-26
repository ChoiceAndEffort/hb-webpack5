<!--单项目准备计划汇总审批-->
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
    <TableBody :colConfig="colConfig" :data="data.data" concatKey="name">
      <template slot="state" slot-scope="{ scope }">
        <div class="status status-01" v-if="scope.row.state == 0">
          <span>未审批</span>
        </div>
        <div class="status status-02" v-if="scope.row.state == 1">
          <span>待审批</span>
        </div>
        <div class="status status-03" v-if="scope.row.state == 2">
          <span>已审批</span>
        </div>
      </template>
      <template slot="btn" slot-scope="{ scope }">
        <el-button size="mini" type="text" @click="handleView(scope.row)"
          >查看</el-button
        >
      </template>
    </TableBody>
  </div>
</template>

<script>
import { TableFilter, TableBody, Pagination } from "gggj_lib";
export default {
  components: { TableFilter, TableBody, Pagination },
  data() {
    return {
      searchobj: {
        keyWords: "",
        projectName: "",
      },
      buttonText: "确定",
      headerData: [
        {
          code: "keyWords",
          title: "项目名称",
          type: "select",
          width: "220px",
          options: [
            { label: "项目一", value: 1 },
            { label: "项目二", value: 2 },
          ],
        },
      ],
      colConfig: [
        {
          attrs: { label: "序号", type: "index", align: "center" },
        },
        {
          attrs: { label: "项目名称", prop: "name", align: "center" },
        },
        {
          slot: "state",
          attrs: { label: "计划审批状态", prop: "state", align: "center" },
        },
        {
          slot: "btn",
          attrs: {
            label: "操作",
            width: "200px",
            align: "center",
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
            name: "武汉长江大桥套料图",
            state: "1",
          },
          {
            name: "武汉长江大桥套料图",
            state: "0",
          },
          {
            name: "武汉长江大桥套料图",
            state: "2",
          },
        ],
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    //搜索
    getFilterList() {
    },
    //查看
    handleView() {
      this.$router.push({
        name: "total-view",
        query: {
          //   designQaId:row.designQaId,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  .cell span {
    padding: 0 8px;
  }
  .status span {
    width: 72px;
    height: 32px;
    line-height: 32px;
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
