<script setup>
import { Copy } from 'lucide-vue-next';
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center mb-6">
    <h3 class="text-left font-bold text-lg mb-4 text-gray-800">Profile</h3>
    
    <div class="relative inline-block mb-3">
      <img 
        src="https://i.pravatar.cc/150?img=12" 
        alt="Wade Warren" 
        class="w-24 h-24 rounded-full object-cover mx-auto"
      />
    </div>

    <h2 class="text-xl font-bold text-gray-800">Wade Warren</h2>
    
    <div class="flex items-center justify-center gap-2 mt-1 text-gray-500 text-sm">
      <span>students@gmail.com</span>
      <button class="text-blue-500 hover:text-blue-600">
        <Copy :size="14" />
      </button>
    </div>

    <button class="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors">
      Change Password
    </button>
  </div>
</template>