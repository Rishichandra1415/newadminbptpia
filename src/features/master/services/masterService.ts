import { apiClient, http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { StateEntry, CityEntry } from "../types";

export const masterService = {
  // --- States ---
  getStates: async () => {
    return apiClient<{ success: boolean; data: StateEntry[] }>(API_ENDPOINTS.MASTER.STATES);
  },

  createState: async (data: { name: string }) => {
    return http.post<{ success: boolean; data: StateEntry }>(API_ENDPOINTS.MASTER.STATES, data);
  },

  deleteState: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.MASTER.STATES}/${id}`);
  },

  // --- Cities (Districts) ---
  getCitiesByState: async (stateId: number) => {
    return apiClient<{ success: boolean; data: CityEntry[] }>(`${API_ENDPOINTS.MASTER.CITIES}/${stateId}`);
  },

  createCity: async (data: { name: string; stateId: number }) => {
    return http.post<{ success: boolean; data: CityEntry }>(API_ENDPOINTS.MASTER.CITIES, data);
  },

  deleteCity: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.MASTER.CITIES}/${id}`);
  },
};
