<template>
  <div class="edit-forms-list">
    <div v-for="id in ids" :key="id" class="edit-form-container">
      <sale-order-editor :item-id="parseInt(id)" :is-edit="true" />
    </div>
  </div>
</template>

<script>
import SaleOrderEditor from './components/SaleOrderEditor'

export default {
  name: 'EditForm',
  components: { SaleOrderEditor },
  data() {
    return {
      ids: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.ids = this.$route.params.id.split('+')
    }
  }
}
</script>

<style>
  .edit-form-container {
    margin: 6pt 0px;
    padding: 7pt 6pt;
    border: 1px solid #ccc;
    box-shadow: 2pt 2pt 5pt #ccc;
  }
  @media (min-width: 601px) {
    .responsive-width {
      max-width: 25%;
      display: inline-block;
    }
  }
</style>
