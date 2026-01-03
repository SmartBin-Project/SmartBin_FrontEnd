<script setup>
import {
  LayoutDashboard,
  MapPin,
  Trash2,
  Settings,
  LogOut,
  Trash,
  Sparkles,
  UserCheck,
  ShieldCheck,
  KeyRound,
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showLogoutConfirm = ref(false)

const handleLogout = async () => {
  try {
    await authStore.logout()
    // Replace current history entry instead of pushing, so back button doesn't go to superadmin
    await router.replace({ name: 'home' })
    showLogoutConfirm.value = false
  } catch (error) {
    console.error('Logout failed:', error)
    // Still redirect even if logout fails
    await router.replace({ name: 'home' })
    showLogoutConfirm.value = false
  }
}
const cancelLogout = () => {
  showLogoutConfirm.value = false
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, url: '/superadmin' },
  { name: 'View Bin', icon: MapPin, url: '/superadmin/view-bin' },
  { name: 'View Cleaner', icon: Sparkles, url: '/superadmin/view-cleaner' },
  { name: 'View Admin', icon: ShieldCheck, url: '/superadmin/view-admin' },
  { name: 'Add Cleaner', icon: UserCheck, url: '/superadmin/add-cleaner' },
  { name: 'Add Admin', icon: KeyRound, url: '/superadmin/add-admin' },
  { name: 'Add SmartBin', icon: Trash2, url: '/superadmin/add-bin' },
  { name: 'Settings', icon: Settings, url: '/superadmin/account' },
]

// Compute active state based on current route
const isMenuItemActive = (url) => {
  return route.path === url
}
</script>

<template>
  <aside
    class="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between z-20 lg:static lg:h-screen"
  >
    <div>
      <div class="h-24 flex items-center px-8">
        <!-- <div class="bg-green-600 p-1.5 rounded-lg mr-3">
          <Trash class="text-white w-6 h-6" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">SmartBin</h1> -->
        <router-link
          to="/"
          class="flex items-center w-[130px] md:w-40 shrink-0 transition-all hover:opacity-80 active:scale-95"
        >
          <img
            src="/Users/macbookpro/Developer/Competition/FullStackSmartBin/smart_bin/src/assets/images/SmartBin.png"
            alt="logo"
            class="w-full drop-shadow-sm"
          />
        </router-link>
      </div>

      <nav class="mt-4 px-4 space-y-2">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.url"
          :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer',
            isMenuItemActive(item.url)
              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
              : 'text-gray-500 hover:bg-gray-50 hover:text-green-600',
          ]"
        >
          <component :is="item.icon" :size="20" class="mr-3" />
          <span class="font-medium text-sm">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="p-4 mb-4">
      <button
        class="w-full flex items-center px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        @click="showLogoutConfirm = true"
        :disabled="authStore.loading"
      >
        <LogOut :size="20" class="mr-3" />
        <span class="font-medium text-sm">{{
          authStore.loading ? 'Logging out...' : 'Logout'
        }}</span>
      </button>
    </div>

    <!-- Logout Confirmation Modal -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelLogout"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-96 transform transition-all duration-300">
        <div
          class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4"
        >
          <LogOut class="w-6 h-6 text-red-600" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Logout Confirmation</h3>

        <p class="text-gray-600 text-center mb-6">
          Are you sure you want to logout? You'll need to login again to access your account.
        </p>

        <div class="flex gap-3">
          <button
            @click="cancelLogout"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut :size="18" />
            {{ authStore.loading ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
