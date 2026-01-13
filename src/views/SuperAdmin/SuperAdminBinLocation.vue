<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import BinCard from '@/components/BinCard.vue'
import SuperAdminBinLocation from '@/components/ui/SuperAdmin/SuperAdminBinLocation.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import SuccessAlert from '@/components/ui/SuccessAlert.vue'
import { useBinStore } from '@/stores/binStore'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import UpdateBinModal from '@/components/UpdateBinModal.vue'
import type { Bin } from '@/types/bin'

const searchText = ref('')
const binStore = useBinStore()
const { bins } = storeToRefs(binStore)
const selectedBin = ref<any>(null)
const isUpdateModalVisible = ref(false)
const showDeleteModal = ref(false)
const showSuccessAlert = ref(false)
const binToDelete = ref<Bin | null>(null)
const isDeleting = ref(false)
const successMessage = ref('')

const handleSearch = (query: string) => {
  searchText.value = query
}

const filteredBins = computed(() => {
  const query = searchText.value.toLowerCase()

  if (!query.trim()) {
    return bins.value
  }

  return bins.value.filter((bin) => {
    return (
      bin.binCode.toLowerCase().includes(query) ||
      bin.fillLevel.toString().includes(query) ||
      bin.status.toLowerCase().includes(query) ||
      bin.location.includes(query) ||
      (bin.area && bin.area.toLowerCase().includes(query))
    )
  })
})

onMounted(() => {
  binStore.getAllBins()
})

const handleUpdateBin = async (id: string, bin: Partial<Bin>) => {
  try {
    await binStore.updateBin(id, bin)
    successMessage.value = `SmartBin "${bin.binCode}" has been updated successfully!`
    showSuccessAlert.value = true
    isUpdateModalVisible.value = false
    selectedBin.value = null // Deselect after update
    await binStore.getAllBins() // Refresh the list
  } catch (error: any) {
    console.error(error.message || 'Failed to update bin')
  }
}

const closeSuccessAlert = () => {
  showSuccessAlert.value = false
}

const deleteSelectedBin = () => {
  if (selectedBin.value) {
    binToDelete.value = selectedBin.value
    showDeleteModal.value = true
  } else {
    alert('Please select a bin to delete.')
  }
}

const confirmDeleteBin = async () => {
  if (binToDelete.value?._id) {
    isDeleting.value = true
    try {
      await binStore.deleteBin(binToDelete.value._id)
      showDeleteModal.value = false
      binToDelete.value = null
      selectedBin.value = null
      await binStore.getAllBins()
    } catch (error: any) {
      console.error(error.message || 'Failed to delete bin')
    } finally {
      isDeleting.value = false
    }
  }
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  binToDelete.value = null
}

const openUpdateModal = () => {
  if (selectedBin.value) {
    isUpdateModalVisible.value = true
  } else {
    alert('Please select a bin to update.')
  }
}

const selectBin = (bin: Bin) => {
  if (selectedBin.value && selectedBin.value._id === bin._id) {
    selectedBin.value = null // Deselect if clicking the same card
  } else {
    selectedBin.value = bin
  }
}

onMounted(() => {
  binStore.getAllBins()
})
</script>

<template>
  <SuperAdminLayout title="Bin Locations" @search="handleSearch">
    <div>
      <div
        class="w-full h-125 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden"
      >
        <SuperAdminBinLocation :search-text="searchText" />
      </div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">SmartBin List:</h3>
        <div class="flex gap-4">
          <button @click="openUpdateModal" class="px-8 py-2 bg-green-600 text-white rounded-lg">
            Update
          </button>
          <button @click="deleteSelectedBin" class="px-8 py-2 bg-red-600 text-white rounded-lg">
            Delete
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="!filteredBins.length" class="col-span-full p-8 text-center text-gray-600">
          No bins match your search
        </div>
        <BinCard
          v-for="bin in filteredBins"
          :key="bin._id"
          :binCode="bin.binCode"
          :area="bin.area"
          :fillLevel="bin.fillLevel"
          :statusColor="bin.fillLevel > 75 ? 'red' : 'green'"
          :status="bin.status"
          :selected="selectedBin && selectedBin._id === bin._id"
          @click="selectBin(bin)"
          class="cursor-pointer"
        />
      </div>
    </div>
    <UpdateBinModal
      :visible="isUpdateModalVisible"
      :bin="selectedBin"
      @close="isUpdateModalVisible = false"
      @update="handleUpdateBin"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :visible="showDeleteModal"
      title="Delete SmartBin"
      :message="`Are you sure you want to delete bin ${binToDelete?.binCode}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      :is-loading="isDeleting"
      @confirm="confirmDeleteBin"
      @cancel="closeDeleteModal"
    />

    <!-- Success Alert -->
    <SuccessAlert
      :visible="showSuccessAlert"
      title="SmartBin Updated Successfully!"
      :message="successMessage"
      action-text="Close"
      @close="closeSuccessAlert"
    />
  </SuperAdminLayout>
</template>
