"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Mail, RotateCw } from "lucide-react";
import { MasterModalProps } from "../types";
import { capitalizeWords } from "@/shared/utils/string-utils";

export function MasterModal({ isOpen, onClose, onSave, entity, editData, states }: MasterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    stateId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        stateId: editData.stateId?.toString() || "",
      });
    } else {
      setFormData({ name: "", stateId: "" });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, name: capitalizeWords(val) }));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Modal Header  */}
        <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg md:text-[20px] font-semibold text-slate-800">
            {editData ? `Edit ${entity}` : `Add New ${entity}`}
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 flex-1 text-left">
          <form onSubmit={handleSubmit} id="masterForm" className="space-y-6">
            
            <h3 className="text-[#00b4d8] text-[12px] md:text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-2 flex items-center gap-2">
               <Mail size={16} /> Basic configuration
            </h3>

            {/* State Selection (Only for City) */}
            {entity === 'city' && (
              <div className="space-y-1.5">
                <label className="text-[12px] md:text-[13px] font-medium text-slate-500">
                  Select Parent State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.stateId}
                  onChange={(e) => setFormData(p => ({ ...p, stateId: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none transition-all focus:border-[#00b4d8] cursor-pointer appearance-none"
                >
                  <option value="">Choose a state...</option>
                  {states?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[12px] md:text-[13px] font-medium text-slate-500">
                {entity === 'state' ? 'State Name' : 'City Name'} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder={`e.g. ${entity === 'state' ? 'Bihar' : 'Patna'}`}
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none transition-all focus:border-[#00b4d8]"
              />
            </div>

          </form>
        </div>

        {/* Modal Footer - Matched to GovLetter */}
        <div className="px-6 md:px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 md:px-6 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="masterForm"
            disabled={isSubmitting}
            className="px-5 md:px-6 py-2 md:py-2.5 bg-[#0e8bf1] text-white rounded-lg text-[13px] md:text-[14px] font-medium hover:bg-[#0b73c9] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
               <RotateCw className="animate-spin" size={16} />
            ) : (
                <Save size={18} />
            )}
            {editData ? `Update ${entity}` : `Save ${entity}`}
          </button>
        </div>
      </div>
    </div>
  );
}
