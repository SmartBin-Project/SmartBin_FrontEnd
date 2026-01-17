<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check, Globe } from 'lucide-vue-next' // Using Lucide icons for consistency

const { locale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Define available languages
const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'kh', label: 'Khmer', flag: '🇰🇭' },
]

// Get current active language object
const currentLang = computed(
  () => languages.find((lang) => lang.code === locale.value) || languages[0],
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLang = (code: string) => {
  locale.value = code
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div v-if="currentLang" class="relative inline-block text-left" ref="dropdownRef">
    <button
      type="button"
      @click="toggleDropdown"
      class="inline-flex items-center justify-between w-32 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
    >
      <span class="flex items-center gap-2">
        <span class="text-base">{{ currentLang.flag }}</span>
        <span>{{ currentLang.label }}</span>
      </span>
      <ChevronDown
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-2 w-32 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="switchLang(lang.code)"
            class="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            :class="[
              currentLang.code === lang.code
                ? 'text-green-600 bg-green-50 font-medium'
                : 'text-gray-700',
            ]"
          >
            <span class="flex items-center gap-2">
              <span class="text-base">{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </span>

            <Check v-if="currentLang.code === lang.code" class="w-4 h-4 text-green-600" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
