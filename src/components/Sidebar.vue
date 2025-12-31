<script setup>
import { 
  LayoutDashboard, MapPin, Users, UserPlus, 
  Trash2, Settings, LogOut, Trash 
} from 'lucide-vue-next';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Bin Location', icon: MapPin, active: false },
  { name: 'Customer', icon: Users, active: false },
  { name: 'Add Customer', icon: UserPlus, active: false },
  { name: 'Add SmartBin', icon: Trash2, active: false },
  { name: 'Settings', icon: Settings, active: false },
];
</script>

<template>
  <aside class="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between z-20">
    <div>
      <div class="h-24 flex items-center px-8">
        <div class="bg-green-600 p-1.5 rounded-lg mr-3">
            <Trash class="text-white w-6 h-6" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">SmartBin</h1>
      </div>

      <nav class="mt-4 px-4 space-y-2">
        <a 
          v-for="item in menuItems" 
          :key="item.name" 
          href="#"
          :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200',
            item.active 
              ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-green-600'
          ]"
        >
          <component :is="item.icon" :size="20" class="mr-3" />
          <span class="font-medium text-sm">{{ item.name }}</span>
        </a>
      </nav>
    </div>

    <div class="p-4 mb-4">
      <button class="w-full flex items-center px-4 py-3 text-gray-400 hover:text-red-500 transition-colors">
        <LogOut :size="20" class="mr-3" />
        <span class="font-medium text-sm">Logout</span>
      </button>
    </div>
  </aside>
</template>