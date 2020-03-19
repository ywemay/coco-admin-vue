<template>
  <div class="cl-orders-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date">
        <template slot-scope="scope">
          {{ scope.row.plainCreatedAt }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Customer">
        <template slot-scope="scope">
          {{ scope.row.assignedTo.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Company">
        <template slot-scope="scope">
          {{ scope.row.saleOrder.company.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Start At">
        <template slot-scope="scope">
          {{ scope.row.saleOrder.plainStartDateTime }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/clorders/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

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
      list: null,
      totalItems: 0,
      listLoading: false,
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
