<template>
  <div class="sale-order-editor-container">
    <el-form ref="form" :model="form">
      <el-form-item label="">
        <el-col :span="11">
          <el-date-picker v-model="form.date" type="date" placeholder="Order Date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Customer">
        <user-dinamic-field
          :user="customer"
          :initialstate="isEdit ? 'veiw' : 'search'"
          @select-user="setCustomer"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="form.startDateTime"
            type="datetime"
            :placeholder="$t('order.startDateTime')">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getOrder } from '@/api/saleorders'
import UserDinamicField from '@/views/user/components/UserDinamicField'

defaultForm
export default {
  name: 'SaleOrderEditor',
  components: { UserDinamicField },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: undefined,
        date: Date(),
        customer: ''
      },
      saleOrderItems: [],
      links: [],
      theId: this.$route.params.id,
      doneLoading: false,
      customer: undefined
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.isEdit) {
        const saleOrder = this
        getOrder(this.$route.params.id).then(response => {
          if (response.status === 200) {
            saleOrder.customer = response.data.customer
            this.form.id = response.data.id
            this.form.data = response.data.date
            // this.form.customer = this.customer['@id']
          } else {
            console.log('Failed to load order')
          }
        }).then(() => {
          this.doneLoading = true
        })
      } else {
        this.doneLoading = true
      }
    },
    setCustomer: function(aUser) {
      this.customer = aUser
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
