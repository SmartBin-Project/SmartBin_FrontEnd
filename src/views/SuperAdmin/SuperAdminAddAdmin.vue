<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import AdminFormInputs from '@/components/AdminFormInputs.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'

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
      errorMessage.value = 'Username is required'
      isLoading.value = false
      return
    }

    if (!formData.email?.trim()) {
      errorMessage.value = 'Email is required'
      isLoading.value = false
      return
    }

    if (!formData.password?.trim()) {
      errorMessage.value = 'Password is required (minimum 6 characters)'
      isLoading.value = false
      return
    }

    if (formData.password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters'
      isLoading.value = false
      return
    }

    if (!formData.area?.trim()) {
      errorMessage.value = 'Area is required'
      isLoading.value = false
      return
    }

    // Create admin
    await adminStore.createAdmin(formData)
    successMessage.value = 'Admin created successfully!'
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
  <SuperAdminLayout title="Add Admin">
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
            {{ isLoading ? 'Saving...' : 'Create Admin' }}
          </button>
        </div>
      </div>

      <!-- Success Alert -->
      <SuccessAlert
        :visible="showSuccess"
        :message="successMessage"
        actionText="Done"
        @close="showSuccess = false"
      />
    </div>
  </SuperAdminLayout>
</template>
