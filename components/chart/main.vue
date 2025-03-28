<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
const echarts = require('echarts')

export default {
  props: {
    option: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      chartInstance: null,
    }
  },
  watch: {
    option(newv, oldv) {
      if (!newv) {
        return
      }
      this.drawChart(newv)
    },
    loading(newv) {
      if (this.chartInstance) {
        if (newv) {
          this.chartInstance.showLoading()
        }
        else {
          this.chartInstance.hideLoading()
        }
      }
    },
  },
  mounted() {
    // 装载屏幕变化时的函数
    window.addEventListener('resize', this.onScreenSizeChangedFixer)
    this.registerChartInstance()
  },
  beforeDestroy() {
    // 销毁屏幕变化时的函数
    window.removeEventListener('resize', this.onScreenSizeChangedFixer)
  },
  methods: {
    registerChartInstance() {
      const chartInstance = echarts.init(this.$refs.chart)
      this.chartInstance = chartInstance
    },
    drawChart(option) {
      if (!this.chartInstance) {
        return
      }
      else {
        this.chartInstance.setOption(option)
      }
    },
    // 屏幕变化时的自适应函数
    onScreenSizeChangedFixer() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>