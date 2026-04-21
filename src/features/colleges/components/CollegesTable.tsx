"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, Edit3, 
    Plus, School, 
    MapPin, Phone, 
    Mail, ExternalLink,
    ShieldCheck, EyeOff,
    ChevronLeft, ChevronRight,
    Filter,
    FileText
} from 'lucide-react';
import { CollegesTableProps, College, CollegeType } from "../types";

import { capitalizeWords } from "@/shared/utils/string-utils";

interface ExtendedCollegesTableProps extends Omit<CollegesTableProps, 'category'> {
    filter: 'ALL' | CollegeType;
    onFilterChange: (filter: 'ALL' | CollegeType) => void;
}

export function CollegesTable({
  data,
  filter,
  onFilterChange,
  onDelete,
  onToggleStatus,
  onToggleCourse,
  onEdit,
  onRefresh
}: ExtendedCollegesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Search Logic
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Educational Institutions
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>COLLEGES</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800 uppercase">{filter === 'ALL' ? 'ALL ARCHIVES' : filter}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or code..." 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm h-10">
            <Filter className="text-slate-400 mr-2" size={14} />
            <select 
                className="text-xs bg-transparent border-none outline-none font-semibold text-slate-600 cursor-pointer"
                value={filter}
                onChange={(e) => {
                    onFilterChange(e.target.value as any);
                    setCurrentPage(1);
                }}
            >
                <option value="ALL">All Categories</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="POLYTECHNIC">Polytechnic</option>
            </select>
          </div>

          <button 
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh List"
          >
            <RotateCw size={18} />
          </button>

          <button 
            onClick={() => onEdit?.({} as College)}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Register New Institution"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm flex flex-col min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar text-left">
          <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[1200px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm text-left">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[30%] bg-slate-50">Institution Summary</th>
                <th className="p-3 md:p-4 w-[25%] bg-slate-50">Inline Course Management</th>
                <th className="p-3 md:p-4 w-[20%] bg-slate-50 text-left">Location</th>
                <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((college, idx) => (
                <tr key={college.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium italic">
                    {college.code}
                  </td>
                  
                  {/* Summary */}
                  <td className="p-3 md:p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500 shadow-sm mt-0.5">
                             <School size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-[14px] leading-tight truncate-two-lines whitespace-normal pr-4">
                                    {capitalizeWords(college.name)}
                                </span>
                                {college.brochureUrl && (
                                  <a 
                                    href={college.brochureUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors"
                                    title="View Brochure PDF"
                                  >
                                    <FileText size={14} />
                                  </a>
                                )}
                             </div>
                            
                            {filter === 'ALL' && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  college.type === 'ENGINEERING' ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' : 'bg-orange-50 text-orange-500 border border-orange-100'
                                }`}>
                                  {college.type}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Phone size={10} className="text-[#00b4d8]" />
                                    <span>{college.contacts[0]}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 italic">
                                    <Mail size={10} />
                                    <span className="truncate max-w-[150px]">{college.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  {/* Inline Course Toggles */}
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Management & Disciplines</span>

                        </div>
                        
                        {/* List of active departments with enhanced styling */}
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {Object.entries(college.courseMatrix)
                            .filter(([_, data]) => data.isEnabled)
                            .map(([code, data]) => (
                                <div key={code} className="flex items-center bg-white border border-slate-200 rounded overflow-hidden shadow-sm h-7">
                                  <div className="bg-slate-100 px-2 h-full flex items-center border-r border-slate-200">
                                    <span className="text-[10px] font-black text-slate-600 tracking-tighter">{code}</span>
                                  </div>
                                  <div className="px-2 h-full flex items-center bg-blue-50/30">
                                    <span className="text-[11px] font-black text-blue-600">{data.seats}</span>
                                  </div>
                                </div>
                            ))}
                          {Object.values(college.courseMatrix).filter(c => c.isEnabled).length === 0 && (
                            <span className="text-[10px] text-slate-400 italic font-medium px-1">No disciplines active</span>
                          )}
                        </div>

                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-800">
                            <MapPin size={12} className="text-rose-500 shrink-0" />
                            <span className="font-bold">{college.city || college.district}</span>
                            {college.city && (
                              <span className="text-slate-400 font-medium text-[11px]">({college.district})</span>
                            )}
                        </div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest pl-4">
                            {college.state} State
                        </span>
                    </div>
                  </td>
                  
                  {/* Status Toggle Switch */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button 
                          onClick={() => onToggleStatus?.(college.id)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-100
                            ${college.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span 
                          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                            ${college.isActive ? 'translate-x-5.5' : 'translate-x-1'}`} 
                        />
                      </button>
                      <span className={`text-[9px] font-black tracking-tighter ${college.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {college.isActive ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                        onClick={() => onDelete?.(college.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove Record"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit?.(college)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Comprehensive Edit"
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
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
            <div className="text-[12px] text-slate-500 font-medium order-2 sm:order-1">
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span> records
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
                    {/* Sliding Window Pagination (Max 4 Pages) */}
                    {(() => {
                        const pages = [];
                        const maxVisible = 4;
                        let start = Math.max(1, currentPage - 1);
                        let end = Math.min(totalPages, start + maxVisible - 1);
                        
                        if (end - start + 1 < maxVisible) {
                            start = Math.max(1, end - maxVisible + 1);
                        }

                        if (start > 1) {
                            pages.push(
                                <button key={1} onClick={() => handlePageChange(1)} className="w-8 h-8 rounded-lg text-[12px] font-black text-slate-400 hover:bg-white transition-all">1</button>
                            );
                            if (start > 2) pages.push(<span key="dots-start" className="text-slate-300 px-1">...</span>);
                        }

                        for (let i = start; i <= end; i++) {
                            pages.push(
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`w-8 h-8 rounded-lg text-[12px] font-black transition-all ${
                                        currentPage === i 
                                        ? 'bg-white text-[#00b4d8] shadow-sm border border-slate-200 ring-2 ring-blue-50' 
                                        : 'text-slate-400 hover:bg-white hover:text-slate-600'
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }

                        if (end < totalPages) {
                            if (end < totalPages - 1) pages.push(<span key="dots-end" className="text-slate-300 px-1">...</span>);
                            pages.push(
                                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="w-8 h-8 rounded-lg text-[12px] font-black text-slate-400 hover:bg-white transition-all">{totalPages}</button>
                            );
                        }
                        return pages;
                    })()}
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
