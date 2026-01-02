<template>
  <div class="relative w-full h-[calc(100vh-70px)] bg-[#f1f5f9] overflow-hidden font-sans text-left">
    
    <transition name="slide-down">
      <div v-if="activeBinId" class="absolute top-8 left-1/2 -translate-x-1/2 z-2000 w-[90%] max-w-md">
        <div class="bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-4xl p-5 border border-white flex items-center justify-between">
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
      <div v-if="showArrival" class="absolute inset-0 z-3000 flex items-center justify-center bg-gray-900/40 backdrop-blur-md px-6">
        <div class="bg-white p-10 rounded-[48px] shadow-2xl text-center max-w-sm w-full border border-white">
          <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 class="text-3xl font-black text-gray-900 mb-2">Arrived!</h2>
          <p class="text-gray-500 font-medium mb-8 text-lg">Waste collection point reached.</p>
          <button @click="showArrival = false" class="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all">Dismiss</button>
        </div>
      </div>
    </transition>

    <l-map ref="leafletMap" v-model:zoom="zoom" :center="mapCenter" :use-global-leaflet="true" class="z-0" @dragstart="isFollowingUser = false">
      <l-tile-layer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="userIcon" />
      <l-marker v-for="bin in filteredBins" :key="bin._id" :lat-lng="[bin.location.lat, bin.location.lng]" :icon="createBinIcon(bin)" @click="handleBinClick(bin)" />
    </l-map>

    <div v-show="!activeBinId" class="absolute bottom-8 left-0 w-fit z-1000 px-4 overflow-x-auto no-scrollbar">
      <div v-if="filteredBins.length > 0" class="flex space-x-4 pb-4">
        <div v-for="bin in filteredBins" :key="bin._id" @click="handleBinClick(bin)" class="min-w-[280px] bg-white/90 backdrop-blur-xl rounded-4xl p-4 shadow-lg border border-white group transition-all duration-300 hover:-translate-y-1">
          <div class="flex justify-between items-start mb-4">
            <div :class="bin.fillLevel > 80 ? 'bg-red-500 shadow-red-200' : 'bg-green-500 shadow-green-200'" class="p-3 rounded-xl text-white shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <span :class="bin.fillLevel > 80 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'" class="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
              {{ bin.fillLevel > 80 ? 'Urgent' : 'Available' }}
            </span>
          </div>
          <div class="mb-4">
            <h3 class="text-xl font-bold text-gray-900">{{ bin.binCode }}</h3>
            <!-- <p class="text-gray-500 text-xs uppercase font-semibold tracking-tight">{{ bin.address }}</p> -->
          </div>
          <div class="space-y-2 mb-5">
            <div class="flex justify-between text-[10px] font-bold uppercase text-gray-500 tracking-wider">
              <span>Load</span>
              <span :class="bin.fillLevel > 80 ? 'text-red-500' : 'text-gray-800'">{{ bin.fillLevel }}%</span>
            </div>
            <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full transition-all duration-1000" :style="{ width: bin.fillLevel + '%', backgroundColor: bin.fillLevel > 80 ? '#ef4444' : '#10b981' }"></div>
            </div>
          </div>
          <button @click.stop="startNavigationToBin(bin)" class="w-full bg-gray-900 text-white py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all">
            Directions
          </button>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-xl rounded-4xl max-w-xs mx-auto shadow-lg border border-white animate-in fade-in zoom-in duration-300">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">🔎</div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">No Results</h3>
        <p class="text-gray-500 text-center text-sm font-medium">No bins found for "<span class="text-[#68a357] font-semibold">{{ props.searchText }}</span>".</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import { getAllBins } from '@/services/binService';
import type { Bin } from '@/types/Bin';

// Receive Search Text from Parent
const props = defineProps<{
  searchText: string
}>()

// ==========================================
// 🛠️ BACKEND & DATA
// ==========================================
const bins = ref<Bin[]>([]);
const isLoading = ref(true);

// FILTER ENGINE: Connects Search Bar to the UI
const filteredBins = computed(() => {
  const query = props.searchText.toLowerCase().trim();
  if (!query) return bins.value;
  return bins.value.filter(bin => 
    bin.binCode.toLowerCase().includes(query) 
    // bin.address.toLowerCase().includes(query)
  );
});

// AUTO-ZOOM: Glide map to first result when typing
watch(() => props.searchText, (newVal) => {
  if (newVal && filteredBins.value.length > 0) {
    const firstMatch = filteredBins.value[0];
    leafletMap.value?.leafletObject.flyTo([firstMatch?.location.lat, firstMatch?.location.lng], 17);
  }
});

const fetchBins = async () => {
  isLoading.value = true;
  bins.value = await getAllBins();
  isLoading.value = false;
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
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  const handleLocationError = (error: GeolocationPositionError) => {
    let message = "Error getting your location: ";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message += "You denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        message += "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        message += "The request to get user location timed out.";
        break;
      default:
        message += "An unknown error occurred.";
        break;
    }
    alert(message);
    console.error(message, error);
  };

  if (watchId) navigator.geolocation.clearWatch(watchId);

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      userLocation.value = [latitude, longitude];
      if (isFollowingUser.value && !activeBinId.value) {
        mapCenter.value = [latitude, longitude];
      }

      if (activeBinId.value) {
        const bin = bins.value.find(b => b.id === activeBinId.value);
        if (bin) {
          const dist = L.latLng(latitude, longitude).distanceTo(L.latLng(bin.lat, bin.lng));
          distanceRemaining.value = Math.round(dist) + ' m';
          if (dist < 15) handleArrival();
        }
      }
    }, 
    handleLocationError, 
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

const startNavigationToBin = (bin: Bin) => {
  if (!userLocation.value) {
    alert("Still trying to find your location. Please wait a moment and try again.");
    trackUserLocation(); // Re-trigger location tracking
    return;
  }
  
  activeBinId.value = bin._id;
  isFollowingUser.value = true;
  navigationColor.value = bin.fillLevel > 80 ? '#ef4444' : '#10b981';

  import('leaflet-routing-machine').then(() => {
    const map = leafletMap.value.leafletObject;
    if (routingControl) map.removeControl(routingControl);
    routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(userLocation.value!), L.latLng(bin.location.lat, bin.location.lng)],
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

onMounted(async () => {
  trackUserLocation();
  if (!document.getElementById('routing-css')) {
    const link = document.createElement('link');
    link.id = 'routing-css'; link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css';
    document.head.appendChild(link);
  }
  await fetchBins();
  backendInterval = setInterval(fetchBins, 30000);
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

const createBinIcon = (bin: Bin) => {
  const color = bin.fillLevel > 80 ? '#ef4444' : '#10b981';
  return L.divIcon({ 
    html: `<div style="border: 3px solid ${color};" class="bg-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-5 h-5" style="color: ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>`,
    className: 'custom-bin-icon',
    iconSize: [40, 40]
  });
};

const handleBinClick = (bin: Bin) => {
  isFollowingUser.value = false;
  leafletMap.value?.leafletObject.flyTo([bin.location.lat, bin.location.lng], 18);
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