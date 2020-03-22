<template>
  <div class="sale-order-editor-container">
    <el-form
      :model="formPost"
      :rules="rules"
      ref="formPost"
      class="form-container"
      v-loading="formLoading"
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
      <el-form-item :label="$t('order.customer')" prop="company">
        <el-select
          v-model="formPost.company"
          remote
          filterable
          :remote-method="loadCompanies"
          :loading="companyLoading"
          @change="companySelect"
          >
            <el-option
                v-for="item in companies"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('order.startDateTime')">
        <el-date-picker
            v-model="formPost.startDateTime"
            type="datetime"
            :placeholder="$t('order.startDateTime')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('order.containerType')">
        <el-select v-model="formPost.containerType">
            <el-option
                v-for="item in containerTypes"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('order.price')">
        <el-input-number
          v-model="formPost.price"
          :min="0"
          :max="90000"
          prefix-icon="el-icon-money"
          ></el-input-number>
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
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
      </el-form-item>
      <el-button v-loading="formLoading" type="success" @click="submitForm('formPost')">
        {{ $t('button.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getOrder, createOrder, updateOrder } from '@/api/saleorders'
import { getList as getCompanies } from '@/api/company'
import { getList as getUsers } from '@/api/user'
import { formatDate, formatDateTime } from '@/utils/datetime'
// import UserDinamicField from '@/views/user/components/UserDinamicField'


var dt = new Date();
dt.setHours(dt.getHours() + 3)

const defaultForm = {
  date: Date(),
  company: '',
  state: 0,
  containerType: 'HQ',
  startDateTime: dt,
  price: 600,
  description: ''
}

const defaultCLForm = {
  date: Date(),
  assignedTo: '',
  saleOrder: ''
}

export default {
  name: 'SaleOrderEditor',
  // components: { UserDinamicField },
  props: {
    isEdit: {
      type: Boolean,
      default: false
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
        company: [
          // { required: true, message: this.$t('message.validation.required'), trigger: 'blur' },
          { required: true, pattern: /\/api\/companies\/\d+/,
            message: this.$t('message.validation.company'), trigger: 'blur' }
        ]
      },
      saleOrderItems: [],
      links: [],
      theId: this.$route.params.id,
      doneLoading: false,
      companyLoading: false,
      teamLeadersLoading: false,
      formLoading: false,
      customer: undefined,
      companies: [],
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
      if (this.isEdit) {
        const saleOrder = this
        this.formLoading = true
        getOrder(this.$route.params.id).then(response => {
          if (response.status === 200) {
            var data = response.data
            this.formPost = data
            //saleOrder.customer = data.customer
            //this.formPost.id = data.id
            //this.formPost.date = data.date
            this.mapCompanies([data.company])
            this.formPost.company = data.company['@id']
            //this.formPost.price = data.price
          } else {
            console.log('Failed to load order')
          }
        }).then(() => {
          this.formLoading = false
        })
      }
    },
    loadCompanies(cname) {
      if (cname.length > 1) {
        this.companyLoading = true
        getCompanies({name: cname}).then(response => {
          var data = response.data
          if (data['hydra:member']) {
            this.mapCompanies(data['hydra:member'])
          }
          this.companyLoading = false
        }).catch(error => {
          this.companies = []
          this.companyLoading = false
        })
      }
    },
    loadTeamLeaders(uname) {
      if (uname.length > 1) {
        this.teamLeadersLoading = true
        getUsers({username: uname, roles: 'ROLE_TEAMLEADER', enabled: 1}).then(response => {
          var data = response.data
          console.log(data['hydra:member'])
          if (data['hydra:member']) {
            this.mapTeamLeaders(data['hydra:member'])
          }
          this.teamLeadersLoading = false
        }).catch(error => {
          this.teamleaders = []
          this.teamLeadersLoading = false
        })
      }
    },
    companySelect(value) {
      this.formPost.company = value
    },
    teamLeaderSelect(value){
      this.formPost.teamleader = value
    },
    mapCompanies(data) {
      this.companies = data.map(val => {
        return {
          id: val['id'],
          value: val['@id'],
          label: val['name']
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
    setCustomer: function(aUser) {
      this.customer = aUser
    },
    notifyResult(response){
      if (response.status === 201) {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('saved.successfully'),
          type: 'success',
          duration: 2000
        })
      }
      else {
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
          json.startDateTime = formatDateTime(this.formPost.startDateTime),

          this.formLoading = true
          if (this.isEdit) {
            updateOrder(this.$route.params.id, json).then(response => {
              this.notifyResult(response)
            }).catch(error => {
              this.formLoading = false
            })
          }
          else {
            createOrder(json).then(response => {
              this.notifyResult(response)
            }).catch(error => {
              this.formLoading = false
            })
          }

        } else {
          console.log('Error submiting form...')
          return false;
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
