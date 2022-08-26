<template>
  <div class="wrap">
    <div class="warp-header">
      <p>{{title}}</p>
    </div>
    <div>
      <TableBody
        :summary-method="getSummaries"
        show-summary
        :data="data"
        :colConfig="colConfig"
      >
        <template #percent="{scope}">
          <el-progress :percentage="scope.row.radio"></el-progress>
          <!-- <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.radio" ></el-progress> -->
        </template>
      </TableBody>
    </div>
  </div>
</template>

<script>
import { Form, TableBody, Pagination } from 'gggj_lib';
export default {
  components: {
    Form,
    TableBody,
    Pagination
  },
  data() {
    return {
      title: '',
      colConfig: [
        { attrs: { label: "序号",'min-width': '25%', type: "index", width: "50" } },
        { attrs: { label: "工序",'min-width': '25%', prop: "gx"} },
        { attrs: { label: "标准吨比例（%）",'min-width': '25%',prop: "stdR"} },
        { attrs: { label: "合同总量（吨）",'min-width': '25%', prop: "totalW"} },
        { attrs: { label: "各工序标准吨",'min-width': '25%', prop: "gxStdR"} },
        { attrs: { label: "本月完成工序吨",'min-width': '25%', prop: "compW"} },
        { attrs: { label: "本月完成标准吨",'min-width': '25%', prop: "compMW"} },
        { attrs: { label: "累计完成工序吨",'min-width': '25%', prop: "countGxW"} },
        { attrs: { label: "累计完成标准吨",'min-width': '25%', prop: "countStdW"} },
        { attrs: { label: "各工序剩余标准吨",'min-width': '25%', prop: "supW"} },
        { slot: "percent",attrs: { label: "工序完工百分比",'min-width': '50%',prop: "percent"} },
      ],
      data: []
    };
  },
  created() {},
  mounted() {
    const row = JSON.parse(this.$route.query.row) 
    this.title = row.name
    this.data = row.child
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column ,index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (index === 0)
          return
        switch(column['property']) {
          case 'stdR': 
          case 'totalW': 
          case 'compW': 
          case 'countGxW': return
          case 'percent': sums[index] = (sums[8] / sums[4] * 100).toFixed(2) + '%'; return
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0).toFixed(2);
        } else {
          sums[index] = 'N/A';
        }
      })
      return sums
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
  background-color: #fff;
  padding: 16px;
  .warp-header {
    margin-bottom: 16px;
  }
  ::v-deep .el-table {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
