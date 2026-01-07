<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'change-page': [page: number]
}>()

// Generate page numbers to display
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  const halfVisible = Math.floor(maxVisible / 2)

  if (props.totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate range around current page
    let startPage = Math.max(2, props.currentPage - halfVisible)
    let endPage = Math.min(props.totalPages - 1, props.currentPage + halfVisible)

    // Add ellipsis before if needed
    if (startPage > 2) {
      pages.push('...')
    }

    // Add pages around current
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis after if needed
    if (endPage < props.totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(props.totalPages)
  }

  return pages
})
</script>

<template>
  <div class="flex items-center justify-between mt-6 px-2">
    <button
      class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="currentPage === 1"
      @click="emit('change-page', currentPage - 1)"
    >
      <ChevronLeft :size="16" class="mr-2" />
      Previous
    </button>

    <div class="flex items-center space-x-2">
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="typeof page === 'number' && emit('change-page', page)"
        :disabled="typeof page === 'string'"
        :class="[
          'w-8 h-8 flex items-center justify-center text-sm rounded-lg',
          typeof page === 'string'
            ? 'text-gray-400 cursor-default'
            : page === currentPage
              ? 'bg-purple-100 text-purple-600 font-bold'
              : 'text-gray-500 hover:bg-gray-100',
        ]"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="currentPage === totalPages"
      @click="emit('change-page', currentPage + 1)"
    >
      Next
      <ChevronRight :size="16" class="ml-2" />
    </button>
  </div>
</template>
