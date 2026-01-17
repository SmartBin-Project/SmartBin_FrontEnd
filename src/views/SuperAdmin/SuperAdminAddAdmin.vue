<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import AdminFormInputs from '@/components/AdminFormInputs.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const adminStore = useAdminStore()
const formRef = ref<InstanceType<typeof AdminFormInputs>>()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showSuccess = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (!formRef.value) {
      errorMessage.value = 'Form reference not found'
      isLoading.value = false
      return
    }

    const formData = formRef.value.getFormData()

    // Validate required fields
    if (!formData.username?.trim()) {
      errorMessage.value = t('ui.admin_required_username')
      isLoading.value = false
      return
    }

    if (!formData.email?.trim()) {
      errorMessage.value = t('ui.admin_required_email')
      isLoading.value = false
      return
    }

    if (!formData.password?.trim()) {
      errorMessage.value = t('ui.admin_required_password')
      isLoading.value = false
      return
    }

    if (formData.password.length < 6) {
      errorMessage.value = t('ui.admin_password_min_length')
      isLoading.value = false
      return
    }

    if (!formData.area?.trim()) {
      errorMessage.value = t('ui.admin_required_area')
      isLoading.value = false
      return
    }

    // Create admin
    await adminStore.createAdmin(formData)
    successMessage.value = t('ui.admin_create_success')
    showSuccess.value = true

    // Reset form
    if (formRef.value) {
      formRef.value.resetForm()
    }

    // SuccessAlert will be closed by user action
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || error.message || 'Failed to create admin'
    console.error('Error creating admin:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <SuperAdminLayout :title="t('ui.create_admin')">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {{ errorMessage }}
      </div>

      <div class="flex flex-col gap-8">
        <!-- Form -->
        <div class="flex-1">
          <AdminFormInputs ref="formRef" />
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-4">
          <button
            @click="handleSubmit"
            :disabled="isLoading"
            class="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors shadow-sm shadow-green-200"
          >
            {{ isLoading ? t('ui.saving') : t('ui.create_admin') }}
          </button>
        </div>
      </div>

      <!-- Success Alert -->
      <SuccessAlert
        :visible="showSuccess"
        :message="successMessage"
        :actionText="t('ui.done')"
        @close="showSuccess = false"
      />
    </div>
  </SuperAdminLayout>
</template>
