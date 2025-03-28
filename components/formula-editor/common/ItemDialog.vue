<template>
  <el-dialog :class="[
    'theme-dialog',
    'dialog-selector',
    'dialog-tree-table-selector',
    multiple ? 'dialog-selector-multiple' : 'dialog-selector-single',
  ]" :title="title" top="10vh" :width="multiple ? '75%' : '65%'" :visible.sync="visible" append-to-body>
    <div class="dialog-content">
      <div class="column column2">
        <div class="column-content">
          <BaseTable ref="table" :searchPanelDefaultCollapsed="false" :showRadio="!multiple" :showSelection="multiple"
            :tableColumns="tableColumns" :searchItems="searchItems" :searchPanelLabelWidth="70" :searchPanelDivide="3"
            :tableData="tableData" :total="total" :pageSize="10" paginationLayout="total, prev, pager, next, jumper"
            @selection-change="onTableSelect" @row-dblclick="onTableDblclick" @load="loadData" />
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button size="mini" @click="visible = false">{{ $t('rtcom.cancel') }}</el-button>
      <el-button size="mini" type="primary" @click="submit">{{ $t('rtcom.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import BaseTable from '@/components/base/baseTable'

export default {
  components: {
    BaseTable
  },
  props: {
    title: { type: String, default: '请选择变量' },
    multiple: { type: Boolean, default: false },
    allData: { type: Array, default: [] },
  },
  data() {
    return {
      visible: false,
      tableData: [],
      total: 0,
      singleValue: '',
    }
  },
  computed: {
    searchItems() {
      return [
        { label: this.$t('rtcom.category'), prop: 'level1', type: 'select', options: this.allData },
        { label: this.$t('rtcom.name'), prop: 'label' },
        { label: this.$t('rtcomfe.pp_num'), prop: 'sourcePoint' },
      ]
    },
    tableColumns() {
      return [
        { label: this.$t('rtcom.name'), prop: 'label' },
        { label: this.$t('rtcomfe.pp_num'), prop: 'sourcePoint' },
        { label: this.$t('rtcom.formula'), prop: 'formulaStr' }
      ]
    },
  },
  methods: {
    show(value) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.table.query()
      })
      this.initSingle(value)
    },

    hide() {
      this.visible = false
    },
    submit() {
      const selection = this.$refs.table.getSelection()
      const value = selection.value
      const item = selection
      this.$emit('submit', value, item)
    },

    loadData(queryFilter) {
      console.log(queryFilter)
      let level1Value = ''
      let searchLabel = ''
      let searchPoint = ''
      queryFilter.querys.forEach(item => {
        if (item.property == 'level1') {
          level1Value = item.value
        }

        if (item.property == 'label') {
          searchLabel = item.value
        }

        if (item.property == 'sourcePoint') {
          searchPoint = item.value
        }
      })

      if (level1Value == '') {
        level1Value = this.allData[0].value
      }

      let pageAllData = []
      pageAllData = this.allData.find(item => item.value == level1Value).children
      if (searchLabel !== '') {
        pageAllData = pageAllData.filter((item) => (item.label)).filter(item => item.label.indexOf(searchLabel) > -1)
      }
      if (searchPoint !== '') {
        pageAllData = pageAllData.filter((item) => (item.label)).filter(item => item.sourcePoint && item.sourcePoint.indexOf(searchPoint) > -1)
      }

      let page = queryFilter.pageBean.page
      let pageSize = queryFilter.pageBean.pageSize
      let pageData = pageAllData.slice((page - 1) * pageSize, page * pageSize)

      this.total = pageAllData.length
      this.tableData = pageData
    },

    initSingle(value) {
      this.singleValue = value
    },

    onTableSelect(tableSelection) {
      this.singleValue = tableSelection.value
    },

    onTableDblclick() {
      this.submit()
    },
  },
}
</script>
