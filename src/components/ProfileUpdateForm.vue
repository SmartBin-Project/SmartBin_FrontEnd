<script setup>
import { Edit2, Calendar } from 'lucide-vue-next';
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
    
    <div class="flex justify-between items-start mb-8">
      <div>
        <h3 class="font-bold text-lg text-gray-800 mb-4">Profile Update</h3>
        <div class="flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?img=12" alt="Thumb" class="w-14 h-14 rounded-full object-cover" />
          <button class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Upload New</button>
          <button class="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Delete</button>
        </div>
      </div>
      <button class="flex items-center gap-2 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">
        <Edit2 :size="14" /> Edit
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
        <input type="text" value="Wade" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
        <input type="text" value="Warren" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Gender</label>
        <select class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 appearance-none">
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Phone Number</label>
        <div class="relative">
          <input type="text" value="+855 12 345 6789" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
          <div class="absolute right-3 top-3.5 flex items-center">
             <span class="text-lg">🇰🇭</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-1">
        <label class="block text-sm font-medium text-gray-600 mb-1.5">E-mail</label>
        <input type="email" value="students@gmail.com" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Date of Birth</label>
        <div class="relative">
          <input type="text" value="12- January- 1999" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
          <Calendar :size="18" class="absolute right-4 top-3.5 text-gray-400" />
        </div>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
        <input type="text" value="Street 57, Sangkat Boeung Keng Kang I, Khan Boeung Keng Kang, Phnom Penh" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500" />
      </div>

    </div>
  </div>
</template>