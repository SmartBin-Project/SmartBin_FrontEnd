<template>
  <nav
    class="sticky top-0 z-2001 bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 md:px-8 py-4 transition-all duration-300"
  >
    <div class="max-w-screen-2xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-6 lg:space-x-12">
        <router-link
          to="/"
          class="flex items-center w-[130px] md:w-40 shrink-0 transition-all hover:opacity-80 active:scale-95"
        >
          <img :src="Logo" alt="logo" class="w-full drop-shadow-sm" />
        </router-link>

        <div class="hidden md:flex items-center space-x-2 font-semibold text-gray-500">
          <router-link
            to="/"
            active-class="text-[#68a357] bg-[#68a357]/5"
            class="px-5 py-2 rounded-xl transition-all hover:bg-gray-100/50"
            >{{ t('ui.nav_map') }}</router-link
          >
          <router-link
            to="/service"
            active-class="text-[#68a357] bg-[#68a357]/5"
            class="px-5 py-2 rounded-xl transition-all hover:bg-gray-100/50"
            >{{ t('ui.nav_service') }}</router-link
          >
          <router-link
            to="/aboutus"
            active-class="text-[#68a357] bg-[#68a357]/5"
            class="px-5 py-2 rounded-xl transition-all hover:bg-gray-100/50"
            >{{ t('ui.nav_about') }}</router-link
          >
        </div>
      </div>

      <div class="flex items-center flex-1 justify-end space-x-6 ml-4">
        <div class="relative w-full max-w-[280px] lg:max-w-sm hidden sm:block group">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              class="w-5 h-5 transition-colors duration-300"
              :class="searchQuery ? 'text-[#68a357]' : 'text-gray-400'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
          </span>

          <input
            ref="searchInput"
            v-model="searchQuery"
            @input="$emit('search', searchQuery)"
            type="text"
            :placeholder="t('ui.search_placeholder')"
            class="w-full py-3 pl-12 pr-12 bg-gray-100/50 border border-transparent rounded-2xl text-sm font-medium transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#68a357]/15 focus:border-[#68a357] placeholder:text-gray-400 shadow-sm"
          />

          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              v-if="searchQuery"
              @click="handleClear"
              class="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <kbd
              v-else
              class="hidden lg:inline-flex px-2 py-1 border border-gray-200 rounded text-[10px] font-black text-gray-400 bg-white"
              >⌘ K</kbd
            >
          </div>
        </div>

        <language-switcher/>
        
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
        >
          <div class="relative w-5 h-5 flex flex-col justify-center items-center">
            <span
              :class="[
                'absolute block h-0.5 w-5 bg-current transform transition duration-300',
                isMenuOpen ? 'rotate-45' : '-translate-y-1.5',
              ]"
            ></span>
            <span
              :class="[
                'absolute block h-0.5 w-4 bg-current transition duration-300 right-0',
                isMenuOpen ? 'opacity-0' : 'opacity-100',
              ]"
            ></span>
            <span
              :class="[
                'absolute block h-0.5 w-5 bg-current transform transition duration-300',
                isMenuOpen ? '-rotate-45' : 'translate-y-1.5',
              ]"
            ></span>
          </div>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'; // Import i18n
import Logo from '@/assets/images/logo.png'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'

const { t } = useI18n(); // Initialize hook
const isMenuOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const emit = defineEmits(['search'])

const handleClear = () => {
  searchQuery.value = ''
  emit('search', '')
  searchInput.value?.focus()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown))
</script>