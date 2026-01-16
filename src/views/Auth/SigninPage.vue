<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const passwordFieldType = ref('password')
const emailError = ref(false)
const passwordError = ref(false)

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const validateForm = (): boolean => {
  emailError.value = !email.value.includes('@') || email.value.trim() === ''
  passwordError.value = password.value.length < 6 || password.value.length > 20

  return !emailError.value && !passwordError.value
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await authStore.login(email.value, password.value)

    if (rememberMe.value) {
      localStorage.setItem('rememberEmail', email.value)
    } else {
      localStorage.removeItem('rememberEmail')
    }

    // Redirect based on user role
    const user = authStore.user
    if (user?.role === 'SUPERADMIN') {
      await router.push('/superadmin')
    } else if (user?.role === 'ADMIN') {
      await router.push('/admin/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Load remembered email on mount
if (localStorage.getItem('rememberEmail')) {
  email.value = localStorage.getItem('rememberEmail') || ''
  rememberMe.value = true
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="relative w-full max-w-md p-10 bg-white rounded-xl shadow-lg font-sans border-2 border-gray-400"
    >
      <h1 class="text-xl font-normal mb-1">{{ t('ui.auth_welcome') }}</h1>
      <h2 class="text-3xl font-bold mb-1">{{ t('ui.auth_signin_title') }}</h2>
      <p class="text-sm text-gray-500 mb-8">{{ t('ui.auth_signin_subtitle') }}</p>
      <div class="absolute top-10 right-5">
        <LanguageSwitcher/>
      </div>
      <form @submit.prevent="handleSubmit">
        <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ authStore.error }}
        </div>

        <div class="mb-6">
          <label for="email" class="block text-base font-normal mb-2">{{ t('ui.auth_email_label') }}</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('ui.auth_email_placeholder')"
            class="w-full px-4 py-3 border rounded-lg outline-none transition duration-150"
            :class="
              emailError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-black'
            "
          />
          <p v-if="emailError" class="text-red-500 text-sm mt-2">
            {{ t('ui.auth_email_error') }}
          </p>
        </div>

        <div class="mb-4">
          <label for="password" class="block text-base font-normal mb-2">{{ t('ui.auth_password_label') }}</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="passwordFieldType"
              :placeholder="t('ui.auth_password_placeholder')"
              class="w-full px-4 py-3 border rounded-lg pr-12 outline-none transition duration-150"
              :class="
                passwordError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black'
              "
            />
            <span
              @click="togglePasswordVisibility"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <template v-if="passwordFieldType === 'password'">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path
                    d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"
                  />
                </template>
                <template v-else>
                  <path
                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A6.517 6.517 0 0 1 8 3.5c2.11 0 4.166.904 5.451 2.35 1.158 1.399 1.755 2.981 1.794 3.287a.5.5 0 0 1-.276.643l-.095.072-1.111-1.112z"
                  />
                  <path
                    d="M2.31 2.31a.5.5 0 0 1 .707 0l11.25 11.25a.5.5 0 0 1-.707.707L2.31 2.31z"
                  />
                  <path
                    d="M.293 8.707A.5.5 0 0 1 0 8c0-.623.633-1.405 1.5-2.204C2.79 4.208 4.79 3.5 6.47 3.5c1.455 0 2.89.404 4.113 1.077l-.95.95A4.322 4.322 0 0 0 8 4.5c-1.573 0-3.007.82-4.148 1.963C2.562 7.028 1.764 7.933 1.5 8.298c.13.09.28.16.44.202l-.54.54a.5.5 0 0 1-.707 0"
                  />
                </template>
              </svg>
            </span>
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-2">
            {{ t('ui.auth_password_error') }}
          </p>
        </div>

        <div class="flex justify-between items-center mb-6 text-sm">
          <label class="flex items-center text-gray-700">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-2"
            />
            {{ t('ui.auth_remember_me') }}
          </label>
          <RouterLink to="/forgot" class="text-[#68A947] font-semibold"
            >{{ t('ui.auth_forgot_password') }}</RouterLink
          >
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 bg-[#68A947] hover:bg-[#58973b] disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-md transition duration-150 mb-8"
        >
          {{ authStore.loading ? t('ui.auth_logging_in') : t('ui.auth_login_btn') }}
        </button>
      </form>

      <div class="text-center text-sm">
        {{ t('ui.auth_no_account') }}
        <RouterLink to="/signup" class="text-[#68A947] font-semibold hover:text-[#58973b]"
          >{{ t('ui.auth_register') }}</RouterLink
        >
      </div>
    </div>
  </div>
</template>
