<template>
  <section class="py-20 bg-[#f8fafc]">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
          Our Service
        </h2>
      </div>

      <div class="flex flex-col md:flex-row justify-center items-stretch gap-8 lg:gap-12">
        
        <div 
          v-for="(plan, index) in plans" 
          :key="index"
          class="flex-1 max-w-sm bg-white rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 flex flex-col text-center transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden"
        >
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]"></div>

          <div class="relative z-10 mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-1">{{ plan.name }}</h3>
            <p class="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Monthly Charge</p>
            <div class="text-[#68a357] text-5xl font-black">
              ${{ plan.price }}
            </div>
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

          <button class="relative z-10 w-full py-4 rounded-full border-2 border-[#68a357] text-[#68a357] font-black text-sm uppercase tracking-widest transition-all duration-300 hover:bg-[#68a357] hover:text-white active:scale-95">
            Purchase Now
          </button>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const plans = ref([
  {
    name: 'Monthly',
    price: '14.99',
    features: [
      { text: 'Free Setup', included: true },
      { text: 'Real-time monitoring', included: true },
      { text: 'Alerts & notifications', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Manage up to 20 bins', included: true },
      { text: 'Free replacement on faulty sensors', included: false },
      { text: '2 months free', included: false },
    ]
  },
  {
    name: 'Yearly',
    price: '49.99',
    features: [
      { text: 'Free Setup', included: true },
      { text: 'Real-time monitoring', included: true },
      { text: 'Alerts & notifications', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Manage up to 20 bins', included: true },
      { text: 'Free replacement on faulty sensors', included: true },
      { text: '2 months free', included: true },
    ]
  }
]);
</script>