<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="relative w-full max-w-md p-8 bg-white rounded-xl shadow-lg font-sans border-2 border-gray-400"
    >
      <div v-if="!emailSent">
        <h1 class="text-xl font-normal mb-1 text-gray-800">{{ t('ui.auth_dont_worry') }}</h1>
        <h2 class="text-3xl font-bold mb-1 text-gray-900">{{ t('ui.auth_forgot_password') }}</h2>
        <p class="text-sm text-gray-500 mb-8">{{ t('ui.auth_forgot_subtitle') }}</p>
      <div class="absolute top-10 right-5">
        <LanguageSwitcher/>
      </div>
        <form @submit.prevent="handleSubmit">
          <div class="mb-8">
            <label for="email" class="block text-base font-medium text-gray-700 mb-2"
              >{{ t('ui.auth_email_addr_label') }}</label
            >
            <input
              id="email"
              type="text"
              v-model="email"
              :placeholder="t('ui.auth_registered_email_placeholder')"
              class="w-full px-4 py-3 rounded-lg outline-none border transition duration-150"
              :class="
                emailError
                  ? 'border-red-500 text-red-900 focus:border-red-500'
                  : 'border-gray-300 focus:border-black'
              "
            />
            <p v-if="emailError" class="text-red-500 text-sm mt-2">
              {{ t('ui.auth_email_invalid_error') }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#5F9E43] hover:bg-[#4e8536] text-white text-lg font-semibold rounded-lg shadow-sm transition duration-150 mb-10"
          >
            {{ t('ui.auth_send_reset_link') }}
          </button>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6"
        >
          <svg
            class="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-gray-900">{{ t('ui.auth_check_mail') }}</h2>
        <p class="text-sm text-gray-500 mb-8">
          {{ t('ui.auth_recovery_sent') }}
        </p>
        <button @click="" class="text-sm text-gray-500 underline hover:text-gray-800 mb-8">
          {{ t('ui.auth_try_another_email') }}
        </button>
      </div>

      <div class="text-center text-gray-500 text-sm">
        {{ t('ui.auth_remember_password') }}
        <a href="Signin" class="text-[#5F9E43] font-bold hover:text-[#4e8536]">{{ t('ui.auth_login_btn') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue';

const { t } = useI18n();
const authStore = useAuthStore()
const email = ref('')
const emailSent = ref(false)
const password = ref('')
const emailError = ref(false)
const passwordError = ref(false)

const handleSubmit = async () => {
  emailError.value = !email.value.includes('@')
  passwordError.value = password.value.length < 6 || password.value.length > 20
  await authStore.login(email.value, password.value)
}
</script>
