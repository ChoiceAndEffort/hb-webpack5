<template>
  <div class="wrap">
    <template v-for="(item, index) in data">
      <el-card :key="index"
        class="box-card">
        <div slot="header"
          class="clearfix">
          <span>{{ getTitle(index) }}</span>
          <el-button style="float: right"
            icon="el-icon-plus"
            @click="handleAdd(item,index)">新增物料</el-button>
        </div>
        <TableBody :colConfig="colConfig"
          :data="item">
          <template slot="btn"
            slot-scope="{ scope }">
            <el-button type="text"
              icon="el-icon-delete"
              style="color: red !important"
              @click="handleDel(scope,index)"></el-button>
          </template>
        </TableBody>
      </el-card>
    </template>
    <bottomFooter @resetForm="handleCancel"
      @handleEditSave="handleEditSave"></bottomFooter>
    <coating-item-add title="新增物料"
      :tableData="tableData"
      :colConfig="colConfigAdd"
      :dialogShow.sync="dialogShow"
      @handle-data="handleCoatingAdd"></coating-item-add>
  </div>
</template>

<script>
import { getCoatingDosageConfigurationList, coatingSaveBatch, coatingDel } from "@/api/productionManagement/systemManagement";
import { TableBody } from "gggj_lib";
import bottomFooter from "@/views/productionManagement/components/bottomFooter";
import coatingItemAdd from "./components/coating-item-add";
export default {
  name: "coating-config-detail",
  components: {
    TableBody,
    bottomFooter,
    coatingItemAdd,
  },
  data() {
    return {
      // 当前处理的数据 下标
      currentListIndex: null,
      coatingList: {},
      data: [],
      colConfig: [
        {
          attrs: {
            label: "物料名称",
            prop: "materialName",
            align: "center",
          },
        },
        {
          attrs: {
            label: "干膜厚度(m²)",
            prop: "dryFilmThickness",
            align: "center",
          },
        },
        {
          attrs: {
            label: "固体含量(s/v)",
            prop: "solidContent",
            align: "center",
          },
        },
        {
          attrs: {
            label: "比重(kg/L)",
            prop: "specificGravity",
            align: "center",
          },
        },
        {
          attrs: {
            label: "涂布率(m²/kg)",
            prop: "spreadingRate",
            align: "center",
          },
        },
        {
          attrs: {
            label: "损耗系数",
            prop: "lossCoefficient",
            align: "center",
          },
        },
        {
          slot: "btn",
          attrs: {
            label: "操作",
            align: "center",
          },
        },
      ],
      colConfigAdd: [
        {
          slot: "materialName",
          attrs: {
            label: "物料名称",
            prop: "materialName",
            align: "center",
          },
        },
        {
          slot: "dryFilmThickness",
          attrs: {
            label: "干膜厚度(m²)",
            prop: "dryFilmThickness",
            align: "center",
          },
        },
        {
          slot: "solidContent",
          attrs: {
            label: "固体含量(s/v)",
            prop: "solidContent",
            align: "center",
          },
        },
        {
          slot: "specificGravity",
          attrs: {
            label: "比重(kg/L)",
            prop: "specificGravity",
            align: "center",
          },
        },
        {
          slot: "spreadingRate",
          attrs: {
            label: "涂布率(m²/kg)",
            prop: "spreadingRate",
            align: "center",
          },
        },
        {
          slot: "lossCoefficient",
          attrs: {
            label: "损耗系数",
            prop: "lossCoefficient",
            align: "center",
          },
        },
      ],
      dialogShow: false,
      tableData: [],
    };
  },
  created() {
    if (this.$route.query.couplingId) {
      const { couplingId } = this.$route.query;
      this.getData(couplingId);
    }
  },
  mounted() { },
  computed: {
    // 获取标题
    getTitle() {
      return (index) => {
        switch (index) {
          case 0:
            return "外表面";
          case 1:
            return "内表面";
          case 2:
            return "顶板面";
          case 3:
            return "摩擦面";
        }
      };
    },
  },
  methods: {
    //获取数据
    async getData(couplingId) {
      let res = await getCoatingDosageConfigurationList(couplingId);
      let coatingList = res.data;
      this.data = [
        coatingList['outsideAreaConfigurationList'],
        coatingList['internalAreaConfigurationList'],
        coatingList['topAreaConfigurationList'],
        coatingList['frictionAreaConfigurationList']
      ]
    },
    // 新增
    handleAdd(item, index) {
      this.dialogShow = true;
      this.tableData = JSON.parse(JSON.stringify(item));
      this.currentListIndex = index
    },
    // 删除
    handleDel(data, index) {
      this.$confirm('是否删除配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        (async () => {
          let res
          const { coatingDosageConfigurationId } = data.row
          res = await coatingDel(coatingDosageConfigurationId)
          if (res.code === 0 || !coatingDosageConfigurationId) {
            this.data[index].splice(data.$index, 1)
            this.$message.success('删除成功')
          }
        })()
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 保存
    handleEditSave() {
      this.$confirm('是否保存配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        (async () => {
          const { couplingId, engineeringProjectId } = this.$route.query
          this.data.forEach((item, index) => {
            item.forEach(its => {
              its.areaType = index + 1
              its.couplingId = couplingId
              its.engineeringProjectId = engineeringProjectId
            })
          })
          await coatingSaveBatch({
            outsideAreaConfigurationList: this.data[0],
            internalAreaConfigurationList: this.data[1],
            topAreaConfigurationList: this.data[2],
            frictionAreaConfigurationList: this.data[3]
          })
          this.$message.success('保存成功')
          this.$router.back()
        })()
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 取消
    handleCancel() {
      this.$confirm('是否放弃配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    // 模态框新增数据
    handleCoatingAdd(data) {
      this.data[this.currentListIndex] = data
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  ::v-deep .box-card {
    margin-bottom: 16px;
    .el-card__header {
      padding: 16px;
      .clearfix {
        display: flex;
        align-items: center;
        span {
          flex: 1;
        }
      }
    }
  }
}
</style>
