"use client";

import React, { useState } from "react";
import { 
    Plus, Search, RotateCw, 
    Trash2, Edit3, ShieldAlert,
    ChevronLeft, ChevronRight,
    MapPin, Filter
} from 'lucide-react';
import { ExamCenterTableProps } from "../../types";

// Using Lucide-react icons
import * as Icons from 'lucide-react';

export function ExamCentersTable({
  data,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading
}: ExamCenterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<'ALL' | 'ENGINEERING' | 'POLYTECHNIC'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Increased page size for better view

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = currentFilter === 'ALL' || item.courseType === currentFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalItemsCount = filteredData?.length || 0;
  const totalPages = Math.ceil(totalItemsCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData?.slice(startIndex, startIndex + pageSize) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full overflow-hidden">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide capitalize">
            Examination Center Management
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>MASTER</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">EXAM CENTERS</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-64">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder={`Search centers...`} 
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-44">
            <Filter className="text-[#00b4d8] mr-2 shrink-0" size={16} />
            <select 
                className="bg-transparent border-none outline-none text-[12px] font-bold w-full text-slate-600 cursor-pointer appearance-none"
                value={currentFilter}
                onChange={(e) => {
                    setCurrentFilter(e.target.value as any);
                    setCurrentPage(1);
                }}
            >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="ENGINEERING">ENGINEERING</option>
                <option value="POLYTECHNIC">POLYTECHNIC</option>
            </select>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>

          <button 
            onClick={onAdd}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title={`Add New Center`}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 📊 DATA TABLE SECTION - Optimized for Internal Scroll */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0 max-h-[calc(100vh-220px)]">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] md:text-[12px] text-[#00b4d8] tracking-widest uppercase font-bold shadow-sm">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 bg-slate-50 text-left">Center Location Summary</th>
                <th className="p-3 md:p-4 w-[150px] text-left bg-slate-50">Course Type</th>
                <th className="p-3 md:p-4 w-[120px] text-center bg-slate-50">Auth ID</th>
                <th className="p-3 md:p-4 w-[180px] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-8 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 border-4 border-cyan-100 border-t-[#00b4d8] rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing centers...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData?.length > 0 ? paginatedData.map((center, idx) => (
                <tr key={center.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium italic">
                    {startIndex + idx + 1}
                  </td>
                  
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-emerald-50 text-emerald-500 shadow-sm border border-white/50 ring-1 ring-slate-100">
                            <Icons.MapPin size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-800 text-[14px]">
                                {center.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                                OFFICIAL EXAM CENTER
                            </span>
                        </div>
                    </div>
                  </td>
                  
                  <td className="p-3 md:p-4 text-left">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border shadow-sm ${
                        center.courseType === 'ENGINEERING' 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                        {center.courseType}
                    </span>
                  </td>

                  <td className="p-3 md:p-4 text-center">
                    <span className="text-[13px] font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 uppercase tracking-tighter">
                         EC-{center.id.toString().padStart(3, '0')}
                    </span>
                  </td>

                  {/* 🔄 STANDARDIZED PILL TOGGLE UI */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-3 group/toggle">
                       <span className={`text-[10px] font-bold tracking-wide transition-colors ${center.status === 'ACTIVE' ? 'text-green-500' : 'text-slate-300'}`}>
                          {center.status === 'ACTIVE' ? 'ACTIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onToggleStatus(center.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             center.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                          title={center.status === 'ACTIVE' ? "Disable center" : "Enable center"}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${
                             center.status === 'ACTIVE' ? 'right-0.5' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  <td className="p-3 md:p-4 pr-8 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                         onClick={() => onDelete(center.id)} 
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Center"
                      >
                        <Icons.Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit(center)} 
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Edit Center"
                      >
                        <Icons.Edit3 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Icons.ShieldAlert size={40} className="mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-slate-600 italic">No examination centers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧭 PROFESSIONAL PAGINATION BAR */}
      {totalItemsCount > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2 text-left">
            <div className="text-[12px] text-slate-500 font-medium order-2 sm:order-1">
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItemsCount)}</span> of <span className="text-slate-900 font-bold">{totalItemsCount}</span> centers
            </div>
            
            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-500 hover:bg-white hover:text-[#00b4d8] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all mr-2"
                >
                    <Icons.ChevronLeft size={16} />
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
                    <Icons.ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
