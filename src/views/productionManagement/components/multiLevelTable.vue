<template>
  <el-table :data="tabledata"
    :max-height="maxHeight"
    :header-cell-style="{ background: '#F2F6FC' }"
    v-bind="$attrs"
    v-on="$listeners">
    <el-table-column label="序号"
      v-if="!ishasSelfSerial"
      type="index"
      width="50"
      align="center"
      :index="indexMethod"
      :fixed="isSerialfixed">
    </el-table-column>
    <el-table-column v-for="item in tableConfig"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      :key="item.id"
      :fixed="item.fixed"
      :align="item.align || 'center'">

      <template v-if="!item.children||item.children.length==0"
        slot-scope="scope">
        <slot v-if="item.slot"
          :name="item.slot"
          :scope="scope"></slot>
        <slot v-else
          :name="item.slot"
          :scope="scope">{{scope.row[item.prop]}}</slot>
      </template>

      <el-table-column v-for="item1 in item.children"
        :label="item1.label"
        :prop="item1.prop"
        :width="item1.width"
        :key="item1.id"
        :align="item1.align || 'center'">
        <el-table-column v-for="item2 in item1.children"
          :label="item2.label"
          :prop="item2.prop"
          :width="item2.width"
          :key="item2.id"
          :align="item2.align || 'center'">
        </el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    tabledata: { // 框和按钮大小
      type: Array,
      default: () => []
    },
    tableConfig: { // 按钮
      type: Array,
      default: () => []
    },
    maxHeight: {
      type: Number,
      default: 420
    },
    //序号是否固定
    isSerialfixed: {
      type: Boolean,
      default: false
    },
    //是否用自己的序号
    ishasSelfSerial: {
      type: Boolean,
      // default: false
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 < 10 ? `0${index + 1}` : index + 1;
    },
  }

}
</script>