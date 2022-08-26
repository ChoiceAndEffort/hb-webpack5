<template>
  <search
    :data="data"
    :filterMenu="filterMenu"
    @change="handleChange"
    @addCustom="addCustom"
    @close="close"
    @on-search="onSearch"
  />
</template>

<script>
import search from "@/components/Search/index.vue";
export default {
  data() {
    return {
      data: [
        {
          label: "项目名称",
          id: "11",
          list: [
            {
              value: "6",
              label: "双皮奶",
            },
            {
              value: "7",
              label: "蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎",
            },
            {
              value: "8",
              label: "龙须面",
            },
            {
              value: "9",
              label: "北京烤鸭",
            },
          ],
        },
        {
          label: "责任单位",
          id: "22",
          list: [
            {
              value: "16",
              label: "双皮奶22",
            },
            {
              value: "17",
              label: "蚵仔煎22",
            },
            {
              value: "18",
              label: "龙须面22",
            },
            {
              value: "19",
              label: "北京烤鸭22",
            },
          ],
        },
      ],
      filterMenu: [
        {
          label: "工种",
          value: "s1",
          id: "222",
        },
        {
          label: "单位",
          value: "s2",
          id: "333",
        },
        {
          label: "图纸名称",
          value: "s3",
          id: "444",
        },
      ],
    };
  },
  components: { search },
  methods: {
    /* 获取所有选中数据 */
    handleChange(val) {
      console.log('获取所有选中数据',val);
    },
    /* 添加自定义菜单筛选 */
    addCustom(data) {
      console.log("addCustom", data);
      let { label, value, id } = data;
      let model = [
        {
          value: "r1",
          label: "文员",
        },
        {
          value: "r2",
          label: "前端开发",
        },
        {
          value: "r3",
          label: "后台开发",
        },
      ];
      this.data.push({ type: "custom", label, id, list: model });
    },
    /* 关闭标签更新data数据 */
    close(id) {
      let inx = this.data.findIndex((val) => val.id === id);
      this.data.splice(inx, 1);
    },
    /* 全局搜索 */
    onSearch(key) {
      console.log(key);
    },
  },
};
</script>

<style></style>
