<template>
  <div class="billState">
    <i :style="{ backgroundColor: stateArr[stateId].color }"></i>
    <span>{{ stateArr[stateId].label }}</span>
  </div>
</template>
<script>
export default {
  props: { 
    stateId:{
      default:'0'
    }  
  },
  data() {
    return {
      stateArr: {
        0: { label: "未提交", value: "0", color: "#F53F3F" },
        1: { label: "处理中", value: "1", color: "#FF7D00" },
        2: { label: "已审核", value: "2", color: "#00B42A" },
        3: { label: "已过账", value: "3", color: "#00B42A" },
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.billState {
  display: flex;
  align-items: center;
  cursor: pointer;
  i {
    height: 6px;
    width: 6px;
    border-radius: 6px;
    margin: 6px;
  }
}
</style>