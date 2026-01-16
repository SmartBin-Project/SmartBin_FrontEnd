<script setup lang="ts">
import { ref } from 'vue'
import { useBinStore } from '@/stores/binStore'
import { useI18n } from 'vue-i18n'; // Import
import ImageUploader from '@/components/ImageUploader.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'

const { t } = useI18n();
const binStore = useBinStore()
const imageUploader = ref<{ uploadedImages: string[] }>()

const formData = ref({
  binCode: '',
  area: '', 
  location: { lat: '', lng: '' },
  fillLevel: 0,
  status: 'EMPTY' as 'EMPTY' | 'HALF' | 'FULL',
  addressBin: '',
})

const submitError = ref('')
const isSubmitting = ref(false)
const showSuccessAlert = ref(false)
const successMessage = ref('')

const addBin = async () => {
  try {
    submitError.value = ''
    isSubmitting.value = true

    if (!formData.value.binCode.trim()) {
      submitError.value = 'Bin Code is required' // You can translate errors too if needed
      return
    }
    
    // ... (Lat/Lng checks remain same) ...
    const lat = parseFloat(formData.value.location.lat as any)
    const lng = parseFloat(formData.value.location.lng as any)

    // === CRITICAL FIX ===
    // Backend expects 'area' and 'addressBin' to be objects { en: string }
    const binDataToSend = {
      binCode: formData.value.binCode,
      location: { lat: lat, lng: lng },
      fillLevel: formData.value.fillLevel,
      status: formData.value.status,
      pictureBins: imageUploader.value?.uploadedImages || [],
      
      // Wrap strings in objects
      area: { en: formData.value.area }, 
      addressBin: { en: formData.value.addressBin }
    }
    // ====================

    console.log('Sending Bin Data:', binDataToSend) // Debug log
    await binStore.createBin(binDataToSend as any)

    successMessage.value = t('ui.success_created')
    showSuccessAlert.value = true

    formData.value = {
      binCode: '',
      area: '',
      location: { lat: '', lng: '' },
      fillLevel: 0,
      status: 'EMPTY',
      addressBin: '',
    }
    if (imageUploader.value) imageUploader.value.uploadedImages = []
  } catch (error) {
    submitError.value = binStore.error || 'Failed to create bin'
    console.error(binStore.error || 'Failed to create bin')
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessAlert = () => {
  showSuccessAlert.value = false
}
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex flex-col lg:flex-row gap-12">
      <div class="flex-1 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.bin_id') }}</label>
            <input
              v-model="formData.binCode"
              type="text"
              :placeholder="t('ui.bin_id')"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.area') }}</label>
            <input
              v-model="formData.area"
              type="text"
              :placeholder="t('ui.area')"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.latitude') }}</label>
            <input
              v-model="formData.location.lat"
              type="text"
              placeholder="e.g., 10.5"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.longitude') }}</label>
            <input
              v-model="formData.location.lng"
              type="text"
              placeholder="e.g., 10.5"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.fill_level') }}</label>
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
            <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.status') }}</label>
            <select
              v-model="formData.status"
              class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
            >
              <option value="EMPTY">{{ t('ui.empty') }}</option>
              <option value="HALF">{{ t('ui.half') }}</option>
              <option value="FULL">{{ t('ui.full') }}</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.address') }}</label>
          <input
            v-model="formData.addressBin"
            type="text"
            :placeholder="t('ui.address')"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>
        <div class="w-full lg:w-80 flex flex-col gap-6">
          <ImageUploader ref="imageUploader" />

          <button
            @click="addBin"
            :disabled="isSubmitting"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors mt-auto shadow-sm shadow-green-200"
          >
            {{ isSubmitting ? t('ui.saving') : t('ui.save_changes') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="submitError" class="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ submitError }}
    </div>

    <SuccessAlert
      :visible="showSuccessAlert"
      title="Success"
      :message="successMessage"
      action-text="Close"
      @close="closeSuccessAlert"
    />
  </div>
</template>