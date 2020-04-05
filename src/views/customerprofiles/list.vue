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
    <div class="action-bar">
      <el-progress v-if="removing.items.length > 0" :percentage="removing.percent" />
      <template v-if="selectedItems.length > 0">
        <el-button
          v-if="selectedItems.length < 10"
          type="primary"
          icon="el-icon-edit"
          @click="editItems()"
        />
        <el-button type="danger" icon="el-icon-delete" @click="deleteItems()" />
        <el-button icon="el-icon-check" />
        <el-badge :value="selectedItems.length" class="item" type="primary">
          <el-button icon="el-icon-close" @click="selectedItems = []" />
        </el-badge>
      </template>
      <el-button v-if="!buttons.search" type="primary" icon="el-icon-search" @click="buttons.search = !buttons.search" />
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

import { getList, deleteItem } from '@/api/customerprofiles'

export default {
  name: 'CustomerProfileList',
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
      removing: {
        items: [],
        done: [],
        fail: [],
        complete: true,
        percent: 0
      }

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
    },
    editItems() {
      this.$router.push('/customerprofiles/edit/' + this.selectedItems.join('+'))
    },
    deleteItems() {
      if (this.selectedItems.length < 1) return
      this.removing = {
        items: this.selectedItems,
        done: [],
        fail: [],
        complete: false,
        percent: 0
      }
      for(var i in this.removing.items) {
        var anId = this.removing.items[i]
        deleteItem(this.selectedItems[i]).then(response => {
          console.log(response)
          if (response.status === 200) {

          }
          this.removing.done.push(anId)
          this.calculateRemovePercent()
        }).catch(() => {
          this.removing.fail.push(anId)
          this.calculateRemovePercent()
        })
      }
    },
    calculateRemovePercent() {
      if (this.removing.items.length < 1) return -1
      var totalItems = this.removing.items.length
      var processedItems = this.removing.done.length + this.removing.fail.length
      if (totalItems === processedItems) {
        this.removing.complete = true
        this.fetchData()
      }
      this.removing.percent = parseInt(processedItems*100/totalItems)
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
