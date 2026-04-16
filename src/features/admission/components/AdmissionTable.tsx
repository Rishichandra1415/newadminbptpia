"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, User, Phone, 
    Mail, GraduationCap,
    Eye, Edit3, CheckCircle2,
    Clock, BadgeCheck,
    ChevronLeft, ChevronRight,
    CreditCard, AlertCircle
} from 'lucide-react';
import { AdmissionForm, AdmissionTableProps } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";

export function AdmissionTable({
  data,
  onView,
  onEdit,
  onDelete,
  isLoading
}: AdmissionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const filteredData = data.filter(item => 
    item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.mobileNumber.includes(searchTerm) ||
    item.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
            Student Admissions
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>ACADEMIC</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">ADMISSION FORMS</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-80">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, application # or mobile..." 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-[13px] md:text-sm w-full text-slate-600 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-md text-slate-400 hover:text-slate-600 transition-colors h-10"
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0 max-h-[calc(100vh-220px)]">
        <div className="flex-1 overflow-auto custom-scrollbar text-left">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1100px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm text-left">
                <th className="p-3 md:p-4 w-[50px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[25%] bg-slate-50">Student Profile</th>
                <th className="p-3 md:p-4 w-[25%] bg-slate-50 text-left">Academic Choice</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Payment Status</th>
                <th className="p-3 md:p-4 w-[12%] text-center bg-slate-50">Applied Date</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="p-20 text-center text-slate-400 font-medium">
                      Loading admissions...
                   </td>
                </tr>
              ) : paginatedData.map((form, idx) => (
                <tr key={form.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {startIndex + idx + 1}
                  </td>
                  
                  {/* Student Details */}
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500 shadow-sm border border-white/50 ring-1 ring-slate-100">
                             <User size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-[14px]">
                                    {capitalizeWords(form.applicantName)}
                                </span>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500 tracking-tighter uppercase">
                                    {form.applicationNumber}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Phone size={10} className="text-[#00b4d8]" />
                                    <span>{form.mobileNumber}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Mail size={10} className="text-[#00b4d8]" />
                                    <span>{form.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  {/* Academic Choice */}
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={16} className="text-[#00b4d8]" />
                            <span className="text-[13px] text-slate-700 font-bold">{form.branchApplied}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium pl-6 uppercase tracking-wider">
                            {form.courseApplied}
                        </span>
                    </div>
                  </td>

                  {/* Payment Status Pill Toggle */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                           form.paymentStatus === 'PAID' 
                           ? 'bg-green-50 text-green-500' 
                           : form.paymentStatus === 'FAILED' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                       }`}>
                          {form.paymentStatus}
                       </span>
                       <div className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             form.paymentStatus === 'PAID' ? 'bg-green-500' : 'bg-amber-400'
                          }`}>
                           <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${
                             form.paymentStatus === 'PAID' ? 'left-[16px]' : 'left-0.5'
                          }`} />
                       </div>
                    </div>
                  </td>

                  {/* Submission Date */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Clock size={14} className="text-slate-300" />
                        <span className="text-[12px] font-medium">{form.submissionDate}</span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                         onClick={() => onView(form)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="View Full Application"
                      >
                        <Eye size={18} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onEdit(form)}
                        className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                        title="Edit Details"
                      >
                        <Edit3 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => onDelete(form.id)}
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Application"
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
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 mt-2">
            <div className="text-[12px] text-slate-500 font-medium order-2 sm:order-1">
                Showing <span className="text-slate-900 font-bold">{startIndex + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span> applications
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
