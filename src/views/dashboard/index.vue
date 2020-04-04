<template>
  <div class="dashboard-container">
    <div v-for="link in links" :key="link.uri" class="button-container">
      <router-link :to="link.uri">
        <el-button>{{ link.title }}</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      links: [
        { uri: '/users/list', title: 'Users' },
        { uri: '/customerprofiles/list', title: 'Customer Profiles' },
        { uri: '/sale/orders', title: 'Sale Orders (Customer Orders)' },
        { uri: '/clorders/list', title: 'Container Load Orders' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  &-container button{
    min-width: 277pt;
  }
}
.button-container {
  margin: 10pt;
}
</style>
