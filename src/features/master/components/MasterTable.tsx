"use client";

import React, { useState } from "react";
import { 
    Plus, Search, RotateCw, 
    Trash2, Edit3, MoreHorizontal, ShieldAlert,
    CheckCircle, Filter,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { MasterTableProps } from "../types";

export function MasterTable({
  entity,
  data,
  onAdd,
  onEdit,
  onDelete,
  isLoading,
  filter
}: MasterTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* 🔝 HEADER SECTION - */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide capitalize">
            {entity} Management
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>MASTER</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">{entity.toUpperCase()}S</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${entity}s...`} 
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          {filter}

          <button 
            onClick={onAdd}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title={`Add New ${entity}`}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 📊 DATA TABLE SECTION - Standardized Height */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0 max-h-[calc(100vh-220px)]">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 bg-slate-50 text-left">
                  {entity === 'state' ? 'State Name' : 'City Name'}
                </th>
                {entity === 'city' && (
                  <th className="p-3 md:p-4 bg-slate-50 text-left">Parent State</th>
                )}
                <th className="p-3 md:p-4 w-[120px] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={entity === 'city' ? 5 : 4} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 border-4 border-cyan-100 border-t-[#00b4d8] rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Synchronizing {entity}s...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData?.length > 0 ? paginatedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group text-left">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {startIndex + idx + 1}
                  </td>
                  
                  <td className="p-3 md:p-4">
                    <span className="font-semibold text-slate-800 text-[13px] md:text-[14px]">{item.name}</span>
                  </td>

                  {entity === 'city' && (
                    <td className="p-3 md:p-4 text-left">
                      <span className="text-[11px] font-medium text-[#00b4d8] bg-cyan-50 px-2 py-0.5 rounded tracking-wide uppercase">
                        {item.state?.name || 'GENERIC'}
                      </span>
                    </td>
                  )}
                  
                  <td className="p-3 md:p-4 text-center">
                    <span className="flex items-center justify-center gap-1.5 px-2 md:px-3 py-1 bg-green-50 text-green-600 text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-md mx-auto w-fit">
                      ACTIVE
                    </span>
                  </td>
                  
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                         onClick={() => onDelete(item.id)} 
                        className="text-red-500 hover:text-red-600 p-1 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit(item)} 
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1 transition-all"
                        title="Edit"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                     
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={entity === 'city' ? 5 : 4} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldAlert size={40} className="mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-slate-600 italic">No records found for {entity} module</p>
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
                    {/* Sliding Window Pagination */}
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
                                <button key={1} onClick={() => handlePageChange(1)} className="w-8 h-8 rounded-lg text-[12px] font-black text-slate-400 hover:bg-white">1</button>
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
                                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="w-8 h-8 rounded-lg text-[12px] font-black text-slate-400 hover:bg-white">{totalPages}</button>
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
