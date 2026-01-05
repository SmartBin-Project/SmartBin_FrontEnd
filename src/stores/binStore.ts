import { getAllBins } from "@/services/binService";

import type { Bin } from "@/types/bin";
import { defineStore } from "pinia";


export const useBinStore = defineStore('bins', {
    state: () => ({
        bins: [] as Bin[],
        loading: false,
        error: null as string | null,
    }),

    getters: {

        getBins(): Bin[] {
            return this.bins;
        }
    },

    actions: {
        async fetchBins() {
            this.loading = true;
            this.error = null;
            try{
                const response = await getAllBins();
                this.bins = response;
            } catch (err: any) {
                this.error = err.message || 'Failed to fetch bins';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
})