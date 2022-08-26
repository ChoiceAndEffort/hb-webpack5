<template>
  <div class="wrap">
    <div class="header">
      <span>项目列表</span>
      <el-input placeholder="请输入项目名称"
        v-model="searchValue">
        <i class="el-icon-search el-input__icon"
          slot="suffix"
          @click="handleSearch">
        </i>
      </el-input>
    </div>
    <div class="content">
      <TableBody v-loading="loading"
        :colConfig="colConfig"
        :data="data.data"
        @expand-change="handleExpand">
        <template slot="expend"
          slot-scope="{ scope }">
          <TableBody v-loading="childrenLoading"
            :colConfig="colConfigChild"
            :data="scope.row.children">
            <template #btn="{ scope }">
              <el-button type="text"
                @click="handleConfig(scope)">配置</el-button>
            </template>
          </TableBody>
        </template>
      </TableBody>

      <Pagination :data="data"
        @changePage="handleChangePage"></Pagination>
    </div>
  </div>
</template>

<script>
import { getProjectpage, getCouplinglist } from "@/api/productionManagement/project.js";
import { tableTimeFilter } from "@/utils/productionManagement/tool"
import { TableBody, Pagination } from "gggj_lib";
export default {
  components: {
    TableBody,
    Pagination
  },
  data() {
    return {
      loading: false,
      childrenLoading: false,
      searchValue: '',
      colConfig: [
        {
          attrs: {
            type: "expand",
          },
          slot: "expend",
        },
        {
          attrs: {
            label: "序号",
            prop: "index",
            align: "left",
            type: "index",
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
            label: "项目重量(吨)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          attrs: {
            label: "项目创建时间",
            prop: "addTime",
            align: "center",
            formatter: tableTimeFilter
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
            label: "联段重量(千克)",
            prop: "totalWeight",
            align: "center",
          },
        },
        {
          slot: "btn",
          attrs: {
            label: "涂装用量配置",
            align: "center",
          },
        },
      ],
      data: {
        data: [],
        page: 0,
        size: 10,
        total: 0
      },
    };
  },
  created() {
    this.getTableData()
  },
  mounted() { },
  methods: {
    // 获取项目数据
    async getTableData(name) {
      this.loading = true
      let res = await getProjectpage({
        name,
        ...this.data,
        status: 1,
      })
      res.code === 0 && (this.loading = false)
      res.data.data.forEach(item => {
        item.children = []
      })
      this.data = res.data
    },
    // 获取联段数据
    async getTableChildData(row) {
      this.childrenLoading = true
      const { engineeringProjectId } = row
      let res = await getCouplinglist({
        engineeringProjectId
      })
      res.code === 0 && (this.childrenLoading = false)
      row.children = res.data
    },
    // 展开事件
    handleExpand(row, expandedRows) {
      if (expandedRows.length)
        this.getTableChildData(row)
    },
    // 搜索框
    handleSearch() {
      this.data.page = 0
      this.getTableData(this.searchValue)
    },
    // 配置
    handleConfig(scope) {
      const { couplingId, engineeringProjectId } = scope.row
      this.$router.push({
        name: 'coating-config-detail',
        query: {
          couplingId,
          engineeringProjectId
        }
      })
    },
    // 分页
    handleChangePage(page) {
      console.log(page)
      this.data.page = page;
      this.getTableData()
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
  padding: 16px;
  background-color: #fff;
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
