<template>
  <div class="bg-white min-h-screen pt-12">
    <div class="text-center mb-16 px-6">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">About Smart Bin</h1>
      <p class="text-gray-500 font-medium">Learn about our smart waste management system</p>
    </div>

    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-24">
      <div class="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-left">
        <h2 class="text-2xl font-black text-gray-900 mb-2">What is Smart Bin?</h2>
        <p class="text-[#68a357] text-xs font-bold uppercase tracking-widest mb-6">IoT-enabled waste management solution</p>
        <p class="text-gray-500 leading-relaxed text-sm">
          Smart Bins are equipped with sensors that monitor fill levels, detect odors, and track cleanliness in real-time. This technology helps optimize waste collection routes and ensures bins are emptied before they overflow.
        </p>
      </div>

      <div class="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-left">
        <h2 class="text-2xl font-black text-gray-900 mb-6">What Special about us?</h2>
        <ul class="space-y-4">
          <li v-for="(item, index) in specialties" :key="index" class="flex items-start text-sm text-gray-500 font-medium">
            <span class="mr-3 text-gray-900 font-black">{{ index + 1 }}.</span>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 pb-24 text-center">
      <h2 class="text-4xl font-black text-gray-900 mb-16">Meet Our Team</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="member in team" :key="member.id" class="group">
          <div class="bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 transition-all hover:-translate-y-2">
            <div class="mb-6 overflow-hidden rounded-[30px]">
              <img :src="member.image" alt="Team Member" class="w-full h-64 object-cover transform group-hover:scale-110 transition-duration-500" />
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-1">{{ member.name }}</h3>
            <p class="text-gray-400 text-xs font-bold mb-6">{{ member.email }}</p>
            <button class="w-full py-3 rounded-2xl border border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const specialties = [
  'Real-Time Fill Level Monitoring',
  'Odor Detection Sensors',
  'Cleanliness Tracking',
  'Automatic Alerts & Notifications',
  'GPS that show location of the bins'
];

const team = [
  { id: 1, name: 'Jason Price', email: 'kuhlman.jeremy@yahoo.com', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Jason Price', email: 'kuhlman.jeremy@yahoo.com', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Jason Price', email: 'kuhlman.jeremy@yahoo.com', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Jason Price', email: 'kuhlman.jeremy@yahoo.com', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400' },
];
</script>