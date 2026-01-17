<script setup lang="ts">
import { Eye, EyeOff, HelpCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const authStore = useAuthStore()

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-lg text-gray-800">{{ t('ui.change_password') }}</h3>
      <a href="#" class="text-blue-500 text-xs flex items-center hover:underline">
        {{ t('ui.need_help') }} <HelpCircle :size="12" class="ml-1" />
      </a>
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

    <div class="space-y-4">
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-700">
          {{ t('ui.security_note') }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('ui.current_password') }}</label>
        <div class="relative">
          <input
            :type="showCurrent ? 'text' : 'password'"
            v-model="currentPassword"
            :placeholder="t('ui.enter_current_password')"
            :disabled="loading"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors disabled:opacity-50"
          />
          <button
            @click="showCurrent = !showCurrent"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <component :is="showCurrent ? Eye : EyeOff" :size="18" />
          </button>
        </div>
        <a href="/forgot" class="text-blue-500 text-xs mt-1 inline-block hover:underline"
          >{{ t('ui.forgot_password_link') }}</a
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('ui.new_password') }}</label>
        <div class="relative">
          <input
            :type="showNew ? 'text' : 'password'"
            v-model="newPassword"
            :placeholder="t('ui.enter_new_password')"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <button
            @click="showNew = !showNew"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <component :is="showNew ? Eye : EyeOff" :size="18" />
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('ui.confirm_new_password') }}</label>
        <div class="relative">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="confirmPassword"
            :placeholder="t('ui.re_enter_new_password')"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <button
            @click="showConfirm = !showConfirm"
            class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <component :is="showConfirm ? Eye : EyeOff" :size="18" />
          </button>
        </div>
      </div>

      <button
        :disabled="loading || !currentPassword || !newPassword || !confirmPassword"
        class="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? t('ui.saving') : t('ui.save_changes') }}
      </button>
    </div>
  </div>
</template>
