<template>
  <div class="wrap">
    <div id="print">
      <el-card class="box-card">
        <div slot="header"
          class="clearfix">
          <span>出厂清单</span>
        </div>
        <el-descriptions>
          <el-descriptions-item label="工程项目名称">kooriookami</el-descriptions-item>
          <el-descriptions-item label="出厂编号">18100000000</el-descriptions-item>
          <el-descriptions-item label="运输目的地">苏州市</el-descriptions-item>
          <el-descriptions-item label="收货联系人">{{ tableData.liaison }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ tableData.liaisonPhone }}</el-descriptions-item>
          <el-descriptions-item label="发起单位">{{ tableData.supplierName }}</el-descriptions-item>
          <el-descriptions-item label="承运方">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
          <el-descriptions-item label="司机姓名">{{ tableData.driverName }}</el-descriptions-item>
          <el-descriptions-item label="发起人">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
          <el-descriptions-item label="车牌号">{{ tableData.carNumber }}</el-descriptions-item>
          <el-descriptions-item label="联系方式">{{ tableData.driverPhone }}</el-descriptions-item>
        </el-descriptions>
        <div class="images">
          <div class="title">装车照片</div>
          <div :class="['images-list',imageList.length===0?'image-none':'']">
            <template v-if="imageList.length">
              <el-image v-for="(item,index) in imageList"
                :key="index"
                :src="item.attachmentUrl"
                :preview-src-list="[item.attachmentUrl]"
                style="width: 178px; height: 178px">
              </el-image>
            </template>
            <template v-else>
              <span>暂无图片</span>
            </template>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
          class="clearfix">
          <span>产品</span>
        </div>
        <TableBody :colConfig="productCol"
          :data="tableData.orderDetailedList">
          <template #index="{scope}">
            <!-- 序号 -->
            <span>{{indexMethod(scope.$index)}}</span>
          </template>
        </TableBody>
      </el-card>
      <el-card class="box-card">
        <div slot="header"
          class="clearfix">
          <span>审批记录</span>
        </div>
        <TableBody :colConfig="approveCol"
          :data="[]">
          <template #index="{scope}">
            <!-- 序号 -->
            <span>{{indexMethod(scope.$index)}}</span>
          </template>
        </TableBody>
      </el-card>
    </div>
    <div class="footer">
      <el-button @click="$router.push('ex-factory')">取消</el-button>
      <el-button v-print="printObj"
        @click="handlePrint">打印</el-button>
      <el-button type="primary">提交审批</el-button>
    </div>

  </div>
</template>

<script>
import print from 'vue-print-nb'
import { TableBody, Pagination } from "gggj_lib"

import { indexMethod } from '@/utils/productionManagement/tool'


// 运输计划详情
import { getTransportDetail } from "@/api/productionManagement/transport.js"
export default {
  components: {
    TableBody,
    Pagination
  },
  directives: {
    print
  },
  data() {
    return {
      // 数据源
      tableData: {},
      // 打印容器展示
      printWrapShow: false,
      // 打印配置项 
      printObj: {
        id: "print",
        beforeOpenCallback(vue) {
          console.log('打开之前')
        },
        openCallback(vue) {
          console.log('执行了打印')
        },
        closeCallback(vue) {
          vue.printWrapShow = false
          console.log('关闭了打印工具')
        }
      },
      // 图片列表
      imageList: [],
      // 产品列配置
      productCol: [
        { slot: "index", attrs: { label: "序号", 'min-width': "52" } },
        { attrs: { label: "物料名称", prop: "name", "min-width": "140" } },
        { attrs: { label: "物料编号", prop: "number", "min-width": "140" } },
        { attrs: { label: "材质", prop: "materialQuality", "min-width": "100", align: "right" } },
        { attrs: { label: "高度", prop: "height", "min-width": "118", align: "right" } },
        { attrs: { label: "宽度", prop: "width", "min-width": "118", align: "right" } },
        { attrs: { label: "长度", prop: "length", "min-width": "118", align: "right" } },
        { attrs: { label: "数量", prop: "amount", "min-width": "118", align: "right" } },
        { attrs: { label: "单重(千克)", prop: "weight", "min-width": "118", align: "right" } },
        { attrs: { label: "总重(千克)", prop: "totalWeight", "min-width": "138", align: "right" } },
      ],
      // 审批列配置
      approveCol: [
        { slot: "index", attrs: { label: "序号", 'min-width': "52" } },
        { attrs: { label: "审批人", prop: "projectName", "min-width": "140" } },
        { attrs: { label: "审批时间", prop: "connectName", "min-width": "140" } },
        { attrs: { label: "审批意见", prop: "projectName", "min-width": "828" } },
      ]
    };
  },
  created() {
    if (this.$route.query?.transportOrderId) {
      const transportOrderId = this.$route.query?.transportOrderId
      this.getTrans(transportOrderId)
    }
  },
  mounted() { },
  methods: {
    handlePrint() {
      let nodes = document.querySelectorAll('table');
      for (let i = 0; i < nodes.length - 1; i++) {
        let tableItem = nodes[i];
        tableItem.style.width = '100%'; // 将宽度设为百分比
        let child = tableItem.childNodes;
        for (let j = 0; j < child.length; j++) {
          let element = child[j];
          if (element.localName === 'colgroup') { // 去除默认的表格宽度设置
            element.innerHTML = ''
          }
        }
      }
      // console.log(nodes)
      this.printWrapShow = true
    },
    // 自定义列表
    indexMethod,
    async getTrans(id) {
      let res = await getTransportDetail(id)
      this.tableData = res.data
    }
  },
}
</script>

<style scoped lang="scss">
.wrap {
  ::v-deep .box-card {
    font-size: 14px;
    margin-bottom: 16px;
    .el-card__header,
    .el-card__body {
      padding: 16px 24px;
    }
    .el-card__header {
      font-weight: bolder;
    }
    .el-table {
      .el-table__header {
        width: 100% !important;
      }
    }
    .el-descriptions {
      padding: 0;
      .el-descriptions-item {
        padding-bottom: 16px;
      }
      tbody:last-child {
        .el-descriptions-item {
          padding-bottom: 0;
        }
      }
    }
    // 图像
    .images {
      margin-top: 20px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      .el-image {
        margin-right: 20px;
      }
      .title {
        padding: 0 16px;
        height: 40px;
        line-height: 40px;
        background-color: #f8f8f8;
      }
      .upload-demo,
      .images-list {
        margin: 24px 16px;
      }
      .image-none {
        text-align: center;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 8px 16px;
    box-shadow: 0px -4px 3px 1px rgba(0, 0, 0, 0.1);
    z-index: 999;
    .el-button--default {
      background-color: transparent !important;
    }
  }
}
</style>
