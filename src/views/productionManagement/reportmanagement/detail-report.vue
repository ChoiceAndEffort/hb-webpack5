<template>
  <div class="wrap">
    <div>
      <Form
        formName="form"
        primary="primary"
        :submit="true"
        submitContext="查询"
        :renderData="renderData"
        @handleSubmit="handleSubmit"
      />
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
        <template #btn="{scope}">
          <el-button type="text" @click="handleClick(scope.row)">详情</el-button>
        </template>
      </TableBody>
      <Pagination :data="{total: 3}"></Pagination>
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
      renderData: [
        {
          tag: "el-select",
          attrs: {
            key: "projectId",
            options: [
        {
          label: 'HB-BS20201228GL',
          value: 1
        },
        {
          label: 'HB-BS20170714GL',
          value: 2
        },
        {
          label: 'HB-BS20180308GL',
          value: 3
        },
      ],
          },
        },
      ],
      colConfig: [
        { attrs: { label: "序号",'min-width': '25%', type: "index", width: "50" } },
        { attrs: { label: "项目WBS号",'min-width': '40%', prop: "wbsCode"} },
        { attrs: { label: "工程名称",'min-width': '80%', prop: "name"} },
        { attrs: { label: "项目总吨位",'min-width': '25%', prop: "totalW"} },
        { attrs: { label: "制造总标准吨",'min-width': '25%', prop: "stdW"} },
        { attrs: { label: "项目制造完成总标准吨",'min-width': '25%', prop: "compW"} },
        { attrs: { label: "项目制造剩余标准吨",'min-width': '25%', prop: "supW"} },
        { attrs: { label: "安装总标准吨",'min-width': '25%', prop: "insW"} },
        { attrs: { label: "项目安装完成总标准吨",'min-width': '25%', prop: "insCompW"} },
        { attrs: { label: "项目安装剩余标准吨",'min-width': '25%', prop: "insSupW"} },
        { attrs: { label: "项目累计完成标准吨",'min-width': '25%', prop: "countW"} },
        { attrs: { label: "项目剩余标准吨",'min-width': '25%', prop: "inssW"} },
        { slot: "percent",attrs: { label: "完工百分比",'min-width': '50%', prop: "radio"} },
        { attrs: { label: "备注",'min-width': '25%', prop: "mark", align: "center",} },
        { slot: "btn",attrs: { label: "操作", align: "center", width: "80px", fixed: "right" },},
      ],
      data: [],
      mockData: [
        {value: 1, wbsCode:'HB-BS20201228GL',name:'东部过境高速公路梧桐立交至终点段工程',totalW:'9441.6',stdW:'7553.280',compW:'1006.584',supW:'6546.696',insW:'1888.320',insCompW:'0',insSupW:'1888.320',countW:'1006.584',inssW:'8435.016',radio:10.66,mark:'',
         child: [
           {gx:'下料',stdR:0,totalW:'9441.6',gxStdR:'0',compW:'315.3',compMW:'0',countGxW:'3254.2',countStdW:'0',supW:'0',radio:34.47},
           {gx:'单元件',stdR:21,totalW:'9441.6',gxStdR:'1982.736',compW:'651.3',compMW:'136.773',countGxW:'2213.6',countStdW:'464.856',supW:'1517.880',radio:23.45},
           {gx:'总装',stdR:44,totalW:'9441.6',gxStdR:'4154.304',compW:'1231.2',compMW:'541.728',countGxW:'1231.2',countStdW:'541.728',supW:'3612.576',radio:13.04},
           {gx:'涂装',stdR:10,totalW:'9441.6',gxStdR:'944.160',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'994.160',radio:0},
           {gx:'运输',stdR:5,totalW:'9441.6',gxStdR:'472.080',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'472.080',radio:0},
           {gx:'安装',stdR:20,totalW:'9441.6',gxStdR:'1888.320',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'1888.320',radio:0},
         ]},
        {value: 2,wbsCode:'HB-BS20170714GL',name:'中开项目',totalW:'4616.6',stdW:'3693.280',compW:'1155.584',supW:'2537.696',insW:'923.320',insCompW:'0',insSupW:'923.320',countW:'1155.584',inssW:'3461.016',radio:25.03,mark:'',
        child: [
           {gx:'下料',stdR:0,totalW:'4616.6',gxStdR:'0',compW:'1231',compMW:'0',countGxW:'3616.2',countStdW:'0',supW:'0',radio:78.33},
           {gx:'单元件',stdR:21,totalW:'4616.6',gxStdR:'969.486',compW:'651.3',compMW:'136.773',countGxW:'2213.6',countStdW:'569.856',supW:'339.630',radio:58.78},
           {gx:'总装',stdR:44,totalW:'4616.6',gxStdR:'2031.304',compW:'325.3',compMW:'143.132',countGxW:'1231.2',countStdW:'585.728',supW:'1445.576',radio:28.84},
           {gx:'涂装',stdR:10,totalW:'4616.6',gxStdR:'461.660',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'461.660',radio:0},
           {gx:'运输',stdR:5,totalW:'4616.6',gxStdR:'230.830',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'230.830',radio:0},
           {gx:'安装',stdR:20,totalW:'4616.6',gxStdR:'923.320',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'923.320',radio:0},
        ]},
        {value: 3,wbsCode:'HB-BS20180308GL',name:'包工大道',totalW:'7058.6',stdW:'5646.880',compW:'3876.294',supW:'1770.586',insW:'1411.720',insCompW:'0',insSupW:'1411.720',countW:'3876.294',inssW:'3182.306',radio:54.92,mark:'',
        child: [
           {gx:'下料',stdR:0,totalW:'7058.6',gxStdR:'0',compW:'315.3',compMW:'0',countGxW:'7058.6',countStdW:'0',supW:'0',radio:100},
           {gx:'单元件',stdR:21,totalW:'7058.6',gxStdR:'1482.306',compW:'651.3',compMW:'136.773',countGxW:'6633.2',countStdW:'1392.972',supW:'89.334',radio:93.97},
           {gx:'总装',stdR:44,totalW:'7058.6',gxStdR:'3105.784',compW:'831.2',compMW:'365.728',countGxW:'5214.3',countStdW:'2294.292',supW:'811.492',radio:73.87},
           {gx:'涂装',stdR:10,totalW:'7058.6',gxStdR:'705.860',compW:'514.2',compMW:'51.420',countGxW:'1890.3.',countStdW:'189.03',supW:'516.830',radio:26.78},
           {gx:'运输',stdR:5,totalW:'7058.6',gxStdR:'352.930',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'352.930',radio:0},
           {gx:'安装',stdR:20,totalW:'7058.6',gxStdR:'1411.720',compW:'0',compMW:'0',countGxW:'0',countStdW:'0',supW:'1411.720',radio:0},
        ]},
      ]
    };
  },
  created() {},
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.mockData))
  },
  methods: {
    handleSubmit(payload) {
      let data = JSON.parse(JSON.stringify(this.mockData))
      if (!payload.projectId) {
        this.data = data
        return
      }
      this.data = data.filter(item => item.value == payload.projectId)
    },
    handleClick(row) {
      this.$router.push({
        name: 'detail-item-report',
        query: {
          row: JSON.stringify(row)
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column ,index) => {
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        if (index === columns.length-1 || index === 0)
          return
        switch(column['property']) {
          case 'wbsCode': 
          case 'stdW': 
          case 'radio': 
          case 'mark': return
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
  .el-form {
    display: flex;
    ::v-deep .el-form-item {
      width: auto !important;
      margin-right: 10px;
    }
  }
  ::v-deep .el-table {
    .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>
