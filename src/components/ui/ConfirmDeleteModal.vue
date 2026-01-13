<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  visible: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirm Delete',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  isLoading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <div class="flex items-start gap-4">
        <div class="shrink-0">
          <AlertCircle class="w-6 h-6 text-red-600" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-600">{{ message }}</p>
        </div>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          @click="emit('confirm')"
          :disabled="isLoading"
          class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-colors"
        >
          {{ isLoading ? 'Deleting...' : confirmText }}
        </button>
        <button
          @click="emit('cancel')"
          :disabled="isLoading"
          class="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>
