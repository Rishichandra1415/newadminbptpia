import { useState, useCallback, useEffect } from "react";
import { VideoEntry } from "../types";
import { videoService } from "../services/videoService";
import { toast } from "@/shared/utils/toast-utils";

export function useVideos() {
  const [data, setData] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await videoService.getAllVideos();
      if (response.success) {
        setData(response.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
      toast.error("Could not load video gallery");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback(async (id: number | null, videoData: Partial<VideoEntry>) => {
    try {
      if (id) {
        await videoService.updateVideo(id, videoData);
        toast.success("Success");
      } else {
        await videoService.createVideo(videoData);
        toast.success("Success");
      }
      await fetchVideos();
      return true;
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to save video");
      return false;
    }
  }, [fetchVideos]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return false;
    try {
      await videoService.deleteVideo(id);
      toast.success("Deleted");
      await fetchVideos();
      return true;
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to delete video");
      return false;
    }
  }, [fetchVideos]);

  const handleToggleStatus = useCallback(async (id: number) => {
    try {
      await videoService.toggleStatus(id);
      toast.success("Status Updated");
      await fetchVideos();
      return true;
    } catch (err: any) {
      toast.error("Error", err.message || "Failed to update status");
      return false;
    }
  }, [fetchVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    data,
    loading,
    error,
    refresh: fetchVideos,
    save: handleSave,
    deleteVideo: handleDelete,
    toggleStatus: handleToggleStatus
  };
}
