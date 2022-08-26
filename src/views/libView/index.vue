<template>
  <div class="lib_view">
    <SearchView></SearchView>
    <TableView></TableView>
  </div>
</template>
<script>
import TableView from "./tableView.vue";
import SearchView from "./searchView2.vue";
export default {
  components: { TableView, SearchView },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.lib_view {
  height: 100%;
  width: 100%;
  background: #fff;
}
</style>