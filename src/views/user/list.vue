<template>
  <div class="user-list" v-loading="listLoading">
    <div class="error" v-if="error !== ''">{{ error }}</div>
    <div class="user-card" :class="'user-' + (user.enabled ? 'enabled' : 'disabled')" v-for="user in list" :key="user.username">
      <h3>{{ user.username }}</h3>
      <div><i v-for="role in user.plainRoles" class="el-icon-user">{{ role }}</i> </div>
      <div class="user-company" v-if="user.company"><i class="el-icon-office-building"></i> {{ user.company.name }}</div>
      <router-link :to="'/users/edit/'+user.id">
        <el-button type="primary" size="small" icon="el-icon-edit">
          {{ $t('button.edit') }}
        </el-button>
      </router-link>
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :total="totalItems">
    </el-pagination>
  </div>
</template>

<script>

import { getList } from '@/api/user'

export default {
  data() {
    return {
      list: [],
      totalItems: 0,
      listLoading: false,
      pageSize: 30,
      currentPage: 1,
      error: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.error = false
      getList({page: this.currentPage}).then(response => {
        this.list = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
        this.listLoading = false
      }).catch(error => {
        this.list = []
        this.totalItems = 0
        this.listLoading = false
        this.error = this.$t('error.userlistempty')
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
div.user-card {
  padding: 6pt;
  margin: 3pt;
  width: 240pt;
  text-align: center;
  display: inline-block;
}
.user-card.user-enabled {
  border: 1px solid green;
}
.user-card.user-disabled {
  border: 1px solid gray;
  background-color: #eee;
}
</style>
