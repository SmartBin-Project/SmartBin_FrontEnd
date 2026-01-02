<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import LoadingComponent from './components/layout/LoadingComponent.vue'
import Navigation from './components/layout/Navigation.vue'
import Footer from './components/layout/Footer.vue'
import { ref } from 'vue'
import LoadingComponent from './components/layout/LoadingComponent.vue'

const isLoading = ref(true)
const searchQuery = ref('') // 1. Added the bridge variable
const router = useRouter()

// Handle the search event from Navigation.vue
const handleSearch = (query: string) => {
  searchQuery.value = query
}

router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  // Artificial delay if you want the loader to feel smoother
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

<template>
  <LoadingComponent v-if="isLoading" />

  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
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
