import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/404',
      name: '404',
      component: () => import('@/components/layout/404Erorr.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },

    // user views
    {
      path: '/',
      name: 'home',
      component: () => import('../views/User/HomePage.vue'),
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: () => import('../views/User/AboutusPage.vue'),
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/User/ServicePage.vue'),
    },

    // super admin
    {
      path: '/superadmin',
      name: 'superadmin',
      component: () => import('../views/SuperAdmin/SuperAdminDashboard.vue'),
    },
    {
      path: '/superadmin/add-bin',
      name: 'superadmin-add-bin',
      component: () => import('../views/SuperAdmin/SuperAdminAddBin.vue'),
    },
    {
      path: '/superadmin/view-bin',
      name: 'superadmin-view-bin',
      component: () => import('../views/SuperAdmin/SuperAdminBinLocation.vue'),
    },

    {
      path: '/superadmin/view-customer',
      name: 'superadmin-view-customer',
      component: () => import('../views/SuperAdmin/SuperAdminViewCustomer.vue'),
    },
    {
      path: '/superadmin/add-customer',
      name: 'superadmin-add-customer',
      component: () => import('../views/SuperAdmin/SuperAdminAddCustomer.vue'),
    },
    {
      path: '/superadmin/account',
      name: 'superadmin-account',
      component: () => import('../views/SuperAdmin/SuperAdminAccount.vue'),
    },

    // auth
    {
      path: '/signup',
      name: 'login',
      component: () => import('../views/Auth/SignupPage.vue'),
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/Auth/SigninPage.vue'),
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/Auth/ForgotPage.vue'),
    },
    // admin views

  ],
})

export default router
