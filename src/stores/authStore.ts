import { defineStore } from 'pinia'
import * as authService from '@/services/authService'
import type { SuperAdmin } from '@/types/superadmin'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as SuperAdmin | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.user
    },
    // getAccessToken(): string | null {
    //   return this.accessToken
    // },
    getUser(): SuperAdmin | null {
      return this.user
    },
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(email, password)
        this.user = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
        return response
      } catch (err: any) {
        this.error = err.message || 'Login failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(username: string, email: string, password: string, role: string, area?: string) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.register(username, email, password, role, area)
        return response
      } catch (err: any) {
        this.error = err.message || 'Registration failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.forgotPassword(email)
        return response
      } catch (err: any) {
        this.error = err.message || 'Request failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async verifyOtp(email: string, otp: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.verifyOtp(email, otp, password)
        return response
      } catch (err: any) {
        this.error = err.message || 'Verification failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        await authService.logout()
      } catch (err: any) {
        this.error = err.message || 'Logout failed'
      } finally {
        this.user = null
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        this.loading = false
      }
    },

    async updateUserProfile(profileData: any) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.updateUserProfile(profileData)
        return response
      } catch (err: any) {
        this.error = err.message || 'Update failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    loadUserFromStorage() {
      this.user = authService.getCurrentUser()
    },

    clearError() {
      this.error = null
    },
  },
})
