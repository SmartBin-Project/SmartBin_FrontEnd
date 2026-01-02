<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const passwordFieldType = ref('password')
const confirmPasswordFieldType = ref('password')
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  area: '',
})

const passwordMismatch = ref(false)

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordFieldType.value =
    confirmPasswordFieldType.value === 'password' ? 'text' : 'password'
}

const validateForm = (): boolean => {
  passwordMismatch.value = form.value.password !== form.value.confirmPassword

  if (passwordMismatch.value) {
    return false
  }

  if (form.value.password.length < 8) {
    authStore.error = 'Password must be at least 8 characters'
    return false
  }

  if (!form.value.role) {
    authStore.error = 'Please select an account type'
    return false
  }

  if (form.value.role === 'ADMIN' && !form.value.area) {
    authStore.error = 'Area is required for Admin accounts'
    return false
  }

  return true
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  try {
    authStore.clearError()
    await authStore.register(
      form.value.username,
      form.value.email,
      form.value.password,
      form.value.role,
      form.value.area || undefined,
    )

    // Redirect to signin page after successful registration
    await router.push('/signin')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div
      class="w-full max-w-md p-6 bg-white rounded-xl shadow-lg font-sans border-2 border-gray-400"
    >
      <h1 class="text-lg font-normal">Get Started!</h1>
      <h2 class="text-2xl font-bold mb-1">Create Account</h2>
      <p class="text-sm text-gray-500 mb-5">Join the Smart Bin community</p>

      <form @submit.prevent="handleRegister">
        <!-- Error Message -->
        <div v-if="authStore.error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ authStore.error }}
        </div>

        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="block text-sm font-normal mb-1">Username</label>
          <input
            id="username"
            type="text"
            v-model="form.username"
            placeholder="Choose a user name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition duration-150 text-sm"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="block text-sm font-normal mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            v-model="form.email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition duration-150 text-sm"
            required
          />
        </div>

        <!-- Role Selection -->
        <div class="mb-3">
          <label for="role" class="block text-sm font-normal mb-1">Account Type</label>
          <select
            id="role"
            v-model="form.role"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition duration-150 text-sm"
            required
          >
            <option value="">Select a role</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPERADMIN">Super Admin</option>
          </select>
        </div>

        <!-- Area (conditional for ADMIN) -->
        <div v-if="form.role === 'ADMIN'" class="mb-3">
          <label for="area" class="block text-sm font-normal mb-1">Area</label>
          <input
            id="area"
            type="text"
            v-model="form.area"
            placeholder="Enter your area"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition duration-150 text-sm"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="block text-sm font-normal mb-1">Password</label>
          <div class="relative">
            <input
              id="password"
              :type="passwordFieldType"
              v-model="form.password"
              placeholder="Create a Password (min 8 characters)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12 outline-none focus:border-black transition duration-150 text-sm"
              required
            />
            <span
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
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
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label for="confirmPassword" class="block text-sm font-normal mb-1"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              :type="confirmPasswordFieldType"
              v-model="form.confirmPassword"
              placeholder="Confirm your Password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12 outline-none focus:border-black transition duration-150 text-sm"
              :class="{ 'border-red-500 focus:border-red-500': passwordMismatch }"
              required
            />
            <span
              @click="toggleConfirmPasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <template v-if="confirmPasswordFieldType === 'password'">
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
            <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">Passwords do not match</p>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-2 bg-[#68A947] hover:bg-[#58973b] disabled:bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-md transition duration-150 mb-4"
        >
          {{ authStore.loading ? 'Signing up...' : 'Sign Up' }}
        </button>
      </form>

      <div class="text-center text-sm">
        Already have an Account ?
        <RouterLink to="/signin" class="text-[#68A947] font-semibold hover:text-[#58973b]"
          >Login</RouterLink
        >
      </div>
    </div>
  </div>
</template>
