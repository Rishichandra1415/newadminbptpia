import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { DownloadItem } from "../types";

export const downloadService = {
  /**
   * Get all downloads
   * Note: Backend defaults to isActive=true, so we pass isActive=all if needed
   */
  getAllDownloads: async () => {
    const response = await apiClient<{ success: boolean; data: DownloadItem[] }>(
      `${API_ENDPOINTS.DOWNLOADS}?isActive=all`
    );
    return response.data;
  },

  /**
   * Create or Update a download (Handles FormData for file uploads)
   */
  saveDownload: async (id: number | null, formData: FormData) => {
    const url = id ? `${API_ENDPOINTS.DOWNLOADS}/${id}` : API_ENDPOINTS.DOWNLOADS;
    const method = id ? "PUT" : "POST";
    
    return apiClient<{ success: boolean; data: DownloadItem }>(url, {
      method,
      body: formData, // apiClient handles headers for FormData
    });
  },

  /**
   * Delete a download
   */
  deleteDownload: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.DOWNLOADS}/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Toggle resource status
   */
  toggleStatus: async (id: number, currentStatus: boolean) => {
    // Backend doesn't have a dedicated toggle route, so we use PUT
    const formData = new FormData();
    formData.append('isActive', (!currentStatus).toString());
    
    return apiClient<{ success: boolean; data: DownloadItem }>(`${API_ENDPOINTS.DOWNLOADS}/${id}`, {
      method: "PUT",
      body: formData,
    });
  }
};
