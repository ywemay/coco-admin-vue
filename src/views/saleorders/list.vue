<template>
  <el-checkbox-group v-model="selectedItems" class="orders-container">
    <el-checkbox-button class="order-card" v-for="order in list" :label="order.id" :key="order.id">
      <div v-if="selectedOrder === order.id" class="order-card-actions">
        <router-link :to="'/sale/edit/'+order.id">
          <div class="btn-edit"><i class="el-icon-edit" /></div>
        </router-link>
        <router-link :to="'/sale/delete/'+order.id">
          <div class="btn-del"><i class="el-icon-delete" /></div>
        </router-link>
      </div>
      <div class="order-card-content" @click="selectOrder(order.id)">
        <div class="order-name">{{ order.owner ? order.owner.company : '' }}</div>
        <div class="order-start-time"><i class="el-icon-watch" /> {{ order.plainStartDateTime }}</div>
        <div class="order-container-type"><i class="el-icon-truck" /> {{ order.containerType }}</div>
        <div class="order-price">{{ order.price }}元</div>
        <div class="order-clorder">{{ order.containerLoadOrder }}</div>
      </div>
    </el-checkbox-button>

    <el-pagination
      v-if="totalItems > pageSize"
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="totalItems">
    </el-pagination>
  </el-checkbox-group>
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
      selectedItems: [],
      totalItems: 0,
      listLoadin: true,
      pageSize: 30,
      currentPage: 1,
      selectedOrder: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ page: this.currentPage }).then(response => {
        this.list = response.data['hydra:member']
        this.totalItems = response.data['hydra:totalItems']
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    selectOrder(oId) {
      if (this.selectedOrder == oId) {
        this.selectedOrder = 0
      } else {
        this.selectedOrder = oId
      }
    },
    logItems() {
      console.log(this.selectedItems)
    }
  }
}
</script>

<style scoped>
div.order-card {
  margin: 3pt;
  width: 240pt;
  text-align: center;
  display: inline-block;
  border: 1px solid gray;
}
.order-card-content {
  padding: 6pt;
}
.order-card .order-price {
  font-weight: bolder;
  color: red;
}
.order-card-actions {
  position: absolute;
}
.order-card-actions .btn-edit,
.order-card-actions .btn-del {
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
</style>
