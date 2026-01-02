<template>
  <div class="w-full h-full">
    <div class="flex justify-center">
      <BinMap :searchText="searchText" />
    </div>
  </div>
</template>

<script setup>
import BinMap from '@/components/layout/BinMap.vue';

// Define the prop coming from the Router (App.vue -> Router -> HomePage)
defineProps({
  searchText: {
    type: String,
    default: ''
  }
});
</script>