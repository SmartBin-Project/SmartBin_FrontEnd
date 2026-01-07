<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import CleanerFormInputs from '@/components/CleanerFormInputs.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import { useCleanerStore } from '@/stores/cleanerStore'
import { ref } from 'vue'

const cleanerStore = useCleanerStore()
const formRef = ref<InstanceType<typeof CleanerFormInputs>>()
const imageUploaderRef = ref<InstanceType<typeof ImageUploader>>()
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true

  try {
    if (!formRef.value) {
      console.error('Form reference not found')
      isLoading.value = false
      return
    }

    const formData = formRef.value.getFormData()

    // Validate required fields
    if (!formData.name?.trim() || !formData.telegramChatId?.trim() || !formData.area?.trim()) {
      console.warn('Please fill all required fields')
      isLoading.value = false
      return
    }

    // Create cleaner with form data and images (images are optional)
    const cleanerData = {
      name: formData.name,
      telegramChatId: formData.telegramChatId,
      area: formData.area,
      pictureCleaner: imageUploaderRef.value?.uploadedImages.values || [],
    }

    await cleanerStore.createCleaner(cleanerData as any)

    // Reset form
    formRef.value.getFormData().name = ''
    formRef.value.getFormData().telegramChatId = ''
    formRef.value.getFormData().area = ''
    if (imageUploaderRef.value) {
      imageUploaderRef.value.uploadedImages = []
    }
  } catch (error: any) {
    console.error(error.message || 'Failed to create cleaner')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <SuperAdminLayout title="Add Cleaner">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="flex flex-col gap-12">
        <div class="flex-1">
          <CleanerFormInputs ref="formRef" />
        </div>

        <div class="w-full lg:w-80 flex flex-col gap-6">
          <ImageUploader ref="imageUploaderRef" />

          <button
            @click="handleSubmit"
            :disabled="isLoading"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors mt-auto shadow-sm shadow-green-200"
          >
            {{ isLoading ? 'Saving...' : 'Save Change' }}
          </button>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
</template>
