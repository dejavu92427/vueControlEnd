import Vue from 'vue'
import Router from 'vue-router'
import { deepClone } from '../../src/utils/index.js'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    hidden: true,
    isdel: false,
    noCache: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    isdel: false
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    isdel: false,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  /*{
    path: '/',
    component: Layout,
    redirect: '/maintain',
    isdel: false,
    children: [{
      path: 'maintain',
      name: 'Maintain',
      component: () => import('@/views/user/index'),
      meta: {title: '功能管理'}
    }]
  }*/
  /* 
   {
     path: '/example',
     component: Layout,
     redirect: '/example/table',
     name: 'Example',
     meta: { title: 'Example', icon: 'el-icon-s-help' },
     children: [
       {
         path: 'table',
         name: 'Table',
         component: () => import('@/views/table/index'),
         meta: { title: 'Table', icon: 'table' }
       },
       {
         path: 'tree',
         name: 'Tree',
         component: () => import('@/views/tree/index'),
         meta: { title: 'Tree', icon: 'tree' }
       }
     ]
   },
   {
     path: '/form',
     component: Layout,
     children: [
       {
         path: 'index',
         name: 'Form',
         component: () => import('@/views/form/index'),
         meta: { title: 'Form', icon: 'form' }
       }
     ]
   },
   {
     path: '/nested',
     component: Layout,
     redirect: '/nested/menu1',
     name: 'Nested',
     meta: {
       title: 'Nested',
       icon: 'nested'
     },
     children: [
       {
         path: 'menu1',
         component: () => import('@/views/nested/menu1/index'), // Parent router-view
         name: 'Menu1',
         meta: { title: 'Menu1' },
         children: [
           {
             path: 'menu1-1',
             component: () => import('@/views/nested/menu1/menu1-1'),
             name: 'Menu1-1',
             meta: { title: 'Menu1-1' }
           },
           {
             path: 'menu1-2',
             component: () => import('@/views/nested/menu1/menu1-2'),
             name: 'Menu1-2',
             meta: { title: 'Menu1-2' },
             children: [
               {
                 path: 'menu1-2-1',
                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                 name: 'Menu1-2-1',
                 meta: { title: 'Menu1-2-1' }
               },
               {
                 path: 'menu1-2-2',
                 component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                 name: 'Menu1-2-2',
                 meta: { title: 'Menu1-2-2' }
               }
             ]
           },
           {
             path: 'menu1-3',
             component: () => import('@/views/nested/menu1/menu1-3'),
             name: 'Menu1-3',
             meta: { title: 'Menu1-3' }
           }
         ]
       }
     ]
   },
   */
  // 404 page must be placed at the end !!!
  //{ path: '*', redirect: '/404', hidden: true }
]
//const roleRoute=[]
/*= [{
  path: '/console',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Console',
  meta: { title: '後台管理', icon: 'el-icon-s-help' },
  children: [
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/role/index'),
      meta: { title: '角色管理', icon: 'table' }
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/role/index'),
      meta: { title: '帳號維護', icon: 'table' }
    }
  ]
}
]*/


const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  //routes: deepClone([...constantRoutes, ...roleRoute])
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
  //keep default route
  let keep = router.options.routes.filter(e => e.isdel == false)
  router.options.routes = keep
  //Object.assign(state, getDefaultState())
}

export default router