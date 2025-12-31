<script setup>
import { Search, Bell } from 'lucide-vue-next';
</script>

<template>
  <header class="flex justify-between items-center mb-8 bg-transparent">
    <div class="bg-white flex items-center px-5 py-3 rounded-full shadow-sm w-full max-w-md border border-gray-100">
      <Search class="text-gray-400 w-5 h-5 mr-3" />
      <input 
        type="text" 
        placeholder="Search" 
        class="bg-transparent outline-none w-full text-sm text-gray-600 placeholder-gray-400"
      />
    </div>

    <div class="flex items-center gap-6">
      <div class="relative cursor-pointer hover:bg-white p-2 rounded-full transition-colors">
        <Bell class="text-blue-500 w-6 h-6" />
        <span class="absolute top-1 right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#F3F4F6]">5</span>
      </div>
      
      <div class="flex items-center gap-3 cursor-pointer">
        <img 
          src="https://i.pravatar.cc/150?img=5" 
          alt="Profile" 
          class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
        />
        <div class="hidden md:block">
          <p class="text-sm font-bold text-gray-700 leading-tight">Moni Roy</p>
          <p class="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </div>
  </header>
</template>