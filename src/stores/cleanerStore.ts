import { defineStore } from 'pinia'
import * as cleanerService from '@/services/cleanerService'
import type { Cleaner } from '@/types/cleaner'

export const useCleanerStore = defineStore('cleaner', {
  state: () => ({
    cleaners: [] as Cleaner[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getCleaners(state) {
      return state.cleaners
    },
  },
  actions: {
    async fetchCleaners() {
      this.loading = true
      this.error = null
      try {
        const cleaners = await cleanerService.getAllCleaners()
        this.cleaners = cleaners
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async createCleaner(cleaner: Cleaner) {
      this.loading = true
      this.error = null
      try {
        const newCleaner = await cleanerService.createCleaner(cleaner)
        this.cleaners.push(newCleaner)
        // Refetch cleaners to ensure data is in sync
        await this.fetchCleaners()
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async updateCleaner(cleaner: Cleaner, id: string) {
      this.loading = true
      this.error = null
      try {
        await cleanerService.updateCleaner(id, cleaner)
        // Refetch cleaners to ensure data is in sync
        await this.fetchCleaners()
        return true
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCleaner(id: string) {
      this.loading = true
      this.error = null
      try {
        await cleanerService.deleteCleaner(id)
        this.cleaners = this.cleaners.filter((c) => c._id !== id)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
})
