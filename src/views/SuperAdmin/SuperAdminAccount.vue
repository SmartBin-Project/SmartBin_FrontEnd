<script setup>
import ProfileCard from '@/components/ProfileCard.vue';
import ChangePasswordCard from '@/components/ChangePasswordCard.vue';
import ProfileUpdateForm from '@/components/ProfileUpdateForm.vue';
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>

    <div class="flex flex-col lg:flex-row gap-6">
      
      <div class="w-full lg:w-1/3 flex flex-col">
        <ProfileCard />
        <ChangePasswordCard />
      </div>

      <div class="w-full lg:w-2/3">
        <ProfileUpdateForm />
      </div>

    </div>
  </div>
</template>