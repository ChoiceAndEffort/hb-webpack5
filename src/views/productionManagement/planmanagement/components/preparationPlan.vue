<!-- 待完成准备计划 -->
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
    <div class="list_table">
      <TableBody :colConfig="colConfig1" :data="data1.data">
        <template slot="importance" slot-scope="{ scope }">
          <div v-if="scope.row.importance === 1">
            <el-rate
              v-model="scope.row.importance"
              disabled
              text-color="#ff9900"
              score-template="{value}"
              :max="1"
            >
            </el-rate>
          </div>
          <div v-else>-</div>
        </template>
        <template slot="state" slot-scope="{ scope }">
          <div class="status" :class="{ red: scope.row.state !== '已完成' }">
            {{ scope.row.state }}
          </div>
        </template>
        <template slot="btn" slot-scope="{ scope }">
          <el-button
            size="mini"
            v-if="scope.row.state === '未完成'"
            type="text"
            @click="selectPerson(scope.row)"
            >填报</el-button
          >
          <el-button
            size="mini"
            v-else
            type="text"
            @click="handleView(scope.row)"
            >查看</el-button
          >
        </template>
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
        {
          code: "projectName",
          title: "部门",
          type: "select",
          width: "220px",
          options: [
            { label: "部门一", value: 1 },
            { label: "部门二", value: 2 },
          ],
        },
      ],
      /* 第一个表格样式 */
      colConfig1: [
        {
          attrs: { label: "序号", type: "index", align: "left", fixed: "left" },
        },
        {
          attrs: { label: "项目名称", prop: "plancontent", align: "left" },
        },
        {
          attrs: { label: "计划内容", prop: "plancontent", align: "left" },
        },
        {
          attrs: { label: "计划完成时间", prop: "time", align: "left" },
        },
        {
          slot: "importance",
          attrs: { label: "重要程度", prop: "importance", align: "center" },
        },
        {
          attrs: { label: "责任单位", prop: "responsibleunit", align: "left" },
        },
        {
          attrs: { label: "责任人", prop: "personliable", align: "left" },
        },
        {
          attrs: { label: "执行人", prop: "personliable", align: "left" },
        },
        {
          slot: "state",
          attrs: { label: "状态", prop: "state", align: "center" },
        },
        {
          attrs: { label: "备注", prop: "remarks", align: "left" },
        },
        {
          slot: "btn",
          attrs: {
            label: "操作",
            width: "200px",
            fixed: "right",
            align: "center",
          },
        },
      ],
      /* 第一个表格数据 */
      data1: {
        data: [
          {
            plancontent: "L联主桥下",
            time: "2021.08.25",
            importance: 0,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "已完成",
          },
          {
            plancontent: "L联主桥下",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "未完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
        ],
      },
      value: 1,
    };
  },
  created() {},
  mounted() {},
  methods: {
    //搜索
    getFilterList() {
    },
    //查看
    handleView(row) {
      this.$router.push({
        name: "completion-view",
        query: {
          //   designQaId:row.designQaId,
        },
      });
    },
    /* 填报 */
    selectPerson(row) {
      this.$router.push({
        name: "plan-completed",
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
  /* 基础蓝点 */
  .status {
    margin: 0 auto;
    text-align: center;
    width: 72px;
    height: 32px;
    line-height: 32px;
    background-color: #ecf5ff;
    border-radius: 2px;
    border: 1px solid #a3d0fd;
    font-size: 14px;
    font-weight: 400;
    color: #409eff;
  }
  /* 红点 */
  .red {
    border: 1px solid #fbc4c4;
    background-color: #fff1f0;
    color: #fa5555;
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
