<template>
  <div class="edit-forms-list">
    <div v-for="uid in userIds" :key="uid" class="edit-form-container">
      <user-editor :userId="parseInt(uid)" :is-edit="true" />
    </div>
  </div>
</template>

<script>
import UserEditor from './components/UserEditor'

export default {
  name: 'CreateUser',
  components: { UserEditor },
  data() {
    return {
      userIds: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.userIds = this.$route.params.id.split("+")
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
