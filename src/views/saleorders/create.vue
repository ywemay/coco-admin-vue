<template>
  <sale-order-editor :is-edit="false" />
</template>

<script>
import SaleOrderEditor from './components/SaleOrderEditor'

export default {
  name: 'CreateSaleOrder',
  components: { SaleOrderEditor }
}
</script>
