<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import BinCard from '@/components/BinCard.vue'
import SuperAdminBinLocation from '@/components/ui/SuperAdmin/SuperAdminBinLocation.vue'
import { useBinStore } from '@/stores/binStore'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import UpdateBinModal from '@/components/UpdateBinModal.vue'
import type { Bin } from '@/types/bin'

const searchText = ref('')
const binStore = useBinStore()
const { bins } = storeToRefs(binStore)
const selectedBin = ref<any>(null)
const isUpdateModalVisible = ref(false)

const handleUpdateBin = async (id: string, bin: Partial<Bin>) => {
  await binStore.updateBin(id, bin)
  isUpdateModalVisible.value = false
  selectedBin.value = null // Deselect after update
  await binStore.getAllBins() // Refresh the list
}

const deleteSelectedBin = () => {
  if (selectedBin.value) {
    if (confirm('Are you sure you want to delete this bin?')) {
      binStore.deleteBin(selectedBin.value._id)
      selectedBin.value = null
    }
  } else {
    alert('Please select a bin to delete.')
  }
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
  <SuperAdminLayout title="Bin Locations">
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
        <BinCard
          v-for="bin in bins"
          :key="bin._id"
          :binCode="bin.binCode"
          :area="bin.area"
          :fillLevel="bin.fillLevel"
          :statusColor="bin.fillLevel > 75 ? 'red' : 'green'"
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
  </SuperAdminLayout>
</template>
