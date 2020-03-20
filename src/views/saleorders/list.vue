<template>
  <div class="orders-container">
    <div class="order-card" v-for="order in list" :key="order.id">
      <h3>{{ order.company ? order.company.name : '' }}</h3>
      <div class="order-start-time">{{ order.plainStartDateTime }}</div>
      <div class="order-container-type">{{ order.containerType }}</div>
      <div class="order-price">{{ order.price }}元</div>
      <div class="order-clorder">{{ order.containerLoadOrder }}元</div>
      <router-link :to="'/sale/edit/'+order.id">
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
import { getList } from '@/api/saleorders'

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
      list: null,
      totalItems: 0,
      listLoadin: true,
      pageSize: 30,
      currentPage: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({page: this.currentPage}).then(response => {
        this.list = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
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
div.order-card {
  padding: 6pt;
  margin: 3pt;
  width: 240pt;
  text-align: center;
  display: inline-block;
  border: 1px solid gray;
}
.order-card .order-price {
  font-weight: bolder;
  color: red;
}
</style>
