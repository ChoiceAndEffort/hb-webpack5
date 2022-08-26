<template>
  <div class="wrap">
    <el-row>
      <el-col :span="24">
        <div class="box">
          <div class="title">考勤日报表</div>
          <TableBody :colConfig="reportConfig.clockingin"
            :data="tableData"
            border
            max-height="180">
            <template slot="serial"
              slot-scope="{ scope }">
              <span>{{ doubleDigit(scope.$index) }}</span>
            </template>
            <template slot="actual"
              slot-scope="{ scope }">
              <span class="actualBox"
                @click="checkDeTail(scope.$index, scope.row)">{{ scope.row.actual }}</span>
            </template>
          </TableBody>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="box part1">
          <div class="title">项目计划与进度情况</div>
          <TableBody :colConfig="reportConfig.projectPlan"
            :data="projectSchedule"
            border
            max-height="630">
            <template slot="serial"
              slot-scope="{ scope }">
              <span>{{ doubleDigit(scope.$index) }}</span>
            </template>
            <template slot="actual"
              slot-scope="{ scope }">
              <span class="actualBox"
                @click="checkDeTail(scope.$index, scope.row)">{{ scope.row.actual }}</span>
            </template>
          </TableBody>
          <!-- <Pagination
            :data="pageData"
            @changePage="changePage"
            class="paging"
          /> -->
        </div>
      </el-col>
      <el-col :span="24">
        <div class="box part1">
          <div class="title">目标对比与人均效能</div>
          <multiLevelTable :tabledata="goalsPerCapitaCapacity"
            :maxHeight="550"
            :tableConfig="reportConfig.objectiveComparison"></multiLevelTable>
          <!-- <Pagination
            :data="pageData"
            @changePage="changePage"
            class="paging"
          /> -->
        </div>
      </el-col>
      <el-col :span="24">
        <div class="box part1 part2">
          <div class="title">项目派工及成本情况</div>
          <multiLevelTable :tabledata="projectStaffing"
            :maxHeight="550"
            :tableConfig="reportConfig.projectDispatching"></multiLevelTable>
          <!-- <Pagination
            :data="pageData"
            @changePage="changePage"
            class="paging"
          /> -->
        </div>
      </el-col>
    </el-row>
    <el-dialog title="实到人员"
      :visible.sync="dialogTableVisible"
      class="Tabledialog">
      <TableBody :colConfig="reportConfig.actuallyRealizedPerson"
        :data="WorkAttendance"
        :max-height="480">
        <template slot="serial"
          slot-scope="{ scope }">
          <span>{{ doubleDigit(scope.$index) }}</span>
        </template>
      </TableBody>
      <Pagination :data="pageData"
        @changePage="changePage"
        class="dialogPagination" />
    </el-dialog>
  </div>
</template>
<script>
import multiLevelTable from "../components/multiLevelTable.vue";
import { TableBody, Pagination } from "gggj_lib";
import { reportConfig } from '@/utils/productionManagement/reportTableConfig'
import { timeFormat, shortTime } from '@/utils/productionManagement/tool.js'
import {
  getPmsTdProjectScheduleStatusPage,
  getPmsTdProjectStaffingCostPage,
  getPmsTdGoalsPerCapitaCapacityPage,
  getPmsTdWorkAttendancePage
} from "@/api/productionManagement/project";
export default {
  components: { TableBody, Pagination, multiLevelTable },
  props: {
    currentData: {
      type: String,
      default: "",
    },
    departmentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      reportConfig: [],
      tableData: [
        {
          serial: "01",
          profession: "管理人员",
          shouldbe: 24,
          actual: 23,
          absenteeism: 1,
        },
        {
          serial: "02",
          profession: "生产工人",
          shouldbe: 24,
          actual: 23,
          absenteeism: 1,
        },
        {
          serial: "03",
          profession: "辅助人员",
          shouldbe: 24,
          actual: 23,
          absenteeism: 1,
        },
      ],
      pageData: {
        total: 0,
        size: 10,
        page: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        tableData: [],
        tableDataId: [],
        segmentList: [],
      },
      dialogTableVisible: false,
      projectSchedule: [], //项目计划与进度情况
      projectStaffing: [], //项目派工及成本情况
      goalsPerCapitaCapacity: [], //目标比与人均效能
      WorkAttendance: [],//员工考勤日报表分页数据
    };
  },
  mounted() {
    // this.getList();
    this.reportConfig = reportConfig;
    console.log(reportConfig, "reportConfig")
  },
  methods: {
    doubleDigit(num) {
      // console.log(num,'num');
      return num + 1 < 10 ? `0${num + 1}` : num + 1
    },
    getList(currentDate, departmentId) {
      if (!departmentId || departmentId == '') {
        this.$message.error('请选择厂区！');
        return
      }
      let params = {
        workTime: currentDate,
        departmentId: departmentId
      };
      getPmsTdProjectScheduleStatusPage(params).then((res) => {
        // console.log(res)
        if (res.code == 0) {
          this.projectSchedule = res.data.data;
        } else {
          this.$message.error(res.message);
        }
      });
      getPmsTdProjectStaffingCostPage(params).then((res) => {
        // console.log(res)
        if (res.code == 0) {
          this.projectStaffing = res.data.data;
        } else {
          this.$message.error(res.message);
        }
      });
      getPmsTdGoalsPerCapitaCapacityPage(params).then((res) => {
        // console.log(res)
        if (res.code == 0) {
          this.goalsPerCapitaCapacity = res.data.data;
        } else {
          this.$message.error(res.message);
        }
      });
      let obj1 = { departmentId: '' }
      getPmsTdWorkAttendancePage(obj1).then((res) => {
        // console.log(res)
        if (res.code == 0) {
          this.WorkAttendance = res.data.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    checkDeTail() {
      this.dialogTableVisible = true;
    },
    //分页
    changePage(e) {
      this.pageData.page = e;
      this.getProject();
    },
  },
};
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
      span {
        margin-left: 10px;
        font-size: 12px;
      }
    }
    .actualBox {
      color: #1989fa;
      font-weight: 700;
      cursor: pointer;
    }
    .paging {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  .part1 {
    // height: 300px;
  }
  .part2 {
    // height: 380px;
  }
  .Tabledialog {
    .dialogPagination {
      margin-top: 20px;
      text-align: right;
    }
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
</style>