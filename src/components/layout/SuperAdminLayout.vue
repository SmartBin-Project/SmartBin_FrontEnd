<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'

defineProps({
  title: {
    type: String,
    default: 'Page',
  },
})

const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar - Desktop -->
    <div class="hidden lg:block">
      <Sidebar />
    </div>

    <!-- Sidebar - Mobile/Tablet (Overlay) -->
    <Transition name="sidebar">
      <div v-if="sidebarOpen" class="fixed inset-0 z-30 lg:hidden">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 transition-opacity duration-300"
          @click="sidebarOpen = false"
        ></div>
        <!-- Sidebar Content -->
        <div class="absolute inset-y-0 left-0 w-64 transition-transform duration-300">
          <Sidebar />
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="w-full bg-gray-50 border-b border-gray-100 px-3 md:px-6 lg:px-8 py-3 md:py-4">
        <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-3 md:p-6 lg:p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ title }}</h2>
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from {
  opacity: 0;
}

.sidebar-leave-to {
  opacity: 0;
}
</style>
