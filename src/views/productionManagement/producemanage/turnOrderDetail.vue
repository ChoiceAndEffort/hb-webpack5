<template>
  <div>
    <el-row>
      <el-col class="part">
        <div>转序列表</div>
        <TableBody :data="outputTData"
          :colConfig="colConfig"
          :max-height="330">
          <template slot="serial"
            slot-scope="{ scope }">
            <span>{{doubleDigit(scope.$index)}}</span>
          </template>
        </TableBody>
      </el-col>
      <el-col class="part">
        <div>转序操作</div>
        <el-form ref="formDom"
          :model="form"
          label-width="80px"
          label-position="top"
          :inline="true"
          :rules="addprojectRules">
          <el-form-item label="转序单号"
            prop="orderNumber">
            <el-input v-model="form.orderNumber"
              disabled></el-input>
          </el-form-item>
          <el-form-item label="转序日期"
            prop="orderTime">
            <!-- <el-input v-model="form.date"></el-input> -->
            <el-date-picker v-model="form.orderTime"
              type="date"
              :disabled="isReceive"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="转系方式"
            prop="zxMode">
            <el-select v-model="form.zxMode"
              :disabled="isReceive"
              placeholder="请选择转系方式"
              clearable>
              <el-option v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收单位"
            prop="targetWorkshopId">
            <!-- <el-input v-model="form.receiver"></el-input> -->
            <!-- <el-select v-model="form.targetWorkshopId"
              placeholder="请选择接收单位"
              clearable>
              <el-option v-for="item in receiverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <el-cascader :options="receiverOptions"
              ref="cascader"
              v-model="form.targetWorkshopId"
              :disabled="isReceive"></el-cascader>
          </el-form-item>
          <el-form-item label="接收位置"
            prop="acceptPlace">
            <el-input v-model="form.acceptPlace"
              :disabled="isReceive"></el-input>
          </el-form-item>
          <el-form-item label="是否加急"
            prop="isUrgent">
            <el-radio-group v-model="form.isUrgent"
              :disabled="isReceive">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="bottom">
      <el-button type="primary"
        @click="toConversionSection">{{isReceive?'确认接收':'确定'}}</el-button>
      <el-button @click="backTo">取消</el-button>
    </div>
  </div>
</template>
<script>
import { TableBody, Pagination } from 'gggj_lib';
import { conversionSection } from '@/utils/productionManagement/reportTableConfig'
import { getOrderNumber, generateOfSwitchOrderInfo, getDepartmentList, getDetailsOfSwitchOrderInfo, confirmOfSwitchOrderInfo } from '@/api/productionManagement/project'
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import { timeFormat, shortTime } from '@/utils/productionManagement/tool.js'
export default {
  components: {
    TableBody,
    Pagination
  },
  data() {
    return {
      colConfig: conversionSection.detail,
      outputTData: [],
      form: { orderNumber: '', orderTime: new Date(), zxMode: '', targetWorkshopId: '', acceptPlace: '', isUrgent: 0 },
      addprojectRules: {
        zxMode: [
          { required: true, message: '请选择转系方式', trigger: "change" }
        ],
        targetWorkshopId: [
          { required: true, message: '请选择接收单位', trigger: "change" }
        ],
        acceptPlace: [
          { required: true, message: '请填写接收位置', trigger: "blur", max: 99, }
        ],

      },
      options: [{
        value: 1,
        label: '汽车转序'
      }, {
        value: 2,
        label: '平车转序'
      }],
      receiverOptions: [],
      isReceive: false,
      receiveRow: {},
    }
  },
  mounted() {
    this.isReceive = this.$route.params.isReceive
    this.getDepartmentList()
    if (this.isReceive) {
      this.receiveRow = JSON.parse(this.$route.params.row);
      this.getReceiveData()

    } else {
      this.outputTData = JSON.parse(this.$route.params.selectList);
      this.getOrderNumber();//调用转序单号
    }
  },
  methods: {
    doubleDigit(num) {
      return num + 1 < 10 ? `0${num + 1}` : num + 1
    },
    backTo() {
      this.$router.go(-1);
    },
    getOrderNumber() {
      getOrderNumber().then((res) => {
        if (res.code == 0) {
          this.form.orderNumber = res.data;
          console.log(this.form.orderNumber, "888")
        }
      })


    },
    getDepartmentList() {
      let pramas = {
        enterpriseId: enterpriseId,
        status: 1,
        type: 1,
      }
      getDepartmentList(pramas).then((res) => {
        res.data.forEach((item) => {
          item.label = item.name;
          item.value = item.departmentId;
          if (item.children) {
            item.children.forEach((el) => {
              el.label = el.name;
              el.value = el.departmentId;
            });
          }
        });
        this.receiverOptions = res.data;
        console.log(this.form.orderNumber, "888")
      })
    },
    toConversionSection() {
      this.$confirm(`是否确认${this.isReceive ? '接收' : '转序'}？`).then(_ => {
        if (this.isReceive) {
          confirmOfSwitchOrderInfo({ orderInfoId: this.form.orderInfoId }).then((res) => {
            if (res.code == 0) {
              this.$message.success("接收成功!");
              this.$router.push({
                name: 'receive',
              });
            } else {
              this.$message.success(res.msg);
            }
          })
        } else {
          //转序
          this.$refs.formDom.validate((valid) => {
            if (valid) {
              let targetWorkshopName = this.$refs.cascader.getCheckedNodes()[0].pathLabels
              let switchGoodsInfo = this.outputTData.map(item => {
                let obj = {}
                obj.goodsInfoId = item.goodsInfoId;
                obj.switchAmount = item.switchAmount;
                return obj
              })
              let pramas = {
                acceptPlace: this.form.acceptPlace,
                isUrgent: this.form.isUrgent,
                orderNumber: this.form.orderNumber,
                orderTime: shortTime(timeFormat(this.form.orderTime)),
                switchGoodsInfo: switchGoodsInfo,
                targetWorkshopId: this.form.targetWorkshopId[this.form.targetWorkshopId.length - 1],
                targetWorkshopName: targetWorkshopName[targetWorkshopName.length - 1],
                zxMode: this.form.zxMode
              }
              console.log(pramas, "pramas")
              generateOfSwitchOrderInfo(pramas).then((res) => {
                if (res.code == 0) {
                  this.$message.success("转序成功!");
                  this.$router.push({
                    name: 'turnOrder',
                  });
                } else {
                  this.$message.error(res.msg);
                }
              })

            } else {
              this.$message.error('请检查输入框的值！');
              return false;
            }
          });
          console.log(this.form, "from")
        }


        done();
      }).catch(_ => { });

      return
    },
    getReceiveData() {
      console.log(this.receiveRow)
      let params = {
        workingProcedureCode: this.receiveRow.workingProcedureCode,
        orderInfoId: this.receiveRow.orderInfoId
      }
      getDetailsOfSwitchOrderInfo(params).then((res) => {
        if (res.code == 0) {
          this.outputTData = res.data.goodsInfoList;
          let obj = res.data.orderInfo;
          console.log((obj.targetPathId).split(','), "555")
          this.form = {
            orderNumber: obj.orderNumber,
            orderTime: obj.orderTime,
            zxMode: obj.zxMode,
            targetWorkshopId: (obj.targetPathId).split(','),
            acceptPlace: obj.acceptPlace,
            isUrgent: obj.isUrgent,
            orderInfoId: obj.orderInfoId
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.part {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 16px;
  overflow: hidden;
  > div {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  &:last-of-type {
    margin-bottom: 50px;
  }
}
::v-deep .el-form {
  overflow: hidden;
}
::v-deep.el-form-item {
  flex: 1;
  width: 30%;
  margin: 1.4%;
}
::v-deep .el-select,
.el-date-editor,
.el-cascader {
  width: 100%;
}
.bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 10px;

  background-color: #fff;
  width: calc(100% - 200px);
  overflow: hidden;
  box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
  button {
    float: right;
    margin-right: 10px;
  }
}
</style>