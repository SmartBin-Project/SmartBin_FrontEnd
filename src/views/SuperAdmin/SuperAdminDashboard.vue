<script setup>
import StatCard from '@/components/StatCard.vue'
import TrashGraph from '@/components/TrashGraph.vue'
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import { Users, Box, BarChart2, Clock, ChevronRight, ChevronLeft } from 'lucide-vue-next'
</script>

<template>
  <SuperAdminLayout title="Dashboard">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Customer"
        value="40,689"
        :icon="Users"
        iconBg="bg-purple-100 text-purple-600"
        trend="8.5%"
        :isPositive="true"
      />
      <StatCard
        title="Total Bin"
        value="10,293"
        :icon="Box"
        iconBg="bg-yellow-100 text-yellow-500"
        trend="1.3%"
        :isPositive="true"
      />
      <StatCard
        title="Total Trash"
        value="89,000"
        :icon="BarChart2"
        iconBg="bg-green-100 text-green-500"
        trend="4.3%"
        :isPositive="false"
      />
      <StatCard
        title="Total Pending"
        value="2,040"
        :icon="Clock"
        iconBg="bg-orange-100 text-orange-500"
        trend="1.8%"
        :isPositive="true"
      />
    </div>

    <div class="mb-8">
      <TrashGraph />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="font-bold text-lg mb-4 text-gray-800">Customers</h3>
        <div class="flex justify-center items-center h-48 relative">
          <div
            class="w-32 h-32 rounded-full border-12 border-gray-100 border-t-green-500 border-r-green-500 transform rotate-45 transition-all hover:scale-105"
          ></div>
        </div>
        <div class="flex justify-between mt-4 px-4">
          <div>
            <p class="text-xl font-bold text-gray-800">34,249</p>
            <div class="flex items-center text-xs text-gray-500 mt-1">
              <div class="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              New
            </div>
          </div>
          <div>
            <p class="text-xl font-bold text-gray-800">1420</p>
            <div class="flex items-center text-xs text-gray-500 mt-1">
              <div class="w-2 h-2 rounded-full bg-gray-200 mr-2"></div>
              Repeated
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="font-bold text-lg mb-4 text-gray-800">Trash Analysis</h3>
        <div class="h-48 flex items-end justify-between px-2 gap-2 relative">
          <div class="absolute bottom-8 left-0 right-0 h-1 bg-gray-100"></div>
          <div class="absolute bottom-16 left-0 right-0 h-1 bg-gray-100"></div>

          <div class="w-full h-full relative overflow-hidden">
            <svg
              viewBox="0 0 100 50"
              class="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 C20,40 40,10 60,30 S80,20 100,0"
                fill="none"
                stroke="#4CAF50"
                stroke-width="2"
              />
              <path
                d="M0,50 C20,45 40,20 60,40 S80,30 100,10"
                fill="none"
                stroke="#3B82F6"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-2 px-2 font-medium">
          <span>2015</span><span>2016</span><span>2017</span><span>2018</span><span>2019</span>
        </div>
      </div>

      <div
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative flex flex-col items-center"
      >
        <div class="w-full flex justify-between items-center mb-6">
          <h3 class="font-bold text-lg text-gray-800">Featured Product</h3>
        </div>

        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-50 p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ChevronLeft :size="18" />
        </button>
        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-50 p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ChevronRight :size="18" />
        </button>

        <div class="mb-6 mt-4">
          <div class="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <Box class="text-blue-500 w-12 h-12" />
          </div>
        </div>
        <h4 class="font-bold text-gray-800 text-lg">Smart Bin</h4>
        <p class="text-blue-500 font-bold mt-1">$89.00</p>
      </div>
    </div>
  </SuperAdminLayout>
</template>
