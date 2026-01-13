<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Cleaner } from '@/types/cleaner'
import ImageUploader from './ImageUploader.vue'

const props = defineProps<{
  cleaner: Cleaner | null
  visible: boolean
}>()

const emit = defineEmits(['close', 'update'])
const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null)
const formData = ref<Partial<Cleaner>>({})

watch(
  () => props.cleaner,
  (newCleaner) => {
    if (newCleaner) {
      formData.value = { ...newCleaner }
      // Reset image uploader with existing images
      if (imageUploader.value) {
        imageUploader.value.uploadedImages = newCleaner.pictureCleaner || []
      }
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('close')
}

const submitUpdate = () => {
  if (props.cleaner) {
    const updateData = {
      name: formData.value.name,
      telegramChatId: formData.value.telegramChatId,
      area: formData.value.area,
      pictureCleaner: imageUploader.value?.uploadedImages || [],
    }
    emit('update', props.cleaner._id, updateData)
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Cleaner</h2>
      <form @submit.prevent="submitUpdate">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-4">
          <label for="telegramChatId" class="block text-sm font-medium text-gray-700"
            >Telegram Chat ID</label
          >
          <input
            type="text"
            id="telegramChatId"
            v-model="formData.telegramChatId"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-6">
          <label for="area" class="block text-sm font-medium text-gray-700">Area</label>
          <input
            type="text"
            id="area"
            v-model="formData.area"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-6">
          <ImageUploader ref="imageUploader" />
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
