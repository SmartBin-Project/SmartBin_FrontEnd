<script setup lang="ts">
import { Search, Bell, Menu } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'; // 1. Import
import LanguageSwitcher from './ui/LanguageSwitcher.vue'; // 2. Import Switcher

const { t } = useI18n(); // 3. Init
const authStore = useAuthStore()
const searchQuery = ref('')

defineProps({
  sidebarOpen: Boolean,
})

const emit = defineEmits(['toggle-sidebar', 'search'])

const handleSearch = (query: string) => {
  searchQuery.value = query
  emit('search', query)
}

const getInitials = (username: string | undefined) => {
  if (!username) return 'U'
  return username.split(' ').map((word) => word[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="flex items-center justify-between w-full gap-2 md:gap-6">
    <button
      @click="emit('toggle-sidebar')"
      class="lg:hidden p-2 hover:bg-white rounded-lg transition-colors text-gray-600 shrink-0"
    >
      <Menu class="w-6 h-6" />
    </button>

    <div
      class="bg-white flex items-center px-4 md:px-5 py-3 md:py-3 rounded-xl md:rounded-full shadow-sm flex-1 max-w-sm md:max-w-md lg:max-w-xl border border-gray-100 focus-within:border-blue-500 focus-within:shadow-md transition-all"
    >
      <Search class="text-blue-500 w-5 md:w-5 h-5 md:h-5 mr-3 md:mr-3 shrink-0" />
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch(searchQuery)"
        :placeholder="t('ui.search_anything')" 
        class="bg-transparent outline-none w-full text-sm md:text-sm text-gray-600 placeholder-gray-400"
      />
    </div>

    <div class="flex items-center gap-2 md:gap-4 shrink-0">
      
      <LanguageSwitcher />

      <a href="/superadmin/account" class="flex items-center gap-1.5 md:gap-3 cursor-pointer">
        <div v-if="authStore.user?.profilePic" class="w-7 md:w-9 h-7 md:h-9 rounded-full border-2 border-white shadow-sm shrink-0 overflow-hidden">
          <img :src="authStore.user.profilePic" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-7 md:w-9 h-7 md:h-9 rounded-full border-2 border-white shadow-sm shrink-0 bg-green-500 flex items-center justify-center text-white font-bold text-xs md:text-sm">
          {{ getInitials(authStore.user?.username) }}
        </div>
        <div class="hidden sm:block">
          <p class="text-xs md:text-sm font-bold text-gray-700 leading-tight">
            {{ authStore.user?.username }}
          </p>
          <p class="hidden md:block text-xs text-gray-500">{{ authStore.user?.role }}</p>
        </div>
      </a>
    </div>
  </div>
</template>