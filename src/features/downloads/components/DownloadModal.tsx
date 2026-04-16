"use client";

import React, { useState, useEffect } from "react";
import { 
    X, Save, FileText, Globe, 
    Link as LinkIcon, Upload, CheckCircle,
    Hash, Type, LayoutList, GraduationCap,
    Info, BookOpen, AlertCircle,
    RotateCw,
    Plus
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { DownloadItem, DownloadFormData, DownloadType } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: FormData) => Promise<boolean>;
  editData: DownloadItem | null;
}

const AVAILABLE_ICONS = [
  'FileText', 'Globe', 'Link', 'GraduationCap', 
  'BookOpen', 'FileCheck', 'Download', 'Info',
  'HelpCircle', 'Award', 'Calendar', 'Briefcase'
];

export function DownloadModal({
  isOpen,
  onClose,
  onSave,
  editData
}: DownloadModalProps) {
  const [formData, setFormData] = useState<Partial<DownloadFormData>>({
    type: 'STUDENT_DOWNLOAD',
    title: "",
    description: "",
    externalUrl: "",
    icon: "FileText",
    displayOrder: 1,
    isActive: true
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editData && editData.id) {
      setFormData({
        type: editData.type,
        title: editData.title,
        description: editData.description,
        externalUrl: editData.externalUrl,
        icon: editData.icon,
        displayOrder: editData.displayOrder,
        isActive: editData.isActive
      });
    } else {
      setFormData({
        type: 'STUDENT_DOWNLOAD',
        title: "",
        description: "",
        externalUrl: "",
        icon: "FileText",
        displayOrder: 1,
        isActive: true
      });
    }
    setSelectedFile(null);
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Construct FormData for multipart/form-data support
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title || "");
    dataToSend.append("type", formData.type || "STUDENT_DOWNLOAD");
    dataToSend.append("description", formData.description || "");
    dataToSend.append("icon", formData.icon || "FileText");
    dataToSend.append("displayOrder", (formData.displayOrder || 1).toString());
    dataToSend.append("isActive", (formData.isActive ?? true).toString());

    // Append both if they exist
    if (selectedFile) {
        dataToSend.append("file", selectedFile);
    }
    
    if (formData.externalUrl) {
        dataToSend.append("externalUrl", formData.externalUrl);
    }

    const success = await onSave(editData?.id || null, dataToSend);
    if (success) {
      onClose();
    }
    setIsSaving(false);
  };

  const renderIcon = (iconName: string, size = 16) => {
    const IconComponent = (LucideIcons as any)[iconName] || FileText;
    return <IconComponent size={size} />;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${editData ? 'bg-cyan-50 text-[#00b4d8]' : 'bg-blue-50 text-blue-500'}`}>
              {editData ? <FileText size={22} /> : <Plus size={22} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {editData?.id ? 'Edit Resource' : 'Register New Resource'}
              </h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Resources & Downloads Management
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30">
          <form id="downloadForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Type & Classification */}
            <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                    <BadgeIcon size={16} className="text-[#00b4d8]" />
                    <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Classification</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Resource Type</label>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 rounded-lg border border-slate-200">
                            {(['STUDENT_DOWNLOAD', 'SUPPORT_LINK', 'QUICK_LINK'] as DownloadType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: t })}
                                    className={`py-2 px-1 text-[10px] font-black rounded-md transition-all ${
                                        formData.type === t 
                                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Visual Icon</label>
                        <div className="flex flex-wrap gap-3 p-3 bg-white rounded-lg border border-slate-200 max-h-[160px] overflow-y-auto custom-scrollbar">
                            {AVAILABLE_ICONS.map(i => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: i })}
                                    className={`p-2.5 rounded-lg transition-all border ${
                                        formData.icon === i 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                        : 'text-slate-400 hover:bg-slate-50 border-slate-100'
                                    }`}
                                    title={i}
                                >
                                    {renderIcon(i, 20)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Details */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Information */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2">
                        <Info size={16} className="text-blue-500" />
                        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">Basic Information</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Resource Title</label>
                            <input 
                                required type="text" placeholder="e.g. Admission Form 2026" 
                                className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none transition-all" 
                                value={formData.title || ""} 
                                onChange={(e) => setFormData({...formData, title: capitalizeWords(e.target.value)})} 
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Short Description</label>
                            <textarea 
                                rows={3} placeholder="Provide context about this resource..." 
                                className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                                value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Display Order</label>
                                <div className="relative">
                                    <LayoutList size={14} className="absolute left-3 top-3 text-slate-400" />
                                    <input 
                                        type="number" 
                                        name="displayOrder"
                                        className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                                        value={formData.displayOrder || 1} 
                                        onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 1})} 
                                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Status</label>
                                <div className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                                    <span className={`text-[11px] font-bold ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                        {formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                        className={`w-9 h-5 rounded-full relative transition-all ${formData.isActive ? 'bg-green-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${formData.isActive ? 'right-0.5' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unified Attachment Section */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2">
                        <Upload size={16} className="text-purple-500" />
                        <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                            Attachments & Links
                        </h3>
                    </div>

                    <div className="flex flex-col gap-6 p-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                        {/* 1. PDF Upload Area */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-white rounded-md border border-slate-100 shadow-sm text-[#00b4d8]">
                                    <Upload size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Upload PDF Document</span>
                            </div>
                            
                            <div className="relative group/upload">
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all ${
                                    selectedFile 
                                    ? 'border-[#3ed4b2] bg-white shadow-sm' 
                                    : 'border-slate-300 bg-white group-hover/upload:border-blue-400'
                                }`}>
                                    <div className={`p-1.5 rounded-md ${selectedFile ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {selectedFile ? <CheckCircle size={14} /> : <FileText size={14} />}
                                    </div>
                                    <span className={`text-[11px] font-bold truncate flex-1 ${selectedFile ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {selectedFile ? selectedFile.name : 'Select file to upload...'}
                                    </span>
                                    {selectedFile && (
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFile(null); }}
                                            className="z-20 p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Visual Divider */}
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase italic">AND / OR</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* 2. Link Destination Area */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-white rounded-md border border-slate-100 shadow-sm text-orange-500">
                                    <Globe size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Destination Link (URL)</span>
                            </div>
                            
                            <div className="relative">
                                <LinkIcon size={14} className="absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    type="url" placeholder="https://example.com/resource-link" 
                                    className="w-full pl-9 p-3 rounded-lg text-sm border border-slate-300 focus:border-orange-400 outline-none transition-all bg-white shadow-sm" 
                                    value={formData.externalUrl || ""} onChange={(e) => setFormData({...formData, externalUrl: e.target.value})} 
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium ml-1 flex items-center gap-1.5">
                                <AlertCircle size={10} className="text-amber-500" />
                                Paste full URL starting with http:// or https://
                            </p>
                        </div>
                    </div>
                </div>
            </section>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
          <button 
            type="submit" 
            form="downloadForm"
            disabled={isSaving} 
            className={`px-8 py-2.5 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg ${
                editData ? 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {isSaving ? <RotateCw className="animate-spin" size={16} /> : <Save size={16} />}
            {editData?.id ? 'Update Resource' : 'Save Resource'}
          </button>
        </div>

      </div>
    </div>
  );
}

function BadgeIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        </svg>
    );
}
