"use client";

import React, { useState } from "react";
import { 
    Search, RotateCw, 
    Trash2, Calendar, FileText, 
    Plus, X, Upload, Hash,
    Edit3,
    CheckCircle,
    BadgeCheck
} from 'lucide-react';
import { getFileUrl } from "@/shared/api/api-client";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { Result, ResultTableProps, CourseType } from "../types";

const COURSE_TYPES: CourseType[] = [
  'Polytechnic Regular', 
  'B.Tech Regular', 
  'Polytechnic Lateral', 
  'B.Tech Lateral', 
  'Other'
];

export function ResultsTable({
  data,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave
}: ResultTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    examName: "",
    refNo: "",
    date: new Date().toISOString().split('T')[0],
    courseType: "Polytechnic Regular" as CourseType,
    phaseNum: 1,
    isNew: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenModal = (result?: Result) => {
    if (result) {
      setEditingResult(result);
      setFormData({
        examName: result.examName,
        refNo: result.refNo,
        date: result.date,
        courseType: result.courseType,
        phaseNum: result.phaseNum,
        isNew: result.isNew
      });
    } else {
      setEditingResult(null);
      setFormData({
        examName: "",
        refNo: "",
        date: new Date().toISOString().split('T')[0],
        courseType: "Polytechnic Regular",
        phaseNum: 1,
        isNew: true
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = new FormData();
    dataToSend.append("examName", formData.examName);
    dataToSend.append("refNo", formData.refNo);
    dataToSend.append("date", formData.date);
    dataToSend.append("courseType", formData.courseType);
    dataToSend.append("phaseNum", formData.phaseNum.toString());
    dataToSend.append("isNew", formData.isNew.toString());

    if (selectedFile) {
      dataToSend.append("pdf", selectedFile);
    }

    const success = await onSave?.(editingResult?.id || null, dataToSend);
    if (success) {
      setIsModalOpen(false);
      setSelectedFile(null);
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.refNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Examination Results
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>ACADEMIC</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">RESULTS</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search by Exam Name or Ref No..." 
              onChange={(e) => setSearchTerm(e.target.value)}
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

          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#0e8bf1] hover:bg-[#0b73c9] text-white p-2.5 rounded-full shadow-md shadow-blue-200 transition-transform hover:scale-105 shrink-0 h-10 w-10 flex items-center justify-center ml-auto md:ml-0"
            title="Add New Result"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="flex-1 bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-auto custom-scrollbar text-left">
          <table className="w-full text-left border-collapse whitespace-nowrap lg:whitespace-normal min-w-[1000px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[12px] md:text-[13px] text-[#00b4d8] tracking-wide uppercase font-semibold shadow-sm text-left">
                <th className="p-3 md:p-4 w-[60px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[35%] bg-slate-50">Exam Details</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Course Type</th>
                <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Phase</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Date</th>
                <th className="p-3 md:p-4 w-[10%] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[10%] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((result, idx) => (
                <tr key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {idx + 1}
                  </td>
                  
                  {/* Exam Name & Ref info */}
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500">
                             <FileText size={20} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800 text-[13px] md:text-[14px]">
                                  {capitalizeWords(result.examName)}
                                </span>
                                {result.isNew && (
                                   <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black bg-red-50 text-red-500 border border-red-100 animate-pulse">
                                      NEW
                                   </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#00b4d8] font-medium">
                                <Hash size={10} />
                                <span className="uppercase tracking-wider">{result.refNo.toUpperCase()}</span>
                            </div>
                            
                            <div className="mt-1">
                               <a 
                                  href={getFileUrl(result.pdfUrl)} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] text-slate-400 hover:text-[#00b4d8] hover:underline flex items-center gap-1"
                               >
                                  View Full Result (PDF)
                               </a>
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  {/* Course Type Chip */}
                  <td className="p-3 md:p-4 text-center">
                    <span className={`px-2 md:px-3 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600`}>
                        {result.courseType}
                    </span>
                  </td>

                  {/* Phase Column */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="inline-flex items-center justify-center p-1.5 bg-amber-50 text-amber-600 rounded-lg font-bold text-xs ring-1 ring-amber-100">
                        P-{result.phaseNum}
                    </div>
                  </td>
                  
                  {/* Date Column */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-[12px] md:text-[13px] text-slate-500 font-light">
                        <Calendar size={14} className="text-[#00b4d8]" />
                        {new Date(result.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold transition-colors ${result.isActive ? 'text-green-500' : 'text-slate-300'}`}>
                          {result.isActive ? 'LIVE' : 'HIDDEN'}
                       </span>
                       <button 
                          onClick={() => onStatusUpdate?.(result.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             result.isActive ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                             result.isActive ? 'left-[16px]' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3 text-right">
                      <button 
                        onClick={() => onDelete?.(result.id)}
                        className="text-red-500 hover:text-red-600 p-1 transition-all"
                        title="Delete Result"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(result)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1 transition-all"
                        title="Edit Result"
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

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-2 sm:p-4 transition-opacity duration-300 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-5 md:px-8 py-4 border-b border-slate-100 shrink-0 rounded-t-xl bg-white">
                    <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
                        {editingResult ? 'Edit Examination Result' : 'Upload New Result'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSubmit} id="resultForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-left">
                        
                        {/* Column 1: Basic Info */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                                <BadgeCheck size={16} /> Basic info
                            </h3>
                            
                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Exam Name <span className="text-red-500">*</span></label>
                                <input 
                                    name="examName" required type="text" placeholder="e.g. Polytechnic 2nd Sem Result 2026" 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                    value={formData.examName} 
                                    onChange={(e) => setFormData({...formData, examName: capitalizeWords(e.target.value)})} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Ref Number <span className="text-red-500">*</span></label>
                                    <input 
                                        name="refNo" required type="text" placeholder="BPTPIA/RES/001" 
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] uppercase" 
                                        value={formData.refNo} 
                                        onChange={(e) => setFormData({...formData, refNo: e.target.value.toUpperCase()})} 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Date <span className="text-red-500">*</span></label>
                                    <input 
                                        name="date" required type="date" 
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                        value={formData.date} 
                                        onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                               <div className="flex-1 space-y-1.5">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Phase Number</label>
                                    <input 
                                        name="phaseNum" type="number" min="0"
                                        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8]" 
                                        value={formData.phaseNum} 
                                        onChange={(e) => setFormData({...formData, phaseNum: parseInt(e.target.value) || 0})} 
                                    />
                                </div>
                                <div className="flex items-center gap-3 pt-6">
                                    <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Mark as New</label>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isNew: !formData.isNew})}
                                        className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${formData.isNew ? 'bg-red-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${formData.isNew ? 'right-0.5' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Detailed Info & File */}
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[#3ed4b2] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                                <FileText size={16} /> Course & Document
                            </h3>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Course Type <span className="text-red-500">*</span></label>
                                <select 
                                    name="courseType" required 
                                    className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] appearance-none cursor-pointer"
                                    value={formData.courseType} 
                                    onChange={(e) => setFormData({...formData, courseType: e.target.value as CourseType})}
                                >
                                    {COURSE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">Upload Result (PDF) {!editingResult && <span className="text-red-500">*</span>}</label>
                                <div className="relative group/upload">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        accept="application/pdf"
                                        required={!editingResult}
                                    />
                                    <div className={`flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all ${
                                        selectedFile 
                                        ? 'border-[#3ed4b2] bg-[#3ed4b2]/10' 
                                        : 'border-slate-200 bg-white group-hover/upload:border-[#00b4d8]'
                                    }`}>
                                        <div className={`p-1.5 rounded-md ${selectedFile ? 'bg-[#3ed4b2] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {selectedFile ? <CheckCircle size={16} /> : <Upload size={16} />}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className={`text-[13px] font-medium ${selectedFile ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {selectedFile ? selectedFile.name : `Choose PDF file...`}
                                            </span>
                                            <span className="text-[10px] text-slate-400">Max size: 5MB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-5 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl border-t border-slate-100">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="resultForm"
                        disabled={isSaving} 
                        className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingResult ? 'Update Result' : 'Save Result')}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}
