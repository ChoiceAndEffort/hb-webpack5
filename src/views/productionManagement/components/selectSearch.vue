<template>
  <div v-bind="$attrs" class="search">
    <el-row type="flex" align="middle" class="search-container">
      <!-- 项目下拉框 -->
      <el-col :xl="6" :md="8" class="search-item">
        <span>项目名称：</span>
        <el-select
          ref="selectProject"
          filterable
          clearable
          v-model="searchobj.engineeringProjectId"
          placeholder="请选择项目"
          @change="firstInputRequest"
          @clear="() => this.$emit('return-title', this.returnTitle())"
        >
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.name"
            :value="item.engineeringProjectId"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 联段下拉框 -->
      <el-col :xl="6" :md="8" class="search-item">
        <span>项目联段：</span>
        <el-select
          ref="selectCoupling"
          v-model="searchobj.couplingId"
          clearable
          filterable
          placeholder="请选择联段"
          @change="secondInputRequest"
          @clear="() => this.$emit('return-title', this.returnTitle())"
        >
          <el-option
            v-for="item in couplingList"
            :key="item.value"
            :label="item.name"
            :value="item.couplingId"
          ></el-option>
        </el-select>
      </el-col>
      <!-- 工序下拉框 -->
      <el-col :xl="6" :md="8" class="search-item">
        <span v-if="selectNumber >= 3">项目工序：</span>
        <el-cascader
          ref="selectProcedure"
          v-if="selectNumber >= 3"
          :key="isResouceShow"
          v-model="searchobj.procedureIds"
          clearable
          :options="procedureList"
          :props="propsConfig"
          @change="handleProcedureConfirm"
          placeholder="请选择工序"
          @clear="() => this.$emit('return-title', this.returnTitle())"
        >
        </el-cascader>
      </el-col>
      <template v-if="extend">
        <slot></slot>
      </template>
      <!-- 插槽 -->
      <el-col
        :xl="{ span: 6, offset: xlOffset }"
        :lg="{ span: 8, offset: lgOffset }"
        :class="['search-operation', extend ? '' : 'not-margin']"
      >
        <slot name="rest"></slot>
        <slot name="btn" :searchObj="searchobj"></slot>
        <el-button v-if="isExtend" type="text" @click="handleExtend">
          {{ extend ? "收起" : "展开" }}
          <i :class="[extend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
} from "@/api/productionManagement/project.js";
export default {
  name: "selectSearch",
  props: {
    xlOffset: {
      type: Number,
      default: 0,
    },
    lgOffset: {
      type: Number,
      default: 0,
    },
    isExtend: {
      type: Boolean,
      default: false,
    },
    selectNumber: {
      type: Number,
      default: 3,
    },
  },
  created() {
    // 初始化 获取项目列表
    this.initRequest();
  },
  data() {
    return {
      searchobj: {
        engineeringProjectId: "", // 项目id
        couplingId: "", // 联段id
        procedureId: "", // 工序id
        procedureIds: "",
        workingProcedureCode: "", // 工序编码
      },
      projectList: [], // 项目
      couplingList: [], // 联段框
      procedureList: [], // 工序框
      extend: false, // 是否展开
      // 级联选择器配置
      propsConfig: {
        value: "projectWorkingProcedureId",
        label: "name",
        expandTrigger: "hover",
      },
      isResouceShow: 0, // 工序级联选择框唯一标识
    };
  },
  methods: {
    // 获取项目列表
    async initRequest() {
      let res;
      try {
        res = await getEngineeringProjectList({ status: 1 });
        this.projectList = res.data;
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    // 获取联段
    async firstInputRequest() {
      let res;
      // 清空联段 工序
      this.searchobj.couplingId = "";
      this.searchobj.procedureId = "";
      this.couplingList = [];
      this.procedureList = [];
      try {
        if (this.searchobj.engineeringProjectId) {
          res = await getCouplinglist({
            engineeringProjectId: this.searchobj.engineeringProjectId,
          });
          this.couplingList = res.data;
          this.$emit("return-title", this.returnTitle());
          this.$emit("reset-page");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    // 获取工序
    async secondInputRequest(item) {
      let res;
      // 清空工序
      this.searchobj.procedureId = "";
      this.procedureList = [];
      try {
        res = await getProcedureList({
          id: this.searchobj.couplingId,
        });
        this.procedureList = res.data;
        if (this.selectNumber === 2 && this.procedureList.length) {
          this.searchobj.procedureId = item
        }
        this.procedureList.forEach((item) => {
          if (item.children.length === 0) {
            this.$delete(item, "children");
          }
        });
        this.$emit("return-title", this.returnTitle());
        this.$emit("reset-page");
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      if (!value.length) return;
      let index, indexs, temp;
      this.searchobj.procedureId = value[value.length - 1];
      index = this.procedureList.findIndex(
        (item) => item.projectWorkingProcedureId === value[0]
      );
      if (value.length > 1) {
        indexs = this.procedureList[index].children.findIndex(
          (item) => item.projectWorkingProcedureId === value[value.length - 1]
        );
      }
      temp =
        value.length > 1
          ? this.procedureList[index].children[indexs]
          : this.procedureList[index];
      this.searchobj.workingProcedureCode = temp.workingProcedureCode;
      this.$emit("procedure-change", temp);
      this.$emit("return-title", this.returnTitle());
      this.$emit("reset-page");
    },
    // 返回下拉框搜索值
    returnSelectObj() {
      return this.searchobj;
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      let title, value1, value2, value3;
      title = value1 = value2 = value3 = "";
      let node1 = this.projectList.find(
        (item) =>
          item.engineeringProjectId === this.searchobj.engineeringProjectId
      );
      let node2 = this.couplingList.find(
        (item) => item.couplingId === this.searchobj.couplingId
      );
      let node3 = this.procedureList.find(
        (item) => item.projectWorkingProcedureId === this.searchobj.procedureId
      );
      if (!node3) {
        this.procedureList.forEach((item) => {
          if (item.children) {
            let index = item.children.findIndex(
              (item) =>
                item.projectWorkingProcedureId === this.searchobj.procedureId
            );
            index !== -1 && (node3 = item);
          }
        });
      }
      value1 = node1 ? node1.name : "";
      value2 = node2 ? node2.name : "";
      value3 = this.selectNumber === 3 ? (node3 ? node3.name : "") : "";
      title = `${value1}${value2 ? "-" + value2 : ""}${
        value3 ? "-" + value3 : ""
      }`;
      return title;
    },
    // 清空重置
    reset() {
      this.searchobj = {
        engineeringProjectId: "",
        couplingId: "",
        procedureId: "",
      };
    },
    // 展开事件
    handleExtend() {
      this.extend = !this.extend;
    },
  },
  watch: {
    procedureList: {
      handler(newValue) {
        if (newValue.length === 0) {
          ++this.isResouceShow;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  background-color: #fff;
  padding: 16px 16px 0;
  width: 100%;
  font-size: 14px;
  ::v-deep .search-container {
    display: flex;
    flex-wrap: wrap;
    > div {
      min-height: 32px;
      display: flex;
      margin-bottom: 16px;
      padding: 0 16px;
      span {
        display: inline-flex;
        flex: 0 0 130px;
        align-items: center;
        justify-content: flex-end;
      }
      > div {
        width: 100%;
      }
    }
    .search-operation {
      display: flex;
      justify-content: flex-end;
    }
    .not-margin {
      margin-left: 0;
    }
  }
}
</style>