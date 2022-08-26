const INIT_SEARCH = {
  page: 0,
  size: 10
};
export default {
  data() {
    return {
      searchColConfig: undefined // 表头下的搜索项配置,目前仅支持input和select类型的查询项配置
    }
  },
  methods: {
    handleResetSearch() {
      this.searchForm = {
        ...JSON.parse(JSON.stringify(INIT_SEARCH))
      };
      console.log('重置查询条件', this.searchForm);
    }
  },
  created() {
    this.searchColConfig = JSON.parse(JSON.stringify(this.colConfig)).filter(
      (item) =>
        item.slotHeaderSearchType === 'input' ||
            item.slotHeaderSearchType === 'select'
    );
  }
}
