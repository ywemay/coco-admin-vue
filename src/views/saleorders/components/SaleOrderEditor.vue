<template>
  <div class="sale-order-editor-container">
    <el-form
      ref="formPost"
      v-loading="formLoading"
      class="form-container"
      :model="formPost"
      :rules="rules"
      @submit.prevent
    >
      <el-form-item :label="$t('order.date')" prop="date">
        <el-col :span="11">
          <el-date-picker
            v-model="formPost.date"
            type="date"
            :placeholder="$t('order.date')"
            style="width: 100%;"
          />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('order.customer')" prop="customer">
        <el-select
          v-model="formPost.customer"
          remote
          filterable
          :remote-method="loadCustomerProfiles"
          :loading="customerProfileLoading"
          @change="customerProfileSelect"
        >
          <el-option
            v-for="item in customerProfiles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('order.startDateTime')">
        <el-date-picker
          v-model="formPost.startDateTime"
          type="datetime"
          :placeholder="$t('order.startDateTime')"
        />
      </el-form-item>
      <el-form-item :label="$t('order.containerType')">
        <el-select v-model="formPost.containerType">
          <el-option
            v-for="item in containerTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('order.price')">
        <el-input-number
          v-model="formPost.price"
          :min="0"
          :max="90000"
          prefix-icon="el-icon-money"
        />
      </el-form-item>
      <el-form-item :label="$t('order.description')">
        <el-input
          v-model="formPost.description"
          type="textarea"
          :placeholder="$t('order.descriptionDetails')"
          autosize
        />
      </el-form-item>
      <el-form-item :label="$t('order.state')">
        <el-button :class="orderStates[formPost.state].cls">{{ orderStates[formPost.state].value }}</el-button>
      </el-form-item>
      <el-form-item :label="$t('clorder.assignedTo')">
        <el-select
          v-model="formPost.assignedTo"
          remote
          filterable
          :remote-method="loadTeamLeaders"
          :loading="teamLeadersLoading"
          @change="teamLeaderSelect"
        >
          <el-option
            v-for="item in teamleaders"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button v-loading="formLoading" type="success" @click="submitForm('formPost')">
        {{ $t('button.save') }}
      </el-button>

      <el-button @click="loadData()" icon="el-icon-plus" />
    </el-form>
  </div>
</template>

<script>
import { getOrder, createOrder, updateOrder } from '@/api/saleorders'
import { getList as getCustomerProfiles } from '@/api/customerprofiles'
import { getList as getUsers } from '@/api/user'
import { formatDate, formatDateTime } from '@/utils/datetime'

var dt = new Date()
dt.setHours(dt.getHours() + 3)

const defaultForm = {
  date: Date(),
  customer: '',
  state: 0,
  containerType: 'HQ',
  startDateTime: dt,
  price: 600,
  description: ''
}

export default {
  name: 'SaleOrderEditor',
  // components: { UserDinamicField },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formPost: Object.assign({}, defaultForm),
      rules: {
        date: [
          // { required: true, message: this.$t('message.validation.required') },
          { required: true, type: 'regexp', pattern: /^\d\d\d\d\-\d\d\-\d\d*/,
            message: this.$t('message.validation.date'), trigger: 'blur' }
        ],
        customer: [
          // { required: true, message: this.$t('message.validation.required'), trigger: 'blur' },
          { required: true, pattern: /\/api\/customer_profiles\/\d+/,
            message: this.$t('message.validation.customer'), trigger: 'blur' }
        ]
      },
      saleOrderItems: [],
      links: [],
      doneLoading: false,
      customerProfileLoading: false,
      teamLeadersLoading: false,
      formLoading: false,
      customerProfiles: [],
      teamleaders: [],
      containerTypes: [
        { value: '20FT', label: this.$t('container.c20ft') },
        { value: 'HQ', label: this.$t('container.hq') },
        { value: 'OTHER', label: this.$t('container.other') }
      ],
      orderStates: [
        { label: 0, cls: 'fresh', value: this.$t('order.states.fresh') },
        { label: 1, cls: 'planned', value: this.$t('order.states.planned') },
        { label: 2, cls: 'inprogress', value: this.$t('order.states.inprogress') },
        { label: 3, cls: 'done', value: this.$t('order.states.done') },
        { label: 4, cls: 'canceled', value: this.$t('order.states.canceled') }
      ]
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      var iid = this.isEdit ? (this.itemId ? this.itemId : this.$route.params.id) : false
      if (!iid) return
      // this.formLoading = true
      getOrder(iid).then(response => {
        if (response.status === 200) {
          var data = response.data
          console.log('Loaded order:')
          console.log(data)
          this.formPost = data
          this.formLoading = false
          if (data.customer) {
            this.mapCustomerProfiles([data.customer])
          }
          //this.formPost.customer = data.customer['@id']
        } else {
          console.log('Failed to load order')
        }
      }).then(() => {
        this.formLoading = false
      })
    },
    loadCustomerProfiles(cname) {
      if (cname.length > 1) {
        this.customerProfileLoading = true
        getCustomerProfiles({ company: cname }).then(response => {
          var data = response.data
          if (data['hydra:member']) {
            this.mapCustomerProfiles(data['hydra:member'])
          }
          this.customerProfileLoading = false
        }).catch(error => {
          this.customerProfiles = []
          this.customerProfileLoading = false
          console.log(error)
        })
      }
    },
    loadTeamLeaders(uname) {
      if (uname.length > 1) {
        this.teamLeadersLoading = true
        getUsers({
          username: uname,
          roles: 'ROLE_TEAMLEADER',
          enabled: 1 }).then(response => {
          var data = response.data
          console.log(data['hydra:member'])
          if (data['hydra:member']) {
            this.mapTeamLeaders(data['hydra:member'])
          }
          this.teamLeadersLoading = false
        }).catch(error => {
          this.teamleaders = []
          this.teamLeadersLoading = false
          console.log(error)
        })
      }
    },
    customerProfileSelect(value) {
      this.formPost.customer = value
    },
    teamLeaderSelect(value) {
      this.formPost.teamleader = value
    },
    mapCustomerProfiles(data) {
      this.customerProfiles = data.map(val => {
        return {
          id: val['id'],
          value: val['@id'],
          label: val['company']
        }
      })
    },
    mapTeamLeaders(data) {
      this.teamleaders = data.map(val => {
        return {
          id: val['id'],
          value: val['@id'],
          label: val['username']
        }
      })
    },
    setCustomer: function(aCustomerProfile) {
      this.customerProfile = aCustomerProfile
    },
    notifyResult(response) {
      if (response.status === 201) {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('saved.successfully'),
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('error.savefail'),
          type: 'error',
          duration: 2000
        })
      }
      this.formLoading = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var json = this.formPost
          json.date = formatDate(this.formPost.date)
          json.startDateTime = formatDateTime(this.formPost.startDateTime)

          this.formLoading = true
          if (this.isEdit) {
            updateOrder(this.$route.params.id, json).then(response => {
              this.notifyResult(response)
            }).catch(error => {
              this.formLoading = false
              console.log(error)
            })
          } else {
            createOrder(json).then(response => {
              this.notifyResult(response)
            }).catch(error => {
              this.formLoading = false
              console.log(error)
            })
          }
        } else {
          console.log('Error submiting form...')
          return false
        }
      })
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
.order-states .canceled.is-active span{
  background-color: red;
}
.order-states .fresh.is-active span{
  background-color: orange;
}
.order-states .planned.is-active span{
  background-color: darkcyan;
}
.order-states .in-progress.is-active span{
  background-color: darkkhaki;
}
</style>
