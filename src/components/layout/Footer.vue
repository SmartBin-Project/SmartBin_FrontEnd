<template>
  <footer class="bg-[#c2d9b6] pt-20 pb-10">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 text-left">
        
        <div class="space-y-6">
          <div class="flex items-center space-x-2">
            <img :src="Logo" alt="SmartBin" class="h-10" />
          </div>
          <p class="text-[#2c4c23] font-semibold leading-relaxed">
            {{ t('ui.footer_desc') }}
          </p>
          <div class="flex space-x-4 pt-4">
            <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" class="w-10 h-10 border-2 border-white/40 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <component :is="link.icon" class="w-6 h-6" />
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-gray-900 font-black text-xl mb-8">{{ t('ui.footer_quick_links') }}</h4>
          <ul class="space-y-4 text-[#2c4c23] font-bold">
            <li><router-link to="/service">{{ t('ui.footer_features') }}</router-link></li>
            <li><router-link to="/aboutus">{{ t('ui.nav_about') }}</router-link></li>
            <li><a href="#">{{ t('ui.footer_report') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-gray-900 font-black text-xl mb-8">{{ t('ui.footer_contact') }}</h4>
          <ul class="space-y-6 text-[#2c4c23] font-bold">
            <li class="flex items-center space-x-4">
              <span class="w-6"><mail/> </span>
              <span>info@greenprofitcambodia.org</span>
            </li>
            <li class="flex items-center space-x-4">
              <span class="w-6"><phone/> </span>
              <span>+855 12 345 678</span>
            </li>
            <li class="flex items-center space-x-4">
              <span class="w-6"><map-pinned/> </span>
              <span>{{ t('ui.footer_location') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-[#2c4c23]/10 pt-10 text-center">
        <p class="text-[#2c4c23]/60 text-sm font-bold uppercase tracking-widest">
          {{ t('ui.footer_rights') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

import Logo from '@/assets/images/logo.png'
import { Facebook, Instagram, Mail, MapPinned, Phone, Twitter } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const socialLinks = computed(() => [
  { icon: Facebook, url: '#' },
  { icon: Instagram, url: '#' },
  { icon: Twitter, url: '#' },
])

</script>