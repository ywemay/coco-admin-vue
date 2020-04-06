<template>
  <div v-loading="listLoading" class="card-list">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="buttons.search" class="filters">
      <el-input
        v-model="filters.company"
        type="text"
        prefix-icon="el-icon-company"
        :placeholder="$t('filters.company')"
      />
      <el-button class="success" @click="resetSearch">{{ $t('button.reset') }}</el-button>
      <el-button type="success" icon="el-icon-search" :alt="$t('button.search')" @click="fetchData" />
      <el-button icon="el-icon-close" @click="buttons.search = !buttons.search" />
    </div>
    <div
      v-for="profile in list"
      v-else
      :key="profile.id"
      class="card"
      :class="compileClass(profile.id)"
      @click="selectItem(profile.id)"
    >
      <div>
        <i class="el-icon-success" />
        <div class="company">{{ profile.company }}</div>
        <div class="details">
          <div>{{ profile.phones.join(', ') }}</div>
          <div>{{ profile.emails.join(', ') }}</div>
          <div>{{ profile.physicalAddresses.length }}</div>
        </div>
      </div>
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
    <list-actions
      :ids="selectedItems"
      :delete-callback="deleteCallback"
      :search="buttons.search"
      @cancel-selection="selectedItems = []"
      @set-selection="selectedItems = $event "
      @edit="$router.push('/customerprofiles/edit/' + $event)"
      @search="buttons.search = !buttons.search"
      @complete="fetchData()"
    />
  </div>
</template>

<script>

import { getList, deleteItem } from '@/api/customerprofiles'
import ListActions from '@/components/listActions'

export default {
  name: 'CustomerProfileList',
  components: { ListActions },
  data() {
    return {
      list: [],
      filters: {
        company: '',
        phone: '',
        email: ''
      },
      buttons: {
        search: false
      },
      totalItems: 0,
      listLoading: false,
      pageSize: 30,
      currentPage: 1,
      error: false,
      selectedItems: [],
      deleteCallback: deleteItem
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
      if (this.filters.company) {
        query.company = this.filters.company
      }
      if (this.filters.phone) {
        query.phones = this.filters.phone
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
        this.error = this.$t('error.listempty')
        this.buttons.search = false
      })
    },
    compileClass(anId) {
      return this.selectedItems.indexOf(anId) > -1 ? ' selected' : ''
    },
    resetSearch() {
      this.filters = {
        company: '',
        phone: '',
        email: '',
        address: ''
      }
      this.fetchData()
      this.buttons.search = false
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    selectItem(anId) {
      if (this.selectedItems.indexOf(anId) === -1) {
        this.selectedItems.push(anId)
      } else {
        this.selectedItems = this.selectedItems.filter(val => {
          return val !== anId
        })
      }
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
    color: #ddd;
    background: #eee;
    font-size: 20pt;
  }
  .details {
    font-size: 70%;
  }

  div.card-list .card {
    margin: 2pt 3pt;
    padding: 3pt;
    border: 1px solid #ddd;
    box-shadow: 2pt 2pt 5pt #ccc;
  }
</style>
