<template>
  <user-editor :is-edit="true" />
</template>

<script>
import UserEditor from './components/UserEditor'

export default {
  name: 'CreateUser',
  components: { UserEditor }
}
</script>
