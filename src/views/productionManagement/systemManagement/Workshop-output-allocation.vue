<template>
  <div class="wrap">
    <div class="header">
      <span>项目列表</span>
      <el-input placeholder="请输入项目名称"
        v-model="searchValue">
        <i slot="suffix"
          class="el-input__icon el-icon-search"
          @click="handleSearch"></i>
      </el-input>
    </div>
    <div class="content">
      <TableBody v-loading="loading"
        :colConfig="colConfig"
        :data="tableData.list"
        @expand-change='handleExpand'>
        <template slot="expand"
          slot-scope="{ scope }">
          <TableBody v-loading='loadingChild'
            :colConfig='colConfigChild'
            :data='scope.row.children'>
            <template slot="btn"
              slot-scope="{ scope }">
              <el-button type="text"
                @click="handleBtn(scope)">配置</el-button>
            </template>
          </TableBody>
        </template>
      </TableBody>

      <Pagination :data="tableData"
        @changePage="handleChange"></Pagination>
    </div>
  </div>
</template>

<script>
import { TableBody, Pagination } from 'gggj_lib'
import { getProjectpage, getCouplinglist } from "@/api/productionManagement/project.js";

export default {
  components: { TableBody, Pagination },
  data() {
    return {
      loading: false,
      loadingChild: false,
      title: "",
      searchValue: '',
      // 表头
      colConfig: [
        {
          attrs: {
            type: 'expand'
          },
          slot: 'expand'
        },
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "left",
            type: 'index'
          },
        },
        {
          attrs: {
            label: "项目名称",
            prop: "name",
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
            label: "项目重量(t)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目创建时间",
            prop: "addTime",
            align: "center",
          },
        },
      ],
      colConfigChild: [
        {
          attrs: {
            label: "联段名称",
            prop: "name",
            align: "center",
          },
        },
        {
          attrs: {
            label: "联段编号",
            prop: "number",
            align: "center",
          },
        },
        {
          attrs: {
            label: "联段重量(t)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          slot: 'btn',
          attrs: {
            label: "车间产值配置",
            align: "center",
          },
        },
      ],
      tableData: {
        list: [],
        total: 0,
        size: 10,
        page: 0
      }
    }
  },
  created() {
    this.getProject()
  },
  mounted() { },
  methods: {
    // 获取项目数据
    async getProject(name) {
      this.loading = true
      let res = await getProjectpage({
        name,
        status: 1,
        ...this.tableData
      })
      res.data.data.forEach(ele => {
        ele.children = []
      });
      res.code === 0 && (this.loading = false)
      this.tableData = res.data
      this.tableData.list = res.data.data
    },
    handleExpand(rows, expandedRows) {
      // console.log(rows, expandedRows, 'row');
      if (expandedRows.length) {
        this.getCoupling(rows)
      }
    },
    // 分页
    handleChange(page) {
      // console.log(page, 'page');
      this.tableData.page = page
      this.getProject()
    },
    async getCoupling(rows) {
      this.loadingChild = true
      const { engineeringProjectId } = rows
      let res = await getCouplinglist({
        engineeringProjectId
      })
      // console.log(res, 'res');
      res.code == 0 && (this.loadingChild = false)
      rows.children = res.data
    },
    // 配置
    handleBtn(scope) {
      // console.log(scope, 'row');
      const { couplingId, engineeringProjectId } = scope.row
      this.$router.push({
        name: 'Workshop-allocation-select',
        query: {
          couplingId,
          engineeringProjectId
        }
      })
    },
    // 搜索
    handleSearch() {
      this.tableData.page = 0
      this.getProject(this.searchValue)
    },
  }
}
</script>

<style lang='scss' scoped>
.wrap {
  height: 100%;
  padding: 16px;
  background: #fff;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    > div {
      width: 240px;
    }
  }
}
</style>