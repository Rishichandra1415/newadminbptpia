"use client";

import React, { useState, useMemo } from "react";
import { 
    Search, RotateCw, 
    Trash2, User, Phone, 
    Mail, MapPin, GraduationCap,
    Plus, X, Hash,
    Edit3, CheckCircle2,
    Clock, BadgeCheck
} from 'lucide-react';
import { Enquiry, EnquiryTableProps } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";
import { StateEntry, CityEntry } from "../../master/types";

interface EnquiriesTableExtendedProps extends EnquiryTableProps {
    states: StateEntry[];
    districts: CityEntry[];
    onFetchDistricts?: (stateId: number) => Promise<void>;
}

export function EnquiriesTable({
  data,
  states,
  districts,
  onDelete,
  onRefresh,
  onStatusUpdate,
  onSave,
  onFetchDistricts
}: EnquiriesTableExtendedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    stateId: 0,
    districtId: 0,
    programme: "",
  });

  // Filter districts based on selected state (Districts now come pre-filtered from hook/service)
  const availableDistricts = districts;

  const handleOpenModal = (enquiry?: Enquiry) => {
    if (enquiry) {
      setEditingEnquiry(enquiry);
      setFormData({
        name: enquiry.name,
        contact: enquiry.contact,
        email: enquiry.email,
        stateId: enquiry.stateId,
        districtId: enquiry.districtId,
        programme: enquiry.programme,
      });
      // Fetch districts for the state of the enquiry we're editing
      onFetchDistricts?.(enquiry.stateId);
    } else {
      setEditingEnquiry(null);
      setFormData({
        name: "",
        contact: "",
        email: "",
        stateId: states[0]?.id || 0,
        districtId: 0,
        programme: "",
      });
      if (states[0]?.id) {
        onFetchDistricts?.(states[0].id);
      }
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Convert IDs to numbers just in case
    const submissionData = {
        ...formData,
        stateId: Number(formData.stateId),
        districtId: Number(formData.districtId)
    };

    const success = await onSave?.(editingEnquiry?.id || null, submissionData);
    if (success) {
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contact.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 w-full font-sans max-w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2 shrink-0">
        <div className="w-full md:w-auto text-left">
          <h1 className="text-2xl md:text-3xl font-light text-[#00b4d8] mb-1 tracking-wide">
            Admission Enquiries
          </h1>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium text-slate-400 tracking-widest uppercase">
            <span>APP</span>
            <span className="text-slate-300">&gt;</span>
            <span>STUDENT</span>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-800">ENQUIRIES</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex flex-grow md:flex-grow-0 items-center bg-white px-3 py-2 rounded-md border border-slate-200 shadow-sm h-10 w-full md:w-72">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input 
              type="text" 
              placeholder="Search by student name or contact..." 
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
            title="Add New Enquiry"
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
                <th className="p-3 md:p-4 w-[50px] text-center bg-slate-50">#</th> 
                <th className="p-3 md:p-4 w-[25%] bg-slate-50">Student Profile</th>
                <th className="p-3 md:p-4 w-[20%] bg-slate-50 text-left">Programme</th>
                <th className="p-3 md:p-4 w-[20%] bg-slate-50 text-left">Location</th>
                <th className="p-3 md:p-4 w-[15%] text-center bg-slate-50">Status</th>
                <th className="p-3 md:p-4 w-[120px] text-right pr-6 bg-slate-50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((enquiry, idx) => (
                <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-3 md:p-4 text-center text-slate-400 text-xs font-medium">
                    {idx + 1}
                  </td>
                  
                  {/* Student Details */}
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg shrink-0 bg-blue-50 text-blue-500 shadow-sm">
                             <User size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-800 text-[14px]">
                                {capitalizeWords(enquiry.name)}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Phone size={10} className="text-[#00b4d8]" />
                                    <span>{enquiry.contact}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <Mail size={10} className="text-[#00b4d8]" />
                                    <span>{enquiry.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                  </td>
                  
                  {/* Programme */}
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={16} className="text-slate-300" />
                        <span className="text-[13px] text-slate-600 font-medium">{enquiry.programme}</span>
                    </div>
                  </td>

                  {/* Location Column */}
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-700">
                            <MapPin size={12} className="text-red-400" />
                            <span className="font-semibold">{enquiry.districtData?.name || 'District'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest pl-4">
                            {enquiry.stateData?.name || 'State'}
                        </span>
                    </div>
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center gap-2 group/toggle">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                           enquiry.isResolved 
                           ? 'bg-green-50 text-green-500' 
                           : 'bg-amber-50 text-amber-500'
                       }`}>
                          {enquiry.isResolved ? 'RESOLVED' : 'PENDING'}
                       </span>
                       <button 
                          onClick={() => onStatusUpdate?.(enquiry.id)}
                          className={`w-8 h-4.5 rounded-full relative transition-all duration-300 shadow-inner ${
                             enquiry.isResolved ? 'bg-green-500' : 'bg-amber-400'
                          }`}
                          title={`Mark as ${enquiry.isResolved ? 'Pending' : 'Resolved'}`}
                       >
                          <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-300 ${
                             enquiry.isResolved ? 'left-[16px]' : 'left-0.5'
                          }`} />
                       </button>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="p-3 md:p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5 md:gap-3">
                      <button 
                        onClick={() => onDelete?.(enquiry.id)}
                        className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(enquiry)}
                        className="text-[#00b4d8] hover:text-[#0077b6] p-1.5 hover:bg-cyan-50 rounded-lg transition-all"
                        title="Edit Details"
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {editingEnquiry ? 'Edit Enquiry Details' : 'Record New Enquiry'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-50">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    <form onSubmit={handleSubmit} id="enquiryForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
                        
                        {/* Student Section */}
                        <div className="space-y-4">
                            <h3 className="text-[#00b4d8] text-[12px] font-bold tracking-widest uppercase border-b pb-2 flex items-center gap-2">
                                <BadgeCheck size={16} /> Student information
                            </h3>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Student Full Name <small className="text-red-500">*</small></label>
                                <input 
                                    required type="text" placeholder="John Doe" 
                                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none transition-all" 
                                    value={formData.name || ""} 
                                    onChange={(e) => setFormData({...formData, name: capitalizeWords(e.target.value)})} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Contact No <small className="text-red-500">*</small></label>
                                    <input 
                                        required type="tel" placeholder="9876543210" 
                                        className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                                        value={formData.contact} 
                                        onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Email Address <small className="text-red-500">*</small></label>
                                    <input 
                                        required type="email" placeholder="john@example.com" 
                                        className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Programme Interested In <small className="text-red-500">*</small></label>
                                <input 
                                    required type="text" placeholder="Polytechnic Computer Science" 
                                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                                    value={formData.programme || ""} 
                                    onChange={(e) => setFormData({...formData, programme: capitalizeWords(e.target.value)})} 
                                />
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="space-y-4">
                            <h3 className="text-[#3ed4b2] text-[12px] font-bold tracking-widest uppercase border-b pb-2 flex items-center gap-2">
                                <MapPin size={16} /> Regional details
                            </h3>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Select State <small className="text-red-500">*</small></label>
                                <select 
                                    required 
                                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-white cursor-pointer"
                                    value={formData.stateId} 
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setFormData({...formData, stateId: val, districtId: 0});
                                        if (val) onFetchDistricts?.(val);
                                    }}
                                >
                                    <option value={0}>Choose a state...</option>
                                    {states.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Select District <small className="text-red-500">*</small></label>
                                <select 
                                    required 
                                    disabled={!formData.stateId}
                                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none bg-white cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    value={formData.districtId} 
                                    onChange={(e) => setFormData({...formData, districtId: Number(e.target.value)})}
                                >
                                    <option value={0}>Choose a district...</option>
                                    {availableDistricts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                                <div className="p-1.5 bg-blue-500 text-white rounded-md mt-0.5">
                                    <Clock size={14} />
                                </div>
                                <div className="text-[11px] text-blue-800/80 leading-relaxed font-medium">
                                    Enquiries recorded will be marked as <span className="font-bold text-blue-600">PENDING</span> by default. You can track followup status directly from the dashboard table.
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="enquiryForm"
                        disabled={isSaving} 
                        className="px-8 py-2.5 bg-[#0e8bf1] text-white rounded-lg text-sm font-bold hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-lg shadow-blue-100"
                    >
                        {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editingEnquiry ? 'Update Enquiry' : 'Save Enquiry')}
                    </button>
                </div>

            </div>
        </div>
      )}

    </div>
  );
}
