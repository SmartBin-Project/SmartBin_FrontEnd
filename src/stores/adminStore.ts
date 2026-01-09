import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { adminService } from '../services/adminService';
import type{ Admin, CreateAdminData, UpdateAdminData } from '../types/admin';

export const useAdminStore = defineStore('admin', () => {
  // State
  const admins = ref<Admin[]>([]);
  const currentAdmin = ref<Admin | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const adminCount = computed(() => admins.value.length);
  const hasAdmins = computed(() => admins.value.length > 0);

  // Actions
  async function fetchAllAdmins() {
    isLoading.value = true;
    error.value = null;
    try {
      admins.value = await adminService.getAllAdmins();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch admins';
      console.error('Error fetching admins:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchAdminById(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      currentAdmin.value = await adminService.getAdminById(id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch admin';
      console.error('Error fetching admin:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function createAdmin(data: CreateAdminData) {
    isLoading.value = true;
    error.value = null;
    try {
      const newAdmin = await adminService.createAdmin(data);
      admins.value.push(newAdmin);
      return newAdmin;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create admin';
      console.error('Error creating admin:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAdmin(id: string, data: UpdateAdminData) {
    isLoading.value = true;
    error.value = null;
    try {
      const updatedAdmin = await adminService.updateAdmin(id, data);
      const index = admins.value.findIndex(admin => admin._id === id);
      if (index !== -1) {
        admins.value[index] = updatedAdmin;
      }
      if (currentAdmin.value?._id === id) {
        currentAdmin.value = updatedAdmin;
      }
      return updatedAdmin;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update admin';
      console.error('Error updating admin:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAdmin(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await adminService.deleteAdmin(id);
      admins.value = admins.value.filter(admin => admin._id !== id);
      if (currentAdmin.value?._id === id) {
        currentAdmin.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete admin';
      console.error('Error deleting admin:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function resetStore() {
    admins.value = [];
    currentAdmin.value = null;
    isLoading.value = false;
    error.value = null;
  }

  return {
    // State
    admins,
    currentAdmin,
    isLoading,
    error,

    // Computed
    adminCount,
    hasAdmins,

    // Actions
    fetchAllAdmins,
    fetchAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    clearError,
    resetStore,
  };
});
