<script setup>
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue';

const previewUrl = ref('https://i.pravatar.cc/300?img=5'); // Default mock image

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    
    <div class="w-full aspect-[4/3] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-4 flex items-center justify-center">
      <img 
        v-if="previewUrl" 
        :src="previewUrl" 
        alt="Customer Preview" 
        class="w-full h-full object-cover"
      />
      <span v-else class="text-gray-400 text-sm">No image selected</span>
    </div>

    <label class="w-full cursor-pointer group">
      <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
      <div class="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 bg-white hover:bg-gray-50 hover:border-green-500 hover:text-green-600 transition-all">
        <div class="bg-purple-100 p-1 rounded-full mb-2 group-hover:bg-green-100">
           <Plus :size="20" class="text-purple-600 group-hover:text-green-600" />
        </div>
        <span class="text-sm font-medium">Add Image</span>
      </div>
    </label>

  </div>
</template>