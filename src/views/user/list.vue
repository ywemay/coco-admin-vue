<template>
  <div class="user-list" v-loading="listLoading">
    <div class="user-filters">
      <el-input
        v-model="filters.username"
        type="test"
        prefix-icon="el-icon-user"
        width="12"
        :placeholder="$t('filters.username')"
      />
      <el-select v-model="filters.roles" :placeholder="$t('filters.role')">
          <el-option
              v-for="item in roles"
              :label="item.label"
              :value="item.value">
          </el-option>
      </el-select>
      <el-button class="success" v-if="filters.username !=='' || filters.roles.length > 0" @click="resetSearch">{{ $t('button.reset') }}</el-button>
      <el-button class="success" @click="fetchData">{{ $t('button.search') }}</el-button>
    </div>
    <div class="error" v-if="error">{{ error }}</div>
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
      v-if="totalItems > pageSize"
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
      filters: {
        username: '',
        roles: ''
      },
      roles: [
        { value: 'ROLE_ADMIN', label: this.$t('user.admin') },
        { value: 'ROLE_CUSTOMER', label: this.$t('user.customer') },
        { value: 'ROLE_TEAMLEADER', label: this.$t('user.teamleader') },
        { value: 'ROLE_WORKER', label: this.$t('user.worker') },
      ],
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
      var query = {
        page: this.currentPage
      }
      if (this.filters.username) {
        query.username = this.filters.username
      }
      if (this.filters.roles) {
        query.roles = this.filters.roles
      }
      console.log(query)
      getList(query).then(response => {
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
    resetSearch(){
      this.filters.username = ''
      this.filters.roles = []
      this.fetchData()
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
.user-filters .el-input {
  max-width: 150pt;
  display: inline-block;
}
</style>
