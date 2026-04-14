import { apiClient, http } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { PhotoGalleryEntry } from "../types";

export const photoService = {
  /**
   * Fetch all photos
   */
  getAllPhotos: async (page = 1, limit = 9999) => {
    return apiClient<{ success: boolean; data: PhotoGalleryEntry[]; totalRecords: number }>(
      `${API_ENDPOINTS.PHOTOS}?page=${page}&limit=${limit}&active=false`
    );
  },

  /**
   * Create a new photo (Requires Multipart FormData with field 'image')
   */
  createPhoto: async (formData: FormData) => {
    return apiClient<{ success: boolean; data: PhotoGalleryEntry }>(API_ENDPOINTS.PHOTOS, {
      method: "POST",
      body: formData,
      headers: {}, 
    });
  },

  /**
   * Update an existing photo
   */
  updatePhoto: async (id: number, formData: FormData) => {
    return apiClient<{ success: boolean; data: PhotoGalleryEntry }>(`${API_ENDPOINTS.PHOTOS}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },

  /**
   * Delete a photo
   */
  deletePhoto: async (id: number) => {
    return http.delete<{ success: boolean }>(`${API_ENDPOINTS.PHOTOS}/${id}`);
  },

  /**
   * Toggle active status
   */
  toggleStatus: async (id: number) => {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.PHOTOS}/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};
