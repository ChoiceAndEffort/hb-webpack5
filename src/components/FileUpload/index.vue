<template>
  <div class="upload-wrapper">
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
      :limit="limit"
      :on-exceed="handleExceed"
      :file-list="fileList"
      v-bind="$attrs"
      v-on="$listeners"
      ref="fileUpload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <slot name="tips" class="tips"></slot>
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <ul class="size-wrapper" ref="sizeWrap">
      <li v-for="item in newFileList" :key="item.id">
        {{ readablizeBytes(item.size) }}
      </li>
    </ul>
  </div>
</template>

<script>
 /* 使用示例
 具名插槽tips 增加提示语
<FileUpload :uploadUrl="uploadUrl" :limit="limit" :fileList="fileList">
      <template v-slot:tips><div>{{tips}}</div></template>
</FileUpload>  */
/**
 * @name: 文件上传
 * @test: test font
 * @msg: 
 * @param {*
 * limit  文件限制上传数
 * uploadUrl 上传地址
 * fileList 文件列表
 * }
 * @return {*}
 */

export default {
  data() {
    return {
      newFileList: []
    };
  },
  props: {
    uploadUrl: {
      type: String,
      default: () => "",
    },
    limit: {
      type: Number,
      default: 0,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.newFileList = this.fileList.length && JSON.parse(JSON.stringify(this.fileList))
  },
  mounted() {
    let height = this.$refs.fileUpload.$children[0].$el.offsetHeight
    this.$refs.sizeWrap.style.top = height + 3 + 'px'
  },
  methods: {
    /* size转化 */
    readablizeBytes(value) {
      //若file_length 返回0 则返回空字符
      if (value == 0) return "";
      let s = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
      let e = Math.floor(Math.log(value) / Math.log(1024));
      return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log("fileList", this.fileList);
      this.newFileList = fileList;
      this.$emit("on-remove", { file, fileList });
    },
    handlePreview(file) {
      console.log(file);
      this.$emit("on-preview", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      this.$emit("before-remove", { file, fileList });
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.newFileList = fileList;
      this.$emit("on-success", { response, file, fileList });
    },
    handleError(err, file, fileList) {
      console.log("上传失败", err, file, fileList);
      this.$message.error("上传失败");
      this.$emit("on-error", { err, file, fileList });
    },
  }
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
  width: 352px;
  font-size: 14px;
  position: relative;
  color: #242833;
  .size-wrapper {
    position: absolute;
    right: 50px;
    top: 35px;
    color: #a3a8ad;
    li {
      height: 25px;
      line-height: 25px;
      margin-top: 10px;
    }
  }
}
::v-deep .el-upload--text {
  text-align: left;
}
::v-deep .el-upload-list__item-name {
  padding: 2.5px 0 2.5px 4px;
  .el-icon-document {
    color: transparent;
    background: url("@/assets/icons/iconLink/iconLink.svg") no-repeat;
    line-height: 19px;
  }
}

::v-deep .el-upload-list__item {
  .el-icon-upload-success {
    color: #52c41a;
  }
  &:hover {
    .el-upload-list__item-name {
      background: #e8f5ff;
      .el-icon-document {
        background: url("@/assets/icons/iconLink/iconLink2.svg") no-repeat;
      }
    }
    .el-icon-close::before {
      content: "\e78d";
    }
  }
}
::v-deep .el-icon-circle-check:before {
  content: "\e6da";
}
</style>
