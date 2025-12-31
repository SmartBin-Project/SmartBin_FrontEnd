<script setup>
import { MoreHorizontal } from 'lucide-vue-next';

defineProps({
  customers: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
          <th class="px-6 py-4">ID</th>
          <th class="px-6 py-4">Name</th>
          <th class="px-6 py-4">Address</th>
          <th class="px-6 py-4">Date</th>
          <th class="px-6 py-4">Branch</th>
          <th class="px-6 py-4 text-center">Options</th>
        </tr>
      </thead>

      <tbody class="text-sm text-gray-700">
        <tr 
          v-for="customer in customers" 
          :key="customer.id" 
          class="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
        >
          <td class="px-6 py-4 font-medium text-gray-500">{{ customer.id }}</td>
          <td class="px-6 py-4 font-medium text-gray-800">{{ customer.name }}</td>
          <td class="px-6 py-4 text-gray-600 max-w-xs truncate">{{ customer.address }}</td>
          <td class="px-6 py-4 text-gray-600">{{ customer.date }}</td>
          <td class="px-6 py-4 text-gray-600">{{ customer.branch }}</td>
          <td class="px-6 py-4 text-center">
            <button class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal :size="18" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>