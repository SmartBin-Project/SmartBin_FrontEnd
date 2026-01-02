import { createRouter, createWebHistory } from 'vue-router'
import * as authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'

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

    // super admin - Protected Routes
    {
      path: '/superadmin',
      name: 'superadmin',
      component: () => import('../views/SuperAdmin/SuperAdminDashboard.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },
    {
      path: '/superadmin/add-bin',
      name: 'superadmin-add-bin',
      component: () => import('../views/SuperAdmin/SuperAdminAddBin.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },
    {
      path: '/superadmin/view-bin',
      name: 'superadmin-view-bin',
      component: () => import('../views/SuperAdmin/SuperAdminBinLocation.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },

    {
      path: '/superadmin/view-cleaner',
      name: 'superadmin-view-cleaner',
      component: () => import('../views/SuperAdmin/SuperAdminViewCleaner.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },
    {
      path: '/superadmin/add-cleaner',
      name: 'superadmin-add-cleaner',
      component: () => import('../views/SuperAdmin/SuperAdminAddCleaner.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },

    {
      path: '/superadmin/view-admin',
      name: 'superadmin-view-admin',
      component: () => import('../views/SuperAdmin/SuperAdminViewAdmin.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },
    {
      path: '/superadmin/add-admin',
      name: 'superadmin-add-admin',
      component: () => import('../views/SuperAdmin/SuperAdminAddAdmin.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },
    {
      path: '/superadmin/account',
      name: 'superadmin-account',
      component: () => import('../views/SuperAdmin/SuperAdminAccount.vue'),
      meta: { requiresAuth: true, roles: ['SUPERADMIN'] },
    },

    // auth routes
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Auth/SignupPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('../views/Auth/SigninPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/Auth/ForgotPage.vue'),
      meta: { requiresAuth: false },
    },
    // admin views
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles as string[] | undefined

  authStore.loadUserFromStorage()

  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role

  // Check if user has required role for the route
  if (requiresAuth && requiredRoles && !requiredRoles.includes(userRole || '')) {
    return next({ name: 'home', replace: true })
  }

  // If authenticated, ONLY allow access to protected routes
  // Block access to ANY public/unauthenticated route (home, aboutus, service, signin, signup, forgot)
  if (isAuthenticated && !requiresAuth) {
    const role = userRole
    if (role === 'SUPERADMIN') {
      return next({ name: 'superadmin', replace: true })
    } else if (role === 'ADMIN') {
      return next({ name: 'admin', replace: true })
    }
    return next({ name: 'home', replace: true })
  }

  next()
})

export default router
