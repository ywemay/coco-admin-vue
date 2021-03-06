<template>
  <div class="user-editor-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
      @submit.prevent
    >
      <el-form-item prop="username" class="responsive-width">
        <el-input
          v-model="postForm.username"
          prefix-icon="el-icon-user"
          :placeholder="$t('user.username')"
        />
      </el-form-item>
      <el-form-item prop="password" class="responsive-width">
        <el-input
          v-model="postForm.password"
          type="password"
          prefix-icon="el-icon-lock"
          :placeholder="$t('user.password')"
        />
      </el-form-item>
      <el-form-item prop="passwordRepeat" class="responsive-width">
        <el-input
          v-model="postForm.passwordRepeat"
          type="password"
          prefix-icon="el-icon-lock"
          :placeholder="$t('user.passwordRepeat')"
        />
      </el-form-item>
      <el-form-item prop="phone" class="responsive-width">
        <el-input
          v-model="postForm.phone"
          prefix-icon="el-icon-mobile"
          :placeholder="$t('user.phone')"
        />
      </el-form-item>
      <el-form-item :label="$t('user.enabled')">
        <el-checkbox v-model="postForm.enabled" checked />
      </el-form-item>
      <el-form-item prop="roles" :label="$t('user.roles')">
        <el-checkbox-group v-model="postForm.roles">
          <el-checkbox label="admin">{{ $t('user.admin') }}</el-checkbox>
          <el-checkbox label="customer"> {{ $t('user.customer') }}</el-checkbox>
          <el-checkbox label="teamleader">{{ $t('user.teamleader') }}</el-checkbox>
          <el-checkbox label="worker">{{ $t('user.worker') }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-button
        v-loading="loading"
        type="success"
        :icon="'el-icon-' + (isEdit ? 'check' : 'plus')"
        :title="$t('button.save')"
        @click="submitForm('postForm')"
      />
      <el-button
        v-if="redirect"
        icon="el-icon-close"
        :title="$t('button.close')"
        @click="$router.push(redirect)"
      />
    </el-form>
  </div>
</template>

<script>
import { getUser, createUser, updateUser } from '@/api/user'

const defaultForm = {
  username: '',
  password: '',
  passwordRepeat: '',
  phone: '',
  roles: [],
  company: { name: '', email: '' }
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
      } else if (this.isEdit && value !== '') {
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
      if (value && !value.match(/\+?[\d \-]{8,12}/)) {
        callback(new Error(this.$t('message.phone.notnull')))
      } else {
        callback()
      }
    }

    var validateCompany = (rule, value, callback) => {
      if (!this.postForm.roles.find(val => {
        return val === 'customer'
      })) {
        callback()
      } else if (value === '') {
        callback(new Error(this.$t('message.company.required')))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      redirect: false,
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
        company: { name: [
          { validator: validateCompany, trigger: 'blur' }
        ] }
      }

    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.$route.query && this.$route.query.redirect) {
        this.redirect = this.$route.query.redirect
      }
      var uid = this.isEdit ? (this.userId ? this.userId : this.$route.params.id) : false
      if (!uid) return
      getUser(uid).then(response => {
        if (response.status === 200) {
          var data = response.data
          this.postForm.username = data.username
          this.postForm.roles = data.roles
          this.postForm.enabled = data.enabled
        }
      }).catch(err => {
        this.$notify({
          title: this.$t('message.load'),
          message: err,
          type: 'error',
          duration: 2000
        })
      })
    },
    notifyResult(response, rezCode = 201) {
      if (response.status === rezCode) {
        this.$notify({
          title: this.$t('message.save'),
          message: this.$t('messages.save.success'),
          type: 'success',
          duration: 2000
        })
        var destination = {
          path: '/user/create',
          query: { }
        }
        if (this.redirect) {
          destination.query = { redirect: this.redirect }
        }
        this.$route.push(destination)
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
          if (this.isEdit) {
            console.log(this.postForm)
            updateUser(this.userId, this.postForm).then(response => {
              this.notifyResult(response, 200)
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            createUser(this.postForm).then(response => {
              this.notifyResult(response)
            }).catch((error, response) => {
              console.log('Error: ' + error)
              console.log('Response???')
              console.log(response)
              this.laoding = false
            })
          }
          this.loading = false
        } else {
          console.log('Error submiting user form!!!')
          return false
        }
      })
    }
  }
}
</script>
