<script setup lang="ts">
import { ref } from 'vue'
import type { CreateAdminData } from '@/types/admin'
import ImageUploader from './ImageUploader.vue'

const formData = ref<CreateAdminData>({
  username: '',
  email: '',
  password: '',
  area: '',
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  dateOfBirth: '',
  address: '',
})

const imageUploader = ref<{ uploadedImages: string[] }>()

const emit = defineEmits<{
  submit: [data: CreateAdminData]
}>()

const handleSubmit = () => {
  emit('submit', formData.value)
  resetForm()
}

const resetForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: '',
    area: '',
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    dateOfBirth: '',
    address: '',
  }
  if (imageUploader.value) {
    imageUploader.value.uploadedImages = []
  }
}

const getFormData = () => {
  return formData.value
}

defineExpose({ handleSubmit, getFormData, resetForm })
</script>

<template>
  <div class="space-y-6">
    <!-- Required Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Username -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Username</label>
        <input
          v-model="formData.username"
          type="text"
          placeholder="Enter username"
          class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          required
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
        <input
          v-model="formData.email"
          type="email"
          placeholder="Enter email"
          class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          required
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Password</label>
        <input
          v-model="formData.password"
          type="password"
          placeholder="Enter password"
          class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          required
        />
      </div>

      <!-- Area -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Area </label>
        <input
          v-model="formData.area"
          type="text"
          placeholder="Enter area"
          class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          required
        />
      </div>
    </div>

    <!-- Optional Personal Information -->
    <div class="border-t border-gray-200 pt-6">
      <h3 class="text-lg font-bold text-gray-700 mb-4">Personal Information (Optional)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
          <input
            v-model="formData.firstName"
            type="text"
            placeholder="Enter first name"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
          <input
            v-model="formData.lastName"
            type="text"
            placeholder="Enter last name"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <!-- Gender -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Gender</label>
          <select
            v-model="formData.gender"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Phone</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="Enter phone number"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <!-- Date of Birth -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
          <input
            v-model="formData.dateOfBirth"
            type="date"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>

        <!-- Address -->
        <div class="md:col-span-2 lg:col-span-1">
          <label class="block text-sm font-bold text-gray-700 mb-2">Address</label>
          <input
            v-model="formData.address"
            type="text"
            placeholder="Enter address"
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors"
          />
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label class="block text-sm font-bold text-gray-700 mb-2">Profile Picture</label>
          <ImageUploader ref="imageUploader" />
        </div>
      </div>
    </div>
  </div>
</template>
