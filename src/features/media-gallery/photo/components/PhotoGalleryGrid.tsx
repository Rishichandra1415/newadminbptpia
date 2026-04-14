"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, Trash2, Edit3, Plus, X, Upload, 
    CheckCircle, Filter, Image as ImageIcon, Info, Eye
} from 'lucide-react';
import { getFileUrl } from "@/shared/api/api-client";
import { PhotoGalleryEntry, PhotoGalleryGridProps } from "../types";

export function PhotoGalleryGrid({
  data,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave
}: PhotoGalleryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoGalleryEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenModal = (photo?: PhotoGalleryEntry) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        title: photo.title,
        description: photo.description || "",
      });
    } else {
      setEditingPhoto(null);
      setFormData({
        title: "",
        description: "",
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);

    if (selectedFile) {
      dataToSend.append("image", selectedFile);
    }

    const success = await onSave?.(editingPhoto?.id || null, dataToSend);
    if (success) {
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col gap-6 w-full font-sans max-w-full">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Photo Gallery
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>MEDIA</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">PHOTO GALLERY</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search photos..." 
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
            title="Add New Photo"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* 🖼️ GRID SECTION */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-6 px-1">
        {filteredData.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-xl">
             <ImageIcon size={48} strokeWidth={1} />
             <p className="font-medium uppercase tracking-widest text-[11px]">No photos found in gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((photo) => (
              <div key={photo.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img 
                    src={getFileUrl(photo.imagePath)} 
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                     <button 
                        onClick={() => onStatusUpdate?.(photo.id)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border ${
                            photo.isActive 
                            ? 'bg-green-500/90 text-white border-green-400' 
                            : 'bg-slate-500/90 text-white border-slate-400'
                        }`}
                     >
                        {photo.isActive ? 'ACTIVE' : 'INACTIVE'}
                     </button>
                  </div>

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                     <button 
                        onClick={() => handleOpenModal(photo)}
                        className="bg-white/90 hover:bg-[#00b4d8] hover:text-white text-[#00b4d8] p-3 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl"
                        title="Edit Photo"
                     >
                        <Edit3 size={20} />
                     </button>
                     <button 
                        onClick={() => onDelete?.(photo.id)}
                        className="bg-white/90 hover:bg-red-500 hover:text-white text-red-500 p-3 rounded-full transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl delay-75"
                        title="Delete Photo"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
                </div>

                {/* Content Footer */}
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1 uppercase tracking-tight">
                    {photo.title}
                  </h3>
                  {photo.description && (
                     <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {photo.description}
                     </p>
                  )}
                   <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-50">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                         <span className="flex items-center gap-1 font-medium">
                            <Info size={12} />
                            Uploaded: {new Date(photo.createdAt || Date.now()).toLocaleDateString()}
                         </span>
                         
                         {/* 🔄 TOGGLE SWITCH */}
                         <div className="flex items-center gap-2">
                            <span className={`font-bold transition-colors ${photo.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                               {photo.isActive ? 'LIVE' : 'HIDDEN'}
                            </span>
                            <button 
                               onClick={() => onStatusUpdate?.(photo.id)}
                               className={`w-9 h-5 rounded-full relative transition-all duration-300 shadow-inner ${
                                  photo.isActive ? 'bg-green-500' : 'bg-slate-300'
                               }`}
                            >
                               <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                                  photo.isActive ? 'left-[18px]' : 'left-0.5'
                               }`} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                    <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
                        {editingPhoto ? 'Edit Gallery Photo' : 'Upload New Photo'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-left">
                    <form onSubmit={handleSubmit} id="photoForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        
                        {/* Column 1: Metadata */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Photo info</h3>
                            
                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Caption / Title <span className="text-red-500">*</span></label>
                                <input 
                                    name="title" required type="text" placeholder="e.g. Annual Tech Fest 2026" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Description (Optional)</label>
                                <textarea 
                                    name="description" rows={4} placeholder="Brief details about this photo..." 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] resize-none" 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value.replace(/\b\w/g, c => c.toUpperCase())})} 
                                />
                            </div>
                        </div>

                        {/* Column 2: Upload */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Image upload</h3>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Choose Image {!editingPhoto && <span className="text-red-500">*</span>}</label>
                                <div className="relative group/upload h-[180px]">
                                    <input 
                                        type="file" 
                                        required={!editingPhoto}
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                    />
                                    <div className={`flex flex-col items-center justify-center gap-3 px-3 py-6 border-2 border-dashed rounded-xl h-full transition-all ${
                                        selectedFile 
                                        ? 'border-[#3ed4b2] bg-[#3ed4b2]/5' 
                                        : 'border-slate-200 bg-slate-50/50 group-hover/upload:border-[#00b4d8] group-hover/upload:bg-white'
                                    }`}>
                                        {selectedFile ? (
                                           <div className="flex flex-col items-center gap-2">
                                              <div className="bg-[#3ed4b2] text-white p-2 rounded-full shadow-lg">
                                                 <CheckCircle size={24} />
                                              </div>
                                              <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[250px]">
                                                 {selectedFile.name}
                                              </span>
                                              <span className="text-[10px] text-slate-400">Click or Drag to replace</span>
                                           </div>
                                        ) : (
                                           <div className="flex flex-col items-center gap-2">
                                              <div className="bg-slate-100 text-slate-400 p-3 rounded-full">
                                                 <Upload size={24} />
                                              </div>
                                              <span className="text-[13px] font-medium text-slate-500">Upload JPG, PNG or WEBP</span>
                                              <span className="text-[11px] text-slate-400 font-light">Max size: 5MB</span>
                                           </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {editingPhoto && !selectedFile && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                                   <Eye className="text-blue-500 shrink-0" size={18} />
                                   <div className="flex flex-col">
                                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Current Preview</span>
                                      <span className="text-[10px] text-blue-600 truncate max-w-[200px]">{editingPhoto.imagePath}</span>
                                   </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="photoForm"
                        disabled={isSaving} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingPhoto ? 'Update Photo' : 'Save Photo')}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}
