<!--项目列表-->
<template>
  <div class="project gggj_style">
    <div class="searchBar">
      <Form
        ref="accountForm"
        formName="accountForm"
        width="auto"
        :inline="true"
        primary="primary"
        size="small"
        submitContext="查询"
        :renderData="prefabricationData"
        @handleSubmit="handleSubmit"
        @handle-reset="handleReset"
      >
      </Form>
    </div>
    <div class="projectList">
      <div class="nav">
        <p>项目列表</p>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addProject"
          size="small"
          >新增项目</el-button
        >
      </div>
      <TableBody
        :colConfig="colConfig"
        :data="data.data"
        @expand-change="expandChange"
        v-loading="loading"
      >
        <template slot="addTime" slot-scope="{ scope }">
          {{ scope.row.addTime | shorttime }}
        </template>
        <template slot="type" slot-scope="{ scope }">
          {{ scope.row.type == 1 ? "桥梁" : "风电" }}
        </template>
        <template slot="name" slot-scope="{ scope }">
          <span class="projectName" @click="addProject(scope.row)">{{
            scope.row.name
          }}</span>
        </template>
        <template slot="isStaffed" slot-scope="{ scope }">
          <div class="status-01" @click="setTechnology(1, scope.row)">配置</div>
        </template>

        <template slot="expand" slot-scope="{ scope }">
          <el-table
            :data="data.data[scope.$index].segmentList"
            class="two-list"
            :header-row-class-name="headerClass"
          >
            <el-table-column
              prop="name"
              :label="`${
                data.data[scope.$index].type == 1 ? '联段' : '机型'
              }名称`"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="number"
              :label="`${
                data.data[scope.$index].type == 1 ? '联段' : '机型'
              }编号`"
              align="center"
            ></el-table-column>
            <el-table-column
              v-if="data.data[scope.$index].type == 2"
              prop="cover"
              label="机型数量(套)"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="totalWeight"
              :label="`${
                data.data[scope.$index].type == 1 ? '联段' : '机型'
              }重量(千克)`"
              align="center"
            ></el-table-column>
            <el-table-column prop="education" label="工艺配置" align="center">
              <template slot-scope="state">
                <div
                  class="status-01"
                  @click="
                    setTechnology(
                      2,
                      state.row,
                      data.data[scope.$index].type
                    )
                  "
                >
                  配置
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="education" label="" align="center">
              <template>
                <div></div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </TableBody>
      <Pagination :data="data" @changePage="changePage" />
    </div>
    <!-- <router-link to="/project/project-float"></router-link> -->
  </div>
</template>

<script>
import { getProjectpage, getCouplinglist } from "@/api/productionManagement/project.js";
import { TableBody, Pagination, Form } from "gggj_lib";
import projectfloat from "./project-float.vue";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
export default {
  components: { TableBody, Pagination, Form },
  data() {
    return {
      headerClass: "table-header-gray",
      prefabricationData: [
        {
          tag: "el-input",
          attrs: {
            label: "项目编号：",
            key: "number",
            type: "text",
            clearable: true,
            value: "",
            placeholder: "请输入项目编号",
          },
        },
        {
          tag: "el-input",
          attrs: {
            label: "项目名称：",
            key: "name",
            type: "text",
            clearable: true,
            value: "",
            placeholder: "请输入项目名称",
          },
        },
        {
          tag: "el-date-picker",
          attrs: {
            label: "时间：",
            key: "dateTime",
            type: "daterange",
            value: [],
            "value-format": "yyyy-MM-dd",
            "range-separator": "-",
            "start-placeholder": "开始日期",
            "end-placeholder": "结束日期",
            class: "date-picker",
          },
        },
        {
          tag: "el-select",
          attrs: {
            key: "type",
            type: "text",
            label: "项目类型：",
            value: "",
            options: [
              {
                value: 1,
                label: "桥梁",
              },
              {
                value: 2,
                label: "风电",
              },
            ],
            value: "",
            placeholder: "请选择项目类型",
            "show-password": true,
          },
        },
        {
          tag: "reset", // 重置按钮
        },
        {
          tag: "submit", // 提交按钮
        },
      ],
      searchobj: {
        number: "",
        name: "",
        dateTime: [],
        type: "",
      },
      colConfig: [
        {
          slot: "expand",
          attrs: {
            prop: "children",
            align: "center",
            type: "expand",
          },
        },
        {
          slot: "addTime",
          attrs: {
            label: "录入时间",
            prop: "addTime",
            align: "center",
          },
        },
        {
          slot: "name",
          attrs: { label: "项目名称", prop: "name", align: "center" },
        },
        {
          slot: "type",
          attrs: {
            label: "项目类型",
            prop: "type",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目编号",
            prop: "number",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目重量(千克)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          slot: "isStaffed",
          attrs: {
            label: "人员配置",
            prop: "isStaffed",
            align: "center",
            // width: 200,
          },
        },
      ],
      data: {
        total: 0,
        size: 10,
        page: 0,
        lastPage: 0,
        totalPages: 2,
        first: true,
        last: true,
        data: [],
        dataId: [],
        segmentList: [],
      },
      loading: false,
    };
  },
  activated() {
    this.getProject();
  },
  created() {
    this.getProject();
  },
  mounted() {},
  methods: {
    // 搜索
    handleSubmit(model) {
      console.log(model);
      this.searchobj = model;
      this.getProject();
    },
    handleReset() {
        console.log("resst")
      this.searchobj = { number: "", name: "", dateTime: [], type: "" };
    },
    getFilterList(val) {
      this.getProject();
    },
    //分页
    changePage(e) {
      this.data.page = e;
      this.getProject();
    },
    //新增和修改项目
    addProject(row) {
      // console.log(row, 444)
      if (row.engineeringProjectId) {
        this.$router.push({
          name: "project-edit",
          query: {
            id: row.engineeringProjectId,
            type: row.type,
          },
        });
      } else {
        this.$router.push({
          name: "project-add",
          query: {},
        });
      }
    },
    //配置工艺定额
    setTechnology(sign, row, type) {
      // console.log(type);
      switch (sign) {
        case 1:
          this.$router.push({
            name: "configurator-people",
            query: {
              engineeringProjectId: row.engineeringProjectId,
            },
          });
          break;
        case 2:
          this.$router.push({
            name: "technology-set",
            query: {
              engineeringProjectId: row.engineeringProjectId,
              couplingId: row.couplingId,
              type: type,
            },
          });
          break;
      }
    },
    //初始化列表
    getProject() {
        // console.log(this.searchobj,"11")
      let _this = this;
      this.loading = true;
      getProjectpage({
        ...this.searchobj,
        page: this.data.page,
        size: this.data.size,
        status: 1,
        enterpriseId:enterpriseId
        
      })
        .then((res) => {
          setTimeout(function () {
            _this.loading = false;
          }, 1000);
          if (res.code === 0) {
            this.data.data = res.data.data;
            res.data.data.map((res, index) => {
              this.data.dataId.push(res.engineeringProjectId);
              this.data.data[index].segmentList = [];
            });
            this.data.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //展开(第一个参数表示当前点击行的数据，第二个参数表示已展开的行的数据)
    expandChange(expandedRows, expanded) {
      let _this = this;
      this.loading = true;
      const idIndex = expandedRows.index;
      getCouplinglist({
        engineeringProjectId: expandedRows.engineeringProjectId,
      })
        .then((res) => {
          if (res.code === 0) {
            this.data.data[idIndex].segmentList.splice(
              0,
              this.data.data[idIndex].segmentList.length
            );
            // setTimeout(function () {
            //   _this.loading = false;
            // }, 1000);
            res.data.forEach((list) => {
              this.data.data[idIndex].segmentList.push(list);
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.project {
  display: flex;
  flex-direction: column;
  height: 100%;
  .two-list {
    padding-left: 42px;
  }
  .searchBar {
    background-color: #fff;
    padding: 16px;
  }
  .projectList {
    flex: 1;
    .projectName {
      color: #1677ff;
      cursor: pointer;
    }
    margin-top: 8px;
    background-color: #fff;
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 21px 16px;
      p {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
  .dot {
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .status-01 {
    color: #1989fa;
    s .dot {
      background: #fa8e55;
    }
  }
  .status-02 {
    color: #1677ff;
    .dot {
      background: #1677ff;
    }
  }
  ::v-deep .el-form {
    .date-picker {
      .el-form-item__label-wrap {
        margin-left: 0 !important;
      }
    }
    .el-form-item {
      margin-right: 24px;
      margin-bottom: 0;
      &:nth-child(4) {
        margin-right: 8px;
      }
    }
  }
}
</style>
