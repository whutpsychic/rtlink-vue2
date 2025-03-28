<template>
  <div class="formula-editor-container">
    <div class="top-section">
      <p>{{ title }}</p>
      <div class="right-btns">
        <el-button v-for="(item, i) in calcSymbols" :key="i" @click="addSymbol(item.value)">{{ item.label }}</el-button>
        <el-button @click="addItem">{{ $t('rtcomfe.add_number_item') }}</el-button>
        <el-button @click="addNumber">{{ $t('rtcomfe.add_const') }}</el-button>
        <el-button @click="backspace" :disabled="!(formula.length > 0)">{{ $t('rtcomfe.back_space') }}</el-button>
        <el-button @click="clear" :disabled="!(formula.length > 0)">{{ $t('rtcomfe.empty') }}</el-button>
        <el-button :icon="showAllSymbols ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          @click="showAllSymbols = !showAllSymbols"></el-button>
      </div>
    </div>
    <div class="spliter"></div>
    <div :class="showAllSymbols ? `more-symbols` : `more-symbols hide`">
      <el-button v-for="(item, i) in moreSymbols" class="more-symbol-btn" :key="i" @click="addSymbol(item.label)">
        <span>{{ item.label }}</span>
      </el-button>
    </div>
    <div v-if="showAllSymbols" class="spliter"></div>
    <div class="main-section">
      <p class="placeholder" v-if="!(formula.length > 0)">{{ $t('rtcomfe.plz_click_righttop_to_edit') }}</p>
      <component v-for="(symbol, i) in formula" :key="i + 1" :is="getElementByType(symbol.type)" width="140px"
        :label="symbol.label" :value="symbol.value" @delete="() => deleteItem(i, symbol)" :optionData="variableOptions"
        @choose="onChooseItem(i)" :active="i === currIndex" @change="(v) => onchangeItem(v, i)" :filterable="filterable"
        :spliter="varSpliter" :withOffset="withOffset" />
    </div>
  </div>
</template>

<script>
import Item from "./common/Item.vue"
import Number from "./common/Number.vue"
import SymbolItem from "./common/Symbol.vue"
import { cloneDeep } from 'lodash'
import { tilingTreeData } from "../../utils/index"

export default {
  components: { Item, Number, SymbolItem },
  props: {
    // v-model
    value: { type: Array, default: () => ([]) },
    // 变量数据源
    variableOptions: { type: Array, default: () => ([]) },
    // 变量数据过多，需要顶部快捷搜索定位
    filterable: { type: Boolean, default: false },
    // 变量跟随偏移量
    withOffset: { type: Boolean, default: false },
    // 偏移量分隔符
    varSpliter: { type: String, default: "|" }
  },
  model: {
    prop: "value",
    event: "change"
  },
  computed: {
    // 公式主体
    formula() {
      const { value, calcFormulaByValue } = this
      const result = calcFormulaByValue(value)
      return result
    },
  },
  data() {
    return {
      title: this.$t('rtcomfe.calc_formula'),
      // 展示所有计算符号
      showAllSymbols: false,
      // 计算符号
      calcSymbols: [
        { label: "+", value: "+" },
        { label: "-", value: "-" },
        { label: "*", value: "*" },
        { label: "/", value: "/" },
        { label: "(", value: "(" },
        { label: ")", value: ")" },
      ],
      // 更多计算符号
      moreSymbols: [
        // 计算符号和判断符号
        { label: "||", value: "||" },
        { label: "&&", value: "&&" },
        { label: "!", value: "!" },
        { label: "<", value: "<" },
        { label: ">", value: ">" },
        { label: "=", value: "=" },
        { label: "[", value: "[" },
        { label: "]", value: "]" },
        { label: "{", value: "{" },
        { label: "}", value: "}" },
        { label: "%", value: "%" },
        { label: "^", value: "^" },
        // 平方根
        // 平均数
        // 最大值
        // 最小值
      ],
      // 当前编辑项索引
      currIndex: this.value.length - 1,
    }
  },
  methods: {
    // =================== model ===================
    calcFormulaByValue(value) {
      const { _isSymbolItem, _isNumberItem } = this
      const result = []
      value.forEach((v, i) => {
        // 识别符号项
        if (_isSymbolItem(v)) {
          result.push({ type: 'symbol', label: v, value: v })
        }
        // 识别数字项
        else if (_isNumberItem(v)) {
          result.push({ type: 'number', value: v })
        }
        // 认为是变量
        else {
          result.push({ type: 'item', value: v })
        }
      });
      return result
    },
    _isSymbolItem(v) {
      const { calcSymbols, moreSymbols } = this
      const result = [...calcSymbols, ...moreSymbols].findIndex((item) => {
        return item.value === v
      })
      return (result > -1)
    },
    _isNumberItem(v) {
      const result = parseFloat(v)
      if (result > 10000000) {
        return false
      }
      return !isNaN(result)
    },
    onchangeItem(v, i) {
      let oper = cloneDeep(this.value)
      oper[i] = v
      this.$emit("change", oper)
    },
    // =================== model ===================
    addSymbol(symbol) {
      this.currIndex = this.currIndex + 1
      let { value, currIndex } = this
      value.splice(currIndex, 0, symbol)
      this.$emit("change", value)
    },
    addItem() {
      this.currIndex = this.currIndex + 1
      let { value, currIndex } = this
      value.splice(currIndex, 0, null)
      this.$emit("change", value)
    },
    addNumber() {
      this.currIndex = this.currIndex + 1
      let { value, currIndex } = this
      value.splice(currIndex, 0, 0)
      this.$emit("change", value)
    },
    getElementByType(type) {
      switch (type) {
        case "symbol": return SymbolItem
        case "number": return Number
        case "item": return Item
        default: return
      }
    },
    // 回退
    backspace() {
      const { value } = this
      value.pop()
      this.$emit("change", value)
    },
    // 清空
    clear() {
      this.$confirm(this.$t('rtcomfe.reedit_formula'), this.$t('rtcom.prompt'), {
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          this.$emit("change", [])
          this.currIndex = 0
          this.$emit("clear")
        })
        .catch(() => { })
    },
    // 获得字符串结果
    getStrResult() {
      const { formula, getLabelByValue } = this
      let result = formula.map((item) => {
        if (item.type === "symbol") {
          return item.label
        }
        else if (item.type === "item") {
          return getLabelByValue(item.value)
        }
        else {
          return item.value
        }
      })
      result = result.join("")
      return result
    },
    // 删除
    deleteItem(index, symbol) {
      const { value } = this
      const L = value.length
      const result = [...value.slice(0, index), ...value.slice(index + 1, L)]
      this.$emit("change", result)
      this.currIndex = index - 1
    },
    //
    // getLabelByValue(v) {
    //   if (v && v.length) {
    //     let data = tilingTreeData(this.variableOptions)
    //     let result = data.find((item) => { return item.value === v })
    //     if (result) {
    //       return result.label
    //     } else {
    //       return
    //     }
    //   } else {
    //     return
    //   }
    // },
    getLabelByValue(v) {
      const { varSpliter } = this
      if (v && v.length) {
        // 旧数据去除[]
        let _v = v.replace(/\[/, '').replace(/\]/, '')
        _v = _v.split(varSpliter)[0]

        let data = tilingTreeData(this.variableOptions)
        let result = data.find((item) => { return item.value === _v })

        if (result) {
          return result.label
        } else {
          return
        }
      } else {
        return
      }
    },
    // 选中当前
    onChooseItem(index) {
      this.currIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.formula-editor-container {
  margin: 0;
  padding: 0;
  border: dashed 1px #ddd;
  min-width: 800px;

  .spliter {
    height: 1px;
    background-color: #eee;
  }

  .top-section,
  .main-section {
    padding: 10px;
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-weight: bold;
      font-size: 15px;
      margin: 0;
    }
  }

  .main-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    min-height: 51px;
  }

  .placeholder {
    color: #bbb;
  }

  .more-symbols {
    height: 70px;
    transition: .2s;
    overflow: hidden;
    padding: 0 10px;
  }

  .more-symbol-btn {
    margin-top: 20px;
  }

  .hide {
    height: 0;
  }
}
</style>
