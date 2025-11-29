<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import LoadingComponent from './components/layout/LoadingComponent.vue'
import { ref } from 'vue'

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
  <LoadingComponent v-if="isLoading" />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
