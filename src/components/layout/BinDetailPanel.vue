<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Bin } from '@/types/bin'

const props = defineProps<{
  bin: Bin | null
}>()

defineEmits(['close', 'navigate'])
const { t, locale } = useI18n()

// Helper to safely get localized strings (handling both string and object formats)
const getLocalizedWithFallback = (val: any) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  // val is LocalizedString { en: string; kh?: string }
  // Try current locale, fallback to 'en', then empty string
  return val[locale.value] || val.en || ''
}

const displayArea = computed(() => (props.bin ? getLocalizedWithFallback(props.bin.area) : ''))
const displayAddress = computed(() =>
  props.bin ? getLocalizedWithFallback(props.bin.addressBin) : '',
)

const getFullImageUrls = computed(() => {
  if (!props.bin || !props.bin.pictureBins || props.bin.pictureBins.length === 0) {
    return []
  }
  const baseUrl = import.meta.env.VITE_API_URL || ''

  return props.bin.pictureBins.map((rawUrl) => {
    // If already a full URL, return as is
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl
    }
    // Otherwise, prepend base URL
    return `${baseUrl}${rawUrl}`
  })
})

console.log(props.bin?.pictureBins)
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="bin"
      class="fixed inset-y-0 left-0 w-full max-w-sm backdrop-blur-xl shadow-2xl z-9999999 border-r border-white"
    >
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-gray-800">{{ t('ui.bin_details') }}</h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="grow overflow-y-auto pr-2">
          <div class="space-y-5">
            <!-- Card 1: Location -->
            <div class="bg-white/80 rounded-3xl p-5">
              <div class="flex items-center space-x-4 mb-4">
                <div class="p-3 bg-gray-100 rounded-xl">
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-900">{{ displayArea }}</h3>
                  <p class="text-xs text-gray-500 font-semibold uppercase">{{ bin.binCode }}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 font-medium">
                {{ t('ui.coordinates') }}: {{ bin.location.lat.toFixed(4) }},
                {{ bin.location.lng.toFixed(4) }}
              </p>
            </div>

            <!-- Card 2: Fill Level -->
            <div class="bg-white/80 rounded-3xl p-5">
              <div class="flex items-center space-x-4 mb-4">
                <div
                  :class="
                    bin.fillLevel >= 75
                      ? 'bg-red-100 text-red-600'
                      : bin.fillLevel >= 50
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                  "
                  class="p-3 rounded-xl"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-900">{{ t('ui.fill_level') }}</h3>
                  <p
                    :class="
                      bin.fillLevel >= 75
                        ? 'text-red-600'
                        : bin.fillLevel >= 50
                          ? 'text-yellow-500'
                          : 'text-green-600'
                    "
                    class="text-xs font-bold uppercase"
                  >
                    {{ bin.fillLevel >= 75 ? t('ui.urgent') : t('ui.normal') }}
                  </p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm font-bold text-gray-800">
                  <span>{{ t('ui.load') }}</span>
                  <span>{{ bin.fillLevel }}%</span>
                </div>
                <div class="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-1000"
                    :style="{
                      width: bin.fillLevel + '%',
                      backgroundColor:
                        bin.fillLevel >= 75
                          ? '#ef4444'
                          : bin.fillLevel >= 50
                            ? '#fbbf24'
                            : '#10b981',
                    }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="bg-white/80 rounded-3xl p-5">
              <h3 class="font-bold text-lg text-gray-900 mb-3">{{ t('ui.bin_address') }}</h3>
              <p class="text-sm text-gray-600 font-medium">{{ displayAddress }}</p>
            </div>

            <!-- Card 3: Bin Images (All) -->
            <div
              v-if="bin.pictureBins && bin.pictureBins.length > 0"
              class="bg-white/80 rounded-3xl p-5"
            >
              <div class="flex items-center justify-between mb-5">
                <h3 class="font-bold text-lg text-gray-900">
                  {{ t('ui.bin_location_image') }}
                </h3>
                <span
                  class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                >
                  {{ bin.pictureBins.length }}
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    />
                  </svg>
                </span>
              </div>

              <!-- Grid of Images - 2 Columns -->
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="(imageUrl, index) in getFullImageUrls"
                  :key="index"
                  class="group relative rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <!-- Image Container -->
                  <div class="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      :src="imageUrl"
                      :alt="`Bin Image ${index + 1}`"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <!-- Overlay Badge -->
                  <div
                    class="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold group-hover:bg-black/70 transition-colors"
                  >
                    {{ index + 1 }}/{{ bin.pictureBins.length }}
                  </div>

                  <!-- Bottom Label on Hover -->
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-3 py-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <p class="text-white text-xs font-medium">
                      {{ t('ui.image') }} {{ index + 1 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-200">
          <button
            @click="$emit('navigate', bin)"
            class="w-full bg-gray-900 text-white py-4 rounded-2xl text-base font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>{{ t('ui.directions') }}</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
