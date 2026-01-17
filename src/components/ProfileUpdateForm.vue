<script setup lang="ts">
import { Edit2, Calendar, Save, X, Upload } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import * as authService from '@/services/authService'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()

const isEditing = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')
const uploadedImage = ref<string>('')
const fileInput = ref<HTMLInputElement>()

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
    uploadedImage.value = ''
  }
}

const saveProfile = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const updateData: any = {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      gender: formData.value.gender,
      phone: formData.value.phone,
      dateOfBirth: formData.value.dateOfBirth,
      address: formData.value.address,
    }

    // Handle profile picture upload
    if (uploadedImage.value) {
      updateData.profilePic = uploadedImage.value
    } else if (formData.value.profilePic) {
      // Keep existing profile picture if not uploading new one
      updateData.profilePic = formData.value.profilePic
    }

    const response = await authService.updateUserProfile(updateData)

    const updatedUserData = response.user || response.admin || response

    success.value = t('ui.profile_updated_success')

    if (authStore.user) {
      authStore.user.firstName = updatedUserData.firstName || formData.value.firstName
      authStore.user.lastName = updatedUserData.lastName || formData.value.lastName
      authStore.user.gender = updatedUserData.gender || formData.value.gender
      authStore.user.phone = updatedUserData.phone || formData.value.phone
      authStore.user.dateOfBirth = updatedUserData.dateOfBirth || formData.value.dateOfBirth
      authStore.user.address = updatedUserData.address || formData.value.address
      authStore.user.profilePic =
        updatedUserData.profilePic || updateData.profilePic || formData.value.profilePic || ''

      localStorage.setItem('user', JSON.stringify(authStore.user))
      formData.value.profilePic = authStore.user.profilePic || ''
    }

    isEditing.value = false
    uploadedImage.value = ''

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err: any) {
    console.error('Save profile error:', err)
    error.value = err.response?.data?.message || err.message || t('ui.update_profile_failed')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
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
        <h3 class="font-bold text-lg text-gray-800 mb-4">{{ t('ui.personal_info') }}</h3>
        <div class="flex items-center gap-4">
          <div
            v-if="formData.profilePic || uploadedImage"
            class="w-18 h-18 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0"
          >
            <img
              :src="uploadedImage || formData.profilePic"
              alt="Profile"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-18 h-18 rounded-full border-2 border-white shadow-sm bg-green-500 flex items-center justify-center text-white font-bold text-lg shrink-0"
          >
            {{ (authStore.user?.username?.[0] || 'U').toUpperCase() }}
          </div>
          <div v-if="isEditing" class="flex flex-col gap-2">
            <button
              type="button"
              @click="fileInput?.click()"
              class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Upload :size="16" /> {{ t('ui.upload_photo') }}
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="flex items-center gap-2 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
        >
          <Edit2 :size="14" /> {{ t('ui.edit_profile') }}
        </button>
        <template v-else>
          <button
            @click="saveProfile"
            :disabled="loading"
            class="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            <Save :size="14" /> {{ loading ? t('ui.saving') : t('ui.save_changes') }}
          </button>
          <button
            @click="toggleEdit"
            class="flex items-center gap-2 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
          >
            <X :size="14" /> {{ t('ui.cancel_edit') }}
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{
          t('ui.first_name')
        }}</label>
        <input
          v-if="isEditing"
          v-model="formData.firstName"
          type="text"
          :placeholder="t('ui.first_name')"
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{
          t('ui.last_name')
        }}</label>
        <input
          v-if="isEditing"
          v-model="formData.lastName"
          type="text"
          :placeholder="t('ui.last_name')"
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ t('ui.gender') }}</label>
        <select
          v-if="isEditing"
          v-model="formData.gender"
          class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 appearance-none"
        >
          <option value="">{{ t('ui.gender') }}</option>
          <option value="Male">{{ t('ui.male') }}</option>
          <option value="Female">{{ t('ui.female') }}</option>
          <option value="Other">{{ t('ui.other') }}</option>
        </select>
        <div
          v-else
          class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800"
        >
          {{ getDisplayValue(formData.gender) }}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ t('ui.phone') }}</label>
        <div class="relative">
          <input
            v-if="isEditing"
            v-model="formData.phone"
            type="text"
            :placeholder="t('ui.phone')"
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ t('ui.email') }}</label>
        <input
          v-if="isEditing"
          v-model="formData.email"
          type="email"
          :placeholder="t('ui.email')"
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ t('ui.dob') }}</label>
        <div class="relative">
          <input
            v-if="isEditing"
            v-model="formData.dateOfBirth"
            type="date"
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
        <label class="block text-sm font-medium text-gray-600 mb-1.5">{{ t('ui.address') }}</label>
        <input
          v-if="isEditing"
          v-model="formData.address"
          type="text"
          :placeholder="t('ui.address')"
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
