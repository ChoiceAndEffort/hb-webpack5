<template>
  <div class="table-config">
    <div class="config-header">
      <span>表头设置</span>
      <span class="recovery-btn" @click="handleRecovery">恢复默认</span>
    </div>
    <!-- 不可拖拽区 -->
    <div v-for="(item, index) in list" :key="index" class="item">
      <div class="label" v-show="item.attrs.prop && item.dragLocked">
        <span class="label-title"> {{ item.attrs.label }}</span>
        <el-switch
          :disabled="item.switchDisabled || false"
          v-model="item.switch"
          active-color="#409eff"
          inactive-color="#dcdfe6"
          @change="handleSwitchChange"
          size="mini"
        >
        </el-switch>
      </div>
    </div>

    <div class="divider">-------------以上属性不可排序-------------</div>
    <!-- 可拖拽区 -->
    <draggable
      class="wrapper"
      v-model="list"
      @end="onEnd"
      :move="onMove"
      :animation="200"
      :scroll="true"
    >
      <transition-group>
        <div v-for="(item, index) in list" :key="index" class="item">
          <div class="label" v-show="item.attrs.prop && !item.dragLocked">
            <i class="el-icon-rank"></i>
            <span class="label-title"> {{ item.attrs.label }}</span>

            <el-switch
              :disabled="item.switchDisabled || false"
              v-model="item.switch"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              size="mini"
              @change="handleSwitchChange"
            >
            </el-switch>
          </div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

 
<script>
import draggable from "vuedraggable";
export default {
  props: {
    initList: {
      type: Array,
      require: false,
      default: () => {
        return [];
      },
    },
    saveComponentKey: {
      type: String,
      require: false,
      default: () => "",
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      list: JSON.parse(JSON.stringify(this.initList)),
    };
  },
  computed: {
    haveHbSetting() {
      return this.initList.some((item) => item.slotHeaderName === "hbSetting");
    },
  },
  // watch: {
  //   list: {
  //     handler(nv, ov) {
  //       console.log("-----监听开关值变化进来了", nv);
  //       // this.$emit("changeColConfig", this.list);
  //       // sessionStorage.setItem(this.urlPath, JSON.stringify(this.list));
  //     },
  //     deep: true,
  //     // immediate: true,
  //   },
  // },
  methods: {
    updateList() {
      if (this.haveHbSetting) {
        this.$emit("changeColConfig", this.list);
        sessionStorage.setItem(
          this.saveComponentKey,
          JSON.stringify(this.list)
        );
      }
    },

    onEnd() {
      this.updateList();
    },
    onMove(e) {
      console.log("拖动的哪一个", e.draggedContext.element.dragLocked);
      if (e.draggedContext.element.dragLocked) return false;
    },
    handleRecovery() {
      if (this.haveHbSetting) {
        sessionStorage.removeItem(this.saveComponentKey); //清除存储项
        this.list = JSON.parse(JSON.stringify(this.initList)); //配置项恢复默认值
        this.$emit(
          "changeColConfig",
          JSON.parse(JSON.stringify(this.initList))
        ); //表格恢复默认值
      }
    },
    handleSwitchChange() {
      this.updateList();
    },
  },
  created() {
    if (this.haveHbSetting) {
      this.list = JSON.parse(sessionStorage.getItem(this.saveComponentKey))
        ? JSON.parse(sessionStorage.getItem(this.saveComponentKey))
        : JSON.parse(JSON.stringify(this.initList));
    }
  },
};
</script>
<style lang="scss">
.table-config {
  padding: 15px;
  .config-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  .recovery-btn {
    color: #409eff;
    cursor: pointer;
  }
  .divider {
    color: #b8c0cb;
    margin: 10px 0;
    padding: 0 4px;
    font-size: 12px;
  }
  .label {
    padding: 8px 8px;
    margin-bottom: 10px;
    display: flex;
    border: 1px dashed #ccc;
    justify-content: space-between;
    align-items: center;
    .el-icon-rank {
      cursor: pointer;
    }
    .label-title {
      display: inline-block;
      max-width: 150px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
      color: #202d40;
    }
  }
}
</style>
  