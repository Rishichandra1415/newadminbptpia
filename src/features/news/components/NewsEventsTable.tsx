"use client";
import React, { useState } from "react";
import { 
    Download, Search, RotateCw, 
    Trash2, Calendar, FileText, Image as ImageIcon, 
    Link as LinkIcon, Edit3, Plus, X, Upload, CheckCircle,
    Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getFileUrl } from "@/shared/api/api-client";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { NewsEvent, NewsEventTableProps } from "../types";

export function NewsEventsTable({
  data,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave
}: NewsEventTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<NewsEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    contentType: "PDF" as NewsEvent['contentType'],
    linkUrl: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenModal = (event?: NewsEvent) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        contentType: event.contentType,
        linkUrl: event.contentType === 'LINK' ? event.actionUrl : ""
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        date: new Date().toISOString().split('T')[0],
        contentType: "PDF",
        linkUrl: ""
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
    dataToSend.append("date", formData.date);
    dataToSend.append("contentType", formData.contentType);

    if (formData.contentType === 'LINK') {
      dataToSend.append("actionUrl", formData.linkUrl);
    } else if (selectedFile) {
      dataToSend.append("file", selectedFile);
    }

    const success = await onSave?.(editingEvent?.id || null, dataToSend);
    if (success) {
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalItemsCount = filteredData.length;
  const totalPages = Math.ceil(totalItemsCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            News & Events
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>PUBLIC</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">NEWS & EVENTS</span>
          </div>
        </div>
        
        {/* Actions - EXACTLY LIKE USERS PAGE */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search news..." 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* 🔥 RED CIRCULAR BUTTON EXACTLY LIKE REFERENCE */}
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Add New Event"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* 📊 DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col min-h-0 max-h-[calc(100vh-220px)] overflow-hidden">
        {/* Table Scroll Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[700px]">
            {/* sticky thead with solid background */}
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-100 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide bg-slate-50 uppercase font-semibold shadow-sm">
                <th className="p-3 md:p-4 w-[60px] text-center">#</th> 
                <th className="p-3 md:p-4 w-[35%]">Event Details</th>
                <th className="p-3 md:p-4 w-[18%] text-center">Category</th>
                <th className="p-3 md:p-4 w-[18%] text-center">Date</th>
                <th className="p-3 md:p-4 w-[15%] text-center">Status</th>
                <th className="p-3 md:p-4 w-[10%] text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {paginatedData.map((event, idx) => (
                <tr key={event.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {startIndex + idx + 1}
                  </td>
                  
                  {/* Title & Category Info */}
                  <td className="p-3 md:p-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                            event.contentType === 'PDF' ? 'bg-red-50 text-red-500' :
                            event.contentType === 'IMAGE' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                            {event.contentType === 'PDF' && <FileText size={18} />}
                            {event.contentType === 'IMAGE' && <ImageIcon size={18} />}
                            {event.contentType === 'LINK' && <LinkIcon size={18} />}
                        </div>
                        <div className="flex flex-col gap-0.5 max-w-[300px] relative group/title">
                            <span className="font-semibold text-[#00b4d8] text-[13px] md:text-[14px] truncate cursor-help">
                              {capitalizeWords(event.title)}
                            </span>
                            
                            <div className="absolute bottom-full left-0 mb-2 invisible group-hover/title:visible opacity-0 group-hover/title:opacity-100 transition-all duration-300 z-50 pointer-events-none">
                              <div className="bg-slate-800 text-white text-[12px] py-2 px-3 rounded-lg shadow-xl min-w-[200px] max-w-[400px] whitespace-normal leading-relaxed ring-1 ring-white/10">
                                {event.title}
                                {/* Tooltip Arrow */}
                                <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-800"></div>
                              </div>
                            </div>

                            <a 
                                href={getFileUrl(event.actionUrl)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] text-slate-400 hover:text-[#00b4d8] hover:underline truncate"
                            >
                                View Source Attached
                            </a>
                        </div>
                    </div>
                  </td>
                  
                  {/* Category Chip */}
                  <td className="p-3 md:p-4 text-center">
                    <span className={`px-2 md:px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                        event.contentType === 'PDF' ? 'bg-red-50 text-red-600' :
                        event.contentType === 'IMAGE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                        {event.contentType}
                    </span>
                  </td>
                  
                  {/* Date Column */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-[12px] md:text-[13px] text-slate-500 font-light">
                        <Calendar size={14} className="text-[#00b4d8]" />
                        {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold transition-colors ${event.isActive ? 'text-green-500' : 'text-slate-300'}`}>
                          {event.isActive ? 'LIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onStatusUpdate?.(event.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             event.isActive ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${
                             event.isActive ? 'left-[16px]' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 md:pr-8 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                        onClick={() => onDelete?.(event.id)}
                        className="text-red-500 hover:text-red-600 p-1 transition-all"
                        title="Delete Event"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(event)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1 transition-all"
                        title="Edit Event"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧭 PROFESSIONAL PAGINATION BAR */}
      {totalItemsCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
            <div className="text-[12px] text-slate-500 font-medium order-2 sm:order-1">
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItemsCount)}</span> of <span className="text-slate-900 font-bold">{totalItemsCount}</span> records
            </div>
            
            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-500 hover:bg-white hover:text-[#00b4d8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all mr-2"
                >
                    <ChevronLeft size={16} />
                    Prev
                </button>
                
                <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-8 h-8 rounded-lg text-[12px] font-black transition-all ${
                                currentPage === i + 1 
                                ? 'bg-white text-[#00b4d8] shadow-sm border border-slate-200 ring-2 ring-blue-50' 
                                : 'text-slate-400 hover:bg-white hover:text-slate-600'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-500 hover:bg-white hover:text-[#00b4d8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all ml-2"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}

      {/* 🚀 ADD/EDIT MODAL - Matching EXACT Reference UI ✨ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                    <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
                        {editingEvent ? 'Edit News/Event' : 'Add New Event'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-left">
                    <form onSubmit={handleSubmit} id="eventForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Column 1: Basic Info */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Basic Info</h3>
                            
                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Event Title <span className="text-red-500">*</span></label>
                                <input 
                                    name="title" required type="text" placeholder="e.g. Tech Seminar 2026" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: capitalizeWords(e.target.value)})} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Publish Date <span className="text-red-500">*</span></label>
                                <input 
                                    name="date" required type="date" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    value={formData.date} 
                                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Column 2: Content Details */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2">Content Details</h3>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Content Type <span className="text-red-500">*</span></label>
                                <select 
                                    name="contentType" required 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] appearance-none cursor-pointer"
                                    value={formData.contentType} 
                                    onChange={(e) => setFormData({...formData, contentType: e.target.value as any})}
                                >
                                    <option value="PDF">PDF Document</option>
                                    <option value="IMAGE">Direct Image</option>
                                    <option value="LINK">External Link</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">
                                    {formData.contentType === 'LINK' ? 'External Web Link (URL)' : 'Upload Attachment'} 
                                    {formData.contentType === 'LINK' && <span className="text-red-500"> *</span>}
                                    {formData.contentType !== 'LINK' && <span className="text-slate-400 italic font-normal text-[10px] ml-1">(Optional / Supported formats)</span>}
                                </label>
                                
                                {formData.contentType === 'LINK' ? (
                                    <input 
                                        name="linkUrl" required type="url" placeholder="https://example.com" 
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                        value={formData.linkUrl} 
                                        onChange={(e) => setFormData({...formData, linkUrl: e.target.value})} 
                                    />
                                ) : (
                                    <div className="relative group/upload">
                                        <input 
                                            type="file" 
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept={formData.contentType === 'PDF' ? "application/pdf" : "image/*"}
                                        />
                                        <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all ${
                                            selectedFile 
                                            ? 'border-[#3ed4b2] bg-[#3ed4b2]/10' 
                                            : 'border-slate-200 bg-white group-hover/upload:border-[#00b4d8]'
                                        }`}>
                                            <div className={`p-1.5 rounded-md ${selectedFile ? 'bg-[#3ed4b2] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                {selectedFile ? <CheckCircle size={16} /> : <Upload size={16} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[13px] font-medium ${selectedFile ? 'text-slate-800' : 'text-slate-500'}`}>
                                                    {selectedFile ? selectedFile.name : `Choose ${formData.contentType} file`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                        form="eventForm"
                        disabled={isSaving} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingEvent ? 'Update Event' : 'Save Event')}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}