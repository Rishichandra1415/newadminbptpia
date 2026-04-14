"use client";

import { useState, useCallback, useEffect } from "react";
import { PhotoGalleryEntry } from "../types";
import { photoService } from "../services/photoService";

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoGalleryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchPhotos = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await photoService.getAllPhotos(page);
      if (response.success) {
        setPhotos(response.data);
        setTotalRecords(response.totalRecords);
      } else {
        throw new Error("Failed to fetch gallery photos");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching photos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePhoto = async (id: number) => {
    try {
      const response = await photoService.deletePhoto(id);
      if (response.success) {
        setPhotos((prev) => prev.filter((item) => item.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const response = await photoService.toggleStatus(id);
      if (response.success) {
        setPhotos((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, isActive: !item.isActive } : item
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const savePhoto = async (id: number | null, formData: FormData) => {
    try {
      const response = id 
        ? await photoService.updatePhoto(id, formData)
        : await photoService.createPhoto(formData);
      
      if (response.success) {
        fetchPhotos(); // Refresh list
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    isLoading,
    error,
    totalRecords,
    refresh: fetchPhotos,
    deletePhoto,
    toggleStatus,
    savePhoto
  };
}
