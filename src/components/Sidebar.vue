<script setup lang="ts">
import {
  LayoutDashboard, MapPin, Trash2, Settings, LogOut,
  Sparkles, UserCheck, ShieldCheck, KeyRound,
} from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { ref, computed } from 'vue' // Import computed
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n'; // Import i18n

const { t } = useI18n();
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const showLogoutConfirm = ref(false)

const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.replace({ name: 'home' })
    showLogoutConfirm.value = false
  } catch (error) {
    console.error('Logout failed:', error)
    await router.replace({ name: 'home' })
    showLogoutConfirm.value = false
  }
}
const cancelLogout = () => {
  showLogoutConfirm.value = false
}

// 1. Convert menuItems to computed so they update when language changes
const menuItems = computed(() => [
  { name: t('ui.dashboard'), icon: LayoutDashboard, url: '/superadmin' },
  { name: t('ui.view_bin'), icon: MapPin, url: '/superadmin/view-bin' },
  { name: t('ui.view_cleaner'), icon: Sparkles, url: '/superadmin/view-cleaner' },
  { name: t('ui.view_admin'), icon: ShieldCheck, url: '/superadmin/view-admin' },
  { name: t('ui.add_cleaner'), icon: UserCheck, url: '/superadmin/add-cleaner' },
  { name: t('ui.add_admin'), icon: KeyRound, url: '/superadmin/add-admin' },
  { name: t('ui.add_smartbin'), icon: Trash2, url: '/superadmin/add-bin' },
  { name: t('ui.settings'), icon: Settings, url: '/superadmin/account' },
])

const isMenuItemActive = (url: any) => {
  return route.path === url
}
</script>

<template>
  <aside class="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between z-20 lg:static lg:h-screen">
    <div>
      <div class="h-24 flex items-center justify-center border-b border-gray-100">
        <router-link to="/" class="w-full h-50 mr-2">
          <img src="/Smart_Bin.png" alt="logo" class="w-full h-full object-cover drop-shadow-sm" />
        </router-link>
      </div>

      <nav class="mt-4 px-4 space-y-2">
        <RouterLink
          v-for="item in menuItems"
          :key="item.url" 
          :to="item.url"
          :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer',
            isMenuItemActive(item.url)
              ? 'bg-green-600 text-white'
              : 'text-gray-500 hover:bg-gray-50 hover:text-green-600',
          ]"
        >
          <component :is="item.icon" :size="20" class="mr-3" />
          <span class="font-medium text-sm">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="p-4 mb-4 border-t border-gray-100 flex items-center justify-center">
      <button
        class="w-full flex items-center px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        @click="showLogoutConfirm = true"
        :disabled="authStore.loading"
      >
        <LogOut :size="20" class="mr-3" />
        <span class="font-medium text-sm">{{
          authStore.loading ? t('ui.logging_out') : t('ui.logout')
        }}</span>
      </button>
    </div>

    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelLogout"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-96 transform transition-all duration-300">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <LogOut class="w-6 h-6 text-red-600" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 text-center mb-2">{{ t('ui.logout_confirm_title') }}</h3>
        <p class="text-gray-600 text-center mb-6">{{ t('ui.logout_confirm_msg') }}</p>

        <div class="flex gap-3">
          <button
            @click="cancelLogout"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {{ t('ui.cancel') }}
          </button>
          <button
            @click="handleLogout"
            :disabled="authStore.loading"
            class="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut :size="18" />
            {{ authStore.loading ? t('ui.logout') + '...' : t('ui.logout') }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>