<template>
  <div class="chart">
    <div ref="chart" :style="{width: width,height: height}">
    </div>
  </div>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from '@/utils/productionManagement/echarts.min.js';

export default {
  name: 'ChartView',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartOption: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: 'canvas'
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartOption: {
      deep: true,
      handler(newVal) {
        this.setOptions(newVal)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      window.addEventListener('resize',this.handleResize)
    }
  },
  beforeDestroy() {
    if (!this.chart) return
    if (this.autoResize) window.removeEventListener('resize',this.handleResize)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    handleResize() {
      this.chart.resize()
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart,'',{
        renderer: this.type
      })
      this.setOptions(this.chartOption)
      this.chart.on('click',this.handleClick)
    },
    handleClick(params) {
      this.$emit('click',params)
    },
    setOptions(option) {
      this.clearChart()
      this.handleResize()
      if (this.chart) {
        this.chart.setOption(option)
      }
    },
    refresh() {
      this.setOptions(this.chartOption)
    },
    clearChart() {
      this.chart && this.chart.clear()
    }
  },
};
</script>

<style scoped lang="scss">
</style>
