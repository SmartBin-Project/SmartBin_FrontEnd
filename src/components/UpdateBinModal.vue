<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Bin } from '@/types/bin'

const props = defineProps<{
  bin: Bin | null
  visible: boolean
}>()

const emit = defineEmits(['close', 'update'])

const formData = ref<Partial<Bin>>({})

watch(
  () => props.bin,
  (newBin) => {
    if (newBin) {
      formData.value = { ...newBin }
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('close')
}

const submitUpdate = () => {
  if (props.bin) {
    emit('update', props.bin._id, formData.value)
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Bin</h2>
      <form @submit.prevent="submitUpdate">
        <div class="mb-4">
          <label for="binCode" class="block text-sm font-medium text-gray-700">Bin Code</label>
          <input
            type="text"
            id="binCode"
            v-model="formData.binCode"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div class="mb-4">
          <label for="area" class="block text-sm font-medium text-gray-700">Area</label>
          <input
            type="text"
            id="area"
            v-model="formData.area"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div class="mb-4">
          <label for="fillLevel" class="block text-sm font-medium text-gray-700">Fill Level</label>
          <input
            type="number"
            id="fillLevel"
            v-model="formData.fillLevel"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div class="mb-4" v-if="formData.location">
          <label for="lat" class="block text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            step="any"
            id="lat"
            v-model="formData.location.lat"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div class="mb-6" v-if="formData.location">
          <label for="lng" class="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            step="any"
            id="lng"
            v-model="formData.location.lng"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
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
