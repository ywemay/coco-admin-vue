<template>
  <div class="cl-orders-container">
    <div class="cl-order-card" v-for="order in list" :key="order.id">
      <h3>{{ order.saleOrder.company ? order.saleOrder.company.name : '' }}</h3>
      <i icon="el-icon-time">{{ order.plainCreatedAt }}</i>
      <div class="assigned-to">{{ order.assignedTo.username }}</div>
      <div class="start-at">{{ order.saleOrder.plainStartDateTime }}</div>

      <router-link :to="'/clorders/edit/'+order.id">
        <el-button type="primary" size="small" icon="el-icon-edit">
          Edit
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
import { getList } from '@/api/clorders'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
      }).catch(err => {
        this.error = this.$t('error.clorderlistempty')
        this.listLoading = false
      }).finally(() => {
        this.listLoading = false
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
div.cl-order-card {
  padding: 6pt;
  margin: 3pt;
  width: 240pt;
  text-align: center;
  display: inline-block;
  border: 1px solid gray;
}
</style>
