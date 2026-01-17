<script setup lang="ts">
import { CheckCircle } from 'lucide-vue-next'

interface Props {
  visible: boolean
  title?: string
  message: string
  actionText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Success!',
  actionText: 'Done',
})

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex items-start gap-4">
        <div class="shrink-0">
          <CheckCircle class="w-6 h-6 text-green-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-600">{{ message }}</p>
        </div>
      </div>

      <button
        @click="emit('close')"
        class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors"
      >
        {{ actionText }}
      </button>
    </div>
  </div>
</template>
