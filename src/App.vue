<template>
  <div id="app">
    <router-view class="main-page" />
  </div>
</template>

<script>
</script>

<style lang="scss">
@import "./styles/reset.scss";
@import "./styles/gggj-common.scss";
@import url("//unpkg.com/element-ui@2.15.6/lib/theme-chalk/index.css");
#app {
  height: 100%;
  width: 100%;
  min-width: 1000px;
  overflow: hidden;
  background: #e5e5e5;
  font-family: "PingFang SC";
}
.main-page {
  height: 100%;
}
</style>
