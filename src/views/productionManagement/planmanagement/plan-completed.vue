<!-- 待完成准备计划填报 -->
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
        <el-descriptions-item label="重要程度"
          ><el-rate
            v-model="value2"
            disabled
            text-color="#ff9900"
            score-template="{value}"
            :max="1"
          >
          </el-rate
        ></el-descriptions-item>
        <el-descriptions-item label="备注">-</el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 填报情况 -->
    <div class="situation">
      <p class="title">填报情况</p>
      <el-divider></el-divider>
      <el-descriptions direction="vertical">
        <el-descriptions-item label="完成情况">
          <el-select v-model="value">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="延期完成时间"
          ><el-date-picker v-model="value1" type="date"> </el-date-picker>
        </el-descriptions-item>
        <el-descriptions-item label="情况说明">
          <el-input
            v-model="input"
            placeholder="简要说明，未完成或延期原因"
          ></el-input>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 文件 -->
    <div class="file">
      <p class="title">文件</p>
      <el-divider></el-divider>
      <div class="uploadfile">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon">上传文件</i>
        </el-upload>
      </div>
    </div>
    <!-- 底部取消和保存 -->
    <div class="footer">
      <span class="cancel" @click="cancel">取消</span>
      <span class="save" @click="save">保存</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "完成",
        },
        {
          value: "选项2",
          label: "延期完成",
        },
        {
          value: "选项3",
          label: "未完成",
        },
      ],
      value: "完成",
      value1: "",
      value2: 1,
      input: "",
      imageUrl: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    /* 文件上传成功后的提示 */
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    /* 上传文件格式和大小，目前是上传图片文件(后期根据需要修改成doc/pdf等样式还有大小) */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    /* 取消按钮 */
    cancel() {
    },
    /* 确认按钮 */
    save() {
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
  .uploadfile {
    padding: 24px 16px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    box-sizing: border-box;
    border-radius: 2px;
    padding-left: 10px;
    font-size: 14px;
    color: #8c939d;
    width: 400px;
    height: 40px;
    line-height: 40px;
    text-align: left;
  }
  .avatar {
    border-radius: 2px;
    width: 400px;
    height: 40px;
    display: block;
    box-sizing: border-box;
  }
  ::v-deep .el-upload {
    border: 1px solid #dcdfe6;
  }
  /* 底部取消和保存 */
  .footer {
    width: calc(100% - 142px);
    position: fixed;
    left: 142px;
    bottom: 0;
    height: 50px;
    background-color: #ffffff;
    box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    span {
      text-align: center;
      width: 58px;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      cursor: pointer;
    }
    .save {
      background-color: #0486fe;
      color: #ffffff;
      margin: 0 16px;
    }
  }
}
</style>
