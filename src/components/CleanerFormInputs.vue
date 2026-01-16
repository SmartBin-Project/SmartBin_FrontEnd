<script setup lang="ts">
import { useCleanerStore } from '@/stores/cleanerStore'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Cleaner } from '@/types/cleaner'

const { t } = useI18n()
const cleanerStore = useCleanerStore()

onMounted(() => {
  cleanerStore.fetchCleaners()
})

const formData = ref({
  name: '',
  telegramChatId: '',
  area: '',
  pictureCleaner: [] as string[],
})

const emit = defineEmits<{
  submit: [cleaner: Cleaner]
}>()

const handleSubmit = () => {
  emit('submit', formData.value as Cleaner)
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    telegramChatId: '',
    area: '',
    pictureCleaner: [],
  }
}

const setImages = (images: string[]) => {
  formData.value.pictureCleaner = images
}

const getFormData = () => {
  return formData.value
}

defineExpose({ setImages, handleSubmit, getFormData })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.name') }}</label>
      <input
        v-model="formData.name"
        type="text"
        :placeholder="t('ui.name')"
        class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.telegram_id') }}</label>
      <input
        v-model="formData.telegramChatId"
        type="text"
        :placeholder="t('ui.telegram_id')"
        class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
      />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('ui.area') }}</label>
      <input
        v-model="formData.area"
        type="text"
        :placeholder="t('ui.area')"
        class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
      />
    </div>
  </div>
</template>
