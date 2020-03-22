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
    edit: 'Edit',
    search: 'Search',
    reset: 'Reset'
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
    },
    validation: {
      required: 'The field is required',
      date: 'Input a valid date',
      company: 'Ivalid company provided'
    }
  },
  filters: {
    username: 'Search by username',
    role: 'Search by role'
  },
  error: {
    userlistempty: 'Cannot find any users by given criteria.',
    clorderlistempty: 'No container load orders found by given criteria',
    savefail: 'Failed to save'
  },
  order: {
    startDateTime: 'Start Date Time',
    date: 'Order Date',
    containerType: 'Container Type',
    customer: 'Customer',
    price: 'Price',
    description: 'Description',
    descriptionDetails: 'Describe the content to be loaded to container. Average carton box size.',
    state: 'State',
    states: {
      fresh: 'Fresh',
      planned: 'Planned',
      inprogress: 'In Progress',
      done: 'Done',
      canceled: 'Canceled'
    }
  },
  clorder: {
    assignedTo: 'Assigned to'
  },
  container: {
    c20ft: '20FT Container',
    hq: 'HQ Container',
    other: 'Other'
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
    phone: 'Phone number',
    enabled: 'Account Enabled'
  },
  company: {
    name: 'Company Name',
    email: 'Email'
  }
}
