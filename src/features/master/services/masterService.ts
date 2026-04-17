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

  // --- Courses ---
  getCourses: async () => {
    return apiClient<{ success: boolean; data: any[] }>(API_ENDPOINTS.MASTER.COURSES);
  },

  createCourse: async (data: { courseName: string; courseType: string }) => {
    return http.post<{ success: boolean; data: any }>(API_ENDPOINTS.MASTER.COURSES, data);
  },

  updateCourse: async (id: number, data: { courseName?: string; courseType?: string; status?: string }) => {
    return http.put<{ success: boolean; data: any }>(`${API_ENDPOINTS.MASTER.COURSES}/${id}`, data);
  },

  deleteCourse: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.MASTER.COURSES}/${id}`);
  },

  // --- Branches ---
  getBranches: async () => {
    return apiClient<{ success: boolean; data: any[] }>(API_ENDPOINTS.MASTER.BRANCHES);
  },

  createBranch: async (data: { branchName: string; courseId: number; courseType: string }) => {
    return http.post<{ success: boolean; data: any }>(API_ENDPOINTS.MASTER.BRANCHES, data);
  },

  updateBranch: async (id: number, data: { branchName?: string; courseId?: number; courseType?: string; status?: string }) => {
    return http.put<{ success: boolean; data: any }>(`${API_ENDPOINTS.MASTER.BRANCHES}/${id}`, data);
  },

  deleteBranch: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.MASTER.BRANCHES}/${id}`);
  },
};
