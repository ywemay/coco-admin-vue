<template>
  <div class="sale-order-editor-container">
    <el-form ref="form" :model="form" v-loading="formLoading">
      <el-form-item :label="$t('order.date')">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date"
            type="date"
            :placeholder="$t('order.date')"
            style="width: 100%;"
          />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('order.customer')">
        <el-select
          v-model="form.company"
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
            v-model="form.startDateTime"
            type="datetime"
            :placeholder="$t('order.startDateTime')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('order.containerType')">
        <el-select v-model="form.containerType">
            <el-option
                v-for="item in containerTypes"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('order.price')">
        <el-input-number
          v-model="form.price"
          :min="0"
          :max="90000"
          prefix-icon="el-icon-money"
          ></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('order.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :placeholder="$t('order.descriptionDetails')"
          autosize
        />
      </el-form-item>
      <el-radio-group v-model="form.state" class="order-states">
          <el-radio-button label="0" class="fresh">{{ $t('order.states.fresh') }}</el-radio-button>
          <el-radio-button label="1" class="planned">{{ $t('order.states.planned') }}</el-radio-button>
          <el-radio-button label="2" class="in-progress">{{ $t('order.states.inprogress') }}</el-radio-button>
          <el-radio-button label="3" class="done">{{ $t('order.states.done') }}</el-radio-button>
          <el-radio-button label="10" class="canceled">{{ $t('order.states.canceled') }}</el-radio-button>
      </el-radio-group>

      <el-form-item :label="$t('clorder.assignedTo')">
          <el-select
            v-model="form.assignedTo"
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
      <el-button v-loading="formLoading" type="success" @click="submitForm('postForm')">
        {{ $t('button.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getOrder } from '@/api/saleorders'
import { getList as getCompanies } from '@/api/company'
import { getList as getUsers } from '@/api/user'
// import UserDinamicField from '@/views/user/components/UserDinamicField'


var dt = new Date();
dt.setHours(dt.getHours() + 3)

const defaultForm = {
  date: Date(),
  company: {
    '@id': '',
    name: ''
  },
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
    }
  },
  data() {
    return {
      form: Object.assign({}, defaultForm),
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
        { label: '20FT', value: this.$t('container.c20ft') },
        { label: 'HQ', value: this.$t('container.hq') },
        { label: '20FT', value: this.$t('container.other') }
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
            saleOrder.customer = data.customer
            this.form.id = data.id
            console.log(data)
            this.form.date = data.date
            this.mapCompanies([data.company])
            this.form.company = data.company['@id']
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
      this.form.company = value
    },
    teamLeaderSelect(value){
      this.form.teamleader = value
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
    submitForm() {
      console.log(this.form)
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
