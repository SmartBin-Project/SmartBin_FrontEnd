<script setup>
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import SmartBinForm from '@/components/SmartBinForm.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <SuperAdminLayout :title="t('ui.add_smartbin')">
    <SmartBinForm />
  </SuperAdminLayout>
</template>
