<template>
  <div class="user-dinamic-field">
    <div v-if="state === 'search'" class="user-edit">
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="rules"
        class="form-container"
        @submit.prevent
      >
        <el-form-item prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="Search for User"
            prefix-icon="el-icon-search"
            suffix-icon="el-icon-user"
            @input="debouncedSearchUsers"
          />
        </el-form-item>
        <div class="found-cusomers">
          <div
            v-for="potentialUser in foundUsers"
            :key="potentialUser.id"
            @click="chooseFoundUser(potentialUser)"
          >{{ potentialUser.username }}
          </div>
        </div>
        <template v-if="userForm.username.length > 1 && foundUsers.length === 0">
          <el-form-item prop="password">
            <el-input
              v-model="userForm.password"
              type="password"
              prefix-icon="el-icon-lock"
              show-password
            />
          </el-form-item>
          <el-form-item prop="passwordRepeat">
            <el-input v-model="userForm.passwordRepeat" type="password" prefix-icon="el-icon-lock" />
          </el-form-item>
          <div>
            <el-button type="success" @click="createUser">Create User</el-button>
            <el-button @click="generatePassword">Generate Password</el-button>
            <el-button type="warning" @click="clearSearch()">Clear</el-button>
          </div>
        </template>
        <el-button v-if="user" @click="cancelSelect">Cancel</el-button>
      </el-form>
    </div>
    <div v-else class="user-view">
      <div class="el-icon-user"> {{ user && user.username }} </div>
      <el-button type="success" @click="changeUser()">Change</el-button>
    </div>
  </div>
</template>

<script>
import { getUsers, createUser } from '@/api/user'
import debounce from 'throttle-debounce/debounce'
import { Message } from 'element-ui'

const defaultForm = {
  username: '',
  password: '',
  passwordRepeat: ''
}

export default {
  name: 'UserEditor',
  props: {
    user: { type: Object, default: undefined },
    initialstate: { type: String, default: 'search' }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.userForm.password !== '') {
          this.$refs.userForm.validateField('passwordRepeat')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.userForm.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      userForm: Object.assign({}, defaultForm),
      state: 'view',
      doneLoading: false,
      foundUsers: [],
      rules: {
        username: [
          { required: true, message: 'Username required', trigger: 'blur' },
          { min: 2, message: 'Username length shall be at least 2 characters', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          {
            min: 5,
            message: 'Password shall be at least 5 characters long',
            tirgger: 'blur'
          }
        ],
        passwordRepeat: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.debouncedSearchUsers = debounce(500, this.searchUsers)
    if (this._props.initialstate) {
      this.state = this._props.initialstate
    }
  },
  methods: {
    resetForm() {
      this.userForm = {
        username: '',
        password: '',
        passwordRepeat: ''
      }
    },
    changeUser() {
      this.resetForm()
      this.state = 'search'
    },
    cancelSelect() {
      this.state = 'view'
    },
    searchUsers() {
      if (!this.userForm.username) return
      getUsers({ username: this.userForm.username }).then(response => {
        if (response.status === 200) {
          this.foundUsers = response.data['hydra:member']
        } else {
          this.foundUsers = []
        }
      })
    },
    chooseFoundUser(userObject) {
      if (!userObject) return
      this.$emit('select-user', userObject)
      this.state = 'view'
      this.userForm.username = userObject.username
      this.foundUsers = []
    },
    clearSearch() {
      this.resetForm()
    },
    createUser() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          var data = {
            username: this.userForm.username,
            password: this.userForm.password
          }
          const thisField = this
          createUser(data).then(response => {
            if (response.status === 201) {
              thisField.$emit('select-user', response.data)
              thisField.state = 'view'
            } else {
              Message({
                message: 'Failed to save new user',
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
        }
      })
    },
    generatePassword() {
      var randomstring = Math.random().toString(36).slice(-8)
      this.userForm.password = randomstring
      this.userForm.passwordRepeat = randomstring
    }
  }
}
</script>
