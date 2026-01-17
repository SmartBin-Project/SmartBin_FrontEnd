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
      <AdminTable :search-query="searchQuery" />
    </div>
  </SuperAdminLayout>
</template>
