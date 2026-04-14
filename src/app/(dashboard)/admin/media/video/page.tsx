"use client";

import React from "react";
import { VideoGalleryGrid } from "@/features/media-gallery/video/components/VideoGalleryGrid";
import { useVideos } from "@/features/media-gallery/video/hooks/useVideos";
import { VideoIcon, RotateCw, AlertTriangle } from "lucide-react";

export default function VideoGalleryPage() {
  const { 
    data, 
    loading, 
    error, 
    refresh, 
    save, 
    deleteVideo, 
    toggleStatus 
  } = useVideos();

  if (loading && data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="relative">
          <VideoIcon size={48} className="text-[#00b4d8] animate-pulse" />
          <RotateCw size={20} className="absolute -bottom-1 -right-1 text-slate-400 animate-spin" />
        </div>
        <div className="flex flex-col items-center">
            <p className="text-slate-600 font-semibold tracking-wide">Syncing Gallery</p>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Preparing Video Streams</p>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-6 bg-red-50/30 rounded-2xl border border-red-100">
        <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle size={40} className="text-red-500" />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gallery Sync Failed</h2>
            <p className="text-red-600 font-medium max-w-md mx-auto">{error}</p>
        </div>
        <button 
            onClick={refresh}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-medium shadow-lg shadow-slate-200"
        >
            <RotateCw size={18} />
            Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col w-full animate-in fade-in duration-500">
      <VideoGalleryGrid 
        data={data}
        onRefresh={refresh}
        onSave={save}
        onDelete={deleteVideo}
        onStatusUpdate={toggleStatus}
      />
    </div>
  );
}
