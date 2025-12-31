<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps({
  currentPage: Number,
  totalPages: Number
});

defineEmits(['change-page']);
</script>

<template>
  <div class="flex items-center justify-between mt-6 px-2">
    
    <button 
      class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      <ChevronLeft :size="16" class="mr-2" />
      Previous
    </button>

    <div class="flex items-center space-x-2">
      <button class="w-8 h-8 flex items-center justify-center text-sm font-bold bg-purple-100 text-purple-600 rounded-lg">1</button>
      <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 rounded-lg">2</button>
      <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 rounded-lg">3</button>
      <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 rounded-lg">4</button>
      <span class="text-gray-400 px-1">...</span>
      <button class="w-8 h-8 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-100 rounded-lg">24</button>
    </div>

    <button 
      class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next
      <ChevronRight :size="16" class="ml-2" />
    </button>

  </div>
</template>