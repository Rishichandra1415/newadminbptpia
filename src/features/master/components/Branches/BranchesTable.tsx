"use client";

import React, { useState } from "react";
import { 
    Plus, Search, RotateCw, 
    Trash2, Edit3, ShieldAlert,
    ChevronLeft, ChevronRight,
    GitBranch, Filter
} from 'lucide-react';
import { BranchTableProps } from "../../types";

export function BranchesTable({
  data,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading
}: BranchTableProps) {
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
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full overflow-hidden">
      
      {/* 🔝 HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide capitalize">
            Branch Management
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>MASTER</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">BRANCHES</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder={`Search branches...`} 
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
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
            title={`Add New Branch`}
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
                <th className="p-3 md:p-4 bg-slate-50 text-left">Branch Summary</th>
                <th className="p-3 md:p-4 w-[150px] text-left bg-slate-50">Category</th>
                <th className="p-3 md:p-4 w-[180px] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-8 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-10 w-10 border-4 border-cyan-100 border-t-[#00b4d8] rounded-full animate-spin" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing branches...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData?.length > 0 ? paginatedData.map((branch, idx) => (
                <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium italic">
                    {startIndex + idx + 1}
                  </td>
                  
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500 shadow-sm border border-white/50 ring-1 ring-slate-100">
                            <GitBranch size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-800 text-[14px]">
                                {branch.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                                {branch.course?.name || 'ACADEMIC BRANCH'}
                            </span>
                        </div>
                    </div>
                  </td>

                  <td className="p-3 md:p-4 text-left">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border shadow-sm ${
                        branch.courseType === 'ENGINEERING' 
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                        {branch.courseType || 'NOT SPECIFIED'}
                    </span>
                  </td>

                  {/* 🔄 STANDARDIZED PILL TOGGLE UI */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-3 group/toggle">
                       <span className={`text-[10px] font-bold tracking-wide transition-colors ${branch.isActive ? 'text-green-500' : 'text-slate-300'}`}>
                          {branch.isActive ? 'ACTIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onToggleStatus(branch.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             branch.isActive ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                          title={branch.isActive ? "Hide from portals" : "Activate for portals"}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${
                             branch.isActive ? 'right-0.5' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  <td className="p-3 md:p-4 pr-8 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                         onClick={() => onDelete(branch.id)} 
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Branch"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit(branch)} 
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Edit Branch"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ShieldAlert size={40} className="mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-slate-600 italic">No branches found matching criteria</p>
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
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItemsCount)}</span> of <span className="text-slate-900 font-bold">{totalItemsCount}</span> branches
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
