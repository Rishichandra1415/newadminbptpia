"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, Edit3, 
    Plus, School, 
    MapPin, Phone, 
    Mail, ExternalLink,
    ShieldCheck, EyeOff,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { CollegesTableProps, College } from "../types";
import { CourseToggleGroup } from "./CourseToggleGroup";
import { capitalizeWords } from "@/shared/utils/string-utils";

export function CollegesTable({
  data,
  category,
  onDelete,
  onToggleStatus,
  onToggleCourse,
  onEdit,
  onRefresh
}: CollegesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

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
            {category === 'engineering' ? 'Engineering Colleges' : 'Polytechnic Colleges'}
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>COLLEGES</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800 uppercase">{category}</span>
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
            title="Register New College"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0 max-h-[calc(100vh-220px)]">
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
                            <span className="font-bold text-slate-800 text-[14px] leading-tight truncate-two-lines whitespace-normal pr-4">
                                {capitalizeWords(college.name)}
                            </span>
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
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest pl-1">Toggle Disciplines</span>
                        <CourseToggleGroup 
                          category={category}
                          selectedCourses={college.courseMatrix}
                          onToggle={(code) => onToggleCourse?.(college.id, code)}
                        />
                    </div>
                  </td>

                  {/* Location */}
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-700">
                            <MapPin size={12} className="text-red-400" />
                            <span className="font-semibold">{college.district}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest pl-4">
                            {college.state} State
                        </span>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="p-3 md:p-4 text-center">
                    <button 
                        onClick={() => onToggleStatus?.(college.id)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all border
                           ${college.isActive 
                           ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                           : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                       }`}
                    >
                        {college.isActive ? <ShieldCheck size={12} /> : <EyeOff size={12} />}
                        {college.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </button>
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
