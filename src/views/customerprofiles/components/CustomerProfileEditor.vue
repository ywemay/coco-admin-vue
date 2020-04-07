<template>
  <div class="customer-profile-editor-container">
    <h3>{{ isEdit ? 'Edit company ' + postForm.company : 'Create new company' }}</h3>
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="edit-form"
      @submit.prevent
    >
      <el-form-item prop="company" class="responsive-width">
        <el-input
          v-model="postForm.company"
          prefix-icon="el-icon-office-building"
          :placeholder="$t('customerprofile.company')"
        />
      </el-form-item>
      <el-form-item prop="webpage" class="responsive-width">
        <el-input
          v-model="postForm.webpage"
          prefix-icon="el-icon-connection"
          :placeholder="$t('customerprofile.webpage')"
        />
      </el-form-item>
      <el-form-item prop="phones">
        <div
          v-for="(phone, index) in postForm.phones"
          :key="index"
          class="form-element-item responsive-width"
        >
          <el-input
            v-model="postForm.phones[index]"
            prefix-icon="el-icon-mobile"
            :placeholder="$t('customerprofile.phone')"
          >
            <el-button
              slot="append"
              icon="el-icon-remove"
              @click="postForm.phones.splice(index, 1)"
            />
          </el-input>
        </div>
        <el-button icon="el-icon-circle-plus" @click="postForm.phones.push('')" />
      </el-form-item>
      <el-form-item prop="emails">
        <div
          v-for="(email, index) in postForm.emails"
          :key="index"
          class="form-element-item responsive-width"
        >
          <el-input
            v-model="postForm.emails[index]"
            prefix-icon="el-icon-message"
            :placeholder="$t('customerprofile.email')"
          >
            <el-button slot="append" icon="el-icon-remove" @click="postForm.emails.splice(index, 1)" />
          </el-input>
        </div>
        <el-button
          icon="el-icon-circle-plus"
          @click="postForm.emails.push('')"
        />
      </el-form-item>
      <el-form-item prop="staff">
        <el-select
          v-model="postForm.staff"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$t('customerprofile.staff')"
          :remote-method="loadCustomers"
          :loading="loadingCustomers"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.id"
            :label="item.username"
            :value="item['@id']"
          />
        </el-select>
      </el-form-item>
      <el-button v-loading="loading" type="success" icon="el-icon-upload2" @click="submitForm('postForm')">
        {{ $t('button.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getItem, createItem, updateItem } from '@/api/customerprofiles'
import { getList as getUsers } from '@/api/user'

const defaultForm = {
  company: '',
  phones: [''],
  emails: [''],
  staff: [],
  webpage: '',
  pysicalAddresses: []
}

export default {
  name: 'UserEditor',
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
      postForm: Object.assign({}, defaultForm),
      loading: false,
      loadingCustomers: false,
      customerOptions: [],
      rules: {
        company: [
          { required: true, message: this.$t('message.company.required'), trigger: 'blur' },
          { min: 2, message: this.$t('message.username.len'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var uid = this.isEdit ? this.itemId : false
      if (!uid) return
      getItem(uid).then(response => {
        if (response.status === 200) {
          var data = response.data
          this.customerOptions = data.staff
          var i
          var staff = []
          for (i in data.staff) {
            staff.push(data.staff[i]['@id'])
          }
          data.staff = staff
          this.postForm = data
        }
      }).catch(err => {
        this.$notify({
          title: this.$t('message.error'),
          message: err,
          type: 'error',
          duration: 2000
        })
      })
    },
    loadCustomers(query) {
      if (query !== '') {
        getUsers({ username: query, roles: 'ROLE_CUSTOMER' }).then(response => {
          if (response.status === 200) {
            this.customerOptions = response.data['hydra:member']
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.customerOptions = []
      }
    },
    checkIsCustomer(item) {
      return item === 'customer'
    },
    notifyResult(response, rezCode = 201) {
      if (response.status === rezCode) {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('messages.save.success'),
          type: 'success',
          duration: 2000
        })
      } else {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('messages.save.fail'),
          type: 'error',
          duration: 2000
        })
      }
      this.loading = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          var json = this.postForm
          if (this.isEdit) {
            updateItem(this.itemId, json).then(response => {
              this.notifyResult(response, 200)
            }).catch(() => {
              this.loading = false
            })
          } else {
            createItem(json).then(response => {
              this.notifyResult(response)
            }).catch(() => {
              this.laoding = false
            })
          }
          this.loading = false
        } else {
          console.log('Error submiting form!!!')
          return false
        }
      })
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
  .inline-input {
    display: inline-block;
    width: 70%;
    margin-right: 4pt;
  }
  .form-element-item {
    padding: 1pt;
  }
  .customer-profile-editor-container {
    margin: 6pt 0px;
    padding: 7pt 6pt;
    border: 1px solid #ccc;
    box-shadow: 2pt 2pt 5pt #ccc;
  }
  @media (min-width: 601px) {
    .responsive-width {
      max-width: 25%;
      display: inline-block;
    }
  }
</style>
