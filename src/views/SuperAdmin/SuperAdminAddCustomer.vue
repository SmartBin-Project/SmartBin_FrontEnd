<script setup>
import CustomerFormInputs from '@/components/CustomerFormInputs.vue';
import ImageUploader from '@/components/ImageUploader.vue';
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Adding Customer</h2>

    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="flex flex-col lg:flex-row gap-12">
        
        <div class="flex-1">
          <CustomerFormInputs />
        </div>

        <div class="w-full lg:w-80 flex flex-col gap-6">
          <ImageUploader />
          
          <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors mt-auto shadow-sm shadow-green-200">
            Save Change
          </button>
        </div>

      </div>
    </div>
  </div>
</template>