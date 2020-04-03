<template>
  <editor :is-edit="false" />
</template>

<script>
import Editor from './components/CustomerProfileEditor'

export default {
  name: 'CreateCustomerProfile',
  components: { Editor }
}
</script>
