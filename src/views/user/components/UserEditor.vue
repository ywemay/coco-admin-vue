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
        <el-input v-model="postForm.username" placeholder="User Name" prefix-icon="el-icon-user" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="postForm.password"
          type="password"
          placeholder="Password"
          prefix-icon="el-icon-lock"
        />
      </el-form-item>
      <el-form-item prop="passwordRepeat">
        <el-input
          v-model="postForm.passwordRepeat"
          type="password"
          placeholder="Password repeat"
          prefix-icon="el-icon-lock"
        />
      </el-form-item>
      <el-button v-loading="loading" type="success" @click="submitForm('postForm')">Save</el-button>
      <div>UserId: {{ userId }}</div>
    </el-form>
  </div>
</template>

<script>
import { getUser } from '@/api/user'

const defaultForm = {
  username: '',
  password: '',
  passwordRepeat: ''
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
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.postForm.password !== '') {
          this.$refs.postForm.validateField('passwordRepeat')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.postForm.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        username: [
          { required: true, message: 'Username required', trigger: 'blur' },
          { min: 2, message: 'Username length shall be at least 2 characters', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordRepeat: [{ validator: validatePass2, trigger: 'blur' }]
      }

    }
  },
  created() {
  },
  mounted() {
    if (this.userId) {
      getUser(this.userId).then(response => {
        if (response.status === 200) {
          this.postForm.username = response.data.username
        }
      })
    }
  },
  methods: {
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
