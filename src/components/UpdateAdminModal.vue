<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Admin, UpdateAdminData } from '@/types/admin'
import ImageUploader from './ImageUploader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  showModal: boolean
  admin: Admin | null
}>()

const emit = defineEmits<{
  close: []
  update: [data: UpdateAdminData, callback: () => void]
}>()

const formData = ref<UpdateAdminData>({})
const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null)
const isSubmitting = ref(false)

watch(
  () => props.admin,
  (newAdmin) => {
    if (newAdmin) {
      formData.value = {
        username: newAdmin.username,
        email: newAdmin.email,
        area: newAdmin.area,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        gender: newAdmin.gender,
        phone: newAdmin.phone,
        dateOfBirth: newAdmin.dateOfBirth,
        address: newAdmin.address,
      }
    }
    if (imageUploader.value) {
      imageUploader.value.uploadedImages = newAdmin?.profilePic || []
    }
  },
  { immediate: true },
)

const submitUpdate = async () => {
  isSubmitting.value = true
  try {
    const data = { ...formData.value }
    if (!data.password || !data.password.trim()) {
      delete data.password
    }
    // Include images from the uploader only if there are images
    if (imageUploader.value && imageUploader.value.uploadedImages.length > 0) {
      data.profilePic = imageUploader.value.uploadedImages
    } else {
      // Make profilePic optional - don't send it if empty
      delete data.profilePic
    }
    // Emit with a callback that will be called when update is complete
    emit('update', data, () => {
      closeModal()
    })
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  formData.value = {}
  emit('close')
}
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">{{ t('ui.update_admin') }}</h2>
      <form @submit.prevent="submitUpdate">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">{{ t('ui.username') }}</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">{{ t('ui.email') }}</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Area -->
          <div>
            <label for="area" class="block text-sm font-medium text-gray-700">{{ t('ui.area') }}</label>
            <input
              type="text"
              id="area"
              v-model="formData.area"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Password (optional) -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"
              >{{ t('ui.password_optional') }}</label
            >
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :placeholder="t('ui.enter_new_password')"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700"
              >{{ t('ui.first_name') }}</label
            >
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">{{ t('ui.last_name') }}</label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">{{ t('ui.gender') }}</label>
            <select
              id="gender"
              v-model="formData.gender"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">{{ t('ui.gender') }}</option>
              <option value="Male">{{ t('ui.male') }}</option>
              <option value="Female">{{ t('ui.female') }}</option>
              <option value="Other">{{ t('ui.other') }}</option>
            </select>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">{{ t('ui.phone') }}</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700"
              >{{ t('ui.dob') }}</label
            >
            <input
              type="date"
              id="dateOfBirth"
              v-model="formData.dateOfBirth"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Address -->
          <div class="md:col-span-2">
            <label for="address" class="block text-sm font-medium text-gray-700">{{ t('ui.address') }}</label>
            <input
              type="text"
              id="address"
              v-model="formData.address"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div class="mt-5">
          <ImageUploader ref="imageUploader" />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="closeModal"
            :disabled="isSubmitting"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('ui.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? t('ui.saving') : t('ui.update_admin') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
