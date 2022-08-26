<!-- 月度计划分解执行人查看 -->
<template>
  <div class="main">
    <!-- 基础信息 -->
    <div class="basicinfo">
      <p class="title">基础信息</p>
      <el-divider></el-divider>
      <el-descriptions>
        <el-descriptions-item label="项目名称"
          >徐州南三环快速路</el-descriptions-item
        >
        <el-descriptions-item label="部门">物资供应部</el-descriptions-item>
        <el-descriptions-item label="计划内容"
          >成品水密门采购回厂</el-descriptions-item
        >
        <el-descriptions-item label="责任人">相滢</el-descriptions-item>
        <el-descriptions-item label="执行人">娜峰</el-descriptions-item>
        <el-descriptions-item label="计划完成时间"
          >2021.08.24</el-descriptions-item
        >
        <el-descriptions-item label="重要程度">
          <el-rate
            v-model="value2"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            :max="1"
          ></el-rate>
        </el-descriptions-item>
        <el-descriptions-item label="备注">-</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 填报情况 -->
    <div class="situation">
      <p class="title">填报情况</p>
      <el-divider></el-divider>
      <el-descriptions>
        <el-descriptions-item label="完成情况">延期完成</el-descriptions-item>
        <el-descriptions-item label="延期完成时间"
          >2021.08.26</el-descriptions-item
        >
        <el-descriptions-item label="情况说明">-</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 文件 -->
    <div class="file">
      <p class="title">文件</p>
      <el-divider></el-divider>
      <div class="downloadfile">文件信息</div>
    </div>
  </div>
</template>

<script>
import { TableBody, Pagination } from "gggj_lib";
export default {
  components: { TableBody, Pagination },
  data() {
    return {
      activeName: "second",
      colConfig: [
        {
          attrs: { label: "操作类型", prop: "time", align: "left" },
        },
        {
          attrs: { label: "操作人", prop: "name", align: "left" },
        },
        {
          slot: "agee",
          attrs: { label: "执行结果", prop: "age", align: "left" },
        },
        {
          attrs: { label: "操作时间", prop: "hobby", align: "left" },
        },
        {
          attrs: { label: "备注", prop: "education", align: "left" },
        },
      ],
      data: {
        total: 0,
        pageSize: 1,
        currentPage: 0,
        lastPage: 0,
        totalPages: 0,
        first: true,
        last: true,
        data: [
          {
            time: "创建计划",
            name: "丰青凝",
            age: "0",
            hobby: "操作时间",
            education: "不通过原因",
          },
        ],
      },
      value2: 1,
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    handleClick(tab, event) {
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ::v-deep .el-divider--horizontal {
    margin: 0;
  }
  ::v-deep .el-descriptions {
    padding: 0 16px;
  }
  ::v-deep .el-descriptions__body {
    padding: 32px 0;
  }

  .basicinfo,
  .situation,
  .file {
    background: #fff;
    width: 100%;
    .title {
      font-size: 14px;
      color: #303133;
      line-height: 52px;
      margin: 0 16px;
      font-size: 14px;
      font-weight: 600;
    }
  }
  .file {
    flex: 1;
  }
  .situation,
  .file {
    margin-top: 8px;
  }
  .downloadfile {
    padding: 24px 16px;
  }
}
</style>
