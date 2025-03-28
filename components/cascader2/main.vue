<!-- 这个组件纯粹是对elementUI - <el-cascader /> 的一个优化组件，非必要则默认不使用 -->
<!-- 与原版 Cascader 组建的区别 -->
<!-- ------------------------ -->
<!-- ！支持使用最末端的值用于标记所选值 v-model -->
<!-- 实现方案：
     - 自定义 v-model
     - 选择后仅返回最末端 value 而不是一整个数组
     - 并且在收到一个最末端值之后计算出一整串显示序列，然后再显示末端节点的文案 -->

<template>
  <el-cascader v-model="cv" v-bind="$props" v-on="$listeners" :inheritAttrs="false" :options="options"
    @change="onChange"></el-cascader>
</template>

<script>
import { Cascader } from 'element-ui'

export default {
  name: 'Cascader2',
  extends: Cascader,
  // 使用inheritAttrs: false来避免将父组件的事件直接绑定到子组件上
  inheritAttrs: false,
  props: { value2: { type: [String, Number], default: '' } },
  model: {
    prop: 'value2',
    event: 'change',
  },
  data() {
    return {
      cv: null,
    }
  },
  watch: {
    value2(newv, oldv) {
      if (newv !== oldv) {
        // 可清空
        if (!newv) {
          this.cv = null
        }
        this.calcCv()
      }
    }
  },
  mounted() {
    // 初始时计算一次单值寻根
    this.calcCv()
  },
  methods: {
    onChange(v) {
      this.$emit('change', v[v.length - 1])
    },
    calcCv() {
      const { value2, options } = this
      const { tailingData } = this
      const key = this.props.value
      // 计算所得的结果
      const resultArr = []

      // 将树形数据平铺
      const dataSource = tailingData(options, { children: 'children' })

      // 循环安排 resultArr
      function loop(v) {
        const _target = dataSource.find((item) => {
          return item[key] === v
        })
        if (_target) {
          resultArr.push(_target[key])

          if (_target.parentId) {
            loop(_target.parentId)
          }
        }
      }

      loop(value2)

      this.cv = resultArr.reverse()
    },
    // 将树形数据平铺
    tailingData(arr, option) {
      const { children } = option
      const result = []

      function loop(_arr) {
        _arr.forEach((item) => {
          result.push(Object.assign({}, item))
          if (item[children] instanceof Array) {
            loop(item[children])
          }
        })
      }

      loop(arr)

      return result
    },
  }
}
</script>

<style lang="scss" scoped></style>
