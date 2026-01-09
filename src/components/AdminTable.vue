<script setup lang="ts">

import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Admin, UpdateAdminData } from '@/types/admin'
import { Edit, Trash2 } from 'lucide-vue-next'
import { useSuperAdminStore } from '@/stores/superAdminStore'


const superAdminStore = useSuperAdminStore()
const { admins, loading, error } = storeToRefs(superAdminStore)

const showUpdateModal = ref(false)
const selectedAdmin = ref<Admin | null>(null)
const formData = ref<UpdateAdminData>({})
const currentPage = ref(1)
const itemsPerPage = 10
const internalSearchQuery = ref('')

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const filteredAdmins = computed(() => {
  const query = (props.searchQuery || internalSearchQuery.value).toLowerCase()
  
  if (!query.trim()) {
    return admins.value
  }
  
  return admins.value.filter(admin => {
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
    console.log('AdminTable mounted, fetching admins...')
    superAdminStore.fetchAdmins().then(() => {
      console.log('Admins fetched:', superAdminStore.admins)
    }).catch((err) => {
      console.error('Error fetching admins:', err)
    })
})

watch(() => props.searchQuery, () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const openUpdateModal = (admin: Admin) => {
  selectedAdmin.value = admin
  formData.value = {
    username: admin.username,
    email: admin.email,
    area: admin.area,
    firstName: admin.firstName,
    lastName: admin.lastName,
    gender: admin.gender,
    phone: admin.phone,
    dateOfBirth: admin.dateOfBirth,
    address: admin.address,
  }
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  selectedAdmin.value = null
  formData.value = {}
}

const submitUpdate = async () => {
  if (selectedAdmin.value?._id) {
    try {
      await superAdminStore.updateAdmin(selectedAdmin.value._id, formData.value)
      closeUpdateModal()
    } catch (error: any) {
      console.error(error.message || 'Failed to update admin')
    }
  }
}

const deleteAdmin = async (admin: Admin) => {
  const fullName = admin.firstName && admin.lastName 
    ? `${admin.firstName} ${admin.lastName}` 
    : admin.username
  
  if (confirm(`Are you sure you want to delete ${fullName}?`)) {
    try {
      if (admin._id) {
        await superAdminStore.deleteAdmin(admin._id)
      }
    } catch (error: any) {
      console.error(error.message || 'Failed to delete admin')
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Error State -->
    <div v-if="error" class="p-8 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700 font-semibold">Error: {{ error }}</p>
      <button 
        @click="superAdminStore.fetchAdmins()"
        class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="p-8 text-center text-gray-600">
      Loading admins...
    </div>

    <!-- Empty State -->
    <div v-else-if="!admins.length" class="p-8 text-center text-gray-600">
      No admins found
    </div>

    <!-- No Search Results -->
    <div v-else-if="!filteredAdmins.length" class="p-8 text-center text-gray-600">
      No admins match your search
    </div>

    <!-- Table -->
    <table v-else class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
          <th class="px-6 py-4">Username</th>
          <th class="px-6 py-4">Email</th>
          <th class="px-6 py-4">Area</th>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4 text-center">Options</th>
        </tr>
      </thead>

      <tbody class="text-sm text-gray-700">
        <tr
          class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
          v-for="admin in paginatedAdmins"
          :key="admin._id"
        >
          <td class="px-6 py-4 font-medium">{{ admin.username }}</td>
          <td class="px-6 py-4">{{ admin.email }}</td>
          <td class="px-6 py-4">{{ admin.area }}</td>
          <td class="px-6 py-4">
            {{ admin.firstName && admin.lastName 
              ? `${admin.firstName} ${admin.lastName}` 
              : '-' }}
          </td>
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
    <div v-if="filteredAdmins.length > 0" class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
      <div class="text-sm text-gray-600">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
        {{ Math.min(currentPage * itemsPerPage, filteredAdmins.length) }} of {{ filteredAdmins.length }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
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
          Next
        </button>
      </div>
    </div>

    <!-- Update Modal -->
    <div
      v-if="showUpdateModal"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Update Admin</h2>
        <form @submit.prevent="submitUpdate">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                v-model="formData.username"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Area -->
            <div>
              <label for="area" class="block text-sm font-medium text-gray-700">Area</label>
              <input
                type="text"
                id="area"
                v-model="formData.area"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Password (optional) -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password (leave empty to keep current)</label>
              <input
                type="password"
                id="password"
                v-model="formData.password"
                placeholder="Enter new password"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                v-model="formData.dateOfBirth"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                v-model="formData.address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeUpdateModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
