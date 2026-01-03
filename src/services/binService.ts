import axios from 'axios'
import type { Bin } from '@/types/bin'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
})

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllBins = async () => {
  const response = await api.get('/bins/public')
  return response.data
}

export const createBin = async (bin: Bin) => {
  const response = await api.post('/bins', bin)
  return response.data
}

export const deleteBin = async (binCode: string) => {
  const response = await api.delete(`/bins/delete/${binCode}`)
  return response.data
}

export const updateBin = async (bin: Bin) => {
  const response = await api.put(`/bins/update/${bin.binCode}`, bin)
  return response.data
}
