import { defineStore } from 'pinia'
import type { Bin } from '@/types/bin'
import * as binService from '@/services/binService'
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
        // response contains { message, data: bin } from the controller
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
  },
})
