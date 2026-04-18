"use client";

import React, { useState, useEffect } from "react";
import { 
    X, CheckCircle, RotateCw,
    GitBranch, Hash, BadgeCheck
} from 'lucide-react';
import { BranchModalProps } from "../../types";

export function BranchModal({
  isOpen,
  onClose,
  onSave,
  editData,
  courses = []
}: BranchModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    courseType: "ENGINEERING",
    isActive: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        courseId: editData.courseId?.toString() || "",
        courseType: editData.courseType || "ENGINEERING",
        isActive: editData.isActive
      });
    } else {
      setFormData({
        name: "",
        courseId: "",
        courseType: "ENGINEERING",
        isActive: true
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await onSave(formData);
    if (success) {
      onClose();
    }
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-hidden text-left">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-[#00b4d8] rounded-lg">
                        <GitBranch size={20} />
                    </div>
                    {editData ? 'Update Branch Entry' : 'Register New Branch'}
                </h2>
                <button 
                    onClick={onClose} 
                    className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-50"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                <form onSubmit={handleSubmit} id="branchForm" className="space-y-8">
                    
                    {/* Branch Information Section */}
                    <div className="space-y-6">
                        <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-widest uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
                            <BadgeCheck size={16} /> Branch details
                        </h3>

                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
                                Belongs to Category <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="courseType" 
                                required 
                                className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] shadow-sm" 
                                value={formData.courseType} 
                                onChange={(e) => setFormData({...formData, courseType: e.target.value, courseId: ""})} 
                            >
                                <option value="ENGINEERING">ENGINEERING (B.Tech, etc.)</option>
                                <option value="POLYTECHNIC">POLYTECHNIC (Diploma)</option>
                            </select>
                        </div>

{/* Commented out as per user request */}
{/* <div className="space-y-1.5">
    <label className="text-[12px] md:text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
        Belongs to Course <span className="text-red-500">*</span>
    </label>
    <select 
        name="courseId" 
        required 
        className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] shadow-sm" 
        value={formData.courseId} 
        onChange={(e) => setFormData({...formData, courseId: e.target.value})} 
    >
        <option value="" disabled>-- Select Course --</option>
        {courses
            .filter(course => course.courseType === formData.courseType)
            .map(course => (
            <option key={course.id} value={course.id}>
                {course.name}
            </option>
        ))}
    </select>
</div> */}

                        <div className="space-y-1.5">
                            <label className="text-[12px] md:text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
                                Branch Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                name="name" 
                                required 
                                type="text" 
                                placeholder="e.g. Computer Science Engineering" 
                                className="w-full p-2.5 rounded-lg text-sm text-slate-700 outline-none transition-all border border-slate-200 bg-white focus:border-[#00b4d8] shadow-sm" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            />
                        </div>

                        {/* Standardized Pill Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-semibold text-slate-700">Display Eligibility</span>
                                <span className="text-[11px] text-slate-500">Enable this branch for active public viewing</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold tracking-wide transition-colors ${formData.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                    {formData.isActive ? 'ACTIVE' : 'HIDDEN'}
                                </span>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                    className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${
                                        formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                                    }`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                                        formData.isActive ? 'right-0.5' : 'left-0.5'
                                    }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-start gap-4">
                         <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md mt-0.5">
                            <Hash size={14} />
                         </div>
                         <p className="text-[11px] text-emerald-800/80 leading-relaxed font-medium">
                            Academic branches are cross-referenced during college profile builds. Ensure the branch name is descriptive and standardized for public documentation.
                         </p>
                    </div>

                </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    form="branchForm"
                    disabled={isSaving} 
                    className="px-8 py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-bold hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm shadow-blue-100"
                >
                    {isSaving ? <RotateCw className="animate-spin" size={16} /> : (editData ? 'Update branch' : 'Save branch')}
                </button>
            </div>

        </div>
    </div>
  );
}
