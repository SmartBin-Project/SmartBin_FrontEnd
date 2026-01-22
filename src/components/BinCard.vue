<script setup lang="ts">
import { useTranslation } from '@/composables/useTranslation'
import { Trash2, MapPin } from 'lucide-vue-next'
import type { Bin } from '@/types/bin'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { translateDB } = useTranslation()

const props = defineProps<{ bin: Bin; selected: boolean }>()

const statusColor = computed(() => {
  if (props.bin.fillLevel === undefined) return 'gray'
  if (props.bin.fillLevel > 80) return 'red'
  if (props.bin.fillLevel > 50) return 'yellow'
  return 'green'
})
</script>

<template>
  <div
    class="bg-white p-6 rounded-2xl shadow-sm border transition-all"
    :class="props.selected ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-100'"
  >
    <div class="flex items-start gap-4 mb-4 pr-6">
      <div class="p-2 bg-gray-50 rounded-lg">
        <Trash2 class="w-6 h-6 text-gray-700" />
      </div>
      <div>
        <div class="flex items-center">
          <MapPin :size="16" class="mr-1" />
          <h3 class="font-bold text-gray-800 text-lg leading-tight">
            {{ translateDB(props.bin.area) }}
          </h3>
        </div>
        <span class="truncate max-w-50 text-xs text-gray-400 mt-1">{{ props.bin.binCode }}</span>
      </div>
    </div>

    <hr class="border-gray-100 mb-4" />

    <div class="space-y-3">
      <div class="flex justify-between items-center text-sm">
        <span class="font-bold text-gray-700">{{ t('ui.fill_level') }}</span>
        <span
          class="px-3 py-1 rounded-full text-xs font-bold"
          :class="{
            'bg-green-100 text-green-600': statusColor === 'green',
            'bg-yellow-100 text-yellow-600': statusColor === 'yellow',
            'bg-red-100 text-red-600': statusColor === 'red',
            'bg-gray-100 text-gray-600': statusColor === 'gray',
          }"
        >
          {{ props.bin.fillLevel }}%
        </span>
      </div>

      <div class="flex justify-between items-center text-sm">
        <span class="font-bold text-gray-700">{{ t('ui.status') }}</span>
        <div
          class="flex items-center font-medium text-xs"
          :class="{
            'text-green-600': statusColor === 'green',
            'text-yellow-600': statusColor === 'yellow',
            'text-red-600': statusColor === 'red',
            'text-gray-600': statusColor === 'gray',
          }"
        >
          <div
            class="w-2 h-2 rounded-full mr-2"
            :class="{
              'bg-green-500': statusColor === 'green',
              'bg-yellow-500': statusColor === 'yellow',
              'bg-red-500': statusColor === 'red',
              'bg-gray-500': statusColor === 'gray',
            }"
          ></div>
          {{ props.bin.status }}
        </div>
      </div>
    </div>
  </div>
</template>
