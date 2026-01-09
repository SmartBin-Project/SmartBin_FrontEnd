<script setup lang="ts">
import { useCleanerStore } from '@/stores/cleanerStore'
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Cleaner } from '@/types/cleaner'
import { Edit, Trash, Trash2 } from 'lucide-vue-next'

const cleanerStore = useCleanerStore()
const { cleaners } = storeToRefs(cleanerStore)

const showUpdateModal = ref(false)
const selectedCleaner = ref<Cleaner | null>(null)
const formData = ref<Partial<Cleaner>>({})
const uploadedImages = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = 10

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const filteredCleaners = computed(() => {
  const query = props.searchQuery.toLowerCase()
  
  if (!query.trim()) {
    return cleaners.value
  }
  
  return cleaners.value.filter(cleaner => {
    return (
      cleaner.name.toLowerCase().includes(query) ||
      cleaner.telegramChatId.toLowerCase().includes(query) ||
      cleaner.area.toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => Math.ceil(filteredCleaners.value.length / itemsPerPage))

const paginatedCleaners = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCleaners.value.slice(start, end)
})

onMounted(() => {
  cleanerStore.fetchCleaners()
})

watch(() => props.searchQuery, () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const openUpdateModal = (cleaner: Cleaner) => {
  selectedCleaner.value = cleaner
  formData.value = { ...cleaner }
  uploadedImages.value = cleaner.pictureCleaner || []
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  selectedCleaner.value = null
  formData.value = {}
  uploadedImages.value = []
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          uploadedImages.value.push(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const submitUpdate = async () => {
  if (selectedCleaner.value?._id) {
    try {
      const updateData = {
        name: formData.value.name,
        telegramChatId: formData.value.telegramChatId,
        area: formData.value.area,
        pictureCleaner: uploadedImages.value,
      }
      await cleanerStore.updateCleaner(updateData as Cleaner, selectedCleaner.value._id)
      closeUpdateModal()
    } catch (error: any) {
      console.error(error.message || 'Failed to update cleaner')
    }
  }
}

const deleteCleaner = async (cleaner: Cleaner) => {
  if (confirm(`Are you sure you want to delete ${cleaner.name}?`)) {
    try {
      if (cleaner._id) {
        await cleanerStore.deleteCleaner(cleaner._id)
      }
    } catch (error: any) {
      console.error(error.message || 'Failed to delete cleaner')
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Empty State -->
    <div v-if="!cleaners.length" class="p-8 text-center text-gray-600">
      No cleaners found
    </div>

    <!-- No Search Results -->
    <div v-else-if="!filteredCleaners.length" class="p-8 text-center text-gray-600">
      No cleaners match your search
    </div>

    <!-- Table -->
    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Telegram ID</th>
          <th class="px-6 py-4">Area</th>
          <th class="px-6 py-4 text-center">Options</th>
        </tr>
      </thead>

      <tbody class="text-sm text-gray-700">
        <tr
          class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
          v-for="cleaner in paginatedCleaners"
          :key="cleaner._id"
        >
          <td class="px-6 py-4">{{ cleaner.name }}</td>
          <td class="px-6 py-4">{{ cleaner.telegramChatId }}</td>
          <td class="px-6 py-4">{{ cleaner.area }}</td>
          <td class="px-6 py-4 text-center">
            <button @click="openUpdateModal(cleaner)">
              <Edit class="inline-block w-5 h-5 mr-1" />
            </button>
            <button @click="deleteCleaner(cleaner)">
              <Trash2 class="inline-block w-5 h-5 text-red-600" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="filteredCleaners.length > 0" class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredCleaners.length) }} of {{ filteredCleaners.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors',
              page === currentPage
                ? 'bg-green-600 text-white font-bold'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Update Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Cleaner</h2>
        <form @submit.prevent="submitUpdate">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label for="telegramChatId" class="block text-sm font-medium text-gray-700"
              >Telegram Chat ID</label
            >
            <input
              type="text"
              id="telegramChatId"
              v-model="formData.telegramChatId"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-6">
            <label for="area" class="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              id="area"
              v-model="formData.area"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Image Upload Section -->
          <div class="mb-6">
            <label for="images" class="block text-sm font-medium text-gray-700 mb-2"
              >Pictures</label
            >
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors"
            >
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
              <label for="images" class="cursor-pointer">
                <p class="text-sm text-gray-600">Click to upload images</p>
              </label>
            </div>

            <!-- Uploaded Images Preview -->
            <div v-if="uploadedImages.length > 0" class="mt-4 grid grid-cols-3 gap-2">
              <div v-for="(image, index) in uploadedImages" :key="index" class="relative group">
                <img
                  :src="image"
                  :alt="`Image ${index + 1}`"
                  class="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  @click="removeImage(index)"
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                >
                  <span class="text-white text-lg font-bold">×</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Update
            </button>
            <button
              type="button"
              @click="closeUpdateModal"
              class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
