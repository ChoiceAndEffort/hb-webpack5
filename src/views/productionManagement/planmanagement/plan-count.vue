<!-- 计划管理 -->
<template>
  <div id="main">
    <!-- 主要内容 -->
    <div class="main_content">
      <div class="conten_header">
        <p class="header_left">繁华大道项目下料工费明细</p>
        <el-button type="primary" @click="out"
          ><i class="el-icon-upload2"></i>导出</el-button
        >
      </div>
      <div class="content_table">
        <TableBody :colConfig="colConfig" :data="data2.data">
          <template slot="state" slot-scope="{ scope }">
            <p class="approval_status" :class="{'finish' : scope.row.state==='已审批', 'progress': scope.row.state==='审批中'}">{{ scope.row.state }}</p>
          </template>
          <template slot="btns" slot-scope="{ scope }">
            <el-button size="mini" type="text" @click="detailsRow(scope.row)"
              >查看</el-button
            >
          </template>
        </TableBody>
      </div>
    </div>
  </div>
</template>

<script>
import { TableBody } from "gggj_lib";
export default {
  components: { TableBody },
  data() {
    return {
      colConfig: [
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "center",
            type: "index",
          },
        },
        {
          attrs: { label: "时间", prop: "time", align: "center" },
        },
        {
          slot: "state",
          attrs: { label: "状态", prop: "state", align: "center" },
        },
        {
          slot: "btns",
          attrs: { label: "操作", fixed: "right", width: 80, align: "center" },
        },
      ],
      /* 后端数据可以在此接收 */
      data2: {
        data: [
          {
            time: "10:03",
            state: "未审批",
          },
          {
            time: "10:03",
            state: "审批中",
          },
          {
            time: "10:03",
            state: "已审批",
          },
          {
            time: "10:03",
            state: "未审批",
          },
          {
            time: "10:03",
            state: "审批中",
          },
          {
            time: "10:03",
            state: "未审批",
          },
          {
            time: "10:03",
            state: "审批中",
          },
          {
            time: "10:03",
            state: "未审批",
          },
        ],
      },
    };
  },
  created() {},
  computed: {
    indexMethod(index) {
      if (index < 9) {
        return (index = `0${index + 1}`);
      } else {
        return (index = index + 1);
      }
    },
  },
  mounted() {},
  methods: {
    //导出
    out() {
    },
    //查看
    detailsRow(row) {
      this.$router.push({
        name: "approval-details",
        query: {
          //   designQaId:row.designQaId,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
#main {
  height: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  .main_content {
    height: 100%;
    box-sizing: border-box;
    padding: 16px 16px;
    .conten_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header_left {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }
    }
    .content_table {
      padding-top: 20px;
      box-sizing: border-box;
      /* 表头和总计加背景样式和字体样式 */
      ::v-deep.has-gutter {
        tr,
        th,
        td {
          background-color: #f2f6fc;
          color: #303133;
          font-size: 14px;
          font-weight: 500;
        }
      }
      .approval_status {
        margin: 0 auto;
        width: 72px;
        height: 32px;
        line-height: 32px;
        background: #fff1f0;
        border-radius: 2px;
        border: 1px solid #fbc4c4;
        font-size: 14px;
        font-weight: 400;
        color: #fa5555;
        &.finish {
          color: #409EFF;
          background: #ecf5ff;
          border: 1px solid #a3d0fd;
        }
        &.progress {
          color: #FA8E55;
          background: #fdf5e6;
          border: 1px solid #f5dab1;
        }
      }
    }
  }
}
</style>

