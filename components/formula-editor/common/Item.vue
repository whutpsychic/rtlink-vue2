<template>
  <div :class="active ? `fic active` : `fic`" :style="`width:${width};min-width: ${withOffset ? '240px' : '170px'};`"
    @click="handleClick">
    <div class="item-can">
      <el-input :placeholder="$t('rtcom.plz_select')" v-model="mainValueLabel" @focus="onFocus"></el-input>
      <div v-if="withOffset" style="margin-left: 10px;">
        <el-input-number style="width: 80px;" v-model="num" controls-position="right" :min="-100" :max="100"
          @change="onChangeNum"></el-input-number>
      </div>
    </div>
    <i class="el-icon-circle-close" @click="$emit('delete')"></i>
    <ItemDialog ref="dialog" :allData="optionData" @submit="handleSubmit"></ItemDialog>
  </div>
</template>

<script>
import ItemDialog from './ItemDialog.vue'
export default {
  components: { ItemDialog },
  props: {
    label: { type: String, default: "" },
    value: { type: [String, Number], default: () => ([]) },
    width: { type: String, default: "" },
    optionData: { type: Array, default: () => ([]) },
    active: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    // 变量跟随偏移量
    withOffset: { type: Boolean, default: false },
    spliter: { type: String, default: "|" },
  },
  data() {
    return {
      mainValue: null,
      mainValueLabel: '',
      num: 0,
    }
  },
  watch: {
    optionData: {
      handler(newv, oldv) {
        const { value, _getValueArrByV } = this
        const result = _getValueArrByV(value, newv)
        this.mainValue = result
      },
    },
    value: {
      handler(newv, oldv) {
        this.react(newv)
      },
    },
    mainValue: {
      handler(newv, oldv) {
        let parent = this.optionData.find(item => item.value == newv[0])
        if (parent) {
          let target = parent.children.find(item => item.value == newv[1])
          this.mainValueLabel = target.label
        }
      },
    }
  },
  mounted() {
    const { value } = this
    this.react(value)
  },
  methods: {
    react(v) {
      const { _getValueArrByV, withOffset, spliter } = this
      const result = _getValueArrByV(v)
      this.mainValue = result
      if (v && withOffset) {
        const _v = v.replace('[', '').replace(']', '')
        const suffix = _v.split(spliter)[1]
        this.num = suffix
      }
    },
    _getValueArrByV(v, ds) {
      const dataSource = ds || this.optionData
      const result = this._findTarget(dataSource, v)
      return result
    },
    _findTarget(allData, v) {
      const { withOffset, spliter } = this
      let _v, _d
      if (withOffset && v) {
        // 旧值
        if (v.indexOf(spliter) < 0) {
          _v = v.replace(/\[/, '').replace(/\]/, '')
          _d = 0
        }
        // 新值
        else {
          _v = v.split(spliter)[0].replace(/\[/, '')
          _d = v.split(spliter)[1].replace(/\]/, '')
        }
      } else {
        _v = v
        _d = 0
      }
      // --------
      let result
      let gotit = false
      let hell = []
      let index = 0
      let _result = []

      for (let i = 0; i < allData.length; i++) {
        if (gotit) {
          break;
        }

        hell = []
        index = 0
        _result = []
        lopper([allData[i]])
      }

      function lopper(targetArr) {
        if (gotit) { return }
        targetArr.forEach((target) => {
          if (target.value === _v) {
            result = _v
            gotit = true
            // 填补之前的值
            hell.forEach((it) => {
              if (it.value !== _v) {
                _result.push(it.value)
              }
            })
          } else {
            if (target && target.children && target.children.length) {
              hell[index] = target
              index++
              lopper(target.children)
            }
          }
        })
      }

      return [..._result, result, _d]
    },
    onFocus() {
      this.$refs.dialog.show(this.innerValue, this.options)
    },
    handleClick() {
      this.$emit("choose")
    },
    handleSubmit(value, item) {
      const { num, withOffset, spliter } = this
      this.mainValue = value
      if (withOffset) {
        this.$emit("change", `[${value}${spliter}${num}]`)
      } else {
        this.$emit("change", value)
      }

      this.$refs.dialog.hide()
    },
    onChangeNum() {
      let { mainValue, num, spliter } = this
      this.$emit("change", `[${mainValue[1]}${spliter}${num}]`)
    },
  }
}
</script>
<style lang="scss" scoped>
.fic {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  cursor: pointer;
  padding: 5px;
  border: solid 1px transparent;


  i {
    cursor: pointer;
    margin-top: 5px;
  }
}

.fic.active {
  border: dashed 1px #1E90FF;
}

.item-can {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
