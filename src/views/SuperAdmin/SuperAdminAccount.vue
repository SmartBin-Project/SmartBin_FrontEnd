<script setup>
import SuperAdminLayout from '@/components/layout/SuperAdminLayout.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import ChangePasswordCard from '@/components/ChangePasswordCard.vue'
import ProfileUpdateForm from '@/components/ProfileUpdateForm.vue'
</script>

<template>
  <SuperAdminLayout title="User Profile">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="w-full lg:w-1/3 flex flex-col">
        <ProfileCard />
        <ChangePasswordCard />
      </div>

      <div class="w-full lg:w-2/3">
        <ProfileUpdateForm />
      </div>
    </div>
  </SuperAdminLayout>
</template>
