import axios from 'axios'
import type { Cleaner } from '@/types/cleaner'

const API_URL = import.meta.env.VITE_API_URL + ''

const api = axios.create({
  baseURL: API_URL,
})

// Add token to headers
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllCleaners = async () => {
  const response = await api.get('/superadmin/cleaners')
  return response.data
}

export const createCleaner = async (cleaner: Cleaner) => {
  const response = await api.post('/superadmin/create-cleaner', cleaner)
  return response.data
}

export const updateCleaner = async (id: string, cleaner: Cleaner) => {
  const response = await api.patch(`/superadmin/update-cleaner/${id}`, cleaner)
  return response.data
}

export const deleteCleaner = async (id: string) => {
  const response = await api.delete(`/superadmin/delete-cleaner/${id}`)
  return response.data
}
