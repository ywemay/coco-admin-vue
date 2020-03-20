import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/lang' // internationalization

Vue.use(Router)

i18n.locale = 'en'
function $t (key, value) {
  return i18n.t(key, value)
}

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
      name: $t('route.dashboard'),
      component: () => import('@/views/dashboard/index'),
      meta: { title: $t('route.dashboard'), icon: 'dashboard' }
    }]
  },
  {
    path: '/sale',
    component: Layout,
    redirect: '/sale/orders',
    name: 'Sales',
    meta: { title: $t('route.sales'), icon: 'table' },
    children: [
      {
        path: 'create',
        name: 'CreateSaleOrder',
        component: () => import('@/views/saleorders/create'),
        meta: { title: $t('route.order.create'), icon: 'form' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditSaleOrder',
        component: () => import('@/views/saleorders/edit'),
        meta: { title: $t('route.order.edit'), icon: 'form', activeMenu: '/sale/orders' },
        hidden: true
      },
      {
        path: 'orders',
        name: 'SaleOrderList',
        component: () => import('@/views/saleorders/list'),
        meta: { title: $t('route.order.list'), icon: 'table' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'Users',
    meta: { title: $t('route.users'), icon: 'user' },
    children: [
      {
        path: 'create',
        name: 'CreateUser',
        component: () => import('@/views/user/create'),
        meta: { title: $t('route.user.create'), icon: 'form' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditUser',
        component: () => import('@/views/user/edit'),
        meta: { title: $t('route.user.edit'), icon: 'edit', activeMenu: '/users/list' },
        hidden: true
      },
      {
        path: 'list',
        name: 'UsersList',
        component: () => import('@/views/user/list'),
        meta: { title: $t('route.user.list'), icon: 'table' }
      }
    ]
  },

  // Container load orders
  {
    path: '/clorders',
    component: Layout,
    redirect: '/clorders/list',
    name: 'ContainerLoadOrders',
    meta: { title: $t('route.clorders'), icon: 'ctnrload' },
    children: [
      {
        path: 'list',
        name: 'CLOrders',
        component: () => import('@/views/clorders/list'),
        meta: { title: $t('route.clorder.list'), icon: 'ctnrload' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'EditCLOrder',
        component: () => import('@/views/clorders/edit'),
        meta: { title: $t('route.clorder.edit'), icon: 'edit', activeMenu: '/clorders/list' },
        hidden: true
      },
      {
        path: 'create',
        name: 'CreateCLOrder',
        component: () => import('@/views/clorders/create'),
        meta: { title: $t('route.clorder.create'), icon: 'form' }
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
