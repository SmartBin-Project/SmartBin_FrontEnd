<script setup>
import VueApexCharts from 'vue3-apexcharts';

const series = [{
  name: 'Total Trash',
  data: [20, 30, 25, 45, 40, 50, 45, 60, 55, 70, 60, 65]
}];

const chartOptions = {
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  colors: ['#4CAF50'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#9CA3AF' } }
  },
  yaxis: { show: false },
  grid: { show: true, borderColor: '#f3f4f6', strokeDashArray: 4 },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} Tons` }
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">Trash graph</h2>
      <button class="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center hover:bg-gray-50">
        October <span class="ml-2 text-[10px]">▼</span>
      </button>
    </div>
    <div class="h-72">
      <VueApexCharts type="area" height="100%" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>