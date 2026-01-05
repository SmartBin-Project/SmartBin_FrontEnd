<script setup lang="ts">
import { Trash2, MapPin } from 'lucide-vue-next'
defineProps({
  binCode: String,
  area: String,
  fillLevel: Number,
  statusColor: String,
  selected: Boolean,
})
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm border transition-all"
    :class="selected ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-100'"
  >
    <div class="flex items-start gap-4 mb-4 pr-6">
      <div class="p-2 bg-gray-50 rounded-lg">
        <Trash2 class="w-6 h-6 text-gray-700" />
      </div>
      <div>
        <h3 class="font-bold text-gray-800 text-lg leading-tight">{{ binCode }}</h3>
        <div class="flex items-center text-xs text-gray-400 mt-1">
          <MapPin :size="12" class="mr-1" />
          <span class="truncate max-w-50">{{ area }}</span>
        </div>
      </div>
    </div>

    <hr class="border-gray-100 mb-4" />

    <div class="space-y-3">
      <div class="flex justify-between items-center text-sm">
        <span class="font-bold text-gray-700">Fill Level</span>
        <span
          :class="`px-3 py-1 rounded-full text-xs font-bold ${
            fillLevel && fillLevel < 50
              ? 'bg-green-100 text-green-600'
              : 'bg-yellow-100 text-yellow-600'
          }`"
        >
          {{ fillLevel }}%
        </span>
      </div>

      <div class="flex justify-between items-center text-sm">
        <span class="font-bold text-gray-700">Status</span>
        <div class="flex items-center text-green-600 font-medium text-xs">
          <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Available
        </div>
      </div>
    </div>
  </div>
</template>
