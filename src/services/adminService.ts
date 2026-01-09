import axios from 'axios';
import type{ Admin, CreateAdminData, UpdateAdminData } from '@/types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const adminAPI = axios.create({
  baseURL: `${API_BASE_URL}/admins`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
adminAPI.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // Create a new admin
  async createAdmin(data: CreateAdminData): Promise<Admin> {
    const response = await adminAPI.post('/', data);
    return response.data.data;
  },

  // Get all admins
  async getAllAdmins(): Promise<Admin[]> {
    const response = await adminAPI.get('/');
    return response.data.data;
  },

  // Get a single admin by ID
  async getAdminById(id: string): Promise<Admin> {
    const response = await adminAPI.get(`/${id}`);
    return response.data.data;
  },

  // Update an admin
  async updateAdmin(id: string, data: UpdateAdminData): Promise<Admin> {
    const response = await adminAPI.patch(`/${id}`, data);
    return response.data.data;
  },

  // Delete an admin
  async deleteAdmin(id: string): Promise<void> {
    await adminAPI.delete(`/${id}`);
  },
};
