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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const searchText = ref('')
const binStore = useBinStore()
const { bins } = storeToRefs(binStore)
const selectedBin = ref<Bin | null>(null)
const isUpdateModalVisible = ref(false)
const showDeleteModal = ref(false)
const showSuccessAlert = ref(false)
const binToDelete = ref<Bin | null>(null)
const isDeleting = ref(false)
const successMessage = ref('')

const handleSearch = (query: string) => {
  searchText.value = query
}

// 🛠️ FIX: Updated Search Logic for Bilingual Data
const filteredBins = computed(() => {
  const query = searchText.value.toLowerCase().trim()

  if (!query) return bins.value

  return bins.value.filter((bin) => {
    // Check Status & BinCode
    const basicMatch =
      bin.binCode.toLowerCase().includes(query) ||
      bin.status.toLowerCase().includes(query) ||
      bin.fillLevel.toString().includes(query)

    // Check Area (Handle Object vs String)
    let areaMatch = false
    if (typeof bin.area === 'object' && bin.area !== null) {
      areaMatch =
        bin.area.en?.toLowerCase().includes(query) ||
        bin.area.kh?.toLowerCase().includes(query) ||
        false
    } else if (typeof bin.area === 'string') {
      areaMatch = (bin.area as string).toLowerCase().includes(query)
    }

    return basicMatch || areaMatch
  })
})

onMounted(() => {
  binStore.getAllBins()
})

const handleUpdateBin = async (id: string, bin: Partial<Bin>) => {
  try {
    await binStore.updateBin(id, bin)
    successMessage.value = t('ui.bin_update_success', { code: bin.binCode })
    showSuccessAlert.value = true
    isUpdateModalVisible.value = false
    selectedBin.value = null
    await binStore.getAllBins()
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
    alert(t('ui.select_bin_delete'))
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
    alert(t('ui.select_bin_to_update'))
  }
}

const selectBin = (bin: Bin) => {
  if (selectedBin.value && selectedBin.value._id === bin._id) {
    selectedBin.value = null
  } else {
    selectedBin.value = bin
  }
}
</script>

<template>
  <SuperAdminLayout :title="t('ui.location')" @search="handleSearch">
    <div>
      <div
        class="w-full h-125 rounded-xl mb-8 flex items-center justify-center relative overflow-hidden"
      >
        <SuperAdminBinLocation :search-text="searchText" />
      </div>

      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-800">{{ t('ui.bins') }}</h3>
        <div class="flex gap-4">
          <button @click="openUpdateModal" class="px-8 py-2 bg-green-600 text-white rounded-lg">
            {{ t('ui.update') }}
          </button>
          <button @click="deleteSelectedBin" class="px-8 py-2 bg-red-600 text-white rounded-lg">
            {{ t('ui.delete') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="!filteredBins.length" class="col-span-full p-8 text-center text-gray-600">
          {{ t('ui.search_results') }} "{{ searchText }}" - {{ t('ui.no_bins_match') }}
        </div>

        <BinCard
          v-for="bin in filteredBins"
          :key="bin._id"
          :bin="bin"
          :selected="!!(selectedBin && selectedBin._id === bin._id)"
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

    <ConfirmDeleteModal
      :visible="showDeleteModal"
      :title="t('ui.delete_smartbin')"
      :message="t('ui.confirm_delete_bin', { code: binToDelete?.binCode })"
      :confirm-text="t('ui.delete')"
      :cancel-text="t('ui.cancel')"
      :is-loading="isDeleting"
      @confirm="confirmDeleteBin"
      @cancel="closeDeleteModal"
    />

    <SuccessAlert
      :visible="showSuccessAlert"
      :title="t('ui.success')"
      :message="successMessage"
      :action-text="t('ui.done')"
      @close="closeSuccessAlert"
    />
  </SuperAdminLayout>
</template>
