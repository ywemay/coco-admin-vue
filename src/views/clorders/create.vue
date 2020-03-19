<template>
  <cl-order-editor :is-edit="false" />
</template>

<script>
import ClOrderEditor from './components/CLOrderEditor'

export default {
  name: 'CreateCLOrder',
  components: { ClOrderEditor }
}
</script>
