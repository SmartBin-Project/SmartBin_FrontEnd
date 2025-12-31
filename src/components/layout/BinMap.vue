<template>
  <div class="relative w-full h-[calc(100vh-70px)] bg-[#f1f5f9] overflow-hidden font-sans text-left">
    
    <transition name="slide-down">
      <div v-if="activeBinId" class="absolute top-8 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-md">
        <div class="bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-[32px] p-5 border border-white flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div :style="{ backgroundColor: navigationColor }" class="p-4 rounded-2xl text-white shadow-lg animate-pulse">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] leading-none mb-1">
                {{ navigationColor === '#ef4444' ? 'Urgent Collection' : 'Live Tracking' }}
              </p>
              <p class="text-2xl font-black text-gray-900 tabular-nums leading-none">{{ distanceRemaining }}</p>
            </div>
          </div>
          <button @click="stopNavigation" class="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-600 transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>
    </transition>

    <transition name="pop">
      <div v-if="showArrival" class="absolute inset-0 z-[3000] flex items-center justify-center bg-gray-900/40 backdrop-blur-md px-6">
        <div class="bg-white p-10 rounded-[48px] shadow-2xl text-center max-w-sm w-full border border-white">
          <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-3xl font-black text-gray-900 mb-2">Arrived!</h2>
          <p class="text-gray-500 font-medium mb-8 text-lg">Waste collection point reached.</p>
          <button @click="showArrival = false" class="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all">Dismiss</button>
        </div>
      </div>
    </transition>

    <l-map ref="leafletMap" v-model:zoom="zoom" :center="mapCenter" :use-global-leaflet="true" class="z-0" @dragstart="isFollowingUser = false">
      <l-tile-layer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="userIcon" />
      <l-marker v-for="bin in filteredBins" :key="bin.id" :lat-lng="[bin.lat, bin.lng]" :icon="createBinIcon(bin)" @click="handleBinClick(bin)" />
    </l-map>

    <div v-show="!activeBinId" class="absolute bottom-12 left-0 w-full z-[1000] px-6 overflow-x-auto no-scrollbar">
      <div v-if="filteredBins.length > 0" class="flex space-x-6 pb-4">
        <div v-for="bin in filteredBins" :key="bin.id" @click="handleBinClick(bin)" class="min-w-[340px] bg-white/90 backdrop-blur-xl rounded-[40px] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white group transition-all duration-500 hover:-translate-y-2">
          <div class="flex justify-between items-start mb-6">
            <div :class="bin.fill_level > 80 ? 'bg-red-500 shadow-red-200' : 'bg-green-500 shadow-green-200'" class="p-4 rounded-2xl text-white shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <span :class="bin.fill_level > 80 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{ bin.fill_level > 80 ? 'Urgent' : 'Available' }}
            </span>
          </div>
          <div class="mb-6">
            <h3 class="text-2xl font-black text-gray-900 mb-1">{{ bin.name }}</h3>
            <p class="text-gray-400 text-sm flex items-center uppercase font-bold tracking-tighter">{{ bin.address }}</p>
          </div>
          <div class="space-y-3 mb-8">
            <div class="flex justify-between text-[11px] font-black uppercase text-gray-500 tracking-widest">
              <span>Current Load</span>
              <span :class="bin.fill_level > 80 ? 'text-red-500' : 'text-gray-900'">{{ bin.fill_level }}% Full</span>
            </div>
            <div class="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full transition-all duration-1000" :style="{ width: bin.fill_level + '%', backgroundColor: bin.fill_level > 80 ? '#ef4444' : '#10b981' }"></div>
            </div>
          </div>
          <button @click.stop="startNavigationToBin(bin)" class="w-full bg-gray-900 text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
            Get Directions
          </button>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-xl rounded-[40px] max-w-sm mx-auto shadow-2xl border border-white animate-in fade-in zoom-in duration-300">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl">🔎</div>
        <h3 class="text-2xl font-black text-gray-900 mb-2 leading-none">No Results</h3>
        <p class="text-gray-500 text-center font-medium leading-tight">No bins found matching "<span class="text-[#68a357] font-bold">{{ props.searchText }}</span>".</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"

// Receive Search Text from Parent
const props = defineProps<{
  searchText: string
}>()

// ==========================================
// 🛠️ BACKEND & DATA
// ==========================================
const isDemoMode = ref(true); // Toggle to false for real data
const API_URL = 'https://your-backend-api.com/api/bins';
const bins = ref<any[]>([
  { id: 1, name: 'BKK1 Zone A', lat: 11.5521, lng: 104.9282, fill_level: 95, address: 'St. 310' },
  { id: 2, name: 'Olympic Park', lat: 11.5584, lng: 104.9123, fill_level: 42, address: 'St. 271' },
  { id: 3, name: 'Riverside Hub', lat: 11.5714, lng: 104.9285, fill_level: 15, address: 'St. 13' }
]);

// FILTER ENGINE: Connects Search Bar to the UI
const filteredBins = computed(() => {
  const query = props.searchText.toLowerCase().trim();
  if (!query) return bins.value;
  return bins.value.filter(bin => 
    bin.name.toLowerCase().includes(query) || 
    bin.address.toLowerCase().includes(query)
  );
});

// AUTO-ZOOM: Glide map to first result when typing
watch(() => props.searchText, (newVal) => {
  if (newVal && filteredBins.value.length > 0) {
    const firstMatch = filteredBins.value[0];
    leafletMap.value?.leafletObject.flyTo([firstMatch.lat, firstMatch.lng], 17);
  }
});

const fetchBinsFromBackend = async () => {
  if (isDemoMode.value) return;
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    bins.value = data.map((item: any) => ({
      id: item.id,
      name: item.bin_name,        
      lat: item.lat_coord,       
      lng: item.lng_coord,       
      fill_level: item.fill_pct, 
      address: item.location_str  
    }));
  } catch (error) { console.error("Sync Error:", error); }
};

// ==========================================
// 📍 MAP & NAVIGATION LOGIC
// ==========================================
const zoom = ref(15)
const mapCenter = ref<[number, number]>([11.5564, 104.9282])
const leafletMap = ref<any>(null)
const activeBinId = ref<number | null>(null)
const userLocation = ref<[number, number] | null>(null)
const distanceRemaining = ref('0 m')
const isFollowingUser = ref(true)
const showArrival = ref(false)
const navigationColor = ref('#10b981')
let routingControl: any = null
let watchId: number | null = null
let backendInterval: any = null;

const trackUserLocation = () => {
  if (!navigator.geolocation) return;
  watchId = navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    userLocation.value = [latitude, longitude];
    if (isFollowingUser.value && !activeBinId.value) mapCenter.value = [latitude, longitude];

    if (activeBinId.value) {
      const bin = bins.value.find(b => b.id === activeBinId.value);
      if (bin) {
        const dist = L.latLng(latitude, longitude).distanceTo(L.latLng(bin.lat, bin.lng));
        distanceRemaining.value = Math.round(dist) + ' m';
        if (dist < 15) handleArrival();
      }
    }
  }, null, { enableHighAccuracy: true });
};

const startNavigationToBin = (bin: any) => {
  activeBinId.value = bin.id;
  isFollowingUser.value = true;
  navigationColor.value = bin.fill_level > 80 ? '#ef4444' : '#10b981';
  if (!userLocation.value) return;

  import('leaflet-routing-machine').then(() => {
    const map = leafletMap.value.leafletObject;
    if (routingControl) map.removeControl(routingControl);
    routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(userLocation.value!), L.latLng(bin.lat, bin.lng)],
      createMarker: () => null,
      show: false,
      lineOptions: { styles: [{ color: navigationColor.value, weight: 10, opacity: 0.7 }] }
    }).addTo(map);
  });
};

const stopNavigation = () => {
  activeBinId.value = null;
  if (routingControl) {
    leafletMap.value.leafletObject.removeControl(routingControl);
    routingControl = null;
  }
};

const handleArrival = () => {
  showArrival.value = true;
  stopNavigation();
};

onMounted(() => {
  trackUserLocation();
  if (!document.getElementById('routing-css')) {
    const link = document.createElement('link');
    link.id = 'routing-css'; link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
    document.head.appendChild(link);
  }
  if (!isDemoMode.value) {
    fetchBinsFromBackend(); 
    backendInterval = setInterval(fetchBinsFromBackend, 30000);
  }
});

onUnmounted(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
  if (backendInterval) clearInterval(backendInterval);
});

// ==========================================
// 🎨 CUSTOM ICONS
// ==========================================
const userIcon = L.divIcon({
  className: 'user-marker-container',
  html: '<div class="user-pulse"></div><div class="user-dot"></div>',
  iconSize: [20, 20]
});

const createBinIcon = (bin: any) => {
  const color = bin.fill_level > 80 ? '#ef4444' : '#10b981';
  return L.divIcon({ 
    html: `<div style="border: 3px solid ${color};" class="bg-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-5 h-5" style="color: ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>`,
    className: 'custom-bin-icon',
    iconSize: [40, 40]
  });
};

const handleBinClick = (bin: any) => {
  isFollowingUser.value = false;
  leafletMap.value?.leafletObject.flyTo([bin.lat, bin.lng], 18);
};
</script>

<style>
.no-scrollbar::-webkit-scrollbar { display: none; }
.user-marker-container { display: flex; align-items: center; justify-content: center; }
.user-dot { width: 14px; height: 14px; background: #1a73e8; border: 2.5px solid white; border-radius: 50%; z-index: 10; position: relative; }
.user-pulse { position: absolute; width: 44px; height: 44px; background: rgba(26, 115, 232, 0.25); border-radius: 50%; animation: pulse-anim 2s infinite; }
@keyframes pulse-anim { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
.leaflet-routing-container { display: none !important; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translate(-50%, -40px); }
.pop-enter-active { animation: pop-in 0.5s cubic-bezier(0.17, 0.88, 0.32, 1.27); }
@keyframes pop-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
</style>