import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/sale',
    component: Layout,
    redirect: '/sale/orders',
    name: 'Sales',
    meta: { title: 'Sales', icon: 'table' },
    children: [
      {
        path: 'create',
        name: 'Create Order',
        component: () => import('@/views/saleorders/create'),
        meta: { title: 'Create Order', icon: 'form' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditSaleOrder',
        component: () => import('@/views/saleorders/edit'),
        meta: { title: 'Edit Order', icon: 'form', activeMenu: '/sale/orders' },
        hidden: true
      },
      {
        path: 'orders',
        name: 'SaleOrderList',
        component: () => import('@/views/saleorders/list'),
        meta: { title: 'Order List', icon: 'table' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'Users',
    meta: { title: 'Users', icon: 'user' },
    children: [
      {
        path: 'create',
        name: 'CreateUser',
        component: () => import('@/views/user/create'),
        meta: { title: 'Create User', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditUser',
        component: () => import('@/views/user/edit'),
        meta: { title: 'Edit user', icon: 'edit', activeMenu: '/users/list' },
        hidden: true
      },
      {
        path: 'list',
        name: 'UsersList',
        component: () => import('@/views/saleorders/list'),
        meta: { title: 'User List', icon: 'table' }
      }
    ]
  },

  // Product
  {
    path: '/products',
    component: Layout,
    redirect: '/products/gallery',
    name: 'Products',
    meta: { title: 'Products', icon: 'table' },
    children: [
      {
        path: 'gallery',
        name: 'ProductList',
        component: () => import('@/views/product/list'),
        meta: { title: 'Product List', icon: 'table' }
      },
      {
        path: 'create',
        name: 'CreateProduct',
        component: () => import('@/views/product/create'),
        meta: { title: 'Create Product', icon: 'edit' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
