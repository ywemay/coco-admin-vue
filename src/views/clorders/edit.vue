<template>
  <cl-order-editor :is-edit="true" />
</template>

<script>
import ClOrderEditor from './components/CLOrderEditor'

export default {
  name: 'CreateCLOrder',
  components: { ClOrderEditor }
}
</script>
