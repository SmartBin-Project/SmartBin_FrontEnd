<script setup>
import { Calendar } from 'lucide-vue-next';
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
      <input type="text" placeholder="Frist Name" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
      <input type="text" placeholder="Last Name" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Branch</label>
      <input type="text" placeholder="AEON1" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
      <input type="email" placeholder="aeon1@gmail.com" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Starting Date</label>
      <div class="relative">
        <input type="text" placeholder="12- January- 2026" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
        <Calendar :size="18" class="absolute right-4 top-3.5 text-gray-400" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Expired Date</label>
      <div class="relative">
        <input type="text" placeholder="12- January- 2027" class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" />
        <Calendar :size="18" class="absolute right-4 top-3.5 text-gray-400" />
      </div>
    </div>

    <div class="md:col-span-2">
      <label class="block text-sm font-bold text-gray-700 mb-2">Product Summary</label>
      <div class="bg-gray-50 border border-gray-100 rounded-lg p-4">
        <p class="text-xs font-bold text-gray-500 uppercase mb-1">PRODUCT</p>
        <p class="text-xs text-gray-600 leading-relaxed">
          "Qui a de la platine" (literally, he "who has platinum") is a French expression used to describe a brilliant and eloquent man. As such, PLATINUM ÉGOÏSTE is a fresh, aromatic and distinctly modern scent for the extrovert who makes himself known.
        </p>
      </div>
    </div>

  </div>
</template>