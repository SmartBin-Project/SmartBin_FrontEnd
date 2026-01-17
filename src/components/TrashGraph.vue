<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import type { PropType } from 'vue'

type ApexChartType =
  | 'area'
  | 'line'
  | 'bar'
  | 'histogram'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'rangeBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'radar'
  | 'polarArea'

const props = defineProps({
  series: {
    type: Array as PropType<any[]>,
    required: true
  },
  chartOptions: {
    type: Object as PropType<Record<string, any>>,
    required: true
  },
  title: {
    type: String,
    default: 'Chart'
  },
  type: {
    type: String as PropType<ApexChartType>,
    default: 'area'
  }
})
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">{{ props.title }}</h2>
    </div>
    <div class="h-72">
      <VueApexCharts :type="props.type" height="100%" :options="props.chartOptions" :series="props.series" />
    </div>
  </div>
</template>