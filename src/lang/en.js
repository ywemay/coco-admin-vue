export default {
  route: {
    dashboard: 'Dashboard',
    sales: 'Sales',
    order: {
      create: 'Create Order',
      edit: 'Edit Order',
      list: 'Order List'
    },
    clorders: 'Container Load Orders',
    clorder: {
      list: 'Container Load Orders List',
      edit: 'Edit Container Load Order',
      create: 'Create Container Load Order'
    },
    users: 'Users',
    user: {
      create: 'Create User',
      edit: 'Edit User',
      list: 'User List'
    }
  },
  button: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit'
  },
  message: {
    password: {
      notnull: 'Please input the password',
      repeatnull: 'Please input the password again',
      nomatch: 'Two inputs don\'t match!'
    },
    phone: {
      notnull: 'Please input a phone number'
    },
    username: {
      required: 'Username required',
      len: 'Username length shall be at least 2 characters long'
    },
    company: {
      required: 'Company name required'
    }
  },
  error: {
    userlistempty: 'Cannot find any users by given criteria.',
    clorderlistempty: 'No container load orders found by given criteria'
  },
  user: {
    // The following fields aer used in userforms:
    username: 'User Name',
    password: 'Password',
    passwordRepeat: 'Repeat password',
    roles: 'Roles',
    admin: 'Administrator',
    teamleader: 'Teamleader',
    worker: 'Worker',
    customer: 'Customer',
    phone: 'Phone number'
  },
  company: {
    name: 'Company Name',
    email: 'Email'
  }
}
