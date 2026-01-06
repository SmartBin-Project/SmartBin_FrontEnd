<template>
  <div id="app-container" class="flex h-screen bg-gray-100 font-sans">
    <LoadingComponent v-if="isLoading" />

    <!-- Admin Layout -->
    <template v-if="authStore.getUser?.role === 'ADMIN' || authStore.getUser?.role === 'SUPERADMIN'">

      <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <div class="flex-1">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </RouterView>
        </div>
      </main>
    </template>

    <!-- Public Layout -->
    <template v-else>
      <div class="flex-1 flex flex-col h-screen">
        <Navigation v-if="!$route.meta.hideNav" @search="handleSearch" />
        <main class="flex-1">
          <RouterView v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="route.path" :search-text="searchQuery" />
            </transition>
          </RouterView>
        </main>
        <Footer v-if="!$route.meta.hideFooter" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import Footer from '@/components/layout/Footer.vue'

import LoadingComponent from '@/components/layout/LoadingComponent.vue'
import Navigation from '@/components/layout/Navigation.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const isLoading = ref(false)

const isMapPage = computed(() => route.path === '/')
const isAuthPage = computed(() => {
  return route.path.startsWith('/auth')
})

const handleSearch = (query: string) => {
  searchQuery.value = query
}

router.beforeEach(() => {
  isLoading.value = true
})

router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
