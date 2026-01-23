<template>
  <div
    class="relative w-full h-[calc(100vh-70px)] bg-[#f1f5f9] overflow-hidden font-sans text-left"
  >
    <BinDetailPanel
      :bin="selectedBin"
      @close="selectedBin = null"
      @navigate="handleNavigateFromPanel"
    />

    <transition name="slide-down">
      <div
        v-if="activeBinId"
        class="absolute top-8 left-1/2 -translate-x-1/2 z-2000 w-[90%] max-w-md"
      >
        <div
          class="bg-white/90 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.12)] rounded-4xl p-5 border border-white flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <div
              :style="{ backgroundColor: navigationColor }"
              class="p-4 rounded-2xl text-white shadow-lg animate-pulse"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p
                class="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] leading-none mb-1"
              >
                {{
                  navigationColor === '#ef4444' ? t('ui.urgent_collection') : t('ui.live_tracking')
                }}
              </p>
              <p class="text-2xl font-black text-gray-900 tabular-nums leading-none">
                {{ distanceRemaining }}
              </p>
            </div>
          </div>
          <button
            @click="stopNavigation"
            class="bg-gray-100 p-3 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <transition name="pop">
      <div
        v-if="showArrival"
        class="absolute inset-0 z-3000 flex items-center justify-center bg-gray-900/40 backdrop-blur-md px-6"
      >
        <div
          class="bg-white p-10 rounded-[48px] shadow-2xl text-center max-w-sm w-full border border-white"
        >
          <div
            class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-black text-gray-900 mb-2">{{ t('ui.arrived') }}</h2>
          <p class="text-gray-500 font-medium mb-8 text-lg">{{ t('ui.waste_point_reached') }}</p>
          <button
            @click="showArrival = false"
            class="w-full bg-gray-900 text-white py-5 rounded-3xl font-black text-lg shadow-xl active:scale-95 transition-all"
          >
            {{ t('ui.dismiss') }}
          </button>
        </div>
      </div>
    </transition>

    <l-map
      ref="leafletMap"
      v-model:zoom="zoom"
      :center="mapCenter"
      :use-global-leaflet="true"
      class="z-0"
      @dragstart="isFollowingUser = false"
    >
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <l-marker v-if="userLocation" :lat-lng="userLocation" :icon="userIcon as any" />
      <l-marker
        v-for="bin in filteredBins"
        :key="`${bin._id}-${bin.fillLevel}`"
        :lat-lng="[bin.location.lat, bin.location.lng]"
        :icon="createBinIcon(bin) as any"
        @click="handleBinClick(bin)"
      />
    </l-map>

    <div
      v-show="!activeBinId"
      class="absolute bottom-8 left-0 w-full z-1000 px-4 overflow-x-auto no-scrollbar"
    >
      <div v-if="filteredBins.length > 0" class="flex space-x-3 pb-4">
        <div
          v-for="bin in filteredBins"
          :key="bin._id"
          @click="handleBinClick(bin)"
          class="min-w-60 backdrop-blur-sm bg-white/80 rounded-3xl p-3 shadow-lg border border-white group transition-all duration-300 hover:-translate-y-1"
        >
          <div class="flex justify-between items-start mb-3">
            <div
              :class="
                bin.fillLevel > 80 ? 'bg-red-500 shadow-red-200' : 'bg-green-500 shadow-green-200'
              "
              class="p-2.5 rounded-lg text-white shadow-md"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <span
              :class="
                bin.fillLevel > 80 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              "
              class="px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider"
            >
              {{ bin.fillLevel > 80 ? t('ui.urgent') : t('ui.available') }}
            </span>
          </div>
          <div class="mb-3 w-55">
            <h3 class="text-base font-bold text-gray-900 truncate">
              {{ translateDB(bin.area) }}
            </h3>
            <p class="text-gray-500 text-[11px] uppercase font-semibold tracking-tight">
              {{ bin.binCode }}
            </p>
          </div>
          <div class="space-y-1.5 mb-4">
            <div
              class="flex justify-between text-[9px] font-bold uppercase text-gray-500 tracking-wider"
            >
              <span>{{ t('ui.load') }}</span>
              <span :class="bin.fillLevel > 80 ? 'text-red-500' : 'text-gray-800'"
                >{{ bin.fillLevel }}%</span
              >
            </div>
            <div class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-1000"
                :style="{
                  width: bin.fillLevel + '%',
                  backgroundColor: bin.fillLevel > 80 ? '#ef4444' : '#10b981',
                }"
              ></div>
            </div>
          </div>
          <button
            @click.stop="startNavigationToBin(bin)"
            class="w-full bg-gray-900 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md active:scale-95 transition-all"
          >
            {{ t('ui.directions') }}
          </button>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-xl rounded-4xl max-w-xs mx-auto shadow-lg border border-white animate-in fade-in zoom-in duration-300"
      >
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl"
        >
          <Search class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ t('ui.no_results') }}</h3>
        <p class="text-gray-500 text-center text-sm font-medium">
          {{ t('ui.no_results_desc') }} "<span class="text-[#68a357] font-semibold">{{
            props.searchText
          }}</span
          >".
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getAllBins } from '@/services/binService'
import type { Bin } from '@/types/bin'
import { useBinStore } from '@/stores/binStore'
import { storeToRefs } from 'pinia'
import { Search } from 'lucide-vue-next'
import BinDetailPanel from './BinDetailPanel.vue'

// NEW: Import i18n hooks
import { useI18n } from 'vue-i18n'
import { useTranslation } from '@/composables/useTranslation'

const props = defineProps<{
  searchText: string
}>()

// Init Hooks
const { t } = useI18n()
const { translateDB } = useTranslation()
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const ORS_TOKEN = import.meta.env.VITE_ORS_TOKEN
const ORS_PROFILE = import.meta.env.VITE_ORS_PROFILE || 'driving-car'

const binStore = useBinStore()
const { bins } = storeToRefs(binStore)
const isLoading = ref(true)

// ==========================================
// 🛠️ FIX: Robust Search Filter
// ==========================================
const filteredBins = computed(() => {
  const query = props.searchText.toLowerCase().trim()
  if (!query) return bins.value

  return bins.value.filter((bin) => {
    // 1. Check if bin.area is an object (New Data)
    if (typeof bin.area === 'object' && bin.area !== null) {
      const enMatch = bin.area.en?.toLowerCase().includes(query)
      const khMatch = bin.area.kh?.toLowerCase().includes(query)
      return enMatch || khMatch
    }

    // 2. Check if bin.area is a string (Legacy Data)
    if (typeof bin.area === 'string') {
      return (bin.area as string).toLowerCase().includes(query)
    }

    return false
  })
})

const createOpenRouteServiceRouter = () => {
  if (!ORS_TOKEN) return null

  return {
    options: {},
    _pendingRequest: null as AbortController | null,
    route(waypoints: any[], cb: any, context?: any) {
      if (this._pendingRequest) this._pendingRequest.abort()

      const coords = waypoints.map((wp) => [wp?.latLng?.lng, wp?.latLng?.lat])
      const controller = new AbortController()
      this._pendingRequest = controller

      // Validate inputs before computing distances to avoid undefined crashes
      const hasValidCoords =
        coords.length >= 2 &&
        coords.every(
          (pair) =>
            Array.isArray(pair) &&
            typeof pair[0] === 'number' &&
            typeof pair[1] === 'number' &&
            Number.isFinite(pair[0]) &&
            Number.isFinite(pair[1]),
        )

      if (!hasValidCoords) {
        console.warn('Invalid waypoints provided to ORS; falling back to direct line')
        const straightDistanceFallback = L.latLng(waypoints[0].latLng).distanceTo(
          L.latLng(waypoints[1].latLng),
        )
        return this.createDirectRoute(waypoints, straightDistanceFallback, cb, context)
      }

      // Calculate straight-line distance for comparison
      if (!coords[0] || !coords[1]) {
        console.warn('Invalid coordinates for straight-line distance, skipping route calculation')
        return this.createDirectRoute(waypoints, 0, cb, context)
      }
      const start = L.latLng(coords[0][1], coords[0][0])
      const end = L.latLng(coords[1][1], coords[1][0])
      const straightDistance = start.distanceTo(end)

      fetch(`https://api.openrouteservice.org/v2/directions/${ORS_PROFILE}/geojson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ORS_TOKEN,
        },
        body: JSON.stringify({
          coordinates: coords,
          preference: 'shortest',
          geometry_simplify: false,
          continue_straight: false,
          elevation: false,
          instructions: false,
        }),
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) {
            console.warn('ORS routing failed, using direct line')
            throw new Error(`ORS API error: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          this._pendingRequest = null
          const features = Array.isArray(data?.features) ? data.features : []

          if (!features.length) {
            console.warn('ORS returned no routes, using direct line')
            return this.createDirectRoute(waypoints, straightDistance, cb, context)
          }

          const routes = features.map((feat: any) => {
            const geometryCoords = feat.geometry?.coordinates || []
            const summary = feat.properties?.summary || { distance: 0, duration: 0 }
            const latLngs = geometryCoords.map(([lng, lat]: [number, number]) => L.latLng(lat, lng))
            return {
              name: 'Route',
              coordinates: latLngs,
              summary: {
                totalDistance: summary.distance,
                totalTime: summary.duration,
              },
              waypoints,
              inputWaypoints: waypoints,
              instructions: [],
            }
          })

          // Sort by distance and pick shortest
          routes.sort((a: any, b: any) => a.summary.totalDistance - b.summary.totalDistance)
          const bestRoute = routes[0]

          // Only fall back to straight line if route is extremely long (>3x straight distance)
          // This ensures we use actual roads whenever possible
          if (bestRoute.summary.totalDistance > straightDistance * 3) {
            console.warn(
              `ORS route too long (${Math.round(bestRoute.summary.totalDistance)}m vs ${Math.round(straightDistance)}m direct), using direct line`,
            )
            return this.createDirectRoute(waypoints, straightDistance, cb, context)
          }

          console.log(
            `Using ORS route: ${Math.round(bestRoute.summary.totalDistance)}m (direct would be ${Math.round(straightDistance)}m)`,
          )
          cb.call(context || this, null, [bestRoute])
        })
        .catch((err) => {
          this._pendingRequest = null
          console.warn('ORS error, falling back to direct line:', err.message)
          this.createDirectRoute(waypoints, straightDistance, cb, context)
        })
    },
    createDirectRoute(waypoints: any[], distance: number, cb: any, context: any) {
      // Create a simple straight line route
      const latLngs = [waypoints[0].latLng, waypoints[1].latLng]
      cb.call(context || this, null, [
        {
          name: 'Direct Route',
          coordinates: latLngs,
          summary: {
            totalDistance: distance,
            totalTime: Math.round(distance / 1.4), // ~5 km/h walking speed
          },
          waypoints,
          inputWaypoints: waypoints,
          instructions: [],
        },
      ])
    },
  }
}

const createRouter = () => {
  if (MAPBOX_TOKEN) {
    return (L as any).Routing.mapbox(MAPBOX_TOKEN, {
      profile: 'mapbox/driving',
      alternatives: false,
      continue_straight: false,
      language: 'en',
    })
  }

  const orsRouter = createOpenRouteServiceRouter()
  if (orsRouter) return orsRouter

  return (L as any).Routing.osrmv1({
    serviceUrl: 'https://router.project-osrm.org/route/v1',
    profile: 'driving',
    useHints: false,
    suppressDemoServerWarning: true,
    alternatives: false,
  })
}

// ... (Rest of your script remains exactly the same: Watchers, Leaflet logic, etc.)
// Just ensure you keep the existing map logic below this line.

// AUTO-ZOOM
watch(
  () => props.searchText,
  (newVal) => {
    if (newVal && filteredBins.value.length > 0) {
      const firstMatch = filteredBins.value[0]
      leafletMap.value?.leafletObject.flyTo(
        [firstMatch?.location.lat, firstMatch?.location.lng],
        17,
      )
    }
  },
)

// MAP & NAVIGATION VARIABLES
const zoom = ref(15)
const mapCenter = ref<[number, number]>([11.5564, 104.9282])
const leafletMap = ref<any>(null)
const activeBinId = ref<string | null>(null) // Changed from number to string to match _id type
const selectedBin = ref<Bin | null>(null)
const userLocation = ref<[number, number] | null>(null)
const distanceRemaining = ref('0 m')
const isFollowingUser = ref(true)
const showArrival = ref(false)
const navigationColor = ref('#10b981')
let routingControl: any = null
let watchId: number | null = null
let backendInterval: any = null
const lastReroutePos = ref<[number, number] | null>(null)
let rerouteTimer: number | null = null
let updateRouteTimer: number | null = null

const trackUserLocation = () => {
  if (!navigator.geolocation) return
  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      userLocation.value = [latitude, longitude]
      if (isFollowingUser.value && !activeBinId.value) mapCenter.value = [latitude, longitude]

      if (activeBinId.value) {
        const bin = bins.value.find((b) => b._id === activeBinId.value)
        if (bin) {
          const dist = L.latLng(latitude, longitude).distanceTo(
            L.latLng(bin.location.lat, bin.location.lng),
          )
          distanceRemaining.value = Math.round(dist) + ' m'
          if (dist < 15) handleArrival()

          // Continuously update route to show remaining path (dynamic reduction)
          if (lastReroutePos.value) {
            const moved = L.latLng(latitude, longitude).distanceTo(
              L.latLng(lastReroutePos.value[0], lastReroutePos.value[1]),
            )
            
            // Update route every 5m of movement for smooth visual reduction
            if (moved > 5) {
              if (updateRouteTimer) window.clearTimeout(updateRouteTimer)
              updateRouteTimer = window.setTimeout(() => {
                const targetBin = bins.value.find((b) => b._id === activeBinId.value)
                if (targetBin && userLocation.value) {
                  lastReroutePos.value = userLocation.value
                  updateRouteFromCurrentPosition(targetBin)
                }
              }, 500) // Quick update for smooth visual feedback
            }
            
            // Full reroute if user deviates significantly (>30m off route)
            if (moved > 30) {
              if (rerouteTimer) window.clearTimeout(rerouteTimer)
              rerouteTimer = window.setTimeout(() => {
                const targetBin = bins.value.find((b) => b._id === activeBinId.value)
                if (targetBin && userLocation.value) {
                  lastReroutePos.value = userLocation.value
                  startNavigationToBin(targetBin)
                }
              }, 1500)
            }
          } else {
            lastReroutePos.value = [latitude, longitude]
          }
        }
      }
    },
    null,
    { enableHighAccuracy: true },
  )
}

const updateRouteFromCurrentPosition = (bin: Bin) => {
  if (!userLocation.value || !routingControl) return
  
  // Update the route to start from current position (reducing the polyline dynamically)
  routingControl.setWaypoints([
    L.latLng(userLocation.value[0], userLocation.value[1]),
    L.latLng(bin.location.lat, bin.location.lng),
  ])
}

const startNavigationToBin = (bin: Bin) => {
  if (!userLocation.value) {
    alert('Could not get your current location.')
    trackUserLocation()
    return
  }

  activeBinId.value = bin._id
  isFollowingUser.value = true
  navigationColor.value = bin.fillLevel > 80 ? '#ef4444' : '#10b981'
  lastReroutePos.value = userLocation.value

  import('leaflet-routing-machine').then(() => {
    const map = leafletMap.value.leafletObject
    if (routingControl) map.removeControl(routingControl)
    routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(userLocation.value!), L.latLng(bin.location.lat, bin.location.lng)],
      createMarker: () => null,
      show: false,
      routeWhileDragging: false,
      router: createRouter(),
      lineOptions: {
        styles: [{ color: navigationColor.value, weight: 10, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
    }).addTo(map)
  })
}

const stopNavigation = () => {
  activeBinId.value = null
  if (updateRouteTimer) window.clearTimeout(updateRouteTimer)
  if (rerouteTimer) window.clearTimeout(rerouteTimer)
  if (routingControl) {
    leafletMap.value.leafletObject.removeControl(routingControl)
    routingControl = null
  }
}

const handleNavigateFromPanel = (bin: Bin) => {
  selectedBin.value = null
  setTimeout(() => {
    startNavigationToBin(bin)
  }, 300)
}

const handleArrival = () => {
  showArrival.value = true
  stopNavigation()
}

onMounted(async () => {
  trackUserLocation()
  if (!document.getElementById('routing-css')) {
    const link = document.createElement('link')
    link.id = 'routing-css'
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css'
    document.head.appendChild(link)
  }
  binStore.getAllBinsPublic()
  binStore.initRealTimeUpdates()
  backendInterval = setInterval(() => binStore.getAllBinsPublic(), 30000)
})

onUnmounted(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId)
  if (backendInterval) clearInterval(backendInterval)
  binStore.stopRealTimeUpdates()
})

const userIcon = L.divIcon({
  className: 'user-marker-container',
  html: '<div class="user-pulse"></div><div class="user-dot"></div>',
  iconSize: [20, 20],
})

const createBinIcon = (bin: Bin) => {
  const color = bin.fillLevel > 80 ? '#ef4444' : '#10b981'
  return L.divIcon({
    html: `<div style="border: 3px solid ${color};" class="bg-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl">
            <svg class="w-5 h-5" style="color: ${color}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>`,
    className: 'custom-bin-icon',
    iconSize: [40, 40],
  })
}

const handleBinClick = (bin: Bin) => {
  selectedBin.value = bin
  isFollowingUser.value = false
  leafletMap.value?.leafletObject.flyTo([bin.location.lat, bin.location.lng], 18)
}
</script>

<style>
/* ... (Keep your existing styles) ... */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.user-marker-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-dot {
  width: 14px;
  height: 14px;
  background: #1a73e8;
  border: 2.5px solid white;
  border-radius: 50%;
  z-index: 10;
  position: relative;
}
.user-pulse {
  position: absolute;
  width: 44px;
  height: 44px;
  background: rgba(26, 115, 232, 0.25);
  border-radius: 50%;
  animation: pulse-anim 2s infinite;
}
@keyframes pulse-anim {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
.leaflet-routing-container {
  display: none !important;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -40px);
}
.pop-enter-active {
  animation: pop-in 0.5s cubic-bezier(0.17, 0.88, 0.32, 1.27);
}
@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
