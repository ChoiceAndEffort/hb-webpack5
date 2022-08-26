<!-- 项目工费详情 -->
<template>
  <div id="main">
    <!-- 主要内容 -->
    <div class="main_content">
      <div class="conten_header">
        <p class="header_left">繁华大道项目{{routeData?routeData.gongxu:''}}工费明细</p>
        <el-button type="primary" @click="out"
          ><i class="el-icon-upload2"></i>导出</el-button
        >
      </div>
      <div class="content_table">
        <TableBody :colConfig="colConfig" :data="data2.data" show-summary>
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
          attrs: { label: "材料编号", prop: "bianhao", align: "center" },
        },
        {
          attrs: { label: "完成工艺", prop: "wanchenggongyi", align: "center" },
        },
        {
          attrs: { label: "完成工作量", prop: "liang", align: "center" },
        },
        {
          attrs: { label: "施工人员", prop: "name", align: "center" },
        },
        {
          attrs: {
            label: "检验合格时间",
            prop: "time",
            align: "center",
          },
        },
        {
          attrs: { label: "工费(元)", prop: "amount1", align: "center" },
        },
        {
          attrs: { label: "进度奖(元)", prop: "amount2", align: "center" },
        },
        {
          attrs: { label: "质量奖(元)", prop: "amount3", align: "center" },
        },
      ],
      /* 后端数据可以在此接收 */
      data2: {
        data: [],
      },
      routeData: {}
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
  mounted() {
    this.routeData = JSON.parse(this.$route.query.row)
    const { detail } = this.routeData
    if (detail.length) {
      this.data2.data = detail
    }
  },
  methods: {
    /* 导出 */
    out() {
    },
    //修改
    handleEdit(row) {
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
      /* 给总计的样式单独加颜色和总计居中(注意位置不要随意交换) */
      ::v-deep.el-table__footer-wrapper {
        .has-gutter {
          tr,
          th,
          td {
            background-color: #ffffff;
          }
          .el-table_1_column_1 {
            text-align: center;
          }
        }
      }
      /* 后面这两行样式是将表格中的总计放到第一行显示 */
      ::v-deep.el-table {
        display: flex;
        flex-direction: column;
      }
      /* order默认值为0，只需将表体order置为1即可移到最后，这样合计行就上移到表体上方 */
      ::v-deep.el-table__body-wrapper {
        order: 1;
      }
    }
  }
}
</style>
