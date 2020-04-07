<template>
  <div v-loading="listLoading" class="card-list">
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
      <el-button type="success" icon="el-icon-search" :alt="$t('button.search')" @click="fetchData" />
      <el-button icon="el-icon-close" @click="buttons.search = !buttons.search" />
    </div>
    <el-button v-if="filters.username !=='' || filters.roles.length > 0" class="success" @click="resetSearch">{{ $t('button.reset') }}</el-button>
    <div v-if="!buttons.search">
      <div
        v-for="user in list"
        :key="user.username"
        class="card"
        :class="compileClass(user)"
        @click="selectUser(user.id)"
      >
        <div>
          <i class="el-icon-success" />
          <el-image class="avatar">
            <div slot="error" class="image-slot">
              <i class="el-icon-user-solid" />
            </div>
          </el-image>
          <div class="username">{{ user.username }}</div>
          <div class="details">
            <i v-if="user.enabled" class="el-icon-check" />
            <i v-else class="el-icon-close" />
            <i v-for="role in user.roles" :key="role">
              {{ role }}
            </i>
          </div>
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
    <list-actions
      :ids="selectedItems"
      :delete-callback="deleteCallback"
      :search="buttons.search"
      @cancel-selection="selectedItems = []"
      @set-selection="selectedItems = $event "
      @edit="$router.push('/users/edit/' + $event)"
      @search="buttons.search = !buttons.search"
      @complete="fetchData()"
    />
  </div>
</template>

<script>

import { getList, deleteUser } from '@/api/user'
import ListActions from '@/components/listActions'

export default {
  name: 'UserList',
  components: { ListActions },
  data() {
    return {
      deleteCallback: deleteUser,
      list: [],
      filters: {
        username: '',
        roles: ''
      },
      buttons: {
        search: false
      },
      roles: [
        { value: 'admin', label: this.$t('user.admin') },
        { value: 'customer', label: this.$t('user.customer') },
        { value: 'teamleader', label: this.$t('user.teamleader') },
        { value: 'worker', label: this.$t('user.worker') }
      ],
      totalItems: 0,
      listLoading: false,
      pageSize: 30,
      currentPage: 1,
      error: false,
      selectedItems: []
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
    selectUser(anId) {
      if (this.selectedItems.indexOf(anId) === -1) {
        this.selectedItems.push(anId)
      } else {
        this.selectedItems = this.selectedItems.filter(val => {
          return val !== anId
        })
      }
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

  .avatar {
    float: left;
    width: 30pt;
    height: 30pt;
    color: #ddd;
    background: #eee;
    font-size: 20pt;
  }
  .details {
    font-size: 70%;
  }
</style>
