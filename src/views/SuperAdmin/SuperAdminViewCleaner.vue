<script setup>
import { ref } from 'vue'
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import CustomerTable from '@/components/CustomerTable.vue'
import Pagination from '@/components/Pagination.vue'

// Mock data based on your image
const customers = ref([
  {
    id: '00001',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Tul Tumpong',
  },
  {
    id: '00002',
    name: 'Rosie Pearson',
    address: '979 Immanuel Ferry Suite 526',
    date: '14 Feb 2019',
    branch: 'Wat Phnom',
  },
  {
    id: '00003',
    name: 'Darrell Caldwell',
    address: '8587 Frida Ports',
    date: '14 Feb 2019',
    branch: 'Stueng meanchey',
  },
  {
    id: '00004',
    name: 'Gilbert Johnston',
    address: '768 Destiny Lake Suite 600',
    date: '14 Feb 2019',
    branch: 'Orosey',
  },
  {
    id: '00005',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Sensok',
  },
  {
    id: '00006',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Koh Pich',
  },
  {
    id: '00007',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Koh Norea',
  },
  {
    id: '00009',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Veng Sreng',
  },
  {
    id: '00010',
    name: 'Alan Cain',
    address: '042 Mylene Throughway',
    date: '14 Feb 2019',
    branch: 'Chamka Doung',
  },
])

const currentPage = ref(1)

const handlePageChange = (newPage) => {
  console.log('Fetching page:', newPage)
  currentPage.value = newPage
}
</script>

<template>
  <SuperAdminLayout title="Cleaner">
    <CustomerTable :customers="customers" />
    <Pagination :current-page="currentPage" :total-pages="24" @change-page="handlePageChange" />
  </SuperAdminLayout>
</template>
