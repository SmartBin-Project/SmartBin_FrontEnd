<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import CleanerTable from '@/components/CleanerTable.vue'
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <SuperAdminLayout title="Cleaner" @search="handleSearch">
    <CleanerTable :search-query="searchQuery" />
  </SuperAdminLayout>
</template>
