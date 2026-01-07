<script setup lang="ts">
import { Plus, X } from 'lucide-vue-next'
import { ref } from 'vue'

const uploadedImages = ref<string[]>([])

const emit = defineEmits<{
  imagesSelected: [images: string[]]
}>()

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        uploadedImages.value.push(imageData)
        emit('imagesSelected', uploadedImages.value)
      }
      reader.readAsDataURL(file)
    })
  }
  // Reset input
  target.value = ''
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
  emit('imagesSelected', uploadedImages.value)
}

const clearAllImages = () => {
  uploadedImages.value = []
  emit('imagesSelected', [])
}

defineExpose({ uploadedImages })
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Image Grid -->
    <div v-if="uploadedImages.length > 0" class="w-full">
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div v-for="(image, index) in uploadedImages" :key="index" class="relative group">
          <div
            class="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <img :src="image" :alt="`Preview ${index + 1}`" class="w-full h-24 object-cover" />
          </div>
          <button
            @click="removeImage(index)"
            class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <X :size="14" />
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label class="w-full cursor-pointer group">
          <input type="file" class="hidden" accept="image/*" multiple @change="handleFileChange" />
          <div
            class="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 bg-white hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition-all"
          >
            <div class="flex items-center gap-2">
              <Plus :size="16" class="text-purple-600 group-hover:text-purple-600" />
              <span class="text-xs font-medium">Add More Images</span>
            </div>
          </div>
        </label>

        <button
          @click="clearAllImages"
          class="w-full py-2.5 border border-red-200 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all text-xs font-medium"
        >
          Clear All
        </button>
      </div>
    </div>

    <!-- Initial Upload -->
    <div v-else class="w-full">
      <label class="w-full cursor-pointer group">
        <input type="file" class="hidden" accept="image/*" multiple @change="handleFileChange" />
        <div
          class="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-600 transition-all"
        >
          <div
            class="bg-purple-100 p-2 rounded-full mb-2 group-hover:bg-purple-200 transition-colors"
          >
            <Plus :size="20" class="text-purple-600" />
          </div>
          <span class="text-sm font-medium">Add Images</span>
          <span class="text-xs mt-1">Click to upload multiple images</span>
        </div>
      </label>
    </div>
  </div>
</template>
