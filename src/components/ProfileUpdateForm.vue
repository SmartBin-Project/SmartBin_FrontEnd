<script setup lang="ts">
import { Edit2, Calendar, Save, X } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import * as authService from '@/services/authService'

const authStore = useAuthStore()

const isEditing = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const formData = ref({
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  address: '',
  profilePic: '',
})

onMounted(() => {
  loadProfile()
})

const loadProfile = async () => {
  try {
    // Try to load from backend first
    const profileData = await authService.getUserProfile()

    formData.value = {
      firstName: profileData.firstName || profileData.username?.split(' ')[0] || '',
      lastName: profileData.lastName || profileData.username?.split(' ')[1] || '',
      gender: profileData.gender || '',
      phone: profileData.phone || '',
      email: profileData.email || '',
      dateOfBirth: profileData.dateOfBirth || '',
      address: profileData.address || profileData.area || '',
      profilePic: profileData.profilePic || '',
    }

    // Update auth store with the full profile data
    if (authStore.user) {
      authStore.user.firstName = profileData.firstName
      authStore.user.lastName = profileData.lastName
      authStore.user.gender = profileData.gender
      authStore.user.phone = profileData.phone
      authStore.user.dateOfBirth = profileData.dateOfBirth
      authStore.user.address = profileData.address
      authStore.user.profilePic = profileData.profilePic
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    // Fallback to auth store if backend fails
    if (authStore.user) {
      formData.value = {
        firstName: authStore.user.firstName || authStore.user.username?.split(' ')[0] || '',
        lastName: authStore.user.lastName || authStore.user.username?.split(' ')[1] || '',
        gender: authStore.user.gender || '',
        phone: authStore.user.phone || '',
        email: authStore.user.email || '',
        dateOfBirth: authStore.user.dateOfBirth || '',
        address: authStore.user.address || authStore.user.area || '',
        profilePic: authStore.user.profilePic || '',
      }
    }
  }
}

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    // Reset form if canceling
    error.value = ''
    success.value = ''
  }
}

const saveProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Prepare only the profile fields (not email which shouldn't be editable)
    const updateData = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      gender: formData.value.gender,
      phone: formData.value.phone,
      dateOfBirth: formData.value.dateOfBirth,
      address: formData.value.address,
      profilePic: formData.value.profilePic,
    }

    // Call API to update profile
    const response = await authService.updateUserProfile(updateData)

    // Get the updated user data from response
    const updatedUserData = response.user || response.admin || response

    success.value = 'Profile updated successfully!'

    // Update auth store with new data
    if (authStore.user) {
      authStore.user.firstName = updatedUserData.firstName || formData.value.firstName
      authStore.user.lastName = updatedUserData.lastName || formData.value.lastName
      authStore.user.gender = updatedUserData.gender || formData.value.gender
      authStore.user.phone = updatedUserData.phone || formData.value.phone
      authStore.user.dateOfBirth = updatedUserData.dateOfBirth || formData.value.dateOfBirth
      authStore.user.address = updatedUserData.address || formData.value.address
      authStore.user.profilePic = updatedUserData.profilePic || formData.value.profilePic

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }

    isEditing.value = false

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Save profile error:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

const getDisplayValue = (value: string | null | undefined) => {
  return value && value.trim() ? value : 'N/A'
}
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
    <div class="flex justify-between items-start mb-8">
      <div>
        <h3 class="font-bold text-lg text-gray-800 mb-4">Profile Update</h3>
        <div class="flex items-center gap-4">
          <div
            v-if="formData.profilePic"
            class="w-18 h-18 rounded-full border-2 border-white shadow-sm overflow-hidden"
          >
            <img :src="formData.profilePic" alt="Profile" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-18 h-18 rounded-full border-2 border-white shadow-sm bg-green-500 flex items-center justify-center text-white font-bold text-lg"
          >
            {{ (authStore.user?.username?.[0] || 'U').toUpperCase() }}
          </div>
          <button
            v-if="isEditing"
            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
          >
            Upload New
          </button>
          <button
            v-if="isEditing"
            class="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="flex items-center gap-2 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
        >
          <Edit2 :size="14" /> Edit
        </button>
        <template v-else>
          <button
            @click="saveProfile"
            :disabled="loading"
            class="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            <Save :size="14" /> {{ loading ? 'Saving...' : 'Save' }}
          </button>
          <button
            @click="toggleEdit"
            class="flex items-center gap-2 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
          >
            <X :size="14" /> Cancel
          </button>
        </template>
      </div>
    </div>

    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
    >
      {{ error }}
    </div>

    <div
      v-if="success"
      class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
    >
      {{ success }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
        <input
          v-if="isEditing"
          v-model="formData.firstName"
          type="text"
          placeholder="Enter first name"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
        />
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.firstName) }}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
        <input
          v-if="isEditing"
          v-model="formData.lastName"
          type="text"
          placeholder="Enter last name"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
        />
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.lastName) }}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
        <select
          v-if="isEditing"
          v-model="formData.gender"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 appearance-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.gender) }}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
        <div class="relative">
          <input
            v-if="isEditing"
            v-model="formData.phone"
            type="text"
            placeholder="Enter phone number"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
          />
          <div
            v-else
            class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
          >
            {{ getDisplayValue(formData.phone) }}
          </div>
        </div>
      </div>

      <div class="md:col-span-1">
        <label class="block text-sm font-medium text-gray-600 mb-1.5">E-mail</label>
        <input
          v-if="isEditing"
          v-model="formData.email"
          type="email"
          placeholder="Enter email"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
        />
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.email) }}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Date of Birth</label>
        <div class="relative">
          <input
            v-if="isEditing"
            v-model="formData.dateOfBirth"
            type="date"
            placeholder="Select date"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
          />
          <div
            v-else
            class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 flex items-center"
          >
            {{ getDisplayValue(formData.dateOfBirth) }}
            <Calendar :size="18" class="ml-auto text-gray-400" />
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
        <input
          v-if="isEditing"
          v-model="formData.address"
          type="text"
          placeholder="Enter address"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500"
        />
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.address) }}
        </div>
      </div>
    </div>
  </div>
</template>
