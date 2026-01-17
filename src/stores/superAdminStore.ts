import { getAllAdmins, getAllCleaners, updateAdmin, deleteAdmin } from '@/services/superAdminService'
import type { Admin, UpdateAdminData } from '@/types/admin'
import type { Cleaner } from '@/types/cleaner'
import { defineStore } from 'pinia'

export const useSuperAdminStore = defineStore('superAdmin', {
  state: () => ({
    admins: [] as Admin[],
    cleaners: [] as Cleaner[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getAdmins(): Admin[] {
      return this.admins
    },

    getCleaners(): Cleaner[] {
      return this.cleaners
    },
  },

  actions: {
    async fetchAdmins() {
      this.loading = true
      this.error = null
      try {
        const response = await getAllAdmins()
        this.admins = response
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch admins'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateAdmin(id: string, data: UpdateAdminData) {
      this.loading = true
      this.error = null
      try {
        const updatedAdmin = await updateAdmin(id, data)
        const index = this.admins.findIndex(admin => admin._id === id)
        if (index !== -1) {
          this.admins[index] = updatedAdmin
        }
        return updatedAdmin
      } catch (err: any) {
        this.error = err.message || 'Failed to update admin'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteAdmin(id: string) {
      this.loading = true
      this.error = null
      try {
        await deleteAdmin(id)
        this.admins = this.admins.filter(admin => admin._id !== id)
      } catch (err: any) {
        this.error = err.message || 'Failed to delete admin'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchCleaners() {
      this.loading = true
      this.error = null
      try {
        const response = await getAllCleaners()
        this.cleaners = response
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch cleaners'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
