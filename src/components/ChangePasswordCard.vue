<script setup>
import { Eye, EyeOff, HelpCircle } from 'lucide-vue-next';
import { ref } from 'vue';

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-lg text-gray-800">Change Password</h3>
      <a href="#" class="text-blue-500 text-xs flex items-center hover:underline">
        Need help <HelpCircle :size="12" class="ml-1" />
      </a>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <div class="relative">
          <input 
            :type="showCurrent ? 'text' : 'password'" 
            placeholder="Enter password"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-colors"
          />
          <button @click="showCurrent = !showCurrent" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            <component :is="showCurrent ? Eye : EyeOff" :size="18" />
          </button>
        </div>
        <a href="#" class="text-blue-500 text-xs mt-1 inline-block hover:underline">Forgot Current Password? Click here</a>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div class="relative">
          <input 
            :type="showNew ? 'text' : 'password'" 
            placeholder="Enter password"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <button @click="showNew = !showNew" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            <component :is="showNew ? Eye : EyeOff" :size="18" />
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Re-enter Password</label>
        <div class="relative">
          <input 
            :type="showConfirm ? 'text' : 'password'" 
            placeholder="Enter password"
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500"
          />
          <button @click="showConfirm = !showConfirm" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
            <component :is="showConfirm ? Eye : EyeOff" :size="18" />
          </button>
        </div>
      </div>

      <button class="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors">
        Save Change
      </button>
    </div>
  </div>
</template>