import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { Enquiry } from "../types";

export const enquiryService = {
  /**
   * Get all admission enquiries
   */
  getAllEnquiries: async () => {
    const response = await apiClient<{ success: boolean; count: number; data: Enquiry[] }>(
      API_ENDPOINTS.ENQUIRIES
    );
    return response.data;
  },

  /**
   * Create a new enquiry
   */
  createEnquiry: async (data: Partial<Enquiry>) => {
    return apiClient<{ success: boolean; data: Enquiry }>(API_ENDPOINTS.ENQUIRIES, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing enquiry
   */
  updateEnquiry: async (id: number, data: Partial<Enquiry>) => {
    return apiClient<{ success: boolean; data: Enquiry }>(`${API_ENDPOINTS.ENQUIRIES}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an enquiry
   */
  deleteEnquiry: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.ENQUIRIES}/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Toggle resolution status (Pending/Resolved)
   */
  toggleResolution: async (id: number) => {
    return apiClient<{ success: boolean; data: Enquiry }>(`${API_ENDPOINTS.ENQUIRIES}/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};
