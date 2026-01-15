<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Bin } from '@/types/bin'
import ImageUploader from './ImageUploader.vue'
import { useI18n } from 'vue-i18n'; // 1. Import i18n

const { t } = useI18n(); // 2. Init hook
const props = defineProps<{
  bin: Bin | null
  visible: boolean
}>()

const emit = defineEmits(['close', 'update'])
const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null)

// 3. Create a specific form state (don't reuse Partial<Bin> directly to avoid type conflicts)
const formState = ref({
  binCode: '',
  area: '',        // String for input
  fillLevel: 0,
  location: { lat: 0, lng: 0 },
  addressBin: '',  // String for input
  status: ''
})

watch(
  () => props.bin,
  (newBin) => {
    if (newBin) {
      // 4. DATA EXTRACTION: Extract 'en' string from the object
      let areaStr = '';
      if (typeof newBin.area === 'object' && newBin.area !== null) {
        areaStr = newBin.area.en || ''; 
      } else if (typeof newBin.area === 'string') {
        areaStr = newBin.area;
      }

      let addressStr = '';
      if (typeof newBin.addressBin === 'object' && newBin.addressBin !== null) {
        addressStr = newBin.addressBin.en || '';
      } else if (typeof newBin.addressBin === 'string') {
        addressStr = newBin.addressBin;
      }

      // Populate form
      formState.value = {
        binCode: newBin.binCode,
        area: areaStr, 
        fillLevel: newBin.fillLevel,
        location: { ...newBin.location },
        addressBin: addressStr,
        status: newBin.status
      }

      if (imageUploader.value) {
        imageUploader.value.uploadedImages = newBin.pictureBins || []
      }
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('close')
}

const submitUpdate = () => {
  if (props.bin) {
    // 5. DATA PREPARATION: Wrap strings back into objects
    const updateData = {
      binCode: formState.value.binCode,
      location: formState.value.location,
      fillLevel: formState.value.fillLevel,
      status: formState.value.status,
      pictureBins: imageUploader.value?.uploadedImages || [],
      
      // CRITICAL: Send as Object { en: ... } so backend auto-translates
      area: { en: formState.value.area },
      addressBin: { en: formState.value.addressBin }
    }
    
    emit('update', props.bin._id, updateData)
  }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Bin</h2>
      <form @submit.prevent="submitUpdate">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.bin_id') }}</label>
          <input
            type="text"
            v-model="formState.binCode"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.area') }}</label>
          <input
            type="text"
            v-model="formState.area"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.fill_level') }}</label>
          <input
            type="number"
            v-model="formState.fillLevel"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-4" v-if="formState.location">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.latitude') }}</label>
          <input
            type="number"
            step="any"
            v-model="formState.location.lat"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <div class="mb-6" v-if="formState.location">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.longitude') }}</label>
          <input
            type="number"
            step="any"
            v-model="formState.location.lng"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="mb-6" v-if="formState.location">
          <label class="block text-sm font-medium text-gray-700">{{ t('ui.address') }}</label>
          <input
            type="text"
            v-model="formState.addressBin"
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
            {{ t('ui.cancel') }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {{ t('ui.save_changes') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>