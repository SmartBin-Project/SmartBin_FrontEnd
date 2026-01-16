<template>
  <section class="py-20 bg-[#f8fafc]">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{{ t('ui.pricing_title') }}</h2>
      </div>

      <div class="flex flex-col md:flex-row justify-center items-stretch gap-8 lg:gap-12">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="flex-1 max-w-sm bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 flex flex-col text-center transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden"
        >
          <div
            class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]"
          ></div>

          <div class="relative z-10 mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ plan.name }}</h3>
            <p class="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">
              {{ t('ui.pricing_monthly_charge') }}
            </p>
            <div class="text-[#68a357] text-5xl font-black">${{ plan.price }}</div>
          </div>

          <hr class="border-gray-100 mb-8" />

          <ul class="relative z-10 space-y-6 mb-10 flex-grow">
            <li
              v-for="(feature, fIndex) in plan.features"
              :key="fIndex"
              :class="feature.included ? 'text-gray-700 font-bold' : 'text-gray-300 line-through'"
              class="text-sm tracking-wide"
            >
              {{ feature.text }}
            </li>
          </ul>

          <button
            class="relative z-10 w-full py-4 rounded-full border-2 border-[#68a357] text-[#68a357] font-black text-sm uppercase tracking-widest transition-all duration-300 hover:bg-[#68a357] hover:text-white active:scale-95"
          >
            {{ t('ui.pricing_purchase') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const plans = computed(() => [
  {
    name: t('ui.pricing_plan_monthly'),
    price: '14.99',
    features: [
      { text: t('ui.pricing_feat_setup'), included: true },
      { text: t('ui.pricing_feat_monitoring'), included: true },
      { text: t('ui.pricing_feat_alerts'), included: true },
      { text: t('ui.pricing_feat_analytics'), included: true },
      { text: t('ui.pricing_feat_manage'), included: true },
      { text: t('ui.pricing_feat_replacement'), included: false },
      { text: t('ui.pricing_feat_months_free'), included: false },
    ],
  },
  {
    name: t('ui.pricing_plan_yearly'),
    price: '49.99',
    features: [
      { text: t('ui.pricing_feat_setup'), included: true },
      { text: t('ui.pricing_feat_monitoring'), included: true },
      { text: t('ui.pricing_feat_alerts'), included: true },
      { text: t('ui.pricing_feat_analytics'), included: true },
      { text: t('ui.pricing_feat_manage'), included: true },
      { text: t('ui.pricing_feat_replacement'), included: true },
      { text: t('ui.pricing_feat_months_free'), included: true },
    ],
  },
])
</script>
