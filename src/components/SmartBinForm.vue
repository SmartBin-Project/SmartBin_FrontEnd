<script setup lang="ts">
import { ref } from 'vue'
import { useBinStore } from '@/stores/binStore'

const binStore = useBinStore()

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

// Toast notification
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const showToast = ref(false)

const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const addBin = async () => {
  try {
    submitError.value = ''
    isSubmitting.value = true

    if (!formData.value.binCode.trim()) {
      submitError.value = 'Bin Code is required'
      showToastNotification('Bin Code is required', 'error')
      return
    }
    if (!formData.value.area.trim()) {
      submitError.value = 'Area is required'
      showToastNotification('Area is required', 'error')
      return
    }

    const lat = parseFloat(formData.value.location.lat as any)
    const lng = parseFloat(formData.value.location.lng as any)

    if (isNaN(lat) || isNaN(lng)) {
      submitError.value = 'Please enter valid numbers for latitude and longitude'
      showToastNotification('Please enter valid numbers for latitude and longitude', 'error')
      return
    }

    // Only send required fields: binCode, area, location
    const binDataToSend = {
      binCode: formData.value.binCode,
      area: formData.value.area,
      location: {
        lat: lat,
        lng: lng,
      },
    }

    await binStore.createBin(binDataToSend as any)

    showToastNotification(`Bin ${formData.value.binCode} created successfully!`, 'success')

    // Reset form after successful submission
    formData.value = {
      binCode: '',
      area: '',
      location: { lat: '', lng: '' },
      fillLevel: 0,
      status: 'EMPTY',
    }
  } catch (error) {
    submitError.value = binStore.error || 'Failed to create bin'
    showToastNotification(binStore.error || 'Failed to create bin', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- Toast Notification -->
    <transition name="slide">
      <div
        v-if="showToast"
        :class="[
          'fixed top-4 right-4 px-6 py-4 rounded-lg text-white font-semibold shadow-lg z-50',
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500',
        ]"
      >
        {{ toastMessage }}
      </div>
    </transition>

    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="space-y-6">
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
            <label class="block text-sm font-bold text-gray-700 mb-2">Lng</label>
            <input
              v-model="formData.location.lng"
              type="text"
              placeholder="Longitude (e.g., 10.5)"
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
        </div>

        <div class="flex justify-end mt-8">
          <button
            @click="addBin"
            :disabled="isSubmitting"
            class="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-3 rounded-xl transition-colors shadow-sm shadow-green-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}
</style>
