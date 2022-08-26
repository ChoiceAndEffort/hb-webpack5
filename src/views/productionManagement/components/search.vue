<template>
  <el-form :ref="formName"
    v-bind="$attrs"
    :model="formData"
    class="search_box">
    <el-row type="flex"
      align="middle"
      class="container">
      <template v-for="(item, index) in _renderData">
        <el-col :xl="6"
          :lg="8"
          :key="index"
          v-show="isShow(index)">
          <el-form-item :label="item.label ? item.label : ' '"
            :class="[item.label?'':'not-label']">
            <slot v-if="item.slot"
              :name="item.slot"
              :scope="formData" />
            <el-select v-else-if="item.tag == 'el-select'"
              clearable
              filterable
              v-bind="item.attrs || {}"
              v-on="item.listeners || $listeners || {}"
              v-model="formData[item.attrs.key]">
              <el-option v-for="option in item.attrs.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"></el-option>
            </el-select>
            <component v-else
              :is="item.tag"
              :key="typeof item.attrs.keys === 'number'?item.attrs.keys:item.attrs.key"
              v-model="formData[item.attrs.key]"
              v-bind="item.attrs || {}"
              v-on="item.listeners || {}"></component>
          </el-form-item>
        </el-col>
      </template>
      <el-col class="operation"
        :xl="{span: 6,offset: getXlOffset}"
        :lg="{span: 8,offset: getLgOffset}">
        <el-form-item class="operation-item">
          <el-button @click="handleReset">{{
            $attrs.resetContext || "重置"
          }}</el-button>
          <el-button @click="handleSubmit"
            type="primary">{{
            $attrs.submitContext || "确定"
          }}</el-button>
          <el-button v-if="renderData.length > 3"
            type="text"
            @click="handleExtend">
            {{ extend ? "收起" : "展开" }}
            <i :class="[extend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    formName: {
      // 表单名
      type: String,
      default: "form",
    },
    renderData: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      formData: {},
      formDataReset: {},
      extend: false // 是否展开
    };
  },
  created() { },
  computed: {
    _renderData() {
      this.renderData.forEach((item) => {
        if (!item.attrs || !item.attrs.key) return;
        this.$set(
          this.formData,
          item.attrs.key,
          item.attrs.value ? item.attrs.value : ""
        );
        // console.log(item,'item');
        this.$set(this.formDataReset, item.attrs.key, "");
      });
      return this.renderData;
    },
    getXlOffset() {
      return this.extend ? (3 - this.renderData.length % 4) * 6 : this.renderData.length > 2 ? 0 : (3 - this.renderData.length) * 6
    },
    getLgOffset() {
      return this.extend ? (2 - this.renderData.length % 3) * 8 : this.renderData.length > 2 ? 16 : (2 - this.renderData.length) * 8
    },
    isShow() {
      return (value) => {
        if (this.renderData.length > 3) {
          return this.extend ? true : value < 3
        } else {
          return true
        }
      }
    }
  },
  methods: {
    // 重置按钮
    handleReset() {
      this.$refs[this.formName].resetFields()
      this.formData = this.formDataReset
      this.$emit('handle-reset')
    },
    // 提交按钮
    handleSubmit() {
      this.$emit('handle-submit', this.formData)
    },
    // 展开事件
    handleExtend() {
      this.extend = !this.extend;
    },
  },
};
</script>

<style lang="scss" scoped>
.search_box {
  margin-bottom: 16px;
}
.container {
  background-color: #fff;
  padding: 16px 16px 0;
  width: 100%;
  font-size: 14px;
  flex-wrap: wrap;
  ::v-deep .el-col {
    > .el-form-item {
      padding: 0 12px;
    }
    .el-form-item:not(.operation-item) {
      display: flex;
      justify-content: space-between;
      .el-form-item__label {
        flex: 0 0 130px;
        padding-right: 0;
        &::after {
          content: ":";
          position: relative;
          top: 0;
          margin: 0 8px 0 2px;
        }
      }
      .el-form-item__content {
        flex: 1;
        //width: calc(100% - 130px);
        > div {
          width: 100%;
        }
      }
    }
    .el-form-item.not-label {
      .el-form-item__label::after {
        content: "";
      }
    }
  }
  .operation {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
