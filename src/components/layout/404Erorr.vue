<script setup lang="ts"></script>
<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-6xl font-bold text-red-500">404</h1>
    <p class="text-xl mt-4">Unauthorized Access</p>
    <p class="text-gray-500 mt-2">You do not have permission to view this page.</p>
    <router-link to="/" class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
      Back to Home
    </router-link>
  </div>
</template>
