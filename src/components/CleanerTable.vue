<script setup lang="ts">
import { useCleanerStore } from '@/stores/cleanerStore'
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Cleaner } from '@/types/cleaner'
import { Edit, Trash2 } from 'lucide-vue-next'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import UpdateCleanerModal from '@/components/UpdateCleanerModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const cleanerStore = useCleanerStore()
const { cleaners } = storeToRefs(cleanerStore)

const showUpdateModal = ref(false)
const showDeleteModal = ref(false)
const showSuccessAlert = ref(false)
const selectedCleaner = ref<Cleaner | null>(null)
const cleanerToDelete = ref<Cleaner | null>(null)
const formData = ref<Partial<Cleaner>>({})
const uploadedImages = ref<string[]>([])
const currentPage = ref(1)
const itemsPerPage = 10
const isDeleting = ref(false)
const isUpdating = ref(false)
const successMessage = ref('')

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const filteredCleaners = computed(() => {
  const query = props.searchQuery.toLowerCase()

  if (!query.trim()) {
    return cleaners.value
  }

  return cleaners.value.filter((cleaner) => {
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
  console.log('Cleaners fetched:', cleaners.value)
})

watch(
  () => props.searchQuery,
  () => {
    currentPage.value = 1
  },
)

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

const handleUpdateCleaner = async (id: string, cleaner: Partial<Cleaner>) => {
  isUpdating.value = true
  try {
    await cleanerStore.updateCleaner(cleaner as Cleaner, id)
    successMessage.value = t('ui.cleaner_update_success', { name: cleaner.name })
    showSuccessAlert.value = true
    closeUpdateModal()
  } catch (error: any) {
    console.error(error.message || 'Failed to update cleaner')
  } finally {
    isUpdating.value = false
  }
}

const closeSuccessAlert = () => {
  showSuccessAlert.value = false
}

const openDeleteModal = (cleaner: Cleaner) => {
  cleanerToDelete.value = cleaner
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (cleanerToDelete.value?._id) {
    isDeleting.value = true
    try {
      await cleanerStore.deleteCleaner(cleanerToDelete.value._id)
      showDeleteModal.value = false
      cleanerToDelete.value = null
    } catch (error: any) {
      console.error(error.message || 'Failed to delete cleaner')
    } finally {
      isDeleting.value = false
    }
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  cleanerToDelete.value = null
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div v-if="!cleaners.length" class="p-8 text-center text-gray-600">{{ t('ui.no_cleaners_found') }}</div>
    <div v-else-if="!filteredCleaners.length" class="p-8 text-center text-gray-600">
      {{ t('ui.no_cleaners_found') }}
    </div>

    <!-- Table -->
    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
          <th class="px-6 py-4">{{ t('ui.cleaner_id') }}</th>
          <th class="px-6 py-4">{{ t('ui.name') }}</th>
          <th class="px-6 py-4">{{ t('ui.telegram_id') }}</th>
          <th class="px-6 py-4">{{ t('ui.area') }}</th>
          <th class="px-6 py-4 text-center">{{ t('ui.accept_count') }}</th>
          <th class="px-6 py-4 text-center">{{ t('ui.reject_count') }}</th>
          <th class="px-6 py-4 text-center">{{ t('ui.options') }}</th>
        </tr>
      </thead>

      <tbody class="text-sm text-gray-700">
        <tr
          class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
          v-for="cleaner in paginatedCleaners"
          :key="cleaner._id"
        >
          <td class="px-6 py-4">{{ cleaner._id }}</td>
          <td class="px-6 py-4">{{ cleaner.name }}</td>
          <td class="px-6 py-4">{{ cleaner.telegramChatId }}</td>
          <td class="px-6 py-4">{{ cleaner.area }}</td>
          <td class="px-6 py-4 text-center">{{ cleaner.acceptCount }}</td>
          <td class="px-6 py-4 text-center">{{ cleaner.rejectCount }}</td>
          <td class="px-6 py-4 text-center">
            <button @click="openUpdateModal(cleaner)">
              <Edit class="inline-block w-5 h-5 mr-1 text-blsue-600" />
            </button>
            <button @click="openDeleteModal(cleaner)">
              <Trash2 class="inline-block w-5 h-5 text-red-600" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div
      v-if="filteredCleaners.length > 0"
      class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50"
    >
      <div class="text-sm text-gray-600">
        {{ t('ui.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ t('ui.to') }}
        {{ Math.min(currentPage * itemsPerPage, filteredCleaners.length) }} {{ t('ui.of') }}
        {{ filteredCleaners.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ t('ui.previous') }}
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
          {{ t('ui.next') }}
        </button>
      </div>
    </div>

    <!-- Update Modal -->
    <UpdateCleanerModal
      :visible="showUpdateModal"
      :cleaner="selectedCleaner"
      @close="closeUpdateModal"
      @update="handleUpdateCleaner"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :visible="showDeleteModal"
      :title="t('ui.delete_cleaner')"
      :message="t('ui.cleaner_delete_confirmation', { name: cleanerToDelete?.name })"
      :confirm-text="t('ui.delete')"
      :cancel-text="t('ui.cancel')"
      :is-loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :visible="showSuccessAlert"
      :title="t('ui.cleaner_updated_title')"
      :message="successMessage"
      :action-text="t('ui.close')"
      @close="closeSuccessAlert"
    />
  </div>
</template>
