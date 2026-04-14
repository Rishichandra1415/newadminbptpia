import { apiClient, http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { Result } from "../types";

export const resultService = {
  /**
   * Fetch all results
   */
  getAllResults: async (page = 1, limit = 9999) => {
    return apiClient<{ success: boolean; data: Result[]; totalRecords: number }>(
      `${API_ENDPOINTS.RESULTS}?page=${page}&limit=${limit}`
    );
  },

  /**
   * Create a new result (Supports PDF Upload)
   */
  createResult: async (formData: FormData) => {
    return apiClient<{ success: boolean; data: Result }>(API_ENDPOINTS.RESULTS, {
      method: "POST",
      body: formData,
      headers: {}, // Browser sets Boundary
    });
  },

  /**
   * Update an existing result
   */
  updateResult: async (id: number, formData: FormData) => {
    return apiClient<{ success: boolean; data: Result }>(`${API_ENDPOINTS.RESULTS}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },

  /**
   * Delete a result
   */
  deleteResult: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.RESULTS}/${id}`);
  },

  /**
   * Toggle active status
   */
  toggleStatus: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.RESULTS}/${id}/toggle`, {
      method: "PATCH",
    });
  },
};
