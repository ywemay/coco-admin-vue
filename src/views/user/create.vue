<template>
  <user-editor :is-edit="false" />
</template>

<script>
import UserEditor from './components/UserEditor'

export default {
  name: 'CreateUser',
  components: { UserEditor }
}
</script>
