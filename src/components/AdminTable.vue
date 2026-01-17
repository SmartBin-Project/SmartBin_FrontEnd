<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Admin, UpdateAdminData } from '@/types/admin'
import { Edit, Trash2 } from 'lucide-vue-next'
import { useAdminStore } from '@/stores/adminStore'
import UpdateAdminModal from './UpdateAdminModal.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Helper function to auto-close success alert
const autoCloseAlert = (duration = 3000) => {
  setTimeout(() => {
    showSuccess.value = false
  }, duration)
}

const adminStore = useAdminStore()
const { admins, error, isLoading } = storeToRefs(adminStore)

const showUpdateModal = ref(false)
const selectedAdmin = ref<Admin | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10
const internalSearchQuery = ref('')

// Feedback & confirmations
const showConfirmDelete = ref(false)
const isDeleting = ref(false)
const deleteTarget = ref<Admin | null>(null)
const showSuccess = ref(false)
const successMessage = ref('')

const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const filteredAdmins = computed(() => {
  const query = (props.searchQuery || internalSearchQuery.value).toLowerCase()

  if (!query.trim()) {
    return admins.value
  }

  return admins.value.filter((admin) => {
    const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase()
    return (
      admin.username.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.area.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      (admin.phone && admin.phone.includes(query))
    )
  })
})

const totalPages = computed(() => Math.ceil(filteredAdmins.value.length / itemsPerPage))

const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAdmins.value.slice(start, end)
})

onMounted(() => {
  adminStore.fetchAllAdmins()
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

const openUpdateModal = (admin: Admin) => {
  selectedAdmin.value = admin
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  selectedAdmin.value = null
}

const handleUpdate = async (data: UpdateAdminData, onComplete?: () => void) => {
  if (selectedAdmin.value?._id) {
    try {
      await adminStore.updateAdmin(selectedAdmin.value._id, data)
      successMessage.value = t('ui.admin_update_success')
      showSuccess.value = true
      autoCloseAlert(3000) // Auto-close after 3 seconds
      if (onComplete) {
        onComplete()
      } else {
        closeUpdateModal()
      }
    } catch (error: any) {
      console.error(error.message || 'Failed to update admin')
    }
  }
}

const deleteAdmin = (admin: Admin) => {
  deleteTarget.value = admin
  showConfirmDelete.value = true
}

const confirmDelete = async () => {
  if (!deleteTarget.value?._id) return
  try {
    isDeleting.value = true
    await adminStore.deleteAdmin(deleteTarget.value._id)
    showConfirmDelete.value = false
    successMessage.value = t('ui.admin_delete_success')
    showSuccess.value = true
    autoCloseAlert(3000) // Auto-close after 3 seconds
  } catch (error: any) {
    console.error(error?.message || 'Failed to delete admin')
  } finally {
    isDeleting.value = false
    deleteTarget.value = null
  }
}

const cancelDelete = () => {
  showConfirmDelete.value = false
  deleteTarget.value = null
}

const deleteTargetName = computed(() => {
  if (!deleteTarget.value) return ''
  return deleteTarget.value.firstName && deleteTarget.value.lastName
    ? `${deleteTarget.value.firstName} ${deleteTarget.value.lastName}`
    : deleteTarget.value.username
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Error State -->
    <div v-if="error" class="p-8 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 font-semibold">Error: {{ error }}</p>
      <button
        @click="adminStore.fetchAllAdmins()"
        class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        {{ t('ui.retry') }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="p-8 text-center text-gray-600">{{ t('ui.loading_admins') }}</div>

    <!-- Empty State -->
    <div v-else-if="!admins.length" class="p-8 text-center text-gray-600">{{ t('ui.no_admins_found') }}</div>

    <!-- No Search Results -->
    <div v-else-if="!filteredAdmins.length" class="p-8 text-center text-gray-600">
      {{ t('ui.no_admins_found') }}
    </div>

    <!-- Table -->
    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
          <th class="px-6 py-4">{{ t('ui.admin_id') }}</th>
          <th class="px-6 py-4">{{ t('ui.username') }}</th>
          <th class="px-6 py-4">{{ t('ui.email') }}</th>
          <th class="px-6 py-4">{{ t('ui.area') }}</th>
          <th class="px-6 py-4">{{ t('ui.role') }}</th>
          <th class="px-6 py-4 text-center">{{ t('ui.options') }}</th>
        </tr>
      </thead>

      <tbody class="text-sm text-gray-700">
        <tr
          class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
          v-for="admin in paginatedAdmins"
          :key="admin._id"
        >
          <td class="px-6 py-4">{{ admin._id }}</td>
          <td class="px-6 py-4 font-medium">{{ admin.username }}</td>
          <td class="px-6 py-4">{{ admin.email }}</td>
          <td class="px-6 py-4">{{ admin.area }}</td>
          <td class="px-6 py-4">{{ admin.role }}</td>
          <td class="px-6 py-4 text-center">
            <button
              @click="openUpdateModal(admin)"
              class="inline-block text-blue-600 hover:text-blue-800 mr-3"
            >
              <Edit class="w-5 h-5" />
            </button>
            <button
              @click="deleteAdmin(admin)"
              class="inline-block text-red-600 hover:text-red-800"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div
      v-if="filteredAdmins.length > 0"
      class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50"
    >
      <div class="text-sm text-gray-600">
        {{ t('ui.showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }} {{ t('ui.to') }}
        {{ Math.min(currentPage * itemsPerPage, filteredAdmins.length) }} {{ t('ui.of') }}
        {{ filteredAdmins.length }}
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
    <UpdateAdminModal
      :showModal="showUpdateModal"
      :admin="selectedAdmin"
      @close="closeUpdateModal"
      @update="handleUpdate"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      :visible="showConfirmDelete"
      :message="t('ui.confirm_delete_admin', { name: deleteTargetName })"
      :isLoading="isDeleting"
      :confirmText="t('ui.delete')"
      :cancelText="t('ui.cancel')"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :visible="showSuccess"
      :message="successMessage"
      :actionText="t('ui.done')"
      @close="showSuccess = false"
    />
  </div>
</template>
