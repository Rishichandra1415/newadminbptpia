"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, FileText, Globe, 
    Link as LinkIcon, Edit3, Plus, 
    Download, ExternalLink, Filter,
    ChevronUp, ChevronDown, GraduationCap,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { DownloadItem, DownloadType } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { getFileUrl } from "@/shared/api/api-client";

interface DownloadsTableProps {
  data: DownloadItem[];
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onEdit: (item: DownloadItem) => void;
  onRefresh: () => void;
}

export function DownloadsTable({
  data,
  onDelete,
  onToggleStatus,
  onEdit,
  onRefresh
}: DownloadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<DownloadType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || FileText;
    return <IconComponent size={20} />;
  };

  const getFormatSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIdx = 0;
    while (size >= 1024 && unitIdx < units.length - 1) {
      size /= 1024;
      unitIdx++;
    }
    return `${size.toFixed(1)} ${units[unitIdx]}`;
  };

  return (
    <div className="h-full flex flex-col gap-4 md:gap-5 w-full font-sans max-w-full">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Downloads & Links
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>RESOURCES</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">DOWNLOADS</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search downloads..." 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm h-10">
            <Filter className="text-slate-400 mr-2" size={14} />
            <select 
                className="text-xs bg-transparent border-none outline-none font-semibold text-slate-600 cursor-pointer"
                value={typeFilter}
                onChange={(e) => {
                    setTypeFilter(e.target.value as any);
                    setCurrentPage(1); // Reset to page 1 on filter
                }}
            >
                <option value="ALL">All Types</option>
                <option value="STUDENT_DOWNLOAD">Downloads</option>
                <option value="SUPPORT_LINK">Support Links</option>
                <option value="QUICK_LINK">Quick Links</option>
            </select>
          </div>

          <button 
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>
          
          <button 
            onClick={() => onEdit({} as DownloadItem)}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Add New Resource"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>

        </div>
      </div>

      {/* 📊 DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden max-h-[calc(100vh-220px)]">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] md:text-[12px] text-[#00b4d8] tracking-widest uppercase font-bold shadow-sm">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[35%] bg-slate-50 text-left">Resource Summary</th>
                <th className="p-3 md:p-4 w-[25%] bg-slate-50 text-left">Link / File Info</th>
                <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Order</th>
                <th className="p-3 md:p-4 w-[12%] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[12%] text-right pr-8 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {startIndex + idx + 1}
                  </td>
                  
                  {/* Title & Icon Info */}
                  <td className="p-3 md:p-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                            item.type === 'STUDENT_DOWNLOAD' ? 'bg-blue-50 text-blue-500' :
                            item.type === 'SUPPORT_LINK' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                        } shadow-sm border border-white/50 ring-1 ring-slate-100`}>
                            {getIcon(item.icon)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-800 text-[14px]">
                                {capitalizeWords(item.title)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                                {item.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                  </td>
                  
                  {/* File / URL Info */}
                  <td className="p-3 md:p-4 text-left">
                    <div className="flex flex-col gap-1">
                        {item.type === 'STUDENT_DOWNLOAD' ? (
                            <div className="flex flex-col gap-0.5">
                                <a 
                                    href={getFileUrl((() => {
                                        const path = item.fileUrl;
                                        if (Array.isArray(path)) return path[0];
                                        if (typeof path === 'string' && path.startsWith('[')) {
                                            try {
                                                const parsed = JSON.parse(path);
                                                return Array.isArray(parsed) ? parsed[0] : path;
                                            } catch (e) { return path; }
                                        }
                                        return path;
                                    })())} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[12px] text-slate-600 font-medium flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                                >
                                    <Download size={12} className="text-[#00b4d8]" />
                                    PDF Attachment
                                </a>
                                <span className="text-[10px] text-slate-400 pl-4.5">
                                    Size: {getFormatSize(item.fileSize)} | Downloads: {item.downloadCount}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                <a 
                                    href={item.externalUrl} target="_blank" rel="noreferrer"
                                    className="text-[12px] text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1.5 hover:underline"
                                >
                                    <ExternalLink size={12} />
                                    {item.externalUrl?.replace('https://', '').slice(0, 30)}...
                                </a>
                                <span className="text-[10px] text-slate-400 pl-4.5">
                                    Total Hits: {item.downloadCount}
                                </span>
                            </div>
                        )}
                    </div>
                  </td>
                  
                  {/* Display Order */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-[13px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                             {item.displayOrder}
                        </span>
                    </div>
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold transition-colors ${item.isActive ? 'text-green-500' : 'text-slate-300'}`}>
                          {item.isActive ? 'ACTIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onToggleStatus?.(item.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             item.isActive ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${
                             item.isActive ? 'right-0.5' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 md:pr-8 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3 text-right">
                      <button 
                        onClick={() => onDelete?.(item.id)}
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit?.(item)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Edit Resource"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                  <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                          No resources found matching your search.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧭 PROFESSIONAL PAGINATION BAR */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
            <div className="text-[12px] text-slate-500 font-medium order-2 sm:order-1">
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span> resources
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
    </div>
  );
}
