"use client";

import React, { useState, useEffect } from "react";
import { X, Save, School, MapPin, Globe, Mail, Phone, GraduationCap, DollarSign, FileText } from "lucide-react";
import { College } from "../types";
import { CourseToggleGroup } from "./CourseToggleGroup";
import { capitalizeWords } from "@/shared/utils/string-utils";

interface CollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: Partial<College>) => Promise<boolean>;
  category: 'engineering' | 'polytechnic';
  editData?: College | null;
}

export function CollegeModal({ isOpen, onClose, onSave, category, editData }: CollegeModalProps) {
  const [formData, setFormData] = useState<Partial<College>>({
    name: "",
    code: "",
    totalSeats: 0,
    address: "",
    district: "",
    state: "Bihar",
    contacts: [""],
    email: "",
    website: "",
    feesInfo: "",
    category: category,
    courseMatrix: {}
  });

  useEffect(() => {
    if (editData && editData.id) {
      setFormData(editData);
    } else {
      setFormData({
        name: "",
        code: "",
        totalSeats: 0,
        address: "",
        district: "",
        state: "Bihar",
        contacts: [""],
        email: "",
        website: "",
        feesInfo: "",
        category: category,
        courseMatrix: {}
      });
    }
  }, [editData, category, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(editData?.id || null, formData);
    onClose();
  };

  if (!isOpen) return null;

  const toggleCourseInModal = (code: string) => {
    const current = formData.courseMatrix?.[code] || { isEnabled: false, seats: 0 };
    setFormData({
      ...formData,
      courseMatrix: {
        ...formData.courseMatrix,
        [code]: { ...current, isEnabled: !current.isEnabled }
      }
    });
  };

  const updateCourseSeats = (code: string, seats: number) => {
    const current = formData.courseMatrix?.[code] || { isEnabled: false, seats: 0 };
    setFormData({
      ...formData,
      courseMatrix: {
        ...formData.courseMatrix,
        [code]: { ...current, seats }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <School size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {editData?.id ? 'Edit College Details' : `Register New ${capitalize(category)} College`}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-50">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} id="collegeForm" className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-left">
            
            {/* Primary Details */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-[#00b4d8] text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <School size={14} /> Institution Identity
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">College Full Name</label>
                    <input 
                      required type="text" placeholder="e.g. RPS Institute of Technology" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none transition-all" 
                      value={formData.name || ""} 
                      onChange={(e) => setFormData({...formData, name: capitalizeWords(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Code #</label>
                    <input 
                      required type="text" placeholder="139" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.code || ""} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Total Intake Seats</label>
                    <input 
                      type="number" placeholder="360" 
                      className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.totalSeats || 0} onChange={(e) => setFormData({...formData, totalSeats: Number(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Website URL</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-3 text-slate-400" />
                      <input 
                        type="text" placeholder="www.college.in" 
                        className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                        value={formData.website || ""} onChange={(e) => setFormData({...formData, website: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-amber-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <Phone size={14} /> Connectivity & Location
                </h3>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Official Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="email" placeholder="admin@college.in" 
                      className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.email || ""} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Contact Numbers (Primary / Secondary)</label>
                  <input 
                    type="text" placeholder="9876543210, 9876543211" 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                    value={formData.contacts?.join(", ") || ""} 
                    onChange={(e) => setFormData({...formData, contacts: e.target.value.split(",").map(c => c.trim())})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Complete Mailing Address</label>
                  <textarea 
                    rows={2} placeholder="Full postal address..." 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                    value={formData.address || ""} 
                    onChange={(e) => setFormData({...formData, address: capitalizeWords(e.target.value)})} 
                  />
                </div>
              </section>
            </div>

            {/* Courses & Fees */}
            <div className="space-y-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <section className="space-y-4">
                <h3 className="text-emerald-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <GraduationCap size={16} /> Course Management Matrix
                </h3>
                <p className="text-[10px] text-slate-400 font-medium bg-white p-2 rounded border border-slate-100 italic">
                  Select available disciplines and assign planned seat intake for each.
                </p>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {DISCIPLINES[category].map(disc => {
                    const isSelected = !!formData.courseMatrix?.[disc.code]?.isEnabled;
                    return (
                      <div key={disc.code} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${isSelected ? 'bg-white border-blue-100 shadow-sm' : 'bg-transparent border-slate-200 opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => toggleCourseInModal(disc.code)}
                          />
                          <span className="text-sm font-bold text-slate-700">{disc.code} <small className="text-slate-400 font-normal ml-1">({disc.label})</small></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Intake:</label>
                          <input 
                            type="number" 
                            disabled={!isSelected}
                            placeholder="0"
                            className="w-16 p-1 text-center text-xs border rounded outline-none focus:border-blue-400 disabled:bg-slate-50"
                            value={formData.courseMatrix?.[disc.code]?.seats || 0}
                            onChange={(e) => updateCourseSeats(disc.code, Number(e.target.value))}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-rose-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 border-b pb-2">
                  <DollarSign size={15} /> Fee Structures & Attachments
                </h3>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Fee Details Description</label>
                  <textarea 
                    rows={2} placeholder="e.g. 42,500/- Per Semester + Admission Fee 5000/- One Time" 
                    className="w-full p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none resize-none" 
                    value={formData.feesInfo || ""} onChange={(e) => setFormData({...formData, feesInfo: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Brochure Link / Attachment URL</label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input 
                      type="text" placeholder="https://..." 
                      className="w-full pl-9 p-2.5 rounded-lg text-sm border border-slate-200 focus:border-[#00b4d8] outline-none" 
                      value={formData.brochureUrl || ""} onChange={(e) => setFormData({...formData, brochureUrl: e.target.value})} 
                    />
                  </div>
                </div>
              </section>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-colors">
            Discard Changes
          </button>
          <button 
            type="submit" form="collegeForm"
            className="px-8 py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] font-bold hover:bg-[#0b73c9] transition-all flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={16} /> Update Institution
          </button>
        </div>
      </div>
    </div>
  );
}

const DISCIPLINES = {
  engineering: [
    { code: 'CE', label: 'Civil' },
    { code: 'ME', label: 'Mechanical' },
    { code: 'CSE', label: 'Computer Science' },
    { code: 'EEE', label: 'Electrical & Electronics' },
    { code: 'ECE', label: 'Electronics & Comm.' },
    { code: 'BE', label: 'Bio Engineering' },
  ],
  polytechnic: [
    { code: 'CE', label: 'Civil' },
    { code: 'ME', label: 'Mechanical' },
    { code: 'EE', label: 'Electrical' },
    { code: 'CSE', label: 'Computer Science' },
    { code: 'ECE', label: 'Electronics & Comm.' },
    { code: 'Auto', label: 'Automobile' },
  ]
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
