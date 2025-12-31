<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'

// Import your existing components
import LoadingComponent from './components/layout/LoadingComponent.vue'

// Import the SmartBin Layout components
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'

const isLoading = ref(true)
const router = useRouter()

router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  isLoading.value = false
})
</script>

<template>
  <div class="flex bg-[#F3F4F6] min-h-screen font-sans">
    
    <Sidebar />

    <main class="flex-1 ml-64 p-8 relative">
      
      <Header />

      <LoadingComponent v-if="isLoading" />

      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      
    </main>
  </div>
</template>

<style>
/* Simple Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>