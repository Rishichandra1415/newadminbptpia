"use client";

import React, { useState } from "react";
import { usePhotos } from "@/features/media-gallery/photo/hooks/usePhotos";
import { Toast } from "@/shared/components/ui/toast";
import { PhotoGalleryGrid } from "@/features/media-gallery/photo/components/PhotoGalleryGrid";

export default function PhotoGalleryPage() {
  const { 
    photos, 
    isLoading, 
    error, 
    refresh, 
    deletePhoto,
    toggleStatus,
    savePhoto,
    totalRecords
  } = usePhotos();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      const success = await deletePhoto(id);
      if (success) {
        setToast({ message: "Photo deleted successfully!", type: "success" });
      } else {
        setToast({ message: "Failed to delete photo.", type: "error" });
      }
    }
  };

  const handleStatusUpdate = async (id: number) => {
    const success = await toggleStatus(id);
    if (success) {
      setToast({ message: "Photo status updated!", type: "success" });
    } else {
      setToast({ message: "Failed to update status.", type: "error" });
    }
  };

  const handleSave = async (id: number | null, formData: FormData) => {
    const success = await savePhoto(id, formData);
    if (success) {
      setToast({ 
        message: id ? "Photo updated successfully!" : "New photo added to gallery!", 
        type: "success" 
      });
      return true;
    } else {
      setToast({ message: "Failed to save photo. Check file size (max 5MB).", type: "error" });
      return false;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium whitespace-pre-wrap max-w-lg text-center">
          Error: {error}
        </div>
        <button 
          onClick={() => refresh()}
          className="px-6 py-2 bg-[#00b4d8] text-white rounded-lg hover:opacity-90 transition-all font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full p-4 md:p-6 bg-gray-50/20">
      {isLoading ? (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-12 w-12 border-4 border-[#00b4d8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Synchronizing Gallery...</p>
        </div>
      ) : (
        <PhotoGalleryGrid 
          data={photos}
          onDelete={handleDelete}
          onRefresh={() => refresh()}
          onStatusUpdate={handleStatusUpdate}
          onSave={handleSave}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
