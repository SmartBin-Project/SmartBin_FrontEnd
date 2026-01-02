<script setup>
import BinCard from '@/components/BinCard.vue';

// Mock Data matching your image
const bins = [
  { 
    id: 1, 
    name: 'Phnom Penh - Head Office', 
    address: '#128, Street 271, Sangkat Boeng Tumpun 1, Khan Meanchey', 
    fillLevel: 10, 
    statusColor: 'green' 
  },
  { 
    id: 2, 
    name: 'Phnom Penh - Branch 1', 
    address: '#128, Street 271, Sangkat Boeng Tumpun 1, Khan Meanchey', 
    fillLevel: 55, 
    statusColor: 'yellow' 
  },
  { 
    id: 3, 
    name: 'Phnom Penh - Branch 2', 
    address: '#128, Street 271, Sangkat Boeng Tumpun 1, Khan Meanchey', 
    fillLevel: 55, 
    statusColor: 'yellow' 
  }
];
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">SmartBin View</h2>

    <div class="w-full h-[500px] bg-blue-50 border-2 border-blue-200 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
      
      <div class="text-center z-10">
        <p class="text-blue-500 font-bold text-lg">Map Component Space</p>
        <p class="text-blue-400 text-sm">Waiting for code...</p>
      </div>
    </div>
    <h3 class="text-xl font-bold text-gray-800 mb-4">SmartBin List:</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BinCard 
        v-for="bin in bins" 
        :key="bin.id"
        :name="bin.name"
        :address="bin.address"
        :fillLevel="bin.fillLevel"
        :statusColor="bin.statusColor"
      />
    </div>

  </div>
</template>