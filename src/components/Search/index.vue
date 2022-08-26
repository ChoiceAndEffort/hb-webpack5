<template>
  <div>
    <span
      class="search-item"
      v-for="(searchItem, index) in newData"
      :key="searchItem.id"
      :class="{ custom: searchItem.type }"
    >
      <el-popover :append-to-body="false" placement="bottom" trigger="click">
        <el-input
          class="search"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          v-model="searchItem.keyword"
          @input="onInput($event, index)"
        ></el-input>
        <div class="clear-item">
          已选 {{ searchItem.selectedLen || 0 }} 项
          <span
            v-show="searchItem.selectedLen > 0"
            @click="clearAllSelect(searchItem)"
            >清除所选</span
          >
        </div>
        <!-- 选择列表 -->
        <ul class="select-wrap">
          <li
            v-for="item in searchItem.list"
            :key="item.value"
            class="select-item"
            @click.prevent="onChange(item, searchItem)"
          >
            <template v-if="searchItem.type !== 'filter'">
              <span class="label">{{ item.label }}</span>
              <span class="check">
                <i class="el-icon-check" v-show="item.active"></i>
              </span>
            </template>
            <template v-else>
              <el-checkbox v-model="item.active">{{ item.label }}</el-checkbox>
              <span class="check font-color">单选菜单</span>
            </template>
          </li>
        </ul>

        <!-- 是否是自定义菜单 -->
        <span slot="reference" class="menu-item">
          <template v-if="searchItem.type === 'filter'">
            <el-button icon="el-icon-plus" size="mini" class="screen">{{
              searchItem.label
            }}</el-button>
          </template>
          <template v-else :class="{ custom: searchItem.type === 'custom' }">
            {{ searchItem.label }}
            <span
              ref="selectContent"
              class="select-content"
              :style="{ width: searchItem.selectWidth }"
            >
              {{ searchItem.content || "请选择" }}</span
            >
            <i class="el-icon-caret-bottom triangle"></i>
            <i
              class="el-icon-error close"
              v-if="searchItem.type === 'custom'"
              @click="closeMenu(searchItem)"
            ></i>
          </template>
        </span>
      </el-popover>
    </span>

    <el-input
      suffix-icon="el-icon-search"
      placeholder="请输入姓名、工号、手机号"
      class="search-all"
      v-model="keyWords"
      @keyup.enter.native="onSearch"
    ></el-input>
  </div>
</template>

<script>
/* 使用示例
<search
    :data="data"
    :filterMenu="filterMenu"
    @change="handleChange"
    @addCustom="addCustom"
    @close="close"
    @on-search="onSearch"
  />
/**
 * @name: 搜索
 * @test: 
 * @msg: 
 * @param {*
 * data  文件菜单list数据
 * filterMenu 筛选菜单list数据
 * 格式例如：
 * data: [
        {
          label: "项目名称",
          id: "11",
          list: [
            {
              value: "6",
              label: "双皮奶",
              id: "111",
            },
            {
              value: "7",
              label: "蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎",
              id: "222",
            },
            {
              value: "8",
              label: "龙须面",
              id: "333",
            },
            {
              value: "9",
              label: "北京烤鸭",
              id: "444",
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
              id: "555",
            },
            {
              value: "17",
              label: "蚵仔煎22",
              id: "666",
            },
            {
              value: "18",
              label: "龙须面22",
              id: "777",
            },
            {
              value: "19",
              label: "北京烤鸭22",
              id: "888",
            },
          ],
        },
      ],
      filterMenu: [
        {
          label: "工种",
          value: "s1",
          id: "2222",
        },
        {
          label: "单位",
          value: "s2",
          id: "3333",
        },
        {
          label: "图纸名称",
          value: "s3",
          id: "4444",
        },
      ],
 * }
 * @function {
 * change  获取勾选的所有数据
 * addCustom 添加自定义菜单 需要更新data数据
 * close 关闭自定义菜单标签 需要更新data数据
 * on-search 全局搜索
 * }
 * @return {*}
 */
import _ from "lodash";
export default {
  name: "Search",
  data() {
    return {
      search: "",
      keyWords: "",
      newData: [],
      selectedData: [], //选中的数据
    };
  },
  props: {
    data: {
      //菜单列表
      type: Array,
      default: () => [],
    },
    filterMenu: {
      //自定义菜单列表
      type: Array,
      default: () => [],
    },
  },
  methods: {
    /* 勾选list 自定义菜单勾选后需要新建菜单 并且可删除*/
    onChange(item, parItem) {
      let bool = item.active ? false : true;
      console.log('ssssss',bool)
      this.$set(item, "active", bool);
      const vals = parItem.list.filter((val) => val?.active);
      const labels = vals.map((con) => con.label);
      parItem["selectedLen"] = labels.length;

      if (parItem.type === "filter") {
        //选中的需要创建新的菜单
        bool ? this.$emit("addCustom", item) : this.closeMenu(parItem);
      } else {
        parItem["content"] = labels.join("，");
        parItem["selectWidth"] = parItem["content"].length * 12 + 20 + "px";
      }

      /* let index = -1;
      
      console.log('vals',{ ...vals[0]}, bool)
      if(bool){
        let aa = { ...vals[0]}
        this.selectedData.push(aa)
      }else {

      } */
     /*  bool
        ? this.selectedData.push(aa),console.log('ccc',this.selectedData))
        : (index = this.selectedData.findIndex(val => val.active)),
        this.selectedData.splice(index, 1);
        console.log('1111', this.selectedData); */

      //传所有列表勾选的字段 暂时循环处理数据 后期看能否优化
      let selected = []
      this.newData.forEach((val,index) => {
        if(index !== this.newData.length - 1){
          selected.push(...val.list.filter(item => item.active))
        }
        
      })
      this.$emit("change", selected);
      console.log("数据", this.newData, this.filterMenu);
    },
    /* 清除所选 */
    clearAllSelect(item) {
      item.list.forEach((val) => (val.active = false));
      item.content = "";
      item.selectWidth = 0;
    },
    /* 搜索 */
    onInput: _.debounce(function (value, index) {
      const type = this.newData[index]?.type;
      const inx = type === "filter" ? this.newData.length - 1 : index;
      const handleArr =
        type === "filter" ? this.filterMenu : this.data[index].list;
      const arr = handleArr.filter((val) => val.label.includes(value));
      this.newData[inx].list = [...arr];
      console.log("ajax发请求22", arr);
    }, 500),
    /* 关闭添加的自定义菜单 */
    closeMenu(parItem) {
      let inx = this.newData.findIndex((val) => val.id === parItem.id);
      this.newData.splice(inx, 1);
      let data = this.newData[this.newData.length - 1];
      let menuIndex = data.list.findIndex((val) => val.id === parItem.id);
      data.list[menuIndex].active = false;
      console.log("closeMenu", this.newData);
      this.$emit("close", parItem.id);
    },
    /* 外层搜索，给关键字父组件自己搜 */
    onSearch() {
      this.$emit("on-search", this.keyWords);
    },
  },
  watch: {
    data: {
      handler(nval) {
        if (nval) {
          let arr = JSON.parse(JSON.stringify(nval));
          if (this.newData.length) {
            //获取data中新的数据 但是不覆盖原有newData的数据
            let ids = this.newData.map((val) => val.id);
            let newArr = this.data.filter((val) => !ids.includes(val.id));
            // let customData = JSON.parse(
            //   JSON.stringify(this.newData[this.newData.length - 1])
            // );
            // console.log('customData',customData)
            // arr.push(customData);
            this.newData.splice(
              this.newData.length - 1,
              0,
              ...JSON.parse(JSON.stringify(newArr))
            );
          } else {
            this.filterMenu.length > 0 &&
              arr.push({
                type: "filter",
                label: "筛选",
                list: this.filterMenu,
              });
            this.newData = JSON.parse(JSON.stringify(arr));
          }

          console.log("数据22", this.newData, this.filterMenu);
        }
      },
      immediate: true,
    },
  },

  computed: {
    /* newData: {
      get() {
        return JSON.parse(JSON.stringify(this.data));
      },
      set(newVal){
        return newVal
      }
    }, */
  },
};
</script>

<style lang="scss" scoped>
$color: #a3a8ad;
.search-item {
  // min-width: 134px;
  max-width: 272px;
  font-size: 14px;
  height: 30px;
  display: inline-block;
  margin-right: 24px;
  border-radius: 2px;
  &.custom {
    height: 32px;
  }
  &:hover {
    background: #e5e6eb;
    .screen {
      background: #e5e6eb;
    }
    .close {
      display: inline-block;
    }
  }

  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border: none;
    padding: 0 5px;
  }

  .search {
    ::v-deep .el-input__inner {
      height: 36px;
      line-height: 36px;
      padding-left: 36px;
    }
  }

  .clear-item,
  .select-item {
    height: 36px;
    line-height: 36px;
    padding: 0 12px;
  }
  .clear-item {
    color: #56585c;
    font-size: 12px;
    span {
      color: #1678ff;
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .select-wrap {
    overflow: auto;
  }
  .select-item {
    color: #242833;
    cursor: pointer;
    &:hover {
      background: #f2f3f5;
    }
    .label {
      max-width: 298px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .check {
      display: inline-block;
      padding-left: 12px;
      color: #1678ff;
      vertical-align: top;
      float: right;
    }
    .font-color {
      color: $color;
    }
  }
  ::v-deep .el-popover {
    padding: 0;
  }
}
::v-deep .el-popover__reference-wrapper {
  /* .menu-item {
    width: 100%;
    height: 100%;
  } */

  position: relative;
  color: $color;
  display: inline-block;
  padding: 0 6px;
  // width: 100%;
  .select-content {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    max-width: 180px;
    min-width: 42px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    color: #242833;
    margin-top: -2px;
  }
  .screen {
    width: 60px;
    height: 32px;
    background: #fff;
    border: none;
    color: #242833;
    padding: 0;
  }
  .close {
    position: absolute;
    top: -4px;
    left: -4px;
    z-index: 10;
    color: #c9cdd4;
    display: none;
  }
  &.custom {
    .select-content {
      height: 32px;
      line-height: 32px;
    }
  }
}
.search-all {
  width: 228px;
  height: 32px;
  ::v-deep .el-input__inner,
  ::v-deep .el-input__suffix {
    height: 32px;
    top: -4px;
  }
}
</style>
