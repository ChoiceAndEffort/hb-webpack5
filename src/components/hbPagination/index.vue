<template>
  <el-pagination
    background
    v-if="hasPagination"
    class="pagination-wrap"
    @size-change="handleSizeChange"
    @current-change="currentChange"
    :total="pagination.total || 0"
    :page-size="pagination.pageSize"
    :page-sizes="pagination.pageSizesArr || [10, 20, 50,100]"
    :current-page.sync="pagination.currentPage"
    :layout="
      isShowLayoutSizes
        ? 'total,sizes, prev, pager, next, jumper'
        : 'total, prev, pager, next, jumper'
    "
  ></el-pagination>
</template>

<script>
export default {
  data() {
    return {
      pagination: {},
      hasPagination: false,
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          currentPage: 0,
          data: [],
          first: true,
          last: true,
          lastPage: 1,
          total:0,
          totalPages: 1,
          page: 0,
          size: 10,
        };
      },
    },
    isShowLayoutSizes: {
      type: Boolean,
      required:false,
      default: () => false,
    },
  },
  methods: {
    /**
     * 切换页码
     * @param { Number } pageIndex 页码
     */
    currentChange(pageIndex) {
      this.$emit("changePage", pageIndex - 1);
    },
    handleSizeChange(val) {
      // this.pagination.size = val;
      this.$emit("sizeChange", val);
      console.log(`每页 ${val} 条`);
    },
  },
  watch: {
    data: {
      handler: function (newData, old) {
        this.pagination = newData;
        // console.log("-----------this.pagination", this.pagination);
        if (newData.data) {
          if (newData.data.length == 0) {
            this.hasPagination = false;
          } else {
            this.hasPagination = true;
          }
        }
        this.$set(this.pagination, "currentPage", newData.page + 1);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.pagination-wrap {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-end;
}
</style>
