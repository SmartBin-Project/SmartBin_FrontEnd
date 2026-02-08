<template>
  <div class="bg-white min-h-screen pt-12">
    <div class="text-center mb-16 px-6">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">{{ t('ui.about_title') }}</h1>
      <p class="text-gray-500 font-medium">{{ t('ui.about_subtitle') }}</p>
    </div>

    <div class="max-w-7xl mx-auto px-6 mb-24">
      <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        <div class="w-full lg:w-1/2">
          <div
            class="relative rounded-[20px] sm:rounded-[30px] lg:rounded-[40px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-64 sm:h-80 md:h-96 lg:h-100 group"
          >
            <img
              :src="SmartBin_Banner"
              alt="Clean City"
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <!-- <div
              class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8"
            >
              <p class="text-white font-bold text-lg">{{ t('ui.about_mission_subtitle') }}</p>
            </div> -->
          </div>
        </div>

        <div class="w-full lg:w-1/2 text-left">
          <div
            class="inline-block px-4 py-2 bg-green-50 rounded-full text-[#68a357] font-black text-xs uppercase tracking-widest mb-6"
          >
            {{ t('ui.about_mission') }}
          </div>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            {{ t('ui.about_mission_title') }}
          </h2>
          <p class="text-gray-500 leading-relaxed mb-8">
            {{ t('ui.about_mission_desc') }}
          </p>

          <div class="flex items-center gap-4 pt-6 border-t border-gray-100">
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://gic.itc.edu.kh/img/logo.png" alt="ITC Logo" />
            </div>
            <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <img src="https://ric.itc.edu.kh/sd14/images/itc_logo.png" alt="RIC Logo" />
            </div>
            <div>
              <p class="text-gray-900 font-bold text-sm">GIC-STUDENT 26</p>
              <p class="text-gray-400 text-xs">Institute of Technology of Cambodia</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-24">
      <div
        class="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-left relative overflow-hidden"
      >
        <div
          class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-[#68a357]"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            ></path>
          </svg>
        </div>

        <h2 class="text-2xl font-black text-gray-900 mb-2">{{ t('ui.about_what_title') }}</h2>
        <p class="text-[#68a357] text-xs font-bold uppercase tracking-widest mb-6">
          {{ t('ui.about_what_subtitle') }}
        </p>
        <p class="text-gray-500 leading-relaxed text-sm">
          {{ t('ui.about_what_desc') }}
        </p>
      </div>

      <div
        class="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-left relative overflow-hidden"
      >
        <div
          class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-[#68a357]"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
          </svg>
        </div>

        <h2 class="text-2xl font-black text-gray-900 mb-6">{{ t('ui.about_special_title') }}</h2>
        <ul class="space-y-4">
          <li
            v-for="(item, index) in specialties"
            :key="index"
            class="flex items-start text-sm text-gray-500 font-medium"
          >
            <span class="mr-3 text-gray-900 font-black">{{ index + 1 }}.</span>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div ref="statsSection" class="w-full mx-auto px-6 mb-24">
      <div class="bg-[#68a357] rounded-[40px] p-12 text-white shadow-xl relative overflow-hidden">
        <div
          class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"
        ></div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div v-for="(stat, index) in statsData" :key="index">
            <div class="text-4xl md:text-5xl font-black mb-2 tabular-nums">
              {{ Math.round(currentStats[index] as number) }}{{ stat.suffix }}
            </div>
            <div class="text-sm md:text-base font-medium opacity-80 uppercase tracking-wide">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-16 pb-24">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-10">
          {{ t('ui.about_trusted_title') }}
        </p>
        <div
          class="flex flex-wrap justify-center items-center gap-8 md:gap-16 transition-all duration-500"
        >
          <img src="https://moe.gov.kh/wp-content/uploads/2019/05/cropped-ic-moe-logo.png" alt="" />
        </div>
      </div>
    </div>

    <div class="w-full bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 pb-24 text-center">
        <h2 class="text-4xl font-black text-gray-900 mb-16 pt-24">
          {{ t('ui.about_team_title') }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in team" :key="member.id" class="group">
            <div
              class="bg-white rounded-[40px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 transition-all hover:-translate-y-2"
            >
              <div class="mb-6 overflow-hidden rounded-[30px]">
                <img
                  :src="member.image"
                  alt="Team Member"
                  class="w-full h-64 object-cover transform group-hover:scale-110 transition-duration-500"
                />
              </div>
              <h3 class="text-xl font-black text-gray-900 mb-1">{{ member.name }}</h3>
              <p class="text-gray-400 text-xs font-bold mb-6">{{ member.email }}</p>
              <button
                class="w-full py-3 rounded-2xl border border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a :href="member.telegram" target="_blank" rel="noopener noreferrer">
                  <span>{{ t('ui.about_message_btn') }}</span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Khun from '@/assets/images/khun.jpg'
import Lyhor from '@/assets/images/Lyhor.jpg'
import Kity from '@/assets/images/Kity.jpg'
import Seyha from '@/assets/images/Seyha.jpg'
import Phath from '@/assets/images/Phath.jpg'
import SmartBin_Banner from '@/assets/images/SmartBin_Banner.png'
import type { Bin } from '@/types/bin'
import { getAllBinsPublic } from '@/services/binService'

const { t } = useI18n()

const specialties = computed(() => [
  t('ui.about_spec_1'),
  t('ui.about_spec_2'),
  t('ui.about_spec_3'),
  t('ui.about_spec_4'),
  t('ui.about_spec_5'),
])

const smartbin = ref(0)

onMounted(async () => {
  try {
    const bins: Bin[] = await getAllBinsPublic()
    smartbin.value = bins.length
  } catch (error) {
    console.error('Failed to fetch bins:', error)
    smartbin.value = 0
  }
})

const statsSection = ref(null)
const currentStats = ref([0, 0, 0, 0])
const statsData = computed(() => [
  { target: 50, suffix: '+', label: 'Cities Covered' },
  { target: smartbin.value, suffix: '+', label: 'Smart Bins' },
  { target: 30, suffix: '%', label: 'Cost Reduced' },
  { target: 24, suffix: '/7', label: 'Monitoring' },
])

const setupStatsAnimation = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const duration = 2000
          const frameDuration = 1000 / 60
          const totalFrames = Math.round(duration / frameDuration)

          statsData.value.forEach((stat, index) => {
            let frame = 0
            const counter = setInterval(() => {
              frame++

              const progress = frame / totalFrames
              const easeOut = 1 - Math.pow(1 - progress, 3)

              currentStats.value[index] = stat.target * easeOut

              if (frame === totalFrames) {
                currentStats.value[index] = stat.target
                clearInterval(counter)
              }
            }, frameDuration)
          })

          if (entry.target) observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  if (statsSection.value) {
    observer.observe(statsSection.value)
  }
}

onMounted(async () => {
  try {
    const bins: Bin[] = await getAllBinsPublic()
    smartbin.value = bins.length
  } catch (error) {
    console.error('Failed to fetch bins:', error)
    smartbin.value = 0
  }

  // Setup stats animation after data is loaded
  setupStatsAnimation()
})

// Team Logic
const team = [
  {
    id: 1,
    name: 'Luy Lyhor',
    email: 'luylyhor28@gmail.com',
    image: Lyhor,
    telegram: 'https://t.me/Bonjourhorhor',
  },
  {
    id: 2,
    name: 'Lim Kity',
    email: 'kitylim123@gmail.com',
    image: Kity,
    telegram: 'https://t.me/Je_suis_Tyy',
  },
  {
    id: 3,
    name: 'Cheang Seyha',
    email: 'cheangseyha2208@gmail.com',
    image: Seyha,
    telegram: 'https://t.me/AxgusTC',
  },
  {
    id: 4,
    name: 'Phorn Sophath',
    email: 'sophathphorn04gmail.com',
    image: Phath,
    telegram: 'https://t.me/P_phath',
  },
  {
    id: 5,
    name: 'Lim Heangkhun',
    email: 'lhveng@gmail.com',
    image: Khun,
    telegram: 'https://t.me/heangkhunnnnn',
  },
]
</script>
