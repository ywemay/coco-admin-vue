<template>
  <sale-order-editor :is-edit="true" />
</template>

<script>
import SaleOrderEditor from './components/SaleOrderEditor'

export default {
  name: 'EditForm',
  components: { SaleOrderEditor }
}
</script>
