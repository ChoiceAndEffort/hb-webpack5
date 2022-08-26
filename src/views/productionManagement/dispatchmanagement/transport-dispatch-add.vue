<template>
  <div class="bosms_box">
    <div class="box_5x">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>起重工</span>
          <el-button style="float: right; padding: 7px 3px" icon="el-icon-plus"  @click="addPersonnel(1)">新增人员</el-button>
        </div>
        <!-- 表单 -->
        <div>
          <TableBody
            :colConfig="colConfig"
            :data="riggerList.data"
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
          <span>行车工</span>
          <el-button  style="float: right; padding: 7px 3px"  icon="el-icon-plus"  @click="addPersonnel(2)">新增人员</el-button>
        </div>
        <!-- 表单 -->
        <div>
          <TableBody
            :colConfig="colConfig"
            :data="craneDriverList.data"
            max-height="300px"
          >
            <template slot="isStaffed" slot-scope="{ scope }">
               <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, false)"></el-button>
            </template>
          </TableBody>
        </div>
      </el-card>
    </div>
      <div class="footer">
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="confirmDispatched">确定派工</el-button>
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
import {confirmDispatched, workOrderDistribution} from '@/api/productionManagement/dispatch.js'
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
                {
                    attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
                },
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
             {
                  attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
              },
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
          riggerList: {
            data: [],
            selectidEd: []
          },
          craneDriverList: {
            data: [],
            selectidEd: []
          },
        selectidEd: [],
        type: undefined, // 人员类型
    };
  },
  created() {},
  mounted() {},
  methods: {
      /**确认报工*/
      confirmDispatched() {
          if(this.riggerList.data.length<1 || this.craneDriverList.data.length<1) return this.$message.warning('请指派人员');
          const riggerListPersonnels = []
          const craneDriverListPersonnels = []
          this.$confirm('是否确定派工?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.riggerList.data.map(res => {
                // console.log(res, 88)
                  riggerListPersonnels.push(
                      {
                          staffId: res.staff.staffId,
                          staffName: res.staff.name
                      }
                  )
              })
              this.craneDriverList.data.map(res => {
                  craneDriverListPersonnels.push(
                      {
                          staffId: res.staff.staffId,
                          staffName: res.staff.name
                      }
                  )
              })
              let sendList = []
              let list = JSON.parse(this.$route.query.list)
              list.forEach(item => {
                sendList.push(
                  {
                    riggerList: riggerListPersonnels,
                    craneDriverList: craneDriverListPersonnels,
                    workReportOrderId: item.workReportOrderId,
                  }
                )
              })
              // console.log('确认派工'+sendList)
              confirmDispatched(sendList).then(res => {
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
          switch(this.type) {
            case 1: {
              this.riggerList.data = [...this.riggerList.data,...sendArr]
              this.riggerList.selectidEd = [...this.riggerList.selectidEd, ...sendIds]
            }; break;
            case 2: {
              this.craneDriverList.data = [...this.craneDriverList.data,...sendArr]
              this.craneDriverList.selectidEd = [...this.craneDriverList.selectidEd, ...sendIds]
            }; break;
          }
      },
      addPersonnel(type) { // 打开新增人员弹框并把已有人员id list传过去方便校验查重
          this.$nextTick(()=>{
              this.$refs['selectTable'] && this.$refs['selectTable'].clearSelect()
          })
          this.dialogTablsdx = true;
          this.type = type
      },
      deletePersonnel(data, index, sign) {
          if(sign) {
              this.riggerList.data.splice(index,1)
              this.riggerList.selectidEd.splice(index, 1)
          }else {
              this.craneDriverList.data.splice(index, 1)
              this.craneDriverList.selectidEd.splice(index, 1)
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

.footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  padding: 8px 16px;
  box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
  z-index: 999;
  .el-button--default {
    background-color: transparent !important;
  }
}
</style>
