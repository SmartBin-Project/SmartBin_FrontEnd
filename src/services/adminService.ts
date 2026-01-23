import axios from 'axios'
import type { Admin, CreateAdminData, UpdateAdminData } from '@/types/admin'

const API_BASE_URL = import.meta.env.VITE_API_URL

const adminAPI = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminService = {
  async createAdmin(data: Admin) {
    const response = await adminAPI.post('/superadmin/create-admin', data)
    return response.data
  },

  async getAllAdmins(): Promise<Admin[]> {
    const response = await adminAPI.get('/superadmin/admins')
    return response.data
  },

  async getAdminById(id: string): Promise<Admin> {
    const response = await adminAPI.get(`/${id}`)
    return response.data
  },

  async updateAdmin(id: string, admin: UpdateAdminData) {
    const response = await adminAPI.patch(`/superadmin/update-admin/${id}`, admin)
    return response.data
  },

  async deleteAdmin(id: string): Promise<void> {
    await adminAPI.delete(`/superadmin/delete-admin/${id}`)
  },
}
