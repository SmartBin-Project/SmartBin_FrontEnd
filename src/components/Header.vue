<script setup lang="ts">
import { Search, Bell, Menu } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
defineProps({
  sidebarOpen: Boolean,
})

const emit = defineEmits(['toggle-sidebar'])

const getInitials = (username: string | undefined) => {
  if (!username) return 'U'
  return username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="flex items-center justify-between w-full gap-2 md:gap-6">
    <!-- Hamburger Menu - Mobile/Tablet -->
    <button
      @click="emit('toggle-sidebar')"
      class="lg:hidden p-2 hover:bg-white rounded-lg transition-colors text-gray-600 shrink-0"
    >
      <Menu class="w-6 h-6" />
    </button>

    <!-- Search Bar - Mobile Optimized -->
    <div
      class="bg-white flex items-center px-4 md:px-5 py-3 md:py-3 rounded-xl md:rounded-full shadow-sm flex-1 max-w-sm md:max-w-md lg:max-w-xl border border-gray-100 focus-within:border-blue-500 focus-within:shadow-md transition-all"
    >
      <Search class="text-blue-500 w-5 md:w-5 h-5 md:h-5 mr-3 md:mr-3 shrink-0" />
      <input
        type="text"
        placeholder="Search anything..."
        class="bg-transparent outline-none w-full text-sm md:text-sm text-gray-600 placeholder-gray-400"
      />
    </div>

    <!-- Right Section - Icons & Profile -->
    <div class="flex items-center gap-2 md:gap-4 shrink-0">
      <div
        class="relative cursor-pointer hover:bg-white p-1.5 md:p-2 rounded-full transition-colors hidden sm:block"
      >
        <Bell class="text-blue-500 w-5 md:w-6 h-5 md:h-6" />
        <span
          class="absolute top-1 right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#F3F4F6]"
          >5</span
        >
      </div>

      <a href="/superadmin/account" class="flex items-center gap-1.5 md:gap-3 cursor-pointer">
        <div
          v-if="authStore.user?.profilePic"
          class="w-7 md:w-9 h-7 md:h-9 rounded-full border-2 border-white shadow-sm shrink-0 overflow-hidden"
        >
          <img :src="authStore.user.profilePic" alt="Profile" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-7 md:w-9 h-7 md:h-9 rounded-full border-2 border-white shadow-sm shrink-0 bg-blue-500 flex items-center justify-center text-white font-bold text-xs md:text-sm"
        >
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
