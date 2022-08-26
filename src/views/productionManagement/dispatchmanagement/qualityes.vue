<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="col">工单基础信息</div>
      </div>
      <div class="option">
        <div>
          <div>项目名称：{{ data1.gongxu }}</div>
          <div>工艺：</div>
        </div>
        <div>
          <div>联段：</div>
          <div>编号：</div>
        </div>
        <div>
          <div>工序：</div>
          <div>施工面积：</div>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="col">检验意见填报</div>
      </div>
      <!-- 复选框 -->
      <div class="option">
        <el-radio v-model="radio" label="1">是</el-radio>
        <el-radio v-model="radio" label="2">否</el-radio>
      </div>

      <div class="option">
        <a class="input_get">检验意见：</a>
        <el-input
          type="textarea"
          autosize
          placeholder="简要说明，检验意见"
          v-model="textarea1"
        ></el-input>
      </div>

      <!-- 图片 -->
      <div class="vis" >
        <div class="vis_is">互检图片</div>
        <div class="vis_ob">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 照片上传
        dialogImageUrl: '',
        dialogVisible: false,
      textarea1: "",
      // 复选框
      radio: "1",
      /* 后端数据可以在此接收 */
      data1: {
        gongxu: "武汉南湖路",
        budget: "0",
        monthcost: "0",
        totalcost: "数控划线",
        differencecost: "L1-1A",
        progreward: "118m²",
        progressreward: "2021.12.22",
        qualityreward: "2021.12.22",
        qualityreflex: "2021.12.26",
      },
    }
  },
     created() {},
  mounted() {},
      methods: {
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
};
</script>

<style scoped>
.option {
  display: flex;
}
.option > div {
  flex: 1;
}
.option > div > div {
  margin-top: 20px;
}
.option {
  margin-top: 20px;
}

.col {
  color: #000;
}
.input_get {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  text-decoration: none;
}
.vis{
   margin-top: 20px;
   border: 1px solid #EBEEF5;
}
.vis_ob{
    margin-top: 20px;
}
.vis_is{
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #EBEEF5;
}
</style>
