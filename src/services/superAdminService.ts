import axios from 'axios'
import type { Admin, UpdateAdminData } from '@/types/admin'

const API_URL = import.meta.env.VITE_API_URL + '/superadmin'
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllAdmins = async () => {
  const response = await api.get(`/admins`)
  return response.data
}

export const updateAdmin = async (id: string, data: UpdateAdminData): Promise<Admin> => {
  const response = await api.patch(`/update-admin/${id}`, data)
  return response.data
}

export const deleteAdmin = async (id: string): Promise<void> => {
  await api.delete(`/delete-admin/${id}`)
}

export const getAllCleaners = async () => {
  const response = await api.get('/cleaners')
  return response.data
}
