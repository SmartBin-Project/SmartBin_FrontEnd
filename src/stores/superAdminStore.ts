import { getAllAdmins, getAllCleaners } from "@/services/superAdminService";
import type { Admin } from "@/types/admin";
import type { Cleaner } from "@/types/cleaner";
import { defineStore } from "pinia";


export const useSuperAdminStore = defineStore('superAdmin', {
    state: () => ({
        admin: [] as Admin[],
        cleaners: [] as Cleaner[],
        loading: false,
        error: null as string | null,
    }),

    getters: {

        getAdmins(): Admin[] {
            return this.admin;
        },

        getCleaners(): Cleaner[] {
            return this.cleaners;
        }
    },

    actions: {
        async fetchAdmins() {
            this.loading = true;
            this.error = null;
            try{
                const response = await getAllAdmins();
                this.admin = response;
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch admins';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchCleaners() {
            this.loading = true;
            this.error = null;
            try{
                const response = await getAllCleaners();
                this.cleaners = response;
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch cleaners';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
})