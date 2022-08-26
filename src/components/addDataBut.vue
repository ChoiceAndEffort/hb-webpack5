<template>
  <div class="addDataBut" @click="addClick">+ 添加一行数据</div>
</template>
<script>
export default {
  methods: {
    addClick() {
      this.$emit("addClick");
    },
  },
};
</script>
<style lang="scss" scoped>
.addDataBut {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  font-size: 13px;
  text-align: center;
  border: 1px dashed #e4e7ed;
  line-height: 36px;
  cursor: pointer;
  color: #303133;
  margin-top: 10px;
  border-radius: 2px;
  &:hover {
    background-color: #ecf5ff;
    border: 1px solid #c6e2ff;
  }
}
</style>