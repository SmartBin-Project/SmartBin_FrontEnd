<script setup>
import { ref } from 'vue';

const formData = ref({
  binId: '',
  assigned: '',
  branch: 'AEON1', // Default value from image
  address: 'Street 57, Sangkat Boeung Keng Kang I, Khan Boeung Keng Kang, Phnom Penh'
});
</script>

<template>
  <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Bin ID</label>
          <input 
            v-model="formData.binId"
            type="text" 
            placeholder="Frist Name" 
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" 
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Assigned</label>
          <input 
            v-model="formData.assigned"
            type="text" 
            placeholder="Last Name" 
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" 
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Branch</label>
          <input 
            v-model="formData.branch"
            type="text" 
            placeholder="Branch Name" 
            class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-500 focus:bg-white transition-colors" 
          />
        </div>

      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Address</label>
        <input 
          v-model="formData.address"
          type="text" 
          placeholder="Enter Address" 
          class="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-green-500 focus:bg-white transition-colors" 
        />
      </div>

      <div class="flex justify-end mt-8">
        <button class="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-3 rounded-xl transition-colors shadow-sm shadow-green-200">
          Save Change
        </button>
      </div>

    </div>
  </div>
</template>