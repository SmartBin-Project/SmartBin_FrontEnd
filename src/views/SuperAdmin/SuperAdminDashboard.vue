<script setup lang="ts">
import StatCard from '@/components/StatCard.vue'
import TrashGraph from '@/components/TrashGraph.vue'
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import { useBinStore } from '@/stores/binStore'
import { useSuperAdminStore } from '@/stores/superAdminStore'
import { Users, Box, BarChart2, Clock, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'

const superAdminStore = useSuperAdminStore();
const binStore = useBinStore();
onMounted(() => {
  superAdminStore.fetchAdmins();
  superAdminStore.fetchCleaners();
  binStore.fetchBins();
})

const bins = computed(() => binStore.bins);

const totalFullCount = computed(() => {
  return bins.value.reduce((total, bin) => total + (bin.fullCount || 0), 0);
});


// 1. Bin Status Pie Chart
const binStatusData = computed(() => {
  const statusCounts = bins.value.reduce((acc, bin) => {
    acc[bin.status] = (acc[bin.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    series: Object.values(statusCounts),
    chartOptions: {
      chart: { type: 'pie' },
      labels: Object.keys(statusCounts),
      colors: ['#ef4444', '#f97316', '#22c55e'], // FULL, FILLING, EMPTY
      legend: { position: 'bottom' }
    }
  }
})

// 2. Busiest Bins Bar Chart
const busiestBinsData = computed(() => {
  const sortedBins = [...bins.value].sort((a, b) => b.fullCount - a.fullCount).slice(0, 5)

  return {
    series: [{ name: 'Times Full', data: sortedBins.map(b => b.fullCount) }],
    chartOptions: {
      chart: { type: 'bar' },
      xaxis: {
        categories: sortedBins.map(b => b.binCode)
      },
      colors: ['#34a853'],
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} times`
        }
      }
    }
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
    };

    bins.value.forEach(bin => {
        if (bin.fillLevel <= 20) brackets['0-20%']++;
        else if (bin.fillLevel <= 40) brackets['21-40%']++;
        else if (bin.fillLevel <= 60) brackets['41-60%']++;
        else if (bin.fillLevel <= 80) brackets['61-80%']++;
        else brackets['81-100%']++;
    });

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
                }
            },
            dataLabels: {
                enabled: false
            },
        }
    };
});


// 4. Fill Level Trend (Line Chart) - Mock data for trend
const fillLevelTrendData = computed(() => {
  return {
    series: [{
      name: 'Avg. Fill Level',
      data: [20, 30, 25, 45, 40, 50, 45, 60, 55, 70, 60, 65].reverse() // Mock trend
    }],
    chartOptions: {
      chart: { type: 'line', zoom: { enabled: false } },
      stroke: { curve: 'smooth' },
      colors: ['#4CAF50'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].reverse()
      },
       tooltip: {
        y: {
          formatter: (val: number) => `${val}%`
        }
      }
    }
  }
})

</script>

<template>
  <SuperAdminLayout title="Dashboard">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Customer"
        :value="superAdminStore.getAdmins?.length || 0"
        :icon="Users"
        iconBg="bg-purple-100 text-purple-600"
        trend="8.5%"
        :isPositive="true"
      />
      <StatCard
        title="Total Bin"
        :value="binStore.getBins?.length || 0"
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
        :value="superAdminStore.getCleaners?.length || 0"
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
