<template>
  <div class="items-actions">
    <el-progress v-if="items.length > 0" :percentage="percent" />
    <el-button type="primary" icon="el-icon-document-add" @click="$emit('new')" />
    <template v-if="ids.length > 0">
      <el-button
        v-if="ids.length < 10"
        type="primary"
        icon="el-icon-edit"
        @click="$emit('edit', getIdsString())"
      />
      <el-button type="danger" icon="el-icon-delete" @click="deleteItems()" />
      <!-- el-button icon="el-icon-check" @click="$emit('select-all')" / -->
      <el-badge :value="ids.length" class="item" type="primary">
        <el-button icon="el-icon-close" @click="$emit('cancel-selection')" />
      </el-badge>
    </template>
    <el-button v-if="!search" type="primary" icon="el-icon-search" @click="$emit('search')" />
  </div>
</template>

<script>

export default {
  name: 'Items',
  props: {
    ids: {
      type: Array,
      default: () => { return [] }
    },
    path: {
      type: String,
      default: ''
    },
    deleteCallback: {
      type: Function,
      default: () => {}
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [], // processing items
      done: [],
      fail: [],
      complete: false,
      percent: 0
    }
  },
  methods: {
    getIdsString() {
      return this.ids.join('+')
    },
    deleteItems() {
      if (this.ids.length < 1) return

      this.$confirm(this.$t('messages.warn.delete', { count: this.ids.length }), this.$t('message.warning'), {
        confirmButtonText: this.$t('button.ok'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        this.items = this.ids
        this.done = []
        this.fail = []
        this.complete = false
        this.percent = 0

        for (var i in this.items) {
          this.requestRemoveItem(this.items[i])
        }
      }).catch(() => {
        this.complete = false
      })
    },
    requestRemoveItem(anId) {
      this.deleteCallback(anId).then(response => {
        if (response.status === 204) {
          this.done.push(anId)
        } else {
          this.fail.push(anId)
        }
        this.calculateRemovePercent()
      }).catch(() => {
        this.fail.push(anId)
        this.calculateRemovePercent()
      })
    },
    calculateRemovePercent() {
      if (this.items.length < 1) return -1
      var totalItems = this.items.length
      var processedItems = this.done.length + this.fail.length
      if (totalItems === processedItems) {
        this.complete = true
        this.notifyRemoveResults()
        this.items = []
        this.$emit('complete')
      }
      this.percent = parseInt(processedItems * 100 / totalItems)
    },
    notifyRemoveResults() {
      if (this.fail.length > 0) {
        this.$notify({
          title: this.$t('message.delete'),
          message: this.$t('messages.delete.fail', { count: this.fail.length }),
          type: 'error',
          duration: 4000
        })
        this.$emit('set-selection', this.fail)
      } else {
        this.$emit('cancel-selection')
      }
      if (this.done.length > 0) {
        this.$notify({
          title: this.$t('message.delete'),
          message: this.$t('messages.delete.success', { count: this.done.length }),
          type: 'success',
          duration: 4000
        })
      }
    }
  }
}
</script>

<style scoped>
.items-actions {
  bottom: 5pt;
  position: fixed;
}
</style>
