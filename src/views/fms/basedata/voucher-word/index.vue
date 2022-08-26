<template>
  <div class="fms-view">
    <div class="fms-content">
      <hb-table
        :colConfig="colConfig"
        :tableData="
          initData.data&&initData.data.map((item, index) => {
            return { ...item, id: searchForm.page * searchForm.size + index };
          })
        "
        row-key="id"
        height="calc(100vh - 170px)"
        :selection="true"
        :border="true"
        saveComponentKey="page6-01"
        @to-search="handleToSearch"
        @reset-search="handleResetSearch"
        @selectionEvent="handleSelectionEvent"
      >
        <!--自定义表头列插槽--表头查询项----- 循环遍历input和select搜索框  -->
        <template
          v-for="(item, index) in searchColConfig"
          :slot="item.slotHeaderName"
          slot-scope="scope"
        >
          <el-input
            :key="index"
            v-if="item.slotHeaderSearchType === 'input'"
            size="mini"
            clearable
            v-model.trim="searchForm[scope.row.searchKey]"
            placeholder="请输入"
          ></el-input>
          <el-select
            v-else-if="item.slotHeaderSearchType === 'select'"
            :key="index"
            size="mini"
            clearable
            v-model="searchForm[scope.row.searchKey]"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>

        <!-- 自定义表头列插槽--表头查询项-----非input和select类型 ---如:搜索日期项 -->
        <template slot="searchRawMaterialTotalWeight" slot-scope="scope">
          <el-date-picker
            v-model="searchForm[scope.row.searchKey]"
            type="date"
            size="mini"
            style="width:100%;'"
            placeholder="请选择"
          >
          </el-date-picker>
        </template>

        <!--自定义表头列插槽----下的列内容插槽--------如:插槽'hbSetting'下展示操作项 -->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="text"
            v-if="operateList.length === 1"
            :disabled="handleColBtnIsDisabled(scope.row)"
            @click="handleOperateCol(operateList[0].eventsName, scope.row)"
            >详情</el-button
          >
          <el-dropdown trigger="hover" v-else>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in operateList"
                :key="index"
                :disabled="item.disabled && handleColBtnIsDisabled(scope.row)"
                @click.native="handleOperateCol(item.eventsName, scope.row)"
                >{{ item.btnName }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <!-- 自定义列插槽-在这里你可以展示你想要的每列不同的类容 -->
        <template slot="addCol" slot-scope="scope">
          <div style="padding: 30px; background: gray">
            <el-table :data="tableData1" style="width: 100%">
              <el-table-column prop="nestingName" label="日期" width="180">
              </el-table-column>
              <el-table-column prop="totalPage" label="姓名" width="180">
              </el-table-column>
              <el-table-column prop="sparePartsTotalWeight" label="地址">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </hb-table>
    </div>
    <div class="fms-pagination">
      <pagination
        class="hb-pagination"
        :data="initData"
        @changePage="handleChangePage"
        @sizeChange="handleSizeChange"
        :isShowLayoutSizes="true"
      />
    </div>
  </div>
</template>

<script>
const INIT_SEARCH = {
  page: 0,
  size: 10,
};
import HbTable from "../../components/hb-table/index.vue";
import Pagination from "../../components/hb-pagination/index.vue";
import { colConfig } from "./constants.js";
import tableMixins from "./table-mixins.js";
import {

  getMaterialPage,


} from "@/api/productionManagement/project.js";
export default {
  components: {
    HbTable,
    Pagination,
  },
  mixins: [tableMixins],
  data() {
    return {
      colConfig,
      // 搜索条件
      searchForm: {
        ...JSON.parse(JSON.stringify(INIT_SEARCH)),
      },
      statusOptions: [
        {
          label: "未开发",
          value: "0",
        },
        {
          label: "已开发,未受控",
          value: "1",
        },
        {
          label: "已受控,未下发",
          value: "2",
        },
      ],
      //操作项list
      operateList: [
        {
          btnName: "详情",
          eventsName: "handleSeeDetail",
        },
        {
          btnName: "删除",
          eventsName: "handleDelete",
          disabled: true, //是否禁用
        },
        {
          btnName: "编辑",
          eventsName: "handleEdit",
        },
      ],
      //初始化数据
      initData: {
        page: 0,
        size: 10,
        data: [],
      },
    };
  },
  methods: {
    //多选框的数据
    handleSelectionEvent(value) {
      console.log("多选数据----------", value);
    },

    //去查询
    handleToSearch() {
      console.log("看查询条件-----", this.searchForm);
    },

    //详情页操作项
    handleSeeDetail(row) {
      console.log("详情页", row);
    },

    //删除操作项
    handleDelete(row) {
      console.log("删除页", row);
    },

    //编辑操作项
    handleEdit(row) {
      console.log("编辑页", row);
    },
    //操作项父级方法
    handleOperateCol(eventName, row) {
      console.log("操作栏对应的操作项", eventName, row);
      this[eventName](row);
    },
    //禁用操作列
    handleColBtnIsDisabled(row) {
      return row.index === 0;
    },

    //翻页--查询
    handleChangePage(page) {
      this.searchForm.page = page;
      this.getList();
    },
    //每页条数改变---查询
    handleSizeChange(size) {
      this.searchForm.size = size;
      this.searchForm.page = 0;
      this.getList();
    },
    //查询列表
    async getList() {
      let res = await getMaterialPage(
        {
          ...this.searchForm,
          couplingId: "220411A7X6SS99WH",
          engineeringProjectId: "220411A7X6PHXPZC",
          materialNameValue: "",
          nestingNameValue: "",
          procedureId: "220411A84702P8SW",
          procedureIds: ["220411A84702P8SW"],
          workingProcedureCode: "GX_ZZ",
        }
      );
      this.initData = { ...res.data };
      console.log( this.initData,11111111);
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
@import "../../fms.scss";
</style>