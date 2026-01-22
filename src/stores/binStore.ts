import { defineStore } from 'pinia'
import type { Bin } from '@/types/bin'
import * as binService from '@/services/binService'
import { socketService } from '@/services/socket'

export const useBinStore = defineStore('binStore', {
  state: () => ({
    bins: [] as Bin[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allBins(state) {
      return state.bins
    },
    getBinByCode(state) {
      return (binCode: string) => state.bins.find((b) => b.binCode === binCode)
    },
  },
  actions: {
    async getAllBinsPublic() {
      try {
        this.loading = true
        this.error = null
        const response = await binService.getAllBinsPublic()
        this.bins = response
        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch bins'
        throw err
      } finally {
        this.loading = false
      }
    },

    async getAllBins() {
      try {
        this.loading = true
        this.error = null
        const response = await binService.getAllBins()
        this.bins = response
        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch bins'
        throw err
      } finally {
        this.loading = false
      }
    },
    async createBin(bin: Bin) {
      try {
        this.loading = true
        this.error = null
        const response = await binService.createBin(bin)
        const binData = response.data || response
        this.bins.push(binData)
        return binData
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to create bin'
        this.error = errorMsg
        console.error('Create bin error:', err.response?.data || err.message)
        throw err
      } finally {
        this.loading = false
      }
    },
    async updateBin(id: string, bin: Partial<Bin>) {
      try {
        this.loading = true
        this.error = null
        const response = await binService.updateBin(id, bin)
        const index = this.bins.findIndex((b: Bin) => b._id === id)
        if (index !== -1) {
          this.bins[index] = { ...this.bins[index], ...response.data }
        }
        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update bin'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteBin(id: string) {
      try {
        this.loading = true
        this.error = null
        await binService.deleteBin(id)
        this.bins = this.bins.filter((b) => b._id !== id)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete bin'
        throw err
      } finally {
        this.loading = false
      }
    },

    initRealTimeUpdates() {
      // Debug: Check if 'this' is working
      console.log('🔌 Initializing WebSocket. Store bins count:', this.bins.length)

      socketService.connect()

      // ✅ FIX 2: Arrow function inside is CORRECT (it keeps 'this' from the outer function)
      socketService.on('bin-updated', (updatedData: Partial<Bin>) => {
        console.log('⚡ Real-time update received:', updatedData)

        // Debug: Ensure this.bins exists
        if (!this.bins) {
          console.error('❌ Error: this.bins is undefined. Check store initialization.')
          return
        }

        // ✅ FIX 3: Use .find() for safety
        const bin = this.bins.find((b) => b.binCode === updatedData.binCode)

        if (bin) {
          console.log(`✅ Found bin ${bin.binCode}. Updating fill level to ${updatedData.fillLevel}`)
          
          // Update values safely
          if (updatedData.fillLevel !== undefined) bin.fillLevel = updatedData.fillLevel
          if (updatedData.status !== undefined) bin.status = updatedData.status
          if (updatedData.location) bin.location = updatedData.location
        } else {
          console.warn(`⚠️ Bin with code ${updatedData.binCode} not found in local store.`)
        }
      })
    },

    stopRealTimeUpdates() {
      socketService.off('bin-updated')
      socketService.disconnect()
    },
  },
})
