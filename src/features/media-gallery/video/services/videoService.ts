import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import { VideoEntry } from "../types";

export const videoService = {
  /**
   * Fetch all videos from the gallery
   */
  async getAllVideos(): Promise<{ success: boolean; data: VideoEntry[] }> {
    return apiClient<{ success: boolean; data: VideoEntry[] }>(`${API_ENDPOINTS.VIDEOS}?active=false`);
  },

  /**
   * Create a new video entry
   */
  async createVideo(data: Partial<VideoEntry>): Promise<{ success: boolean; data: VideoEntry }> {
    return apiClient<{ success: boolean; data: VideoEntry }>(API_ENDPOINTS.VIDEOS, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing video entry
   */
  async updateVideo(id: number, data: Partial<VideoEntry>): Promise<{ success: boolean; data: VideoEntry }> {
    return apiClient<{ success: boolean; data: VideoEntry }>(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a video entry
   */
  async deleteVideo(id: number): Promise<void> {
    return apiClient<void>(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: "DELETE",
    });
  },

  /**
   * Toggle the active status of a video
   */
  async toggleStatus(id: number): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`${API_ENDPOINTS.VIDEOS}/${id}/toggle-status`, {
      method: "PATCH",
    });
  },
};
