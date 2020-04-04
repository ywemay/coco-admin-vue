<template>
  <div class="edit-forms-list">
    <div v-for="iid in itemIds" :key="iid" class="edit-form-container">
      <editor :item-id="parseInt(iid)" :is-edit="true" />
    </div>
  </div>
</template>

<script>
import Editor from './components/CustomerProfileEditor'

export default {
  components: { Editor },
  data() {
    return {
      itemIds: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.itemIds = this.$route.params.id.split('+')
    }
  }
}
</script>
