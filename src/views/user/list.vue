<template>
  <div v-loading="listLoading" class="card-list">
    <div class="action-bar">
      <template v-if="selectedItems.length > 0">
        <el-button v-if="selectedItems.length == 1" type="primary" icon="el-icon-edit" />
        <el-button type="danger" icon="el-icon-delete" />
        <el-button icon="el-icon-check" />
        <el-badge :value="selectedItems.length" class="item" type="primary">
          <el-button icon="el-icon-close" @click="selectedItems = []" />
        </el-badge>
      </template>
      <el-button v-if="!buttons.search" type="primary" icon="el-icon-search" @click="buttons.search = !buttons.search" />
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="buttons.search" class="filters">
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
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-if="filters.username !=='' || filters.roles.length > 0" class="success" @click="resetSearch">{{ $t('button.reset') }}</el-button>
      <el-button type="success" @click="fetchData(true)" icon="el-icon-search" :alt="$t('button.search')" />
      <el-button icon="el-icon-close" @click="buttons.search = !buttons.search" />
    </div>
    <div
      v-else
      v-for="user in list"
      :key="user.username"
      class="card"
      :class="compileClass(user)"
      @click="selectUser(user.id)"
    >
      <i class="el-icon-success" />
      <action-buttons
        rootpath="/users"
        :selected="selectedId"
        :itemId="user.id"
      />
      <h3>{{ user.username }}</h3>
      <div>
        <i v-for="role in user.plainRoles" :key="role" class="el-icon-user">
          {{ role }}
        </i>
      </div>
      <div v-if="user.company" class="user-company">
        <i class="el-icon-office-building" /> {{ user.company.name }}</div>
    </div>

    <el-pagination
      v-if="totalItems > pageSize && !buttons.search"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalItems"
      @current-change="handleCurrentChange"
    />
    <el-backtop taget=".users-list" />
  </div>
</template>

<script>

import { getList } from '@/api/user'

export default {
  name: 'UserList',
  data() {
    return {
      list: [],
      filters: {
        username: '',
        roles: ''
      },
      buttons: {
        search: false
      },
      roles: [
        { value: 'ROLE_ADMIN', label: this.$t('user.admin') },
        { value: 'ROLE_CUSTOMER', label: this.$t('user.customer') },
        { value: 'ROLE_TEAMLEADER', label: this.$t('user.teamleader') },
        { value: 'ROLE_WORKER', label: this.$t('user.worker') }
      ],
      totalItems: 0,
      listLoading: false,
      pageSize: 30,
      currentPage: 1,
      error: false,
      selectedId: 0,
      selectedItems: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(resetPage = false) {
      if (resetPage) {
        this.currentPage = 1
      }
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
      getList(query).then(response => {
        this.list = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
        this.listLoading = false
        this.buttons.search = false
      }).catch(() => {
        this.list = []
        this.totalItems = 0
        this.listLoading = false
        this.error = this.$t('error.userlistempty')
        this.buttons.search = false
      })
    },
    resetSearch() {
      this.filters.username = ''
      this.filters.roles = []
      this.fetchData()
      this.buttons.search = false
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    clickBtnUp(anId) {
      this.holdId = 0
      var delay = new Date() -  this.clickBtnDownTime
      console.log(delay)
      if (this.selectedItems.length > 0 || delay > 3000) {
        this.selectedId = 0
        this.selectUser(anId)
        return
      }
      if (this.currentId == anId) {
        this.selectedId = 0
      }
      else {
        this.selectedId = anId
      }
    },
    selectUser(anId) {
      if (this.selectedItems.indexOf(anId) === -1) {
        this.selectedItems.push(anId)
        this.selectedId = 0
      } else {
        this.selectedItems = this.selectedItems.filter(val => {
          return val !== anId
        })
      }
    },
    clickBtnDown(anId) {
      this.holdId = anId
      this.clickBtnDownTime = new Date()
    },
    compileClass(user) {
      var res = user.enabled ? 'enabled' : 'disabled'
      res += this.selectedItems.indexOf(user.id) > -1 ? ' selected' : ''
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
$card-width: 220pt;
  @import "~@/styles/card-list.scss";
</style>
