<template>
  <div :class="active ? `fic active` : `fic`">
    <p @click="onFocus">{{ label }}</p>
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
  methods: {
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
  width: 16px;
  cursor: pointer;
  padding: 5px;
  border: solid 1px transparent;

  p {
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    margin: 0;
  }

  i {
    cursor: pointer;
    margin-top: 5px;
  }
}

.fic.active {
  border: dashed 1px #1E90FF;
}
</style>
