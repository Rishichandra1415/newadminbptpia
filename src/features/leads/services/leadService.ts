import { http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { Lead } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export const leadService = {
  /**
   * Fetch all contact leads from backend
   */
  getAllLeads: async () => {
    const response = await http.get<ApiResponse<Lead[]>>(API_ENDPOINTS.CONTACT);
    return response.data;
  },

  /**
   * Get a single lead by ID
   */
  getLeadById: async (id: number) => {
    const response = await http.get<ApiResponse<Lead>>(`${API_ENDPOINTS.CONTACT}/${id}`);
    return response.data;
  },

  /**
   * Update lead status or other details
   */
  updateLead: async (id: number, data: Partial<Lead>) => {
    const response = await http.put<ApiResponse<Lead>>(`${API_ENDPOINTS.CONTACT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a lead
   */
  deleteLead: async (id: number) => {
    await http.delete(`${API_ENDPOINTS.CONTACT}/${id}`);
    return true;
  },

  /**
   * Bulk delete leads
   */
  deleteMultipleLeads: async (ids: number[]) => {
    await http.post(`${API_ENDPOINTS.CONTACT}/delete-multiple`, { ids });
    return true;
  }
};
