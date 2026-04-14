import { apiClient, http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { GovernmentLetter } from "../types";

export const govLetterService = {
  /**
   * Fetch all government letters
   */
  getAllLetters: async (page = 1, limit = 9999) => {
    return apiClient<{ success: boolean; data: GovernmentLetter[]; totalRecords: number }>(
      `${API_ENDPOINTS.GOV_LETTER}?page=${page}&limit=${limit}`
    );
  },

  /**
   * Create a new letter (Supports File Upload)
   */
  createLetter: async (formData: FormData) => {
    return apiClient<{ success: boolean; data: GovernmentLetter }>(API_ENDPOINTS.GOV_LETTER, {
      method: "POST",
      body: formData,
      headers: {}, 
    });
  },

  /**
   * Update an existing letter
   */
  updateLetter: async (id: number, formData: FormData) => {
    return apiClient<{ success: boolean; data: GovernmentLetter }>(`${API_ENDPOINTS.GOV_LETTER}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },

  /**
   * Delete a letter
   */
  deleteLetter: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.GOV_LETTER}/${id}`);
  },

  /**
   * Toggle active status
   */
  toggleStatus: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.GOV_LETTER}/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};
