# SmartBin Frontend - AI Agent Instructions

## Project Overview
SmartBin is a Vue 3 + TypeScript waste management system with map-based navigation for locating and servicing bins. The app supports multiple user roles (regular users, super admins) with role-specific dashboards and workflows.

## Tech Stack
- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build**: Vite + TypeScript 5.9
- **Styling**: Tailwind CSS 4.1 + custom utility classes
- **State Management**: Pinia (minimal usage - counter store only)
- **Mapping**: Leaflet + vue-leaflet, Mapbox GL, leaflet-routing-machine
- **HTTP**: Axios
- **Testing**: Vitest (unit), Playwright (e2e)
- **Type Checking**: vue-tsc (required for .vue imports)

**Important**: Use `npm run type-check` before builds to catch TypeScript errors in .vue files.

## Architecture & Key Components

### Directory Structure
```
src/
├── views/          # Page-level components organized by role
│   ├── User/       # Regular user pages (HomePage, ServicePage, AboutusPage)
│   ├── SuperAdmin/  # Admin dashboards (Dashboard, AddBin, ViewCustomer, etc.)
│   └── Auth/       # Authentication pages (SigninPage, SignupPage, ForgotPage)
├── components/layout/  # Shared layout components
│   ├── BinMap.vue      # Core map component with routing (Leaflet + routing-machine)
│   ├── Navigation.vue  # Top navbar with search bridge to RouterView
│   └── LoadingComponent.vue
├── router/index.ts     # Route definitions with lazy-loaded views
├── stores/             # Pinia state (minimal setup)
└── assets/             # CSS and images
```

### Data Flow Patterns
1. **Search Bridge**: `App.vue` captures search input from `Navigation.vue` via `@search` event, passes `searchText` prop to routed components via `RouterView` slot
2. **Route Props**: Routes with `props: true` pass params/data as component props (see `router/index.ts` line 20)
3. **Map Interaction**: `BinMap.vue` manages Leaflet markers, click handlers, and routing display
4. **State**: Currently minimal Pinia usage (counter.ts); expect API integration for bin/customer data

### Component Communication
- **Parent → Child**: Props (e.g., `:searchText` from App.vue to routed views)
- **Child → Parent**: Events (e.g., `@search` from Navigation.vue)
- **Cross-View**: Use Pinia stores (pattern: `export const useXxxStore = defineStore('xxx', () => {...})`)

## Critical Development Patterns

### Tailwind + Vue Integration
- Use `@apply` for reusable styles (not heavily used here; rely on inline utilities)
- Dynamic classes with `:class` and conditional bindings:
  ```vue
  <div :class="isFull ? 'bg-red-500' : 'bg-green-500'" class="fixed-classes">
  ```
- Reference: `Navigation.vue` (search input styling) and `BinMap.vue` (status indicator)

### Leaflet Map Setup
- **Critical**: Icons must be initialized in `main.ts` (lines 13-29) to work in Vite/TS environment
- Use `<l-map>`, `<l-tile-layer>`, `<l-marker>` from `@vue-leaflet/vue-leaflet`
- Custom icons created dynamically in component (e.g., `createBinIcon()` in BinMap.vue)
- Disable default user following on map drag: set `isFollowingUser = false`
- Leaflet routing uses `leaflet-routing-machine`; see `BinMap.vue` line ~150 for routing control setup
- Dynamic routing color based on bin status: `navigationColor.value = bin.fill_level > 80 ? '#ef4444' : '#34a853'`

### TypeScript in .vue Files
- Use `<script setup lang="ts">` (Composition API standard in this project)
- Vue imports: `import { ref, computed, onMounted } from 'vue'`
- Router: `import { useRouter, RouterView } from 'vue-router'`
- Leaflet: `import L from 'leaflet'` and `import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'`
- Props definition: `const props = defineProps({ searchText: { type: String, default: '' } })`
- Type annotations required for custom types (currently sparse; add as needed)

### Styling Conventions
- **Color scheme**: Green primary (`#34a853`, `#68a357`), gray neutrals, red for alerts/full bins
- **Spacing**: Tailwind defaults (4px base)
- **Rounded corners**: Heavy use of `rounded-2xl`, `rounded-[32px]`, `rounded-full`
- **Shadows**: `shadow-lg`, `shadow-2xl`, `shadow-green-100/200` for depth
- **Z-index**: Map `z-0`, modals `z-[1000]` to `z-[2000]`, navbar `z-50`
- **Transitions**: Use `transition-all`, `transition-colors` for smooth effects
- See `BinMap.vue` and `Navigation.vue` for extensive Tailwind patterns

## Workflow & Commands

| Task | Command |
|------|---------|
| **Dev** | `npm run dev` (Vite hot reload on http://localhost:5173) |
| **Type Check** | `npm run type-check` (required before builds) |
| **Build** | `npm run build` (runs type-check then vite build) |
| **Format** | `npm run format` (Prettier on src/) |
| **Tests (Unit)** | `npm run test:unit` (Vitest) |
| **Tests (E2E)** | `npm run test:e2e` (Playwright; install browsers first with `npx playwright install`) |
| **Preview Build** | `npm run preview` (local production preview) |

## Node/Package Requirements
- **Node**: 20.19.0+ or 22.12.0+
- **npm**: 10+
- Map dependencies (Mapbox GL) already installed; Leaflet icons require main.ts setup
- Tailwind CSS v4 configured via `@tailwindcss/vite` plugin

## Common Gotchas & Patterns

### Router Lazy Loading
Routes use dynamic imports: `component: () => import('../views/User/HomePage.vue')`
- **Why**: Reduces initial bundle size
- **Type safety**: Vue 3 handles this automatically
- Always add `props: true` to route definitions when passing data to view components

### Map Marker Icons
Leaflet requires icon registration in `main.ts` (L.Marker.prototype.options.icon = DefaultIcon)
- **Issue**: Without this, markers won't display in Vite
- **Solution**: Already fixed in main.ts; only touch if adding new icon types
- Custom SVG icons created with `L.divIcon()` and HTML templates (see BinMap.vue)

### Search Functionality
Navigation search emits to App.vue, which passes via RouterView slot to active view
- Navigation.vue emits `@search` event on input (line 30)
- App.vue captures via `@search="handleSearch"` and updates `searchQuery` (line 13)
- Routed components receive via `searchText` prop and filter data accordingly
- See HomePage.vue for prop usage example

### TypeScript Path Aliases
`@` maps to `src/` (configured in vite.config.ts)
- Use: `import BinMap from '@/components/layout/BinMap.vue'` ✓
- Not: `import BinMap from '../../../components/layout/BinMap.vue'` ✗

### Loading State Management
Loading is controlled by router navigation hooks in App.vue:
- `router.beforeEach()` sets `isLoading = true`
- `router.afterEach()` sets `isLoading = false` after 300ms delay (artificial smoothing)
- LoadingComponent displays via `<LoadingComponent v-if="isLoading" />`

## Integration Points (External/Planned)
- **API**: Expected Axios calls to backend (bins, customers, auth) - integration point ready
- **Auth**: `SigninPage`, `SignupPage`, `ForgotPage` views suggest JWT/session auth flow (not yet implemented)
- **Mapbox GL vs Leaflet**: Both imported; Leaflet is currently primary in BinMap.vue with vue-leaflet components

## Testing Strategy
- **Unit Tests**: Place in same structure (e.g., `src/stores/__tests__/counter.spec.ts`)
- **E2E Tests**: Located in `e2e/` directory (see `e2e/vue.spec.ts`)
- Run e2e after `npm run build` for CI accuracy
- Use `npm run test:unit` to run Vitest suite

## Quick Productivity Tips
1. **Component exploration**: Start with `src/App.vue` → routes in `router/index.ts` → view files
2. **Styling**: Use Tailwind utilities directly; reference `BinMap.vue` for complex patterns
3. **Debugging**: Check Vue DevTools (browser) for component props/emits; use `console.log` in Composition API
4. **Build errors**: Always run `npm run type-check` before reporting build issues
5. **New stores**: Follow `counter.ts` pattern; use `defineStore('name', () => {...})` with Composition API
