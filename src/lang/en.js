export default {
  dashboard: {
    title: 'Dashboard'
  },
  saleorders: {
    title: 'Sale Orders',
    list: 'Sale Order List',
    create: 'Create Order',
    edit: 'Edit Order'
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
  clorders: {
    title: 'Container Load Order',
    list: 'Container Load Orders',
    edit: 'Edit Container Load Order',
    create: 'Create Container Load Order'
  },
  clorder: {
    assignedTo: 'Assigned to'
  },
  container: {
    c20ft: '20FT Container',
    hq: 'HQ Container',
    other: 'Other'
  },
  customerprofiles: {
    title: 'Customer Profiles',
    create: 'Create Customer Profile',
    edit: 'Edit Customer Profile',
    list: 'Customer Profile List'
  },
  customerprofile: {
    company: 'Company Name',
    email: 'Email',
    phone: 'Phone',
    webpage: 'Webpage',
    staff: 'Company staff'
  },
  users: {
    title: 'Users',
    create: 'Create User',
    edit: 'Edit User',
    list: 'User List'
  },
  user: {
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
  button: {
    ok: 'OK',
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
    },
    save: 'Save',
    delete: 'Delete',
    warning: 'Warning',
    load: 'Load'
  },
  messages: {
    save: {
      success: 'Successfully saved',
      fail: 'Failed to save'
    },
    delete: {
      success: 'Successfully deleted {count} records',
      fail: 'Failed to delete {count} records'
    },
    warn: {
      delete: 'This will permanently delete {count} items. Continue?'
    }
  },
  filters: {
    username: 'Search by username',
    role: 'Search by role',
    company: 'Search by company name'
  },
  error: {
    userlistempty: 'Cannot find any users by given criteria.',
    clorderlistempty: 'No container load orders found by given criteria',
    savefail: 'Failed to save',
    listempty: 'The list is empty'
  }
}
