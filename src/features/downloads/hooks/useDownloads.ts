"use client";

import { useState, useCallback, useEffect } from "react";
import { DownloadItem } from "../types";
import { downloadService } from "../services/downloadService";

export function useDownloads() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDownloads = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await downloadService.getAllDownloads();
      setDownloads(data);
    } catch (error) {
      console.error("Failed to fetch downloads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const saveDownload = useCallback(async (id: number | null, formData: FormData) => {
    try {
      const response = await downloadService.saveDownload(id, formData);
      if (response.success) {
        await fetchDownloads(); // Refresh list after save
        return true;
      }
      return false;
    } catch (error) {
      console.error("Save download error:", error);
      return false;
    }
  }, [fetchDownloads]);

  const deleteDownload = useCallback(async (id: number) => {
    try {
      const response = await downloadService.deleteDownload(id);
      if (response.success) {
        setDownloads(prev => prev.filter(item => item.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete download error:", error);
      return false;
    }
  }, []);

  const toggleStatus = useCallback(async (id: number) => {
    const item = downloads.find(d => d.id === id);
    if (!item) return false;

    try {
      const response = await downloadService.toggleStatus(id, item.isActive);
      if (response.success) {
        setDownloads(prev => prev.map(d => 
          d.id === id ? { ...d, isActive: !d.isActive } : d
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Toggle status error:", error);
      return false;
    }
  }, [downloads]);

  return {
    downloads,
    isLoading,
    saveDownload,
    deleteDownload,
    toggleStatus,
    fetchDownloads
  };
}
