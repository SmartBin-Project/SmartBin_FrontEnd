<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';

defineProps({
  title: String,
  value: Number,
  icon: Object,
  iconBg: String,
  trend: String,
  isPositive: Boolean
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between h-40 transition-transform hover:-translate-y-1 hover:shadow-md border border-gray-100">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-gray-400 text-sm font-medium mb-1">{{ title }}</h3>
        <span class="text-3xl font-bold text-gray-800">{{ value }}</span>
      </div>
      <div :class="`p-3 rounded-xl ${iconBg} bg-opacity-20`">
        <component :is="icon" :size="24" />
      </div>
    </div>

    <div class="flex items-center text-xs mt-4">
      <span :class="`flex items-center font-bold mr-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`">
        <component :is="isPositive ? ArrowUpRight : ArrowDownRight" :size="14" class="mr-1" />
        {{ trend }}
      </span>
      <span class="text-gray-400">Up from yesterday</span>
    </div>
  </div>
</template>