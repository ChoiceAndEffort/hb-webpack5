<!-- 新增涂装用量配置 -->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogShow"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form :model="tableDataForm" ref="tableDataForm" style="width: 100%">
        <el-form-item style="width: 100%">
          <TableBody
            :data="tableDataForm.tableData"
            :colConfig="colConfig"
          >
            <template #materialName="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.materialName`"
                :rules="coatingEdit.materialName"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.materialName"></el-input>
              </el-form-item>
            </template>
            <template #dryFilmThickness="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.dryFilmThickness`"
                :rules="coatingEdit.dryFilmThickness"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.dryFilmThickness"></el-input>
              </el-form-item>
            </template>
            <template #solidContent="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.solidContent`"
                :rules="coatingEdit.solidContent"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.solidContent"></el-input>
              </el-form-item>
            </template>
            <template #specificGravity="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.specificGravity`"
                :rules="coatingEdit.specificGravity"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.specificGravity"></el-input>
              </el-form-item>
            </template>
            <template #spreadingRate="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.spreadingRate`"
                :rules="[...coatingEdit.spreadingRate,{ validator: spreadingRate, trigger: 'blur'}]"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.spreadingRate"></el-input>
              </el-form-item>
            </template>
            <template #lossCoefficient="{scope}">
              <el-form-item
                :prop="`tableData.${scope.$index}.lossCoefficient`"
                :rules="[...coatingEdit.lossCoefficient,{ validator: lossCoefficient, trigger: 'blur'}]"
              >
                <el-input :disabled="!scope.row.disabled" v-model="scope.row.lossCoefficient"></el-input>
              </el-form-item>
            </template>
          </TableBody>
        </el-form-item>
      </el-form>
      <div class="add" @click="addData"><span>+</span>添加</div>
      <div class="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onSubmit('tableDataForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { coatingEdit } from "@/utils/productionManagement/valid";
import { TableBody } from "gggj_lib";
export default {
  components: {
    TableBody
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    colConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let spreadingRate = (rule, value, callback) => {
      value === 0 ? callback(new Error('输入值不能为0')) : callback()
    }
    let lossCoefficient = (rule, value, callback) => {
      value === 0 ? callback(new Error('输入值不能为0')) : callback()
    }
    return {
      spreadingRate,
      lossCoefficient,
      tableDataForm: {
        tableData: [],
      },
      coatingEdit, // 验证规则
    };
  },
  created() {
  },
  mounted() {},
  methods: {
    //保存
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.tableDataForm.tableData))
          temp.length && temp.forEach(item => {
            item.disabled = false
          })
          this.$emit('handle-data',temp)
          this.close()
        }
      });
    },
    //取消
    close() {
      this.tableDataForm.tableData = []
      this.$emit('update:dialogShow', false)
    },
    //新增
    addData() {
      let temp = {}
      this.colConfig.forEach(item => {
        temp[item.slot] = ""
      })
      temp.disabled = true
      this.tableDataForm.tableData.push(temp);
    },
  },
  watch: {
    tableData: {
      handler(newValue) {
        newValue.length ? this.tableDataForm.tableData = newValue : []
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .el-form-item {
  .el-form-item__content {
    margin-left: 0 !important;
  }
  .el-form-item,
  .is-error,
  .is-required {
    padding: 20px 0;
  }
}
.add {
  height: 36px;
  border: 1px dotted #e4e7ed;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}
.footer {
  text-align: right;
  margin-top: 20px;
  .el-form .el-form-item {
    width: 100% !important;
  }
}
</style>
