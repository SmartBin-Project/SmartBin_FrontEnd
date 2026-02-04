<template>
  <div class="service-page-container">
    <section class="relative w-full py-16 md:py-24 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          <div class="flex-1 text-left space-y-8 animate-fade-in-left">
            <h2
              class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight"
            >
              {{ t('ui.service_hero_1') }} <br />
              {{ t('ui.service_hero_2') }} <br />
              <span class="text-[#68a357]">{{ t('ui.service_hero_highlight') }}</span>
            </h2>

            <p class="text-gray-500 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              {{ t('ui.service_desc') }}
            </p>

            <div class="pt-4">
              <button
                class="bg-[#68a357] hover:bg-[#568a48] text-white px-10 py-4 rounded-2xl text-xl font-black shadow-[0_20px_40px_-10px_rgba(104,163,87,0.4)] transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <a href="https://t.me/Bonjourhorhor" target="_blank" rel="noopener noreferrer">
                  {{ t('ui.service_booking') }}
                </a>
              </button>
            </div>
          </div>

          <div class="flex-1 relative animate-fade-in-right">
            <div
              class="absolute -top-10 -right-10 w-64 h-64 bg-[#e9f2e6] rounded-full filter blur-3xl opacity-60"
            ></div>
            <div
              class="absolute -bottom-10 -left-10 w-48 h-48 bg-[#68a357]/10 rounded-full filter blur-3xl opacity-60"
            ></div>

            <div class="relative z-10 flex justify-center">
              <div class="relative w-full max-w-125">
                <img
                  src="@/assets/images/image.png"
                  alt="Smart Bin Technology Illustration"
                  class="w-full h-auto drop-shadow-2xl object-contain"
                />

                <div
                  class="absolute top-1/4 -left-4 w-4 h-4 bg-[#68a357] rounded-full animate-bounce"
                ></div>
                <div class="absolute bottom-1/4 -right-4 w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <PricingSection />
  </div>
</template>

<script setup lang="ts">
import PricingSection from '@/components/layout/PricingSection.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Define props to receive the searchText passed from App.vue
defineProps<{
  searchText: string
}>()
</script>

<style scoped>
/* Custom Animations remain the same */
@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-left {
  animation: fade-in-left 0.8s ease-out forwards;
}
.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

h2 {
  letter-spacing: -0.02em;
}
</style>
