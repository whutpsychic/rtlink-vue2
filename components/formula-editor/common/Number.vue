<template>
  <div :class="active ? `fic active` : `fic`" :style="`width:${width}`" @click="onFocus">
    <el-input-number :style="`width:${width}`" v-model="num" controls-position="right" @change="handleChange"
      @focus="onFocus"></el-input-number>
    <i class="el-icon-circle-close" @click="$emit('delete')"></i>
  </div>
</template>

<script>

export default {
  props: {
    label: { type: String, default: "" },
    value: { type: [String, Number], default: "" },
    width: { type: String, default: "" },
    active: { type: Boolean, default: false },
  },
  data() {
    return {
      num: 0
    }
  },
  mounted() {
    this.num = this.value
  },
  methods: {
    handleChange(v) {
      this.$emit("change", v)
      this.$emit("choose")
    },
    onFocus() {
      this.$emit("choose")
    }
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
</style>
