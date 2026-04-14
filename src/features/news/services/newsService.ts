import { apiClient, http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { NewsEvent } from "../types";

export const newsService = {
  /**
   * Fetch all news events (with pagination info)
   */
  getAllEvents: async (page = 1, limit = 9999) => {
    return apiClient<{ success: boolean; data: NewsEvent[]; totalRecords: number }>(
      `${API_ENDPOINTS.NEWS}?page=${page}&limit=${limit}`
    );
  },

  /**
   * Create a new news event (Supports File Upload)
   */
  createEvent: async (formData: FormData) => {
    // Note: We use apiClient directly here because http.post stringifies the body
    return apiClient<{ success: boolean; data: NewsEvent }>(API_ENDPOINTS.NEWS, {
      method: "POST",
      body: formData,
      // REMEMBER: Don't manualy set Content-Type header when using FormData;
      // the browser will set it automatically with the correct boundary.
      headers: {}, 
    });
  },

  /**
   * Update an existing news event (Supports File Upload)
   */
  updateEvent: async (id: number, formData: FormData) => {
    return apiClient<{ success: boolean; data: NewsEvent }>(`${API_ENDPOINTS.NEWS}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },

  /**
   * Delete a news event
   */
  deleteEvent: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.NEWS}/${id}`);
  },

  /**
   * Toggle active status
   */
  toggleStatus: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.NEWS}/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};
