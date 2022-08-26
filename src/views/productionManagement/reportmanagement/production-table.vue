<template>
  <div class="wrap">
    <el-row>
      <el-col :span="24"
        v-show="!isShowDetail">
        <div class="box">
          <el-button type="primary"
            class="exportBtn exportExel"
            @click="eportMainTab(true)">导出报表</el-button>
          <multiLevelTable :tabledata="tableData1"
            id="tableMain"
            show-summary
            :maxHeight="635"
            :tableConfig="mainTable"
            :isSerialfixed="true"
            :summary-method="getSummaries1">
            <template slot="serial"
              slot-scope="{ scope }">
              <span class="highlightSpan">{{indexMethod(scope.row.serial)}}</span>
            </template>
            <template slot="name"
              slot-scope="{ scope }">
              <span class="highlightSpan"
                @click="toDetail(scope.row)">{{scope.row.project_name}}</span>
            </template>
          </multiLevelTable>
        </div>
      </el-col>
    </el-row>
    <el-col :span="24"
      v-show="isShowDetail">
      <div class="box">
        <div class="title">
          {{detailRow.project_name}}
          <el-button type="primary"
            style="float:right;margin-left:20px"
            @click="backTo">返回</el-button>
          <el-button type="primary"
            class="exportExel"
            style="float:right"
            @click="eportMainTab(false)">导出报表</el-button>
        </div>
        <!--  -->
        <multiLevelTable :tabledata="tableData2"
          id="table"
          show-summary
          :maxHeight="635"
          :tableConfig="detailsTable"
          :ishasSelfSerial="true"
          :span-method="arraySpanMethod"
          :summary-method="getSummaries">
          <template slot="serial"
            slot-scope="{ scope }">
            <span>{{indexMethod(scope.$index)}}</span>
          </template>
        </multiLevelTable>
      </div>
    </el-col>
  </div>
</template>
<script>
import axios from 'axios';
import multiLevelTable from "../components/multiLevelTable.vue";
import { getReportOfOutputByMonth, getReportMxOfOutputByMonth, getReportOfOutputByMonthExel } from '@/api/productionManagement/project'
import { enterpriseId } from "@/assets/productionManagement/comjs/login";
import { yearTime, getMonth } from "@/utils/productionManagement/tool"
export default {
  components: { multiLevelTable },
  props: {
    currentData: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tableData1: [],
      tableData2: [],
      spanArr: [],
      pos: '',
      spanArr1: [],
      pos1: '',
      spanArr2: [],
      pos2: '',
      detailRow: {},
      isShowDetail: false,//展示详情
      mainTable: [],
      detailsTable: [],
      searchData: {
        workYear: 2022,
        workMonth: 4
      }
    }
  },

  mounted() {

  },
  watch: {
    isShowDetail: {
      handle(n) {
        console.log(this.$parent)
        this.$parent.wrap.isShowDetail = !n
      },
      deep: true
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
    },
    getList(val) {
      let params = {
        workYear: val.workYear,
        workMonth: val.workMonth,
        enterpriseId: enterpriseId
      };
      getReportOfOutputByMonth(params).then((res) => {
        if (res.code == 0) {
          res.data.tableHeaders.forEach(item => {
            if (item.prop == "project_name") {
              item.slot = 'name'
            }
          })
          this.mainTable = res.data.tableHeaders;
          this.tableData1 = res.data.tableDataList
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //查看详情
    toDetail(row) {
      this.detailRow = row;
      this.isShowDetail = true;
      let params = {
        workYear: 2022,
        workMonth: 4,
        enterpriseId: '210806DYZ51XWYCH',
        projectId: row.project_id
      };
      getReportMxOfOutputByMonth(params).then((res) => {
        if (res.code == 0) {
          res.data.tableHeaders.unshift({
            slot: 'serial',
            label: "序号",
            prop: "serial",
            width: "150",
            fixed: true
          })
          res.data.tableHeaders.forEach(item => {
            if (item.prop == "coupling_name") {
              item.fixed = true
            }
          })
          this.detailsTable = res.data.tableHeaders;
          this.tableData2 = res.data.tableDataList
          this.getSpanArr(this.tableData2, 'coupling_name');
        } else {
          this.$message.error(res.message);
        }
      });
    },
    backTo() {
      this.isShowDetail = false;
    },
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          if (column.property.indexOf('month') > -1) {
            let count = values.reduce((prev, curr) => {
              const value = Number(curr * 1000);
              if (!isNaN(value)) {
                return prev + value;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = count / 1000
          }
        }
      })
      return sums;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          // console.log(sums[index], index)
          if (column.property.indexOf('pip_ton') > -1) {
            // sums[index + 1 - 7] = '20542.554'

            let count = values.reduce((prev, curr) => {
              const value = Number(curr * 1000);
              if (!isNaN(value)) {
                return prev + value;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = count / 1000

          } else {
            // sums[index] == ''
          }
          // sums[index] = values.reduce((prev, curr) => {
          //   const value = Number(curr);
          //   if (!isNaN(value)) {
          //     return prev + curr;
          //   } else {
          //     return prev;
          //   }
          // }, 0);
          // sums[index] += ' 元';
        } else {
          // sums[index] = 'N/A';
        }
      });

      return sums;
    }
    ,
    getSpanArr(data, attrs) {
      // data就是我们从后台拿到的数据
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          this.spanArr1.push(1);
          this.pos1 = 0;
          this.spanArr2.push(1);
          this.pos2 = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].coupling_id === data[i - 1].coupling_id) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
            if (data[i].superior_working_procedure_name === data[i - 1].superior_working_procedure_name) {
              this.spanArr1[this.pos1] += 1;
              this.spanArr1.push(0);
            } else {
              this.spanArr1.push(1);
              this.pos1 = i;
            }
          } else {
            this.spanArr.push(1);
            this.pos = i;
            this.spanArr1.push(1);
            this.pos1 = i;
            this.spanArr2.push(1);
            this.pos2 = i;
          }
        }
        let Nosort = 0;
        for (let n in this.spanArr) {
          if (this.spanArr[n] > 0) {
            Nosort += 1;
            let serial = this.indexMethod(Nosort)
            this.$set(this.tableData2[n], 'serial', serial) // this.list为最后展示的数组
          }
        }

      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      } if (columnIndex === 3) {
        const _row = this.spanArr1[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    eportMainTab(isMain) {
      let params = {
        workMonth: this.searchData.workMonth,
        workYear: this.searchData.workYear,
        enterpriseId: '210806DYZ51XWYCH',
        fileName: '产值报表'
      }
      if (!isMain) {
        params.projectId = this.detailRow.project_id
      }

      const defaultSettings = require("@/settings");
      let baseUrl = "";
      if (process.env.NODE_ENV === "production") {
        if (process.env.VUE_APP_TITLE === "test") {
          baseUrl = defaultSettings.testApi;
        } else {
          baseUrl = defaultSettings.productionApi;
        }
      } else if (process.env.NODE_ENV === "development") {
        baseUrl = defaultSettings.developmentApi;
      }
      axios({
        method: 'get',
        url: `/rms/c/v1/pms/excel/export/output/${isMain ? 'getReportOfOutputByMonth' : 'getReportMxOfOutputByMonth'}`,
        params: params,
        // `${baseUrl}?fileName=产量报表&workYear=${this.searchData.workYear}&workMonth=${this.searchData.workMonth}&enterpriseId=210806DYZ51XWYCH`,
        responseType: "blob"
      })
        .then(res => {
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel"
          });

          let link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.setAttribute('download', `${isMain ? '' : this.detailRow.project_name}产量报表.xlsx`);
          link.click();
          link = null;
          this.$message.success('导出成功');

        })
        .catch(err => {
          this.btnLoading = false;
          this.$message.error("下载失败");
        });


      // getReportOfOutputByMonthExel(params).then((res) => {

      //   // 文件下载
      //   const blob = new Blob([res.data], {
      //     type: "application/vnd.ms-excel"
      //   });
      //   let link = document.createElement('a');
      //   link.href = URL.createObjectURL(blob);
      //   link.setAttribute('download', '导出文件.xlsx');
      //   link.click();
      //   link = null;
      //   this.$message.success('导出成功');


      // })


      // if(isMain){
      //   var url = `${baseUrl}/rms/c/v1/pms/excel/export/output/getReportOfOutputByMonth?fileName=产量报表&workYear=${this.searchData.workYear}&workMonth=${this.searchData.workMonth}&&enterpriseId=enterpriseId`;
      // }else{
      //    var url = `${baseUrl}/rms/c/v1/pms/excel/export/output/getReportMxOfOutputByMonth?fileName=产量报表&workYear=${this.searchData.workYear}&workMonth=${this.searchData.workMonth}&&enterpriseId=enterpriseId`;
      // }
      // const a = document.createElement("a");
      // a.setAttribute("href", url);
      // a.setAttribute("download", url);
      // a.click();

      // const downloadFile = (url, filename) =>
      //   axios
      //     .get(url, {
      //       responseType: 'blob',
      //       //处理部分情况需要token的问题 
      //       headers: { token: localStorage.getItem("_token") }
      //     })
      //     .then((res) => {
      //       const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据，并设置文件类型
      //       if (window.navigator.msSaveOrOpenBlob) {
      //         // 兼容IE10
      //         navigator.msSaveBlob(blob, filename)
      //       } else {
      //         const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
      //         const a = document.createElement('a')
      //         a.style.display = 'none'
      //         a.href = href // 指定下载链接
      //         a.download = filename // 指定下载文件名
      //         a.click()
      //         URL.revokeObjectURL(a.href) // 释放URL对象
      //       }
      //     })
    }

  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 16px 16px 16px 6px;
  .inputBox {
    margin-right: 10px;
  }
  .box {
    position: relative;
    width: 100%;
    background-color: #fff;
    // height: 250px;
    border-radius: 5px;
    padding: 20px 30px;
    font-size: 14px;
    .title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      overflow: hidden;
      span {
        margin-left: 10px;
        font-size: 12px;
      }
    }
    .tableTitle {
      font-size: 16px;
      font-weight: 600;
    }
    .exportBtn {
      float: right;
      margin: 10px;
      background-color: #fff;
    }
  }
  .el-col {
    margin-bottom: 20px;
    .box {
      width: 100%;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .highlightSpan {
    color: #1989fa;
    cursor: pointer;
    &:hover {
      color: #0b5df5;
    }
  }
}
// ::v-deep .el-button--primary {
//   background-color: #fff !important;
//   color: #409eff !important;
// }
// ::v-deep .el-button--primary:focus,
// .el-button--primary:hover {
//   background-color: #409eff !important;
//   color: #fff !important;
// }
</style>