<template>
  <el-form :ref="formName" v-bind="$attrs" :model="formData" class="search_box">
    <el-row type="flex" align="middle" class="container">
      <template   v-for="(item, index) in _searchData">
        <el-col :xl="6" :lg="8" :key="index" v-show="isShow(index)">
          <el-form-item
            :label="item.label ? item.label : ' '"
            :class="[item.label ? '' : 'not-label']"
          >
            <slot v-if="item.slot" :name="item.slot" :scope="formData" />
            <el-select
              v-else-if="item.tag == 'el-select'"
              clearable
              filterable
              :size="sizeType"
              v-bind="item.attrs || {}"
              v-on="item.listeners || $listeners || {}"
              v-model="formData[item.attrs.key]"
            >
              <el-option
                v-for="option in item.attrs.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
            <component
              v-else
              :is="item.tag"
              :size="sizeType"
              :clearable="item.clearable?item.clearable:true"
              :key="
                typeof item.attrs.keys === 'number'
                  ? item.attrs.keys
                  : item.attrs.key
              "
              v-model="formData[item.attrs.key]"
              v-bind="item.attrs || {}"
              v-on="item.listeners || {}"
            ></component>
          </el-form-item>
        </el-col>
      </template>
      <el-col
        class="operation"
        :xl="{ span: 6, offset: getXlOffset }"
        :lg="{ span: 8, offset: getLgOffset }"
      >
        <el-form-item class="operation-item">
          <el-button @click="handleSubmit" type="primary" :size="sizeType">{{
            $attrs.submitContext || "查询"
          }}</el-button>
          <el-button @click="handleReset" :size="sizeType">{{
            $attrs.resetContext || "重置"
          }}</el-button>
          <el-button
            v-if="searchData.length > 3"
            type="text"
            :size="sizeType"
            @click="handleExtend"
          >
            {{ extend ? "收起" : "展开" }}
            <i
              :class="[extend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
            ></i>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    /*
      formName:表单名
    */
    formName: {
      type: String,
      default: "form",
    },
    searchData: {
      type: Array,
      default: () => [],
      required: true,
      /*
        searchData:表单数据
        type:数组
        searchData:[
          {
            tag:'',         **表单类型* 必填 ，可选值：el-select,el-cascader,el-date-picker,el-input等,适配element所有表单类型控件
            label:'',       **字段名称* 必填 ,
            attrs:{         **字段参数* 必填 
                ref:"",     **ref字段*  关联必填
                key:"",     **参数名称* 必填, 用于表单提交时返回的对象的key,可以根据接口参数对照命名
                keys:"",    **原始值*   选填, 当keys为Number类型是启用
                options:[   **下拉列表数组* 关联必填, 当tag为el-select 是为 必填
                    {              
                      value: "",    
                      label: "",
                    }
                    *注:options内为对象，默认key 分别是 value 和 label
                ],
                props:{     **级联选择参数* 关联必填, 当tag为el-cascader 是为 必填
                    value:"",           **必填  指定选项的值为选项对象的某个属性值
                    label:"",           **必填  指定选项标签为选项对象的某个属性值	
                    checkStrictly:      **选填  是否严格的遵守父子节点不互相关联  默认值 false
                    expandTrigger:	    **选填  次级菜单的展开方式    click / hover
                    children:[          **级联选择数组参数* 关联必填, 当tag为el-cascader 是为 必填
                        props:{        
                            value:"",   
                            label:"",   
                            children:[ 
                                ---- 参照children 父子级 多级联动数据----
                            ]
                        }
                    ]
                    注:props更多参数参照element-ui -> Cascader级联选择器 -> Props  https://element.eleme.cn/#/zh-CN/component/cascader
                }
                listeners:{ **监听事件* 选填
                    change: Function,           选中值发生变化时触发
                    clear: Function,            可清空的单选模式下用户点击清空按钮时触发
                    visible-change: Function, 	下拉框出现/隐藏时触发
                    remove-tag: Function, 	    多选模式下移除tag时触发
                    blur: Function,             当 input 失去焦点时触发
                    focus: Function, 	          当 input 获得焦点时触发

                    *注:listeners更多事件参照element-ui  不同组件所对应的事件有所不同
                }
            },
            clearable:"",   **可清空* 选填(建议必填) Boolean类型 默认 true
            placeholder:""  **输入框占位文本* 选填(建议必填) String类型,
            submitContext:"" **提交按钮名称 *选填  默认 查询
            resetContext:""  **重置按钮名称 *选填  默认 重置
          }
        ]
      */
    },
    sizeType: {
      type: String,
      default: "small",
      /*
        表单控件尺寸，可选值  medium / small / mini
      */
    },
  },
  data() {
    return {
      formData: {},
      formDataReset: {},
      extend: false, // 是否展开
    };
  },
  created() {
  
  },
  computed: {
    _searchData() {
      this.searchData.forEach((item) => {
        if (!item.attrs || !item.attrs.key) return;
        this.$set(
          this.formData,
          item.attrs.key,
          item.attrs.value ? item.attrs.value : ""
        );
        this.$set(this.formDataReset, item.attrs.key, "");
      });
      return this.searchData;
    },
    getXlOffset() {
      return this.extend
        ? (3 - (this.searchData.length % 4)) * 6
        : this.searchData.length > 2
        ? 0
        : (3 - this.searchData.length) * 6;
    },
    getLgOffset() {
      return this.extend
        ? (2 - (this.searchData.length % 3)) * 8
        : this.searchData.length > 2
        ? 16
        : (2 - this.searchData.length) * 8;
    },
    isShow() {
      return (value) => {
        if (this.searchData.length > 3) {
          return this.extend ? true : value < 3;
        } else {
          return true;
        }
      };
    },
  },
  methods: {
    // 重置按钮
    handleReset() {
      this.$refs[this.formName].resetFields();
      this.formData = this.formDataReset;
      this.$emit("handle-reset");
    },
    // 提交按钮
    handleSubmit() {
      console.log(this.formData);
      this.$emit("handle-submit", this.formData);
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
      margin-bottom: 10px;
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
