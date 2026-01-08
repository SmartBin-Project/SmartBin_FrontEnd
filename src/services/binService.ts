import axios from 'axios'
import type { Bin } from '@/types/bin'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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

// Response interceptor to ensure area field is preserved
api.interceptors.response.use((response) => {
  console.log('🔍 Response Interceptor - Raw data:', response.data)
  if (Array.isArray(response.data)) {
    console.log('🔍 Is array, first item:', response.data[0])
    console.log('🔍 First item has area?:', response.data[0]?.area)
  }
  return response
})

// for public bins, no auth needed
export const getAllBinsPublic = async () => {
  const response = await api.get('/bins/public')

  // Handle different response formats
  // let binsData = response.data
  // if (binsData && typeof binsData === 'object' && 'data' in binsData) {
  //   console.log('⚠️ Response wrapped in data property, unwrapping...')
  //   binsData = binsData.data
  // }

  // if (Array.isArray(binsData)) {
  //   console.log('✅ Is array, length:', binsData.length)
  //   console.log('✅ First item:', JSON.stringify(binsData[0], null, 2))
  // }

  return response.data
}

// for private bins, auth needed
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
