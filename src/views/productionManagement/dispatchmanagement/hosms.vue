<template>
  <div class="bosms_box">
    <div class="box_5x">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>生产人员</span>
          <el-button style="float: right; padding: 7px 3px" icon="el-icon-plus"  @click="addPersonnel(true)">新增人员</el-button>
        </div>
        <!-- 表单 -->
        <div>
          <TableBody
            :colConfig="colConfig"
            :data="productionPersonnel.data"
            max-height="300px"
          >
            <template slot="isStaffed" slot-scope="{ scope }">
                <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, true)"></el-button>
            </template>
          </TableBody>
        </div>
      </el-card>
    </div>
    <div class="top_op box_5x">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>辅助人员</span>
          <el-button  style="float: right; padding: 7px 3px"  icon="el-icon-plus"  @click="addPersonnel(false)">新增人员</el-button>
        </div>
        <!-- 表单 -->
        <div>
          <TableBody
            :colConfig="colConfig"
            :data="auxiliaryPersonnel.data"
            max-height="300px"
          >
            <template slot="isStaffed" slot-scope="{ scope }">
               <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, false)"></el-button>
            </template>
          </TableBody>
        </div>
      </el-card>
    </div>
      <div class="flex_row_end bottom_btn">
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="operationJobWorkReportStaff">确定派工</el-button>
      </div>
      <!-- 模态框 开始-->
      <el-dialog
          title="选择执行人"
          :visible.sync="dialogTablsdx"
          class="motai"
          width="1100px"
      >
          <selectPeople ref="selectTable" :colConfig="addPeopleColconfig" :framework=1 :showselect="false" :selectidEd="selectidEd" @setPersonnelData="setPersonnelData" @closedialogTablsdx="closedialogTablsdx"></selectPeople>
      </el-dialog>
      <!-- 模态框 结束-->
  </div>
</template>
<script>
import { TableBody } from "gggj_lib";
import {operationJobWorkReportStaff, workOrderDistribution} from '@/api/productionManagement/dispatch.js'
import selectPeople from "../components/selectPeople";
export default {
  components: { TableBody, selectPeople },
  data() {
    return {
        data5: {
            total: 0,
            size: 10,
            page: 0,
            lastPage: 0,
            totalPages: 2,
            first: true,
            last: true,
        },
          // 点击新增人员打开模态框
          dialogTablsdx: false,
          dialogTableVisible: false,
          addPeopleColconfig: [
                {
                    attrs: {   align: 'center', type: 'selection', 'reserve-selection': true },
                },
                {
                    attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                },
                {
                    attrs: { label: '姓名', prop: 'staff.name', align: 'center' },
                },{
                    attrs: { label: '工号', prop: 'staff.number', align: 'center' },
                },{
                    attrs:  { label: '部门', prop: 'positionList[0].departmentName', align: 'center' },
                },
           /*   {
                    attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
                },*/
              {
                    attrs: { label: '手机号', prop: 'staff.mobile', align: 'center' },
                }],
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
                  attrs: { label: '姓名', prop: 'staff.name', align: 'center' },
              },{
                  attrs: { label: '工号', prop: 'staff.number', align: 'center' },
              },{
                  attrs:  { label: '部门', prop: 'positionList[0].departmentName', align: 'center' },
              },
          /*    {
                  attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
              },*/
              {
                  attrs: { label: '手机号', prop: 'staff.mobile', align: 'center' },
              },
            {
              slot: "isStaffed",
              attrs: {
                label: "操作",
                prop: "progreward",
                align: "center",
              },
            },
          ],
          productionPersonnel: {
            data: [],
            selectidEd: []
          },
          auxiliaryPersonnel: {
            data: [],
            selectidEd: []
          },
        selectidEd: [],
          personnelSign: true, // true: 新增生产人员  false: 新增辅助人员
    };
  },
  created() {},
  mounted() {},
  methods: {
      /**确认报工*/
      operationJobWorkReportStaff() {
          if(this.productionPersonnel.data.length<1 && this.auxiliaryPersonnel.data.length<1) return this.$message.warning('请指派人员');
          const auxiliaryPersonnels = []
          const productionPersonnels = []
          this.$confirm('是否确定派工?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.productionPersonnel.data.map(res => {
                  productionPersonnels.push(
                      {
                          staffId: res.staff.staffId,
                          staffName: res.staff.name
                      }
                  )
              })
              this.auxiliaryPersonnel.data.map(res => {
                  auxiliaryPersonnels.push(
                      {
                          staffId: res.staff.staffId,
                          staffName: res.staff.name
                      }
                  )
              })
              const sendData = {
                  auxiliaryPersonnels: auxiliaryPersonnels,
                  productionPersonnels: productionPersonnels,
                  jobOrderBos: JSON.parse(this.$route.query.ids),
                  workingProcedureCode: this.$route.query.workingProcedureCode
              }
              operationJobWorkReportStaff(sendData).then(res => {
                  this.$message.success('派工完成');
                  this.$router.go(-1)
              })
          }).catch(() => {
          });
      },
      setPersonnelData(rpsdata) { // 接收新增人员弹框传回来的人员list及新增的人员id list
          this.dialogTablsdx = false;
          let sendIds = []; // 人员id集合
          let sendArr = []; // 人员id集合
          rpsdata.forEach((data,index) => {
              if(this.selectidEd.indexOf(data.staff.staffId) != -1){ // 之前已加的人员在list中去掉

              }else{
                  sendIds.push(data.staff.staffId) // 之前已加的人员加到list 方便后期再加比对
                  sendArr.push(data)
              }
          })
          if(this.personnelSign) {
              this.productionPersonnel.data = [...this.productionPersonnel.data,...sendArr]
              this.productionPersonnel.selectidEd = [...this.productionPersonnel.selectidEd, ...sendIds]
          }else{
              this.auxiliaryPersonnel.data = [...this.auxiliaryPersonnel.data,...sendArr]
              this.auxiliaryPersonnel.selectidEd = [...this.auxiliaryPersonnel.selectidEd, ...sendIds]
          }
      },
      addPersonnel(sign) { // 打开新增人员弹框并把已有人员id list传过去方便校验查重
          this.$nextTick(()=>{
              this.$refs['selectTable'].clearSelect()
          })
          if(sign){
              this.dialogTablsdx = true;
              this.personnelSign = true
              this.$set(this, 'selectidEd', this.productionPersonnel.selectidEd)
          }else{
              this.dialogTablsdx = true;
              this.personnelSign = false
              this.$set(this, 'selectidEd', this.auxiliaryPersonnel.selectidEd)
          }
      },
      deletePersonnel(data, index, sign) {
          if(sign) {
              this.productionPersonnel.data.splice(index,1)
              this.productionPersonnel.selectidEd.splice(index, 1)
          }else {
              this.auxiliaryPersonnel.data.splice(index, 1)
              this.auxiliaryPersonnel.selectidEd.splice(index, 1)
          }
      },
      closedialogTablsdx() {
          this.dialogTablsdx = false
      }
  },
};
</script>

<style scoped lang="scss">
.bosms_box{
    height: 100%;
    padding-bottom: 30px;
    .box_5x{
        height: calc(50% - 20px);
        .box-card{
            height: 100%;
        }
    }
    .bottom_btn{
        margin-top: 5px;
        margin-right: 10px;
    }
}
.clearfix > el-button {
  color: #b0b1b3;
}
.top_op {
  margin-top: 15px;
}
.optio {
  display: flex;
}

.optio > .optio_one {
  width: 250px;
}
.col {
  color: #fa5555;
   border: none;
}

</style>
