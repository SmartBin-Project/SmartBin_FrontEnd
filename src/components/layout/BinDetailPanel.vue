<template>
  <transition name="slide-fade">
    <div
      v-if="bin"
      class="fixed inset-y-0 left-0 w-full max-w-sm backdrop-blur-xl shadow-2xl z-2000 border-r border-white"
    >
      <div class="p-6 flex flex-col h-full">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-black text-gray-800">Bin Details</h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-grow overflow-y-auto pr-2">
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
                  <h3 class="font-bold text-lg text-gray-900">{{ bin.area }}</h3>
                  <p class="text-xs text-gray-500 font-semibold uppercase">{{ bin.binCode }}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 font-medium">
                Coordinates: {{ bin.location.lat.toFixed(4) }},
                {{ bin.location.lng.toFixed(4) }}
              </p>
            </div>

            <!-- Card 2: Fill Level -->
            <div class="bg-white/80 rounded-3xl p-5">
              <div class="flex items-center space-x-4 mb-4">
                <div
                  :class="
                    bin.fillLevel > 80
                      ? 'bg-red-100 text-red-600'
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
                  <h3 class="font-bold text-lg text-gray-900">Fill Level</h3>
                  <p
                    :class="bin.fillLevel > 80 ? 'text-red-500' : 'text-green-600'"
                    class="text-xs font-bold uppercase"
                  >
                    {{ bin.fillLevel > 80 ? 'Urgent' : 'Normal' }}
                  </p>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-sm font-bold text-gray-800">
                  <span>Load</span>
                  <span>{{ bin.fillLevel }}%</span>
                </div>
                <div class="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-1000"
                    :style="{
                      width: bin.fillLevel + '%',
                      backgroundColor: bin.fillLevel > 80 ? '#ef4444' : '#10b981'
                    }"
                  ></div>
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
            <span>Directions</span>
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

<script setup lang="ts">
import type { Bin } from '@/types/bin'

defineProps<{
  bin: Bin | null
}>()

defineEmits(['close', 'navigate'])
</script>

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
