<script setup lang="ts">
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import AdminTable from '@/components/AdminTable.vue'
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <SuperAdminLayout title="View Admins" @search="handleSearch">
    <div class="space-y-6">
      <!-- Header with refresh info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        All admins are listed below. You can edit or delete any admin using the action buttons.
      </div>

      <!-- Admin Table with search -->
      <AdminTable :search-query="searchQuery" />
    </div>
  </SuperAdminLayout>
</template>
