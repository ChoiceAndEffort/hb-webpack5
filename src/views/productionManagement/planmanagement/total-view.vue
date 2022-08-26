<!--汇总审批查看-->
<template>
  <div class="main">
    <!-- 流程进度 -->
    <div class="basicData">
      <p class="title">流程进度</p>
      <el-divider></el-divider>
      <el-steps :active="1">
        <el-step title="计调主管审批">
          <template slot="description">
            <p>丰青凝</p>
            <p>2021.08.21 12:32</p>
          </template>
        </el-step>
        <el-step title="生产部长审批"></el-step>
        <el-step title="分管副总审批"></el-step>
        <el-step title="总经理审批"></el-step>
      </el-steps>
    </div>
    <!-- 计划列表 -->
    <div class="planlist">
      <p class="title">计划列表</p>
      <el-divider></el-divider>
      <div class="list_table">
        <TableBody :colConfig="colConfig1" :data="data1.data">
          <template slot="rate" slot-scope="{ scope }">
            <el-rate
              v-model="scope.row.importance"
              disabled
              text-color="#ff9900"
              score-template="{value}"
              :max="1"
              v-if="scope.row.importance === 1"
            >
            </el-rate>
            <div v-else>-</div>
          </template>
          <template slot="state" slot-scope="{ scope }">
            <div class="status">
              <span
                class="doc"
                :class="{
                  reddoc: scope.row.state === '未完成',
                  orangedoc: scope.row.state === '延期完成',
                }"
              ></span
              >{{ scope.row.state }}
            </div>
          </template>
          <template slot="btn" slot-scope="{ scope }">
            <el-button size="mini" type="text" @click="handleView(scope.row)"
              >编辑</el-button
            >
          </template>
        </TableBody>
      </div>
    </div>
    <!-- 审批记录和修改记录 -->
    <div class="periodInfo">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="审批记录" name="first">
          <TableBody :colConfig="colConfig2" :data="data2.data">
            <template slot="result" slot-scope="{ scope }">
              <div class="result1">
                <span
                  class="doc"
                  :class="{
                    reddoc: scope.row.result === '驳回',
                  }"
                ></span
                >{{ scope.row.result }}
              </div>
            </template>
          </TableBody>
        </el-tab-pane>
        <el-tab-pane label="修改记录" name="second">
          <TableBody :colConfig="colConfig3" :data="data3.data">
            <template slot="result" slot-scope="{ scope }">
              <div class="result1">
                <span
                  class="doc"
                  :class="{
                    reddoc: scope.row.result === '驳回',
                  }"
                ></span
                >{{ scope.row.result }}
              </div>
              <div
                class="status status-02"
                v-if="scope.row.age == 1"
                @click="setTechnology(scope.row)"
              >
                <span class="dot greet"></span>成功
              </div>
            </template>
          </TableBody>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 底部的驳回和确定 -->
    <div class="footer">
      <span class="reject" @click="reject">驳回</span>
      <span class="agree" @click="agree">同意</span>
    </div>
    <!-- 驳回弹框 -->
    <div class="mask">
      <el-dialog
        title="驳回原因"
        :visible.sync="dialogVisible1"
        :before-close="handleClose"
      >
        <textarea
          cols="30"
          rows="10"
          placeholder="请输入驳回原因"
          v-model="textarea"
        ></textarea>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 操作编辑弹框 -->
    <div class="mask_edit">
      <el-dialog
        title="修改计划"
        :visible.sync="dialogVisible2"
        :before-close="handleClose"
      >
        <div class="plan_content">
          <p>计划内容：</p>
          <input type="text" placeholder="L联主桥下节点封板零件加工图" />
        </div>
        <div class="plan_time">
          <div class="plan_content">
            <p>计划完成时间：</p>
            <el-date-picker v-model="value2" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="remarks">
          <p>备注：</p>
          <textarea
            cols="30"
            rows="10"
            placeholder="-"
            v-model="textarea"
          ></textarea>
        </div>
        <div class="importance">
          <p>重要程度：</p>
          <div class="block">
            <el-rate v-model="value1" :max="1"></el-rate>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { TableBody, Pagination } from "gggj_lib";
export default {
  components: { TableBody, Pagination },
  data() {
    return {
      activeName: "first",
      /* 第一个表格样式 */
      colConfig1: [
        {
          attrs: { label: "序号", type: "index", align: "left" },
        },
        {
          attrs: { label: "计划内容", prop: "plancontent", align: "left" },
        },
        {
          attrs: { label: "计划完成时间", prop: "time", align: "left" },
        },
        {
          slot: "rate",
          attrs: { label: "重要程度", prop: "importance", align: "center" },
        },
        {
          attrs: { label: "责任单位", prop: "responsibleunit", align: "left" },
        },
        {
          attrs: { label: "责任人", prop: "personliable", align: "left" },
        },
        {
          attrs: { label: "备注", prop: "remarks", align: "left" },
        },
        {
          slot: "state",
          attrs: { label: "状态", prop: "state", align: "left" },
        },
        {
          slot: "btn",
          attrs: {
            label: "操作",
            width: "200px",
            align: "center",
          },
        },
      ],
      /* 第一个表格数据 */
      data1: {
        data: [
          {
            plancontent: "L联主桥下节点封板零件加工",
            time: "2021.08.25",
            importance: 0,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "已完成",
          },
          {
            plancontent: "L联主桥下节点封板零件加工",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "未完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
          {
            plancontent: "L联主桥",
            time: "2021.08.25",
            importance: 1,
            responsibleunit: "技术研发部",
            personliable: "丰青凝",
            remarks: "-",
            state: "延期完成",
          },
        ],
      },
      /* 第二个表格样式 */
      colConfig2: [
        {
          attrs: { label: "操作类型", prop: "type", align: "left" },
        },
        {
          attrs: { label: "操作人", prop: "person", align: "left" },
        },
        {
          slot: "result",
          attrs: { label: "执行结果", prop: "result", align: "left" },
        },
        {
          attrs: { label: "操作时间", prop: "time", align: "left" },
        },
        {
          attrs: { label: "备注", prop: "beizhu", align: "left" },
        },
      ],
      /* 第二个表格数据 */
      data2: {
        data: [
          {
            type: "计调主管审批",
            person: "丰青凝",
            result: "成功",
            time: "2021.08.21 12:32",
            beizhu: "-",
          },
          {
            type: "计调主管审批",
            person: "丰青凝",
            result: "驳回",
            time: "2021.08.21 12:32",
            beizhu: "不通过原因",
          },
        ],
      },
      /* 第三个表格样式 */
      colConfig3: [
        {
          attrs: { label: "操作类型", prop: "type", align: "left" },
        },
        {
          attrs: { label: "操作人", prop: "person", align: "left" },
        },
        {
          slot: "result",
          attrs: { label: "执行结果", prop: "result", align: "left" },
        },
        {
          attrs: { label: "操作时间", prop: "time", align: "left" },
        },
        {
          attrs: { label: "备注", prop: "beizhu", align: "left" },
        },
      ],
      /* 第三个表格数据 */
      data3: {
        data: [
          {
            type: "计调主管审批",
            person: "丰青凝",
            result: "成功",
            time: "2021.08.21 12:32",
            beizhu: "-",
          },
          {
            type: "计调主管审批",
            person: "丰青凝",
            result: "驳回",
            time: "2021.08.21 12:32",
            beizhu: "不通过原因",
          },
        ],
      },
      /* 驳回弹框 */
      dialogVisible1: false,
      /* 驳回内容 */
      textarea: "",
      /* 操作编辑弹框 */
      dialogVisible2: false,
      value1: null,
      /* 计划完成时间 */
      value2: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    handleClick(tab, event) {
    },
    /* 编辑 */
    handleView(row) {
      this.dialogVisible2 = true;
    },
    /* 驳回 */
    reject() {
      this.dialogVisible1 = true;
    },
    /* 同意 */
    agree() {
    },
    /* 点击到弹框外面的情况 */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    /* 确认 */
    confirm() {
      this.dialogVisible1 = false;
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
  ::v-deep .el-steps {
    padding: 32px;
    span {
      margin-right: 10px;
    }
  }
  ::v-deep .el-step__title.is-finish {
    color: #606266;
  }
  /* 流程进度 计划列表 审批记录和修改记录 公共样式 */
  .basicData,
  .planlist,
  .periodInfo {
    background: #fff;
    width: 100%;
    .title {
      font-size: 14px;
      color: #606266;
      line-height: 52px;
      margin: 0 16px;
      font-weight: 700;
    }
  }
  /* 流程进度 */
  .basicData {
    flex: 0 0 199px;
    box-sizing: border-box;
  }
  /* 计划列表 */
  .planlist {
    flex: 0 0 380px;
    box-sizing: border-box;
    overflow: hidden;
    .list_table {
      height: 100%;
      box-sizing: border-box;
      padding: 16px;
      overflow: auto;
      .status {
        display: flex;
        align-items: center;
      }
      ::v-deep .el-rate__icon {
        margin-left: 6px;
      }
      /* 单行溢出隐藏 */
      ::v-deep .el-table__body-wrapper {
        .el-table__row {
          td:nth-child(2) {
            .cell {
              overflow: hidden;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              -webkit-text-overflow: ellipsis;
              -moz-text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  /* 审批记录和修改记录 */
  .periodInfo {
    flex: 1;
    .el-tabs {
      padding-bottom: 16px;
      ::v-deep .el-tabs__header {
        .el-tabs__nav-scroll {
          padding: 10px 16px 0px 16px;
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
        }
      }
      ::v-deep .el-tabs__content {
        padding: 0px 16px;
      }
    }
    .result1 {
      display: flex;
      align-items: center;
    }
  }
  /* 上边距 */
  .planlist,
  .periodInfo {
    margin-top: 8px;
  }

  /* 基础蓝点 */
  .doc {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #52c41a;
    margin-right: 6px;
  }
  /* 红点 */
  .reddoc {
    background-color: #fa5555;
  }
  /* 橙点 */
  .orangedoc {
    background-color: #fa8e55;
  }
  .footer {
    box-sizing: border-box;
    width: calc(100% - 142px);
    position: fixed;
    bottom: 0;
    left: 142px;
    height: 50px;
    background-color: #ffffff;
    box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
    span {
      cursor: pointer;
      text-align: center;
      width: 58px;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      -moz-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }
    .agree {
      margin-left: 16px;
      background: #0486fe;
      border-radius: 2px;
      border: 1px solid #0486fe;
      color: #ffffff;
    }
  }
  .mask {
    ::v-deep .el-dialog {
      margin-top: 35vh !important;
      width: 411px;
      .el-dialog__header {
        display: flex;
        padding: 16px;
        align-items: center;
        border: 1px solid #e4e7ed;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }
    }
    ::v-deep .el-dialog__body {
      padding: 23px 16px;
    }
    textarea {
      width: 100%;
      height: 96px;
      padding: 6px 15px;
      box-sizing: border-box;
      resize: none;
      outline: none;
      background-color: #ffffff;
      border-radius: 2px;
      border: 1px solid #ebeef5;
      font-size: 14px;
    }
    textarea::-webkit-input-placeholder {
      color: #c0c4cc;
      font-weight: 400;
      font-size: 14px;
    }
  }
  /* 操作编辑弹框样式 */
  .mask_edit {
    ::v-deep .el-dialog {
      margin-top: 20vh !important;
      width: 411px;
      .el-dialog__header {
        display: flex;
        padding: 16px;
        align-items: center;
        border: 1px solid #e4e7ed;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }
    }
    ::v-deep .el-dialog__body {
      padding: 23px 16px;
    }
    textarea {
      width: 100%;
      height: 96px;
      padding: 6px 15px;
      box-sizing: border-box;
      resize: none;
      outline: none;
      background-color: #ffffff;
      border-radius: 2px;
      border: 1px solid #ebeef5;
      font-size: 14px;
    }
    textarea::-webkit-input-placeholder {
      color: #c0c4cc;
      font-weight: 400;
      font-size: 14px;
    }
    .plan_content,
    .plan_time,
    .remarks,
    .importance {
      p {
        line-height: 36px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
      }
    }
    .plan_content {
      input {
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #ebeef5;
        padding: 0 15px;
        outline: none;
      }
    }
    .plan_time {
      .el-input {
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        ::v-deep input {
          width: 100%;
          height: 32px;
          background-color: #ffffff;
          border-radius: 2px;
          border: 1px solid #ebeef5;
        }
        ::v-deep .el-input__icon {
          line-height: 32px;
        }
      }
    }
  }
}
</style>
