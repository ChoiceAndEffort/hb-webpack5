<!--数据管理-->
<template>
  <div class="sub-page">
    <search v-show="active === 1"
      ref="searchNesting"
      :renderData="renderData.searchNesting"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"></search>
    <search v-show="active === 2"
      ref="searchMaterial"
      :renderData="renderData.searchMaterial"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"></search>
    <search v-show="active === 3"
      ref="searchBom"
      :renderData="renderData.searchBom"
      @handle-submit="handleSubmit"
      @handle-reset="handleReset"></search>
    <!--套料-->
    <div class="container"
      v-if="active === 1">
      <div class="navBar">
        <span>{{title}}</span>
        <div class="navBar-right">
          <el-radio-group class="item"
            v-model="radio"
            @change="handleTabClick">
            <el-radio-button v-for="item in listData"
              :key="item.workingProcedureCode"
              :label="item.workingProcedureCode">{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-input clearable
            placeholder="请输入套料图名称"
            v-model="searchInputObj.nestingNameValue"
            class="input-with-select item">
            <el-button @click="inputGetDataRequest"
              slot="append"
              icon="el-icon-search"></el-button>
          </el-input>
          <a href="https://gggj.oss-cn-hangzhou.aliyuncs.com/211228AKMRYZW65P.xlsx">
            <el-button class="item"
              type="primary"
              icon="el-icon-upload"
              @click="downloadM">下载套料模板</el-button>
          </a>
          <el-button class="item"
            type="primary"
            icon="el-icon-upload2"
            @click="upload">上传</el-button>
        </div>
      </div>
      <TableBody class="table-body"
        v-loading="isLoading"
        v-if="data.length !== 0"
        :colConfig="colConfig"
        :data="data.data"
        border>
        <template slot="btn"
          slot-scope="{ scope }">
          <span class="details"
            @click="details(scope.row, 'nesting')">详情</span>
        </template>
      </TableBody>
      <Pagination :data="data"
        @changePage="changePage"
        v-if="data.data && data.data.length != 0" />
    </div>

    <!--物料-->
    <div class="container"
      v-if="active === 2">
      <div class="navBar">
        <span>{{title}}</span>
        <div class="navBar-right">
          <el-radio-group class="item"
            v-model="radio"
            @change="handleTabClick">
            <el-radio-button v-for="item in listData"
              :key="item.workingProcedureCode"
              :label="item.workingProcedureCode">{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-input clearable
            placeholder="请输入物料编号"
            v-model="searchInputObj.materialNameValue"
            class="input-with-select item">
            <el-button @click="inputGetDataRequest"
              slot="append"
              icon="el-icon-search"></el-button>
          </el-input>
          <a href="https://gggj.oss-cn-hangzhou.aliyuncs.com/2203088FG6WP9D40.xlsx">
            <el-button class="item"
              type="primary"
              icon="el-icon-upload">下载物料模板</el-button>
          </a>
          <el-button class="item"
            type="primary"
            icon="el-icon-upload2"
            @click="upload">上传</el-button>
        </div>
      </div>
      <TableBody class="table-body"
        v-loading="isLoading"
        v-if="data.length !== 0"
        :colConfig="colConfig"
        :data="data.data"
        border
        :concatIndexArr="[1,2,3,4,5,6,7,8]"
        concatKey="materialCode">
        <template slot="btn"
          slot-scope="{ scope }">
          <span class="details"
            @click="details(scope.row, 'material')">修改</span>
        </template>
      </TableBody>
      <Pagination :data="data"
        @changePage="changePage"
        v-if="data.data && data.data.length != 0" />
    </div>
    <!--Bom-->
    <div class="container"
      v-if="active === 3">
      <div class="navBar">
        <span>{{title}}</span>
        <div class="navBar-right">
          <el-radio-group class="item"
            v-model="radio"
            @change="handleTabClick">
            <el-radio-button v-for="item in listData"
              :key="item.workingProcedureCode"
              :label="item.workingProcedureCode">{{ item.name }}</el-radio-button>
          </el-radio-group>
          <el-input clearable
            placeholder="请输入物料编码"
            v-model="searchInputObj.bomNameValue"
            class="input-with-select item">
            <el-button @click="inputGetDataRequest"
              slot="append"
              icon="el-icon-search"></el-button>
          </el-input>
          <a href="https://gggj.oss-cn-hangzhou.aliyuncs.com/2112107ZC34Y7FY8.xlsx">
            <el-button class="item"
              type="primary"
              icon="el-icon-upload">下载BOM模板</el-button>
          </a>
          <el-button class="item"
            type="primary"
            icon="el-icon-upload2"
            @click="upload">上传</el-button>
        </div>
      </div>
      <TableBody class="table-body"
        v-loading="isLoading"
        v-if="data.length !== 0"
        :colConfig="colConfig"
        :data="data.data"
        border
        :concatIndexArr="[1, 4]"
        concatKey="materialCode">
        <template slot="btn"
          slot-scope="{ scope }">
          <span class="details"
            @click="details(scope.row, 'bom')">修改</span>
        </template>
      </TableBody>
      <Pagination :data="data"
        @changePage="changePage"
        v-if="data.data && data.data.length != 0" />
    </div>

    <!--文件上传 :visible="true" -->
    <el-drawer size="480px"
      :visible.sync="drawer"
      :with-header="false">
      <p style="margin-bottom: 20px">{{this.active === 1 ? '套料' : this.active === 2 ? '物料' : 'Bom'}}文件上传</p>
      <TableBody :ref="'uploadFilePageTable'"
        :data="dataArr"
        :colConfig="[
          {attrs: {label: '文件名称', prop: 'fileName', align: 'center'}},
          {slot: 'status', attrs: {label: '导入状态', align: 'center'}}
        ]"
        border
        class="upload-file-page"
        @row-click="handleRowClick"
        :highlight-current-row="true">
        <template slot="status"
          slot-scope="{ scope }">
          <span :class="['upload-status', scope.row.status == 0 ? '': 'active']">{{scope.row.status == 0 ? '未导入': '已导入'}}</span>
        </template>
      </TableBody>
      <el-upload class="btn-pointer upload-btn"
        action
        accept=".xlsx,.xls"
        :show-file-list="false"
        :http-request="uploadImg"
        multiple>
        <div class="add">+上传{{this.active === 1 ? '套料' : this.active === 2 ? '物料' : 'Bom'}}文件</div>
      </el-upload>
      <div class="footer">
        <el-button @click="colse">取消</el-button>
        <el-button @click="dele"
          type="danger">删除</el-button>
        <el-button type="primary"
          @click="addproject">导入</el-button>
      </div>
    </el-drawer>

    <!--bom数据新增-->
    <edit-data-bom :bomAddFlag.sync="bomAddFlag"
      :form="bomFormData"
      @addBom="addBom"></edit-data-bom>
  </div>
</template>

<script>
import { TableBody, Pagination, ImportExcel } from "gggj_lib";
import editDataBom from "./components/edit-data-bom";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import {
  MaterialConfig,
  NestingConfig,
  BomConfig,
  CheckNestingConfig,
  CheckMaterialConfig,
  CheckBomConfig,
} from "@/utils/productionManagement/data_config.js";
import {
  getEngineeringProjectList,
  getCouplinglist,
  getProcedureList,
  checkNestingImport,
  getnestingListPage,
  getMaterialPage,
  getBomPage,
  checkMaterialImport,
  checkBomImport,
  uploadMaterialFile,
  getUploadPage,
  delUploadDetail,

} from "@/api/productionManagement/project.js";
import search from '@/views/productionManagement/components/search.vue'
export default {
  components: {
    TableBody,
    Pagination,
    ImportExcel,
    editDataBom,
    search
  },
  data() {
    return {
      // 项目-联段-工序 名称
      title: '',
      // 加载状态
      isLoading: false,
      // 当前渲染模块标识
      active: 1,
      // 上传窗口显示状态
      drawer: false,
      // 下拉框值
      searchobj: {
        engineeringProjectId: "", // 项目id
        couplingId: "", // 联段id
        procedureId: "", // 工序id
      },
      // 套料/物料/bom搜索框
      searchInputObj: {
        nestingNameValue: "",
        materialNameValue: "",
        bomNameValue: "",
      },
      // 套料/物料/bom 按钮数据渲染
      listData: [
        {
          workingProcedureCode: "1",
          name: "套料数据",
        },
        {
          workingProcedureCode: "2",
          name: "物料数据",
        },
        {
          workingProcedureCode: "3",
          name: "BOM数据",
        },
      ],
      // 套料/物料/bom 按钮 当前状态
      radio: "1",
      // 渲染列表字段
      colConfig: [],
      // 分页数据 or 套料/物料/bom渲染数据
      data: {},
      // 套料/物料/bom渲染数据存储
      dataList: Array(3),
      // 上传窗口表格数据
      dataArr: [],
      // 分页参数 初始化
      pageData: {
        page: 0,
        size: 10,
      },
      // bom模态框状态
      bomAddFlag: false,
      // bom每一项数据
      bomFormData: {
        tableData: {},
      },
      // 文件上传当前选择行
      curUploadRow: {},
      // 页码状态
      pageDataList: [
        {
          page: 0,
          size: 10
        },
        {
          page: 0,
          size: 10
        },
        {
          page: 0,
          size: 10
        }
      ],
      // 子组件数组
      childrenComponents: ['searchNesting', 'searchMaterial', 'searchBom'],
      // 预制数据
      renderData: {
        searchNesting: [
          {
            tag: "el-select",
            label: "项目名称",
            attrs: {
              ref: "selectProject",
              key: "engineeringProjectId",
              options: [],
              placeholder: "请选择项目",
            },
            listeners: {
              change: this.firstInputRequest,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-select",
            label: "项目联段",
            attrs: {
              ref: "selectCoupling",
              key: "couplingId",
              options: [],
              placeholder: "请选择联段",
            },
            listeners: {
              change: this.secondInputRequest,
              clear: this.returnTitle
            },
          }
        ],
        searchMaterial: [
          {
            tag: "el-select",
            label: "项目名称",
            attrs: {
              ref: "selectProject",
              key: "engineeringProjectId",
              options: [],
              placeholder: "请选择项目",
            },
            listeners: {
              change: this.firstInputRequest,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-select",
            label: "项目联段",
            attrs: {
              ref: "selectCoupling",
              key: "couplingId",
              options: [],
              placeholder: "请选择联段",
            },
            listeners: {
              change: this.secondInputRequest,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-cascader",
            label: "项目工序",
            attrs: {
              ref: "selectProcedure",
              key: "procedureIds",
              keys: 0,
              options: [],
              props: {
                value: "projectWorkingProcedureId",
                label: "name",
                children: "children",
                expandTrigger: "hover",
              },
              clearable: true,
              placeholder: "请选择工序",
            },
            listeners: {
              change: this.handleProcedureConfirm,
              clear: this.returnTitle
            },
          }
        ],
        searchBom: [
          {
            tag: "el-select",
            label: "项目名称",
            attrs: {
              ref: "selectProject",
              key: "engineeringProjectId",
              options: [],
              placeholder: "请选择项目",
            },
            listeners: {
              change: this.firstInputRequest,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-select",
            label: "项目联段",
            attrs: {
              ref: "selectCoupling",
              key: "couplingId",
              options: [],
              placeholder: "请选择联段",
            },
            listeners: {
              change: this.secondInputRequest,
              clear: this.returnTitle
            },
          },
          {
            tag: "el-cascader",
            label: "项目工序",
            attrs: {
              ref: "selectProcedure",
              key: "procedureIds",
              keys: 0,
              options: [],
              props: {
                value: "projectWorkingProcedureId",
                label: "name",
                children: "children",
                expandTrigger: "hover",
              },
              clearable: true,
              placeholder: "请选择工序",
            },
            listeners: {
              change: this.handleProcedureConfirm,
              clear: this.returnTitle
            },
          }
        ],
      }
    };
  },
  activated() {
    this.curUploadRow = ''
  },
  created() {
    this.initRequest()
    // 初始化数据管理页面数据
    this.colConfig = NestingConfig;
  },
  mounted() { },
  methods: {
    // 获取项目列表
    async initRequest() {
      let res;
      res = await getEngineeringProjectList({ status: 1, enterpriseId: enterpriseId });
      res.data.forEach((item) => {
        item.value = item.engineeringProjectId;
        item.label = item.name;
      });
      Object.keys(this.renderData).forEach(item => {
        this.renderData[item][0].attrs.options = res.data
      })
    },
    // 清空事件
    selectClear(type) {
      const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
      const curSearchData = this.renderData[this.childrenComponents[this.active - 1]]
      curSearchData[2] ? curSearchData[2].attrs.keys++ : ''
      if (type) {
        curSearchComp.formData.procedureIds = "";
        curSearchComp.formData.procedureId = "";
        curSearchComp.formData.workingProcedureCode = "";
        if (type === 'project') {
          curSearchComp.formData.couplingId = "";
          curSearchData[1].attrs.options = []
        }
        if (type !== 'procedure') {
          curSearchData[2] ? curSearchData[2].attrs.options = [] : ''
        }
      }
    },
    // 获取联段
    async firstInputRequest(value) {
      const curSearchData = this.renderData[this.childrenComponents[this.active - 1]]
      let res;
      // 清空联段 工序
      this.selectClear('project')
      if (value) {
        res = await getCouplinglist({
          engineeringProjectId: value,
        });
        res.data.forEach((item) => {
          item.value = item.couplingId;
          item.label = item.name;
        });
        curSearchData[1].attrs.options = res.data
        this.returnTitle();
        this.handleResetPage();
      }
    },
    // 获取工序
    async secondInputRequest(value) {
      const curSearchData = this.renderData[this.childrenComponents[this.active - 1]]
      let res;
      // 清空工序
      this.selectClear('coupling')
      res = await getProcedureList({
        id: value,
      });
      res.data.forEach((item) => {
        if (item.children.length === 0) {
          this.$delete(item, "children");
        }
      });
      let xlConfig = res.data.find(item => item.name === '下料')
      if (this.active - 1 == 0 && xlConfig) {
        const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
        curSearchComp.formData.procedureIds = xlConfig;
        curSearchComp.formData.procedureId = xlConfig.projectWorkingProcedureId;
        curSearchComp.formData.workingProcedureCode = xlConfig.workingProcedureCode;
      }
      curSearchData[2] ? curSearchData[2].attrs.options = res.data : ''
      this.returnTitle();
      this.handleResetPage();
    },
    // 工序选择框值 切换
    handleProcedureConfirm(value) {
      const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
      const curSearchData = this.renderData[this.childrenComponents[this.active - 1]]
      const procedureList = curSearchData[2].attrs.options
      if (!value.length) {
        this.selectClear('procedure')
        return
      }
      let index, indexs, temp;
      curSearchComp.formData.procedureId = value[value.length - 1];
      index = procedureList.findIndex(
        (item) => item.projectWorkingProcedureId === value[0]
      );
      if (value.length > 1) {
        indexs = procedureList[index].children.findIndex(
          (item) => item.projectWorkingProcedureId === value[value.length - 1]
        );
      }
      temp =
        value.length > 1
          ? procedureList[index].children[indexs]
          : procedureList[index];
      curSearchComp.formData.workingProcedureCode = temp.workingProcedureCode
      this.handleProcedureChange(temp);
      this.returnTitle();
      this.handleResetPage();
    },
    // 返回当前项目-联段-工序名称
    returnTitle() {
      this.$nextTick(() => {
        let title, value1, value2, value3;
        title = value1 = value2 = value3 = "";
        const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
        const { selectCoupling, selectProcedure, selectProject } = curSearchComp.$refs
        value1 = selectProject.selectedLabel
        value2 = selectCoupling.selectedLabel
        selectProcedure ? value3 = selectProcedure.presentText : value3 = ''
        title = `${value1}${value2 ? " - " + value2 : ""}${value3 ? " - " + value3 : ""
          }`;
        this.title = title
      })
    },
    // 获取渲染结果
    async getDataRequest(searchObj) {
      let res
      let checkConfig = [CheckNestingConfig, CheckMaterialConfig, CheckBomConfig]
      this.returnTitle()
      searchObj.headerKeys = checkConfig[this.active - 1]
      const filterData = {
        ...searchObj,
        ...this.pageData,
        ...this.searchInputObj
      };
      this.pageDataList[this.active - 1] = this.pageData
      try {
        switch (this.active) {
          case 1: {
            if (!searchObj.couplingId) {
              this.$message.warning('请选择联段！')
              return
            }
            // 获取套料分页数据
            this.isLoading = true
            res = await getnestingListPage(filterData)
          }; break;
          case 2: {
            if (!searchObj.procedureId) {
              this.$message.warning('请选择工序！')
              return
            }
            // 获取物料分页数据
            this.isLoading = true
            res = await getMaterialPage(filterData)
          }; break;
          case 3: {
            if (!searchObj.procedureId) {
              this.$message.warning('请选择工序！')
              return
            }
            // 获取Bom分页数据
            this.isLoading = true
            res = await getBomPage(this.pageData)
          }; break;
        }
        this.data = { ...res.data }
        this.isLoading = false
      } catch (error) {
        this.$message.error(error.msg);
        this.isLoading = false
      }
      searchObj && (this.searchobj = { ...searchObj })
    },
    //切换
    async handleTabClick(item) {
      let res
      this.active = parseInt(item)
      const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
      this.data.data = []
      this.returnTitle()
      this.searchobj = curSearchComp.formData
      this.pageData = this.pageDataList[this.active - 1]
      const filterData = {
        ...this.pageData,
        ...this.searchInputObj
      };
      switch (this.active) {
        case 1: {
          this.colConfig = NestingConfig;
          this.searchobj.headerKeys = CheckNestingConfig
          if (this.searchobj.couplingId) {
            this.isLoading = true
            res = await getnestingListPage({ ...filterData, ...this.searchobj })
            this.data = { ...res.data }
            this.isLoading = false
          }
        }; break;
        case 2: {
          const { workingProcedureCode } = this.searchobj
          this.colConfig = MaterialConfig;
          this.handleProcedureChange({ workingProcedureCode })
          this.searchobj.headerKeys = CheckMaterialConfig
          if (this.searchobj.procedureId) {
            this.isLoading = true
            res = await getMaterialPage({ ...filterData, ...this.searchobj })
            this.data = { ...res.data }
            this.isLoading = false
          }
        }; break;
        case 3: {
          this.colConfig = BomConfig;
          this.searchobj.headerKeys = CheckBomConfig
          if (this.searchobj.procedureId) {
            this.isLoading = true
            res = await getBomPage(this.pageData)
            this.data = { ...res.data }
            this.isLoading = false
          }
        }; break;
      }
    },
    // 输入框请求结果
    async inputGetDataRequest() {
      let res;
      const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
      const { nestingNameValue, materialNameValue, bomNameValue } = this.searchInputObj
      const pageDataList = this.pageDataList[this.active - 1]
      this.searchobj = curSearchComp.formData
      this.isLoading = true
      try {
        switch (this.active) {
          case 1: {
            // if (!nestingNameValue) {
            //   this.$message.warning('请输入套料图名称')
            //   return
            // }
            res = await getnestingListPage({
              ...this.searchobj,
              ...pageDataList,
              nestingName: nestingNameValue
            })
          }; break;
          case 2: {
            // if (!materialNameValue) {
            //   this.$message.warning('请输入物料编号')
            //   return
            // }
            res = await getMaterialPage({
              ...this.searchobj,
              ...pageDataList,
              materielCode: materialNameValue
            })
          }; break;
          case 3: {
            // if (!bomNameValue) {
            //   this.$message.warning('请输入物料编码')
            //   return
            // }
            res = await getBomPage({
              ...pageDataList,
              materielCode: bomNameValue
            })
          }; break;
        }
        this.data = { ...res.data }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.$message.error(error.msg);
      }
    },
    //翻页
    async changePage(size) {
      let res
      this.pageData.page = size
      const filterData = {
        ...this.searchobj,
        ...this.pageData,
        ...this.searchInputObj
      };
      this.isLoading = true
      this.pageDataList[this.active - 1] = this.pageData
      try {
        switch (this.active) {
          case 1: {
            res = await getnestingListPage({ ...filterData })
          }; break;
          case 2: {
            res = await getMaterialPage({ ...filterData })
          }; break;
          case 3: {
            res = await getBomPage(this.pageData)
          }; break;
        }
        this.data = { ...res.data }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        this.$message.error(error.msg);
      }
    },
    // 工序下拉 
    handleProcedureChange(item) {
      let temp = [...MaterialConfig]
      const { workingProcedureCode } = item
      if (workingProcedureCode === 'GX_YS' || workingProcedureCode === 'GX_TZ') {
        temp.splice(-5, 4)
      } else {
        temp.splice(-9, 4)
      }
      this.colConfig = temp
    },
    //下载套料模板
    downloadM() { },

    //打开上传窗口
    upload() {
      if (this.searchobj.procedureId || this.active === 1) {
        if (!this.searchobj.couplingId) {
          this.$message({ message: "请先选择联段", type: "warning" });
          return
        }
        if (this.searchobj.workingProcedureCode === 'GX_YS') {
          this.$message.error("运输工序不可上传物料模板")
          return
        }
        this.drawer = true;
        this.uploadData();
      } else {
        this.$message({ message: "请先选择工序", type: "warning" });
      }
    },
    //导出
    uploadOut() {
      alert("导出");
    },
    //修改
    details(row, type) {
      type === "nesting" &&
        this.$router.push({
          name: "details-management",
          query: {
            ...this.searchobj,
            nestingPoolId: row.nestingPoolId,
            title: this.title
          },
        });
      type === "material" &&
        this.$router.push({ name: "edit-material", query: row });
      if (type === "bom") {
        const newFormData = {};
        newFormData.tableData = this.data;
        newFormData.tableData.curRow = row;
        this.bomFormData = newFormData;
        this.bomAddFlag = true;
      }
    },
    //关闭上传窗口
    colse() {
      this.curUploadRow = ''
      this.drawer = false;
    },
    // 删除上传文件
    dele() {
      const row = this.curUploadRow
      if (!row.fileUploadId) {
        this.$message({ type: 'warning', message: '请先选择删除文件' })
        return
      }
      this.$confirm(`确认删除${row.fileName}文件?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await delUploadDetail(row)
        res.success && this.$message({ type: 'success', message: '删除成功' })
        const index = this.dataArr.findIndex(item => item.fileUploadId === row.fileUploadId)
        this.dataArr.splice(index, 1)
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' })
      })
    },
    // 上传文件
    async uploadImg(fileObj) {
      let res
      let formData = new FormData();
      let type = this.active
      formData.append("file", fileObj.file);
      formData.append("jsonString", JSON.stringify({
        ...this.searchobj,
        type
      }))
      res = await uploadMaterialFile(formData)
      if (res.success) {
        this.dataArr.push({ ...res.data })
      }
    },
    //导入校验文件
    async addproject() {
      let res
      let queryData
      const type = this.active
      const row = this.curUploadRow
      this.searchobj.type = type
      const uploadData = { ...this.searchobj, ...row }
      if (!row.fileName) {
        this.$message({ type: 'warning', message: '请先选择导入文件' })
        return
      }
      if (row.status) {
        this.$message({ type: 'warning', message: '该文件已导入' })
        return
      }
      try {
        if (type === 1) {
          res = await checkNestingImport(uploadData)
        } else if (type === 2) {
          res = await checkMaterialImport(uploadData)
        } else if (type === 3) {
          res = await checkBomImport(uploadData)
        }
        queryData = { ...this.searchobj, ...res.data, ...row }
        sessionStorage.setItem('queryData', JSON.stringify(queryData))
        this.$router.push({ name: 'check-data', query: queryData })
      } catch (error) {
        if (error.code === 3133) {
          this.$message.error('请删除该套料文件')
          return
        }
        queryData = { ...this.searchobj, ...error.data, ...row }
        sessionStorage.setItem('queryData', JSON.stringify(queryData))
        this.$router.push({ name: 'check-data', query: queryData })
      }
      this.drawer = false
    },
    // 获取上传分页数据
    async uploadData() {
      const res = await getUploadPage({
        ...this.searchobj,
        type: this.active
      })
      res.code === 0 && (this.dataArr = res.data.data)
    },
    // 添加bom数据
    addBom() {
      this.async_getBomPage({ ...this.pageData });
    },
    // 文件上传 表格行点击事件
    handleRowClick(row, column, event) {
      this.curUploadRow = row
    },
    // 重置
    handleReset() {
      const curSearchData = this.renderData[this.childrenComponents[this.active - 1]]
      this.pageData = {
        page: 0,
        size: 10
      }
      curSearchData[2] ? curSearchData[2].attrs.keys++ : ''
      curSearchData.forEach(item => {
        if (item.attrs.key === 'engineeringProjectId') return
        item.attrs.options && (item.attrs.options = [])
      })
      this.returnTitle()
    },
    // 提交
    handleSubmit() {
      const curSearchComp = this.$refs[this.childrenComponents[this.active - 1]]
      let searchobj = curSearchComp.formData
      this.getDataRequest(searchobj)
    },
    // 重置分页
    handleResetPage() {
      this.pageData = {
        page: 0,
        size: 10
      }
    }
  },
};
</script>

<style scoped lang="scss">
.sub-page {
  display: flex;
  flex-direction: column;
  padding: 0 !important;
  background-color: transparent;
  .searchBar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .container {
    flex: 1;
    background-color: #fff;
    .navBar {
      padding: 16px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .navBar-right {
        .item {
          margin-left: 8px !important;
        }
      }
      .el-input {
        width: 240px;
      }
    }
    .table-body {
      padding: 16px;
      padding-top: 0;
    }
    ::v-deep .el-table {
      .details {
        color: #1989fa;
        cursor: pointer;
      }
    }
  }
}
::v-deep .el-drawer__body {
  padding: 16px;
  position: relative;
  .add {
    height: 40px;
    margin-top: 30px;
    line-height: 40px;
    border: 1px dotted #e4e7ed;
    text-align: center;
    color: #606266;
  }
  .footer {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
}
::v-deep .el-upload {
  width: 100%;
}
.upload-file-page {
  .upload-status {
    color: red;
  }
  .active {
    color: greenyellow;
  }
}
</style>
