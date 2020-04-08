<template>
  <div v-loading="listLoading" class="order-list-container">
    <div v-if="error" class="error">{{ error }}</div>
    <div class="card-list">
      <div
        v-for="order in list"
        :key="order.id"
        class="card"
        :class="compileClass(order)"
        :label="order.id"
      >
        <i class="el-icon-success" />
        <div class="order-card-content" :class="order.selected ? 'selected' : ''" @click="selectOrder(order.id)">
          <div class="order-name">{{ order.owner ? order.owner.company : '' }}</div>
          <div class="order-start-time"><i class="el-icon-watch" /> {{ order.plainStartDateTime }}</div>
          <div class="order-container-type"><i class="el-icon-truck" /> {{ order.containerType }}</div>
          <div class="order-price">{{ order.price }}元</div>
          <div class="order-clorder">{{ order.containerLoadOrder }}</div>
        </div>
      </div>

      <el-pagination
        v-if="totalItems > pageSize"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalItems"
      />
      <el-backtop taget=".users-list" />
    </div>
    <list-actions
      :ids="selectedItems"
      :delete-callback="deleteCallback"
      :search="search"
      @cancel-selection="selectedItems = []"
      @set-selection="selectedItems = $event "
      @new="createNew()"
      @edit="$router.push('/sale/edit/' + $event)"
      @search="search = !search"
      @complete="fetchData()"
    />
  </div>
</template>

<script>
import { getList, deleteOrder } from '@/api/saleorders'
import ListActions from '@/components/listActions'
import { handleItemSelect } from '@/utils/lists'

export default {
  name: 'SaleOrderList',
  components: { ListActions },
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
      listLoading: true,
      search: false,
      pageSize: 30,
      currentPage: 1,
      deleteCallback: deleteOrder,
      error: false
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
    createNew() {
      this.$router.push({
        path: '/sale/create',
        query: {
          redirect: '/sale/list'
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    selectOrder(anId) {
      this.selectedItems = handleItemSelect(this.selectedItems, anId)
    },
    logItems() {
      console.log(this.selectedItems)
    },
    compileClass(order) {
      var res = 'order-type-' + order.state
      res += this.selectedItems.indexOf(order.id) > -1 ? ' selected' : ''
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/card-list.scss";
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
  .selected {
    background: lightgreen;
  }
</style>
