<template>
  <div v-loading="listLoading" class="user-list">
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
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-if="filters.username !=='' || filters.roles.length > 0" class="success" @click="resetSearch">{{ $t('button.reset') }}</el-button>
      <el-button class="success" @click="fetchData">{{ $t('button.search') }}</el-button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div
      v-for="user in list"
      :key="user.username"
      class="user-card"
      :class="'user-' + (user.enabled ? 'enabled' : 'disabled') + (selectedItems.indexOf(user.id) > -1 ? ' selected' : '')"
      @click="showEditUser(user.id)"
      @dblclick="selectUser(user.id)"
    >
      <div v-if="selectedId == user.id" class="card-actions">
        <router-link :to="'/sale/edit/'+user.id">
          <div class="btn-edit"><i class="el-icon-edit" /></div>
        </router-link>
        <router-link :to="'/sale/delete/'+user.id">
          <div class="btn-del"><i class="el-icon-delete" /></div>
        </router-link>
      </div>
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
      v-if="totalItems > pageSize"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalItems"
      @current-change="handleCurrentChange"
    />
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
      }).catch(() => {
        this.list = []
        this.totalItems = 0
        this.listLoading = false
        this.error = this.$t('error.userlistempty')
      })
    },
    resetSearch() {
      this.filters.username = ''
      this.filters.roles = []
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    showEditUser(anId) {
      if (this.selectedItems.length > 0) {
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
.card-actions {
  position: absolute;
}
.card-actions .btn-edit,
.card-actions .btn-del {
  color: white;
  padding: 5pt;
  border: 1px solid white;
}
.btn-del {
  background: red;
}
.btn-edit {
  background: green;
}
.user-card.user-enabled.selected,
.user-card.user-disabled.selected {
  border: 1px solid red;
  background: lightcoral;
}
</style>
