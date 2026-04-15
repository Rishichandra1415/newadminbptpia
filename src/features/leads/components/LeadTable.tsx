"use client";

import React, { useState } from "react";
import { 
    Download, Search, RotateCw, 
    Trash2, Mail, Phone, ChevronDown, 
    Check, Clock, Archive, Send,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { LeadTableProps, Lead } from "../types";

export function LeadTable({
  data,
  baseUrl,
  onDelete,
  onRefresh,
  onExport,
  onSearch,
  onStatusUpdate
}: LeadTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Reset to page 1 when data changes (e.g. on search)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Pagination Logic
  const totalItemsCount = data.length;
  const totalPages = Math.ceil(totalItemsCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const statusOptions: { label: Lead['status']; icon: any; color: string; bgColor: string }[] = [
    { label: 'NEW', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'PROCESSED', icon: Send, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'ARCHIVED', icon: Archive, color: 'text-slate-600', bgColor: 'bg-slate-50' },
    { label: 'CLOSED', icon: Check, color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full font-sans max-w-full overflow-hidden">
      
      {/* 🔝 HEADER SECTION - Improved Responsiveness */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-2">
        <div className="w-full lg:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Contact Leads
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>LEADS</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">CONTACTS</span>
          </div>
        </div>
        
        {/* Actions - Responsive Grid/Flex */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#00d2d312] text-[#00b4d8] border border-[#00d2d330] rounded-lg text-sm font-semibold hover:bg-[#00d2d31a] transition-colors w-full sm:w-auto shadow-sm"
          >
            <Download size={16} />
            Export
          </button>

          <div className="flex flex-grow items-center bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm h-10 w-full sm:min-w-[280px]">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              onChange={(e) => onSearch?.(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={onRefresh}
            className="hidden sm:flex p-2.5 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-400 hover:text-slate-600 transition-colors h-10 items-center justify-center"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      {/* 📊 DATA TABLE SECTION - Standardized Height */}
      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-0 max-h-[calc(100vh-220px)] overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-50 text-[13px] text-[#00b4d8] tracking-wide font-medium bg-white">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#00b4d8] cursor-pointer accent-[#00b4d8]" />
                </th> 
                <th className="p-4 font-medium min-w-[180px]">Lead Details</th>
                <th className="p-4 font-medium min-w-[300px]">Message</th>
                <th className="p-4 font-medium w-[120px] text-center">Source</th>
                <th className="p-4 font-medium w-[160px] text-center">Status</th>
                <th className="p-4 font-medium text-right pr-6 w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((lead, idx) => (
                <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group relative">
                  <td className="p-4 text-center">
                    <span className="text-xs text-slate-400 font-medium">{startIndex + idx + 1}</span>
                  </td>
                  
                  {/* Lead Details */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-slate-700 text-sm truncate max-w-[180px]" title={lead.fullName}>
                        {lead.fullName}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 text-left">
                        <Mail size={12} className="opacity-70" />
                        <span className="truncate max-w-[160px]">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 text-left">
                        <Phone size={12} className="opacity-70" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Message */}
                  <td className="p-4">
                    <div className="max-w-[450px] overflow-hidden">
                      <p className="text-xs text-slate-500 italic leading-relaxed whitespace-pre-wrap break-words line-clamp-2 md:line-clamp-3" title={lead.message}>
                        {lead.message}
                      </p>
                    </div>
                  </td>
                  
                  {/* Source */}
                  <td className="p-4 text-center">
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-400 border border-slate-100 rounded tracking-wider uppercase">
                      {lead.sourcePage}
                    </span>
                  </td>
                  
                  {/* Interactive Status Dropdown */}
                  <td className="p-4 relative">
                    <div className="flex justify-center">
                        <div className="relative inline-block text-left">
                            <button 
                                onClick={() => setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)}
                                className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white min-w-[130px] shadow-sm hover:border-[#00b4d8] transition-all group/status"
                            >
                                <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                    lead.status === 'NEW' ? 'text-blue-500' : 
                                    lead.status === 'CLOSED' ? 'text-green-500' : 
                                    lead.status === 'PROCESSED' ? 'text-amber-500' : 'text-slate-400'
                                }`}>
                                    {lead.status}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${openDropdownId === lead.id ? 'rotate-180' : ''}`} />
                            </button>

                            {openDropdownId === lead.id && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[100]" 
                                        onClick={() => setOpenDropdownId(null)}
                                    />
                                    <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="py-1">
                                            {statusOptions.map((opt) => (
                                                <button
                                                    key={opt.label}
                                                    onClick={() => {
                                                        onStatusUpdate?.(lead.id, opt.label);
                                                        setOpenDropdownId(null);
                                                    }}
                                                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-[11px] font-bold transition-colors hover:bg-slate-50 ${
                                                        lead.status === opt.label ? 'bg-blue-50/50 text-[#00b4d8]' : 'text-slate-600'
                                                    }`}
                                                >
                                                    <opt.icon size={15} className={opt.color} />
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end">
                      <button 
                        onClick={() => onDelete?.(lead.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
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
    </div>
  );
}
