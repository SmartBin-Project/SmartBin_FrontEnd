<script setup lang="ts">
import StatCard from '@/components/StatCard.vue'
import TrashGraph from '@/components/TrashGraph.vue'
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import { useBinStore } from '@/stores/binStore'
import { useSuperAdminStore } from '@/stores/superAdminStore'
import { useCleanerStore } from '@/stores/cleanerStore'
import { Users, Box, BarChart2, Clock, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'

const superAdminStore = useSuperAdminStore()
const cleanerStore = useCleanerStore()
const binStore = useBinStore()

// Search functionality
const searchQuery = ref('')

const handleSearch = (query: string) => {
  searchQuery.value = query.toLowerCase()
}

// Filtered data based on search
const filteredBins = computed(() => {
  if (!searchQuery.value) return binStore.allBins
  return binStore.allBins.filter((bin) => {
    const query = searchQuery.value
    return (
      bin.binCode?.toLowerCase().includes(query) ||
      bin.binName?.toLowerCase().includes(query) ||
      bin.area?.toLowerCase().includes(query)
    )
  })
})

const filteredCleaners = computed(() => {
  if (!searchQuery.value) return cleanerStore.getCleaners || []
  return (cleanerStore.getCleaners || []).filter((cleaner) => {
    const query = searchQuery.value
    const fullName = `${cleaner.firstName} ${cleaner.lastName}`.toLowerCase()
    return (
      fullName.includes(query) ||
      cleaner.telegramChatId?.toLowerCase().includes(query) ||
      cleaner.area?.toLowerCase().includes(query)
    )
  })
})

const filteredAdmins = computed(() => {
  if (!searchQuery.value) return superAdminStore.getAdmins || []
  return (superAdminStore.getAdmins || []).filter((admin) => {
    const query = searchQuery.value
    const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase()
    return (
      admin.username?.toLowerCase().includes(query) ||
      admin.email?.toLowerCase().includes(query) ||
      fullName.includes(query) ||
      admin.area?.toLowerCase().includes(query) ||
      admin.phone?.toLowerCase().includes(query)
    )
  })
})

const bins = computed(() => filteredBins.value)
const totalFullCount = computed(() => {
  return bins.value.reduce((total, bin) => total + (bin.fullCount || 0), 0)
})

onMounted(() => {
  superAdminStore.fetchAdmins()
  superAdminStore.fetchCleaners()
  cleanerStore.fetchCleaners()
  console.log('Cleaners:', cleanerStore.cleaners)
  binStore.getAllBins()
})

// 1. Bin Status Pie Chart
const binStatusData = computed(() => {
  const statusCounts = bins.value.reduce(
    (acc, bin) => {
      acc[bin.status] = (acc[bin.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    series: Object.values(statusCounts),
    chartOptions: {
      chart: { type: 'pie' },
      labels: Object.keys(statusCounts),
      colors: ['#ef4444', '#f97316', '#22c55e'], // FULL, FILLING, EMPTY
      legend: { position: 'bottom' },
    },
  }
})

// 2. Busiest Bins Bar Chart
// const busiestBinsData = computed(() => {
//   const sortedBins = [...bins.value].sort((a, b) => b.fullCount - a.fullCount).slice(0, 5)

//   return {
//     series: [
//       {
//         name: 'Times Full',
//         data: sortedBins.map((b) => ({
//           x: b.binCode,
//           y: b.fullCount,
//         })),
//       },
//     ],
//     chartOptions: {
//       chart: { type: 'bar' },
//       xaxis: {
//         type: 'category',
//         categories: sortedBins.map((b) => b.binCode),
//       },
//       colors: ['#34a853'],
//       plotOptions: {
//         bar: {
//           horizontal: true,
//           dataLabels: {
//             position: 'right',
//           },
//         },
//       },
//       dataLabels: {
//         enabled: true,
//         formatter: (val: number) => `${val}`,
//       },
//       tooltip: {
//         y: {
//           formatter: (val: number) => `${val} times`,
//         },
//       },
//     },
//   }
// })

const busiestBinsData = computed(() => {
  const sortedBins = [...bins.value].sort((a, b) => b.fullCount - a.fullCount).slice(0, 5)

  return {
    series: [{ name: 'Times Full', data: sortedBins.map((b) => b.fullCount) }],
    chartOptions: {
      chart: { type: 'bar' },
      xaxis: {
        categories: sortedBins.map((b) => b.binCode),
      },
      colors: ['#34a853'],
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} times`,
        },
      },
    },
  }
})

// 3. Fill Level Histogram
const fillLevelHistogramData = computed(() => {
  const brackets = {
    '0-20%': 0,
    '21-40%': 0,
    '41-60%': 0,
    '61-80%': 0,
    '81-100%': 0,
  }

  bins.value.forEach((bin) => {
    if (bin.fillLevel <= 20) brackets['0-20%']++
    else if (bin.fillLevel <= 40) brackets['21-40%']++
    else if (bin.fillLevel <= 60) brackets['41-60%']++
    else if (bin.fillLevel <= 80) brackets['61-80%']++
    else brackets['81-100%']++
  })

  return {
    series: [{ name: 'Number of Bins', data: Object.values(brackets) }],
    chartOptions: {
      chart: { type: 'bar' },
      xaxis: {
        categories: Object.keys(brackets),
      },
      colors: ['#68a357'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
  }
})

// 4. Fill Level Trend (Line Chart) - Mock data for trend
const fillLevelTrendData = computed(() => {
  return {
    series: [
      {
        name: 'Avg. Fill Level',
        data: [20, 30, 25, 45, 40, 50, 45, 60, 55, 70, 60, 65].reverse(), // Mock trend
      },
    ],
    chartOptions: {
      chart: { type: 'line', zoom: { enabled: false } },
      stroke: { curve: 'smooth' },
      colors: ['#4CAF50'],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ].reverse(),
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  }
})
</script>

<template>
  <SuperAdminLayout title="Dashboard" @search="handleSearch">
    <!-- Search Results Section -->
    <div v-if="searchQuery" class="mb-8">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">
          Search Results for "{{ searchQuery }}"
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Bins Results -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-700 mb-3 flex items-center">
              <Box class="w-5 h-5 mr-2 text-yellow-500" />
              Bins ({{ filteredBins.length }})
            </h4>
            <div v-if="filteredBins.length === 0" class="text-sm text-gray-500">
              No bins match your search
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="bin in filteredBins.slice(0, 10)"
                :key="bin._id"
                class="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div class="font-medium">{{ bin.binName }}</div>
                <div class="text-gray-600 text-xs">{{ bin.binCode }} - {{ bin.area }}</div>
              </div>
              <div v-if="filteredBins.length > 10" class="text-xs text-gray-500 pt-1">
                +{{ filteredBins.length - 10 }} more
              </div>
            </div>
          </div>

          <!-- Cleaners Results -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-700 mb-3 flex items-center">
              <Clock class="w-5 h-5 mr-2 text-orange-500" />
              Cleaners ({{ filteredCleaners.length }})
            </h4>
            <div v-if="filteredCleaners.length === 0" class="text-sm text-gray-500">
              No cleaners match your search
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="cleaner in filteredCleaners.slice(0, 10)"
                :key="cleaner._id"
                class="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div class="font-medium">{{ cleaner.firstName }} {{ cleaner.lastName }}</div>
                <div class="text-gray-600 text-xs">{{ cleaner.area }}</div>
              </div>
              <div v-if="filteredCleaners.length > 10" class="text-xs text-gray-500 pt-1">
                +{{ filteredCleaners.length - 10 }} more
              </div>
            </div>
          </div>

          <!-- Admins Results -->
          <div class="border rounded-lg p-4">
            <h4 class="font-medium text-gray-700 mb-3 flex items-center">
              <Users class="w-5 h-5 mr-2 text-purple-600" />
              Admins ({{ filteredAdmins.length }})
            </h4>
            <div v-if="filteredAdmins.length === 0" class="text-sm text-gray-500">
              No admins match your search
            </div>
            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="admin in filteredAdmins.slice(0, 10)"
                :key="admin._id"
                class="text-sm p-2 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div class="font-medium">{{ admin.username }}</div>
                <div class="text-gray-600 text-xs">{{ admin.email }} - {{ admin.area }}</div>
              </div>
              <div v-if="filteredAdmins.length > 10" class="text-xs text-gray-500 pt-1">
                +{{ filteredAdmins.length - 10 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Customer"
        :value="filteredAdmins.length"
        :icon="Users"
        iconBg="bg-purple-100 text-purple-600"
        trend="8.5%"
        :isPositive="true"
      />
      <StatCard
        title="Total Bin"
        :value="filteredBins.length"
        :icon="Box"
        iconBg="bg-yellow-100 text-yellow-500"
        trend="1.3%"
        :isPositive="true"
      />
      <StatCard
        title="Total Fill Count"
        :value="totalFullCount"
        :icon="BarChart2"
        iconBg="bg-green-100 text-green-500"
        trend="4.3%"
        :isPositive="false"
      />
      <StatCard
        title="Total Cleaners"
        :value="filteredCleaners.length"
        :icon="Clock"
        iconBg="bg-orange-100 text-orange-500"
        trend="1.8%"
        :isPositive="true"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
      <TrashGraph
        type="pie"
        title="Bin Status Overview"
        :series="binStatusData.series"
        :chart-options="binStatusData.chartOptions"
      />
      <TrashGraph
        type="bar"
        title="Fill Level Distribution"
        :series="fillLevelHistogramData.series"
        :chart-options="fillLevelHistogramData.chartOptions"
      />
    </div>
    <div class="grid grid-cols-1 gap-8 mb-5">
      <TrashGraph
        type="bar"
        title="Top 5 Busiest Bins"
        :series="busiestBinsData.series"
        :chart-options="busiestBinsData.chartOptions"
      />
    </div>
    <div class="grid grid-cols-1 gap-8">
      <TrashGraph
        type="line"
        title="Fill Level Trend"
        :series="fillLevelTrendData.series"
        :chart-options="fillLevelTrendData.chartOptions"
      />
    </div>
  </SuperAdminLayout>
</template>
