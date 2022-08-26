<!-- 车间工费详情 -->
<template>
  <div id="main">
    <!-- 主要内容 -->
    <div class="main_content">
      <div class="conten_header">
        <div class="header_left">
          <!-- <p class="worker_name"></p> -->
          <div class="select">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link" ref="name">
                已报工工资明细<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="已报工工资明细"
                  >已报工工资明细</el-dropdown-item
                >
                <el-dropdown-item command="已检验合格工资明细"
                  >已检验合格工资明细</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-button type="primary" @click="out"
          ><i class="el-icon-upload2"></i>导出</el-button
        >
      </div>
      <div class="content_table" v-if="show1">
        <TableBody :colConfig="colConfig1" :data="data1.data" show-summary>
        </TableBody>
      </div>
      <div class="content_table" v-if="show2">
        <TableBody :colConfig="colConfig2" :data="data2.data" show-summary>
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
      colConfig1: [
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
      data1: {
        data: [],
      },
      colConfig2: [
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
      show1: true,
      show2: false,
    };
  },
  created() {},
  mounted() {
    const { detail } = JSON.parse(this.$route.query.row)
    this.data1.data = detail
    this.data2.data = detail
  },
  methods: {
    /* 下拉菜单(数据的切换可以在这边进行) */
    handleCommand(command) {
      this.$refs.name.innerHTML = `${command}<i class="el-icon-arrow-down el-icon--right"></i>`;
      if (command === "已报工工资明细") {
        this.show1 = true;
        this.show2 = false;
      } else {
        this.show1 = false;
        this.show2 = true;
      }
      /* this.$message("click on item " + command); */
    },
    /* 导出 */
    out() {
    },
    /* 索引号 */
    indexMethod(index) {
      if (index < 9) {
        return (index = `0${index + 1}`);
      } else {
        return (index = index + 1);
      }
    },
    //看表格中哪些列需要计算(可进行修改)
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
  },
};
</script>

<style scoped lang="scss">
#main {
  height: 100%;
  background-color: #ffffff;
  .main_content {
    height: 100%;
    box-sizing: border-box;
    padding: 16px 16px;
    .conten_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      .header_left {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        .select {
          // margin-left: 80px;
          .el-dropdown-link {
            cursor: pointer;
            color: #909399;
          }
          .el-icon-arrow-down {
            font-size: 13px;
          }
        }
      }
    }
    .content_table {
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
      /* 去掉所有的边框 */
      ::v-deep.el-table__row {
        .el-table__cell {
          border-left: 0;
          border-right: 0;
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
