import axios from 'axios'
import type { Bin } from '@/types/bin'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllBinsPublic = async () => {
  const response = await api.get('/bins/public')
  return response.data
}

export const getAllBins = async () => {
  const response = await api.get('/bins')
  return response.data
}

export const createBin = async (bin: Bin) => {
  const response = await api.post('/bins', bin)
  return response.data
}

export const deleteBin = async (id: string) => {
  const response = await api.delete(`/bins/${id}`)
  return response.data
}

export const updateBin = async (id: string, bin: Partial<Bin>) => {
  const response = await api.patch(`/bins/${id}`, bin)
  return response.data
}
