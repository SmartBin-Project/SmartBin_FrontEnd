<template>
  <footer class="bg-white">
    <div class="max-w-7xl mx-auto px-6 border-t border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-left mt-10">
        <div class="space-y-6">
          <div class="flex items-center space-x-2">
            <img :src="Logo" alt="SmartBin" class="h-14" />
          </div>
          <p class="text-gray-500 font-medium leading-relaxed">
            {{ t('ui.footer_desc') }}
          </p>
          <div class="flex space-x-4 pt-4">
            <a
              v-for="(link, index) in socialLinks"
              :key="index"
              :href="link.url"
              class="w-10 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#68a357] hover:border-[#68a357] transition-all"
            >
              <component :is="link.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-gray-900 font-black text-xl mb-8">{{ t('ui.footer_quick_links') }}</h4>
          <ul class="space-y-4 text-gray-600 font-bold">
            <li>
              <router-link to="/service" class="hover:text-[#68a357] transition-colors">{{
                t('ui.footer_features')
              }}</router-link>
            </li>
            <li>
              <router-link to="/aboutus" class="hover:text-[#68a357] transition-colors">{{
                t('ui.nav_about')
              }}</router-link>
            </li>
            <li>
              <a href="https://t.me/Bonjourhorhor" class="hover:text-[#68a357] transition-colors">{{
                t('ui.footer_report')
              }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-gray-900 font-black text-xl mb-8">{{ t('ui.footer_contact') }}</h4>
          <ul class="space-y-6 text-gray-600 font-bold">
            <li class="flex items-center space-x-4 group">
              <span class="w-6 text-[#68a357]"><mail /> </span>
              <span class="group-hover:text-[#68a357] transition-colors"
                >info@greenprofitcambodia.org</span
              >
            </li>
            <li class="flex items-center space-x-4 group">
              <span class="w-6 text-[#68a357]"><phone /> </span>
              <span class="group-hover:text-[#68a357] transition-colors">+855 67 466 006</span>
            </li>
            <li class="flex items-center space-x-4 group">
              <span class="w-6 text-[#68a357]"><map-pinned /> </span>
              <span class="group-hover:text-[#68a357] transition-colors">{{
                t('ui.footer_location')
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bg-[#68a357] pb-10 border-gray-200 pt-10 text-center">
      <p class="text-gray-100 text-sm font-bold uppercase tracking-widest">
        {{ t('ui.footer_rights') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Logo from '@/assets/images/logo.png'
import { Facebook, Instagram, Mail, MapPinned, Phone, Twitter } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const socialLinks = computed(() => [
  { icon: Facebook, url: '#' },
  { icon: Instagram, url: '#' },
  { icon: Twitter, url: '#' },
])
</script>
