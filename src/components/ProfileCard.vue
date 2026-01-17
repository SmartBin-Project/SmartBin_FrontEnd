<script setup lang="ts">
import { Copy } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore()
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
    <h3 class="text-left font-bold text-lg mb-4 text-gray-800">{{ t('ui.user_profile') }}</h3>

    <div class="relative inline-block mb-3">
             <div
        v-if="authStore.user?.profilePic"
        class="w-18 h-18 rounded-full border-2 border-white shadow-sm overflow-hidden"
      >
        <img :src="authStore.user.profilePic" alt="Profile" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-18 h-18 rounded-full border-2 border-white shadow-sm bg-green-500 flex items-center justify-center text-white font-bold text-lg"
      >
        {{ (authStore.user?.username?.[0] || 'U').toUpperCase() }}
      </div>
    </div>

    <h2 class="text-xl font-bold text-gray-800">{{ authStore.user?.username }}</h2>

    <div class="flex items-center justify-center gap-2 mt-1 text-gray-500 text-sm">
      <span>{{ authStore.user?.email }}</span>
      <button class="text-blue-500 hover:text-blue-600">
        <Copy :size="14" />
      </button>
    </div>

    <button
      class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors"
    >
      {{ t('ui.change_password') }}
    </button>
  </div>
</template>
