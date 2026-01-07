<script setup lang="ts">
import { ref } from 'vue'
import { useBinStore } from '@/stores/binStore'
import ImageUploader from '@/components/ImageUploader.vue'

const binStore = useBinStore()
const imageUploader = ref<{ uploadedImages: string[] }>()

const formData = ref({
  binCode: '',
  area: '',
  location: {
    lat: '',
    lng: '',
  },
  fillLevel: 0,
  status: 'EMPTY' as 'EMPTY' | 'HALF' | 'FULL',
})

const submitError = ref('')
const isSubmitting = ref(false)

const addBin = async () => {
  try {
    submitError.value = ''
    isSubmitting.value = true

    if (!formData.value.binCode.trim()) {
      submitError.value = 'Bin Code is required'
      return
    }
    if (!formData.value.area.trim()) {
      submitError.value = 'Area is required'
      return
    }

    const lat = parseFloat(formData.value.location.lat as any)
    const lng = parseFloat(formData.value.location.lng as any)

    if (isNaN(lat) || isNaN(lng)) {
      submitError.value = 'Please enter valid numbers for latitude and longitude'
      return
    }

    // Send bin data with optional images
    const binDataToSend = {
      binCode: formData.value.binCode,
      area: formData.value.area,
      location: {
        lat: lat,
        lng: lng,
      },
      pictureBins: imageUploader.value?.uploadedImages || [],
    }

    await binStore.createBin(binDataToSend as any)

    // Reset form after successful submission
    formData.value = {
      binCode: '',
      area: '',
      location: { lat: '', lng: '' },
      fillLevel: 0,
      status: 'EMPTY',
    }
    // Reset images
    if (imageUploader.value) {
      imageUploader.value.uploadedImages = []
    }
  } catch (error) {
    submitError.value = binStore.error || 'Failed to create bin'
    console.error(binStore.error || 'Failed to create bin')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex flex-col lg:flex-row gap-12">
      <div class="flex-1 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Bin ID</label>
            <input
              v-model="formData.binCode"
              type="text"
              placeholder="Bin ID"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Area</label>
            <input
              v-model="formData.area"
              type="text"
              placeholder="Area Name"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Lat</label>
            <input
              v-model="formData.location.lat"
              type="text"
              placeholder="Latitude (e.g., 10.5)"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Lng</label>
            <input
              v-model="formData.location.lng"
              type="text"
              placeholder="Longitude (e.g., 10.5)"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Fill Level</label>
            <input
              v-model.number="formData.fillLevel"
              type="number"
              placeholder="0-100"
              min="0"
              max="100"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select
              v-model="formData.status"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            >
              <option value="EMPTY">Empty</option>
              <option value="HALF">Half</option>
              <option value="FULL">Full</option>
            </select>
          </div>
          <div class="w-full lg:w-80 flex flex-col gap-6">
            <ImageUploader ref="imageUploader" />

            <button
              @click="addBin"
              :disabled="isSubmitting"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors mt-auto shadow-sm shadow-green-200"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
