<template>
  <div class="user-editor-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      @submit.prevent
    >
      <el-form-item prop="username">
        <el-input
          v-model="postForm.username"
          prefix-icon="el-icon-user"
          :placeholder="$t('user.username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="postForm.password"
          type="password"
          prefix-icon="el-icon-lock"
          :placeholder="$t('user.password')"
        />
      </el-form-item>
      <el-form-item prop="passwordRepeat">
        <el-input
          v-model="postForm.passwordRepeat"
          type="password"
          prefix-icon="el-icon-lock"
          :placeholder="$t('user.passwordRepeat')"
        />
      </el-form-item>
      <el-form-item prop="phone">
        <el-input
          v-model="postForm.phone"
          prefix-icon="el-icon-mobile"
          :placeholder="$t('user.phone')"
          />
      </el-form-item>
      <el-form-item :label="$t('user.enabled')">
          <el-checkbox v-model="postForm.enabled" checked></el-checkbox>
      </el-form-item>
      <el-form-item prop="roles" :label="$t('user.roles')">
        <el-checkbox-group v-model="postForm.roles">
         <el-checkbox label="admin">{{ $t('user.admin') }}</el-checkbox>
         <el-checkbox label="customer"> {{ $t('user.customer') }}</el-checkbox>
         <el-checkbox label="teamleader">{{ $t('user.teamleader') }}</el-checkbox>
         <el-checkbox label="worker">{{ $t('user.worker') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="company-related-data" v-if="postForm.roles.find(checkIsCustomer)">
        <el-form-item prop="company.name">
          <el-input
            v-model="postForm.company.name"
            prefix-icon="el-icon-office-building"
            :placeholder="$t('company.name')"
            />
         </el-form-item>
        <el-form-item prop="company.email">
          <el-input
            v-model="postForm.company.email"
            prefix-icon="el-icon-message"
            :placeholder="$t('company.email')"
            />
        </el-form-item>
      </div>
      <el-button v-loading="loading" type="success" @click="submitForm('postForm')">
        {{ $t('button.save') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getUser } from '@/api/user'

const defaultForm = {
  username: '',
  password: '',
  passwordRepeat: '',
  phone: '',
  roles: [],
  company: { name: '', email: ''}
}

export default {
  name: 'UserEditor',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: 0
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!this.isEdit && value === '') {
        callback(new Error(this.$t('message.password.notnull')))
      } else if (this.isEdit && value !== ''){
        if (this.postForm.password !== '') {
          this.$refs.postForm.validateField('passwordRepeat')
        }
        callback()
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (this.postForm.password !== '' && value === '') {
        callback(new Error(this.$t('message.password.repeatnull')))
      } else if (value !== '' && value !== this.postForm.password) {
        callback(new Error(this.$t('message.password.nomatch')))
      } else {
        callback()
      }
    }

    var validatePhone = (rule, value, callback) => {
      if (!value.match(/\+?[\d \-]{8,12}/)) {
        callback(new Error(this.$t('message.phone.notnull')))
      } else {
        callback()
      }
    }

    var validateCompany = (rule, value, callback) => {
      console.log(value)
      if (!this.postForm.roles.find(val => {return val === 'customer'})) {
        callback()
      }
      else if (value === '') {
        callback(new Error(this.$t('message.company.required')))
      }
      else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        username: [
          { required: true, message: this.$t('message.username.required'), trigger: 'blur' },
          { min: 2, message: this.$t('message.username.len'), trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordRepeat: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        company: {name: [
          { validator: validateCompany, trigger: 'blur' }
        ]}
      }

    }
  },
  created() {
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var uid = this.isEdit ? (this.userId ? this.userId : this.$route.params.id) : false
      if (!uid) return
      getUser(uid).then(response => {
        if (response.status === 200) {
          var data = response.data
          this.postForm.username = response.data.username
          this.postForm.roles = response.data.plainRoles
          this.postForm.enabled = response.data.enabled
          this.postForm.company.name = data.company ? data.company.name : ''
          console.log(response.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    checkIsCustomer(item) {
      return item === 'customer'
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: 'Save',
            message: 'Saved successfully',
            type: 'success',
            duration: 2000
          })
          this.loading = false
        } else {
          console.log('Error submiting user form!!!')
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
</style>
