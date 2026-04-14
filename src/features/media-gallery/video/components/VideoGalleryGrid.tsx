"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, Trash2, Edit3, Plus, X, 
    CheckCircle, Filter, Video as VideoIcon, Info, Play, ExternalLink
} from 'lucide-react';
import { VideoEntry, VideoGalleryGridProps } from "../types";

// Custom YouTube Icon SVG for better compatibility
const YoutubeIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.423L15.818 12l-6.273 3.568z"/>
    </svg>
);

export function VideoGalleryGrid({
  data,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave
}: VideoGalleryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  /**
   * Extract YouTube Video ID from URL
   */
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  /**
   * Get High Quality Thumbnail URL
   */
  const getThumbnail = (url: string) => {
    const id = getYoutubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  const handleOpenModal = (video?: VideoEntry) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || "",
        videoUrl: video.videoUrl,
      });
    } else {
      setEditingVideo(null);
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const success = await onSave?.(editingVideo?.id || null, formData);
    if (success) {
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.videoUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col gap-6 w-full font-sans max-w-full">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Video Gallery
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>MEDIA</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">VIDEO GALLERY</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search videos..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>
          
          <button className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10">
            <Filter size={18} />
          </button>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white p-2.5 rounded-full shadow-md shadow-red-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Add New Video"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* 🎥 GRID SECTION */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6 px-1">
        {filteredData.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-xl">
             <VideoIcon size={48} strokeWidth={1} />
             <p className="font-medium uppercase tracking-widest text-[11px]">No videos found in gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((video) => {
               const youtubeId = getYoutubeId(video.videoUrl);
               const thumb = getThumbnail(video.videoUrl);

               return (
                <div key={video.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                  {/* Thumbnail / Placeholder Container */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 flex items-center justify-center">
                    {thumb ? (
                        <img 
                            src={thumb} 
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-slate-300">
                             <VideoIcon size={40} strokeWidth={1} />
                             <span className="text-[10px] uppercase font-bold tracking-tighter mt-1 italic">Thumbnail N/A</span>
                        </div>
                    )}
                    
                    {/* Visual Indicators (Play Icon Overlay) */}
                    <div className="absolute inset-x-0 bottom-0 top-0 m-auto h-12 w-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/90 group-hover:scale-110 transition-all duration-300 border border-white/20 shadow-xl">
                        <Play size={20} fill="currentColor" className="ml-1" />
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute top-3 left-3">
                       <button 
                          onClick={() => onStatusUpdate?.(video.id)}
                          className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border ${
                              video.isActive 
                              ? 'bg-green-500/90 text-white border-green-400' 
                              : 'bg-slate-500/90 text-white border-slate-400'
                          }`}
                       >
                          {video.isActive ? 'ACTIVE' : 'INACTIVE'}
                       </button>
                    </div>

                    {/* Platform Tag */}
                    {youtubeId && (
                        <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm p-1 rounded-md text-white shadow-sm border border-red-500">
                            <YoutubeIcon size={14} />
                        </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                       <button 
                          onClick={() => handleOpenModal(video)}
                          className="bg-white/90 hover:bg-[#00b4d8] hover:text-white text-[#00b4d8] p-3 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl"
                          title="Edit Video"
                       >
                          <Edit3 size={20} />
                       </button>
                       <button 
                          onClick={() => onDelete?.(video.id)}
                          className="bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-3 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl delay-75"
                          title="Delete Video"
                       >
                          <Trash2 size={20} />
                       </button>
                    </div>
                  </div>

                  {/* Content Footer */}
                  <div className="p-4 flex flex-col gap-1">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 uppercase tracking-tight">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#00b4d8] font-semibold truncate hover:underline cursor-pointer mb-1">
                        <ExternalLink size={10} />
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                            {video.videoUrl.split('://')[1] || video.videoUrl}
                        </a>
                    </div>
                    {video.description && (
                       <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {video.description}
                       </p>
                    )}
                    <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-50">
                       <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-medium">
                             <Info size={12} />
                             Added: {new Date(video.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                          
                          {/* 🔄 TOGGLE SWITCH */}
                          <div className="flex items-center gap-2">
                             <span className={`font-bold transition-colors ${video.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                                {video.isActive ? 'LIVE' : 'HIDDEN'}
                             </span>
                             <button 
                                onClick={() => onStatusUpdate?.(video.id)}
                                className={`w-9 h-5 rounded-full relative transition-all duration-300 shadow-inner ${
                                   video.isActive ? 'bg-green-500' : 'bg-slate-300'
                                }`}
                             >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                                   video.isActive ? 'left-[18px]' : 'left-0.5'
                                }`} />
                             </button>
                          </div>
                       </div>
                       
                       <button 
                          onClick={() => setPlayingVideo(video.videoUrl)}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-[#00b4d8]/5 hover:bg-[#00b4d8] text-[#00b4d8] hover:text-white rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border border-[#00b4d8]/20 group/btn"
                       >
                          <Play size={12} fill="currentColor" className="group-hover/btn:scale-125 transition-transform" />
                          Watch Video
                       </button>
                    </div>
                 </div>
              </div>
               );
            })}
          </div>
        )}
      </div>

      {/* 🚀 ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                    <h2 className="text-lg md:text-[20px] font-semibold text-slate-800 flex items-center gap-2">
                        <VideoIcon className="text-[#ff6b6b]" size={20} />
                        {editingVideo ? 'Edit Video Details' : 'Add New Video Link'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-left">
                    <form onSubmit={handleSubmit} id="videoForm" className="space-y-6">
                        
                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] font-bold text-slate-500 uppercase tracking-wide">Video Title / Caption <span className="text-red-500">*</span></label>
                            <input 
                                name="title" required type="text" placeholder="e.g. Campus Highlights 2026" 
                                className="w-full p-3 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-slate-50 focus:border-[#00b4d8] focus:bg-white focus:ring-4 focus:ring-[#00b4d8]/5 font-medium" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] font-bold text-slate-500 uppercase tracking-wide">Video Link (YouTube URL) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input 
                                    name="videoUrl" required type="url" placeholder="https://www.youtube.com/watch?v=..." 
                                    className="w-full p-3 pl-10 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-slate-50 focus:border-[#ff6b6b] focus:bg-white focus:ring-4 focus:ring-[#ff6b6b]/5 font-medium" 
                                    value={formData.videoUrl} 
                                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} 
                                />
                                <YoutubeIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] font-bold text-slate-500 uppercase tracking-wide">Brief Description (Optional)</label>
                            <textarea 
                                name="description" rows={3} placeholder="Tell us more about this video..." 
                                className="w-full p-3 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-slate-50 focus:border-[#00b4d8] focus:bg-white focus:ring-4 focus:ring-[#00b4d8]/5 resize-none font-medium" 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
                            />
                        </div>

                        {/* Link Preview Info */}
                        {getYoutubeId(formData.videoUrl) && (
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <CheckCircle className="text-green-500 shrink-0" size={18} />
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-green-800 uppercase tracking-tight">System identified YouTube Link</span>
                                    <span className="text-[10px] text-green-600">High-quality thumbnail will be generated automatically.</span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="videoForm"
                        disabled={isSaving} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm shadow-blue-100"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingVideo ? 'Update Video' : 'Save Video')}
                    </button>
                </div>

            </div>
        </div>
      )}

      {/* 📹 VIDEO LIGHTBOX / POPUP */}
      {playingVideo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-white/10 group">
                
                {/* Close Button */}
                <button 
                    onClick={() => setPlayingVideo(null)}
                    className="absolute top-4 right-4 z-[2001] bg-white/10 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 hover:scale-110 shadow-lg"
                >
                    <X size={24} />
                </button>

                {/* Iframe for YouTube */}
                {getYoutubeId(playingVideo) ? (
                    <iframe 
                        src={`https://www.youtube.com/embed/${getYoutubeId(playingVideo)}?autoplay=1&rel=0`}
                        title="Video Player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white gap-4 p-8 text-center">
                        <VideoIcon size={64} className="text-red-500 opacity-50" />
                        <div>
                            <p className="text-xl font-bold">Unable to Play Video</p>
                            <p className="text-sm text-slate-400 mt-1">This link might not be a direct YouTube video or is restricted.</p>
                            <a 
                                href={playingVideo} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#00b4d8] rounded-full font-bold text-sm hover:brightness-110 transition-all"
                            >
                                <ExternalLink size={16} />
                                Open Externally
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}
